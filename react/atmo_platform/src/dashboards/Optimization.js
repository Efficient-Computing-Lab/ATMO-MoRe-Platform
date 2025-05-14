import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import optimization_strings from "../localizations/Optimization";
import { OptimizationCSVProducer } from "../producers/OptimizationCSVProducer";
import { OptimizationJSONProducer } from "../producers/OptimizationJSONProducer";
import info_strings from "../localizations/InfoModals";
import InfoModal from "../utils/InfoModal";
import JsonDataTable from "../utils/JSONDataTable";
import TestDataConsumer from "../consumers/TestDataConsumer";

function Optimization() {
    useLanguage();
    const { setShowToast, setToastMessage, setToastVariant } = useToast();
    const { optimizationCSVProducerResponse, optimizationCSVProducerError, optimizationCSVProducerExecute } = OptimizationCSVProducer();
    const { optimizationJSONProducerResponse, optimizationJSONProducerError, optimizationJSONProducerExecute } = OptimizationJSONProducer();
    const [file, setFile] = useState(null);
    const [model, setModel] = useState("approximation");
    const [jsonData, setJsonData] = useState();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fullscreenModal, setFullscreenModal] = useState(false);
    const [modalContent, setModalContent] = useState(sessionStorage.getItem("optimizationModalContent") || "");
    const csvFileRef = useRef();

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalExpand = () => {
        setFullscreenModal(!fullscreenModal);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Capture the selected file
    };

    const handleModelChange = (event) => {
        setModel(event.target.value); // Capture the selected model
    };

    const handleJSONChange = (event) => {
        setJsonData(event.target.value); // Capture the selected model
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowToast(false);
        setLoading(true);

        if (!file && !(jsonData?.length > 2)) {
            setToastMessage(optimization_strings.error_nodata);
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
            return;
        }else if(file){
            const formData = new FormData();
            formData.append("file", file);
            formData.append("model", model);

            try {
                optimizationCSVProducerExecute(formData);
            } catch (err) {
                console.error(optimization_strings.error_server, err);
                setToastMessage(`${optimization_strings.error_server}${err}`);
                setToastVariant("danger");
                setLoading(false);
                setShowToast(true);
            }
            csvFileRef.current.value = "";
            setFile(null);
        }else if(jsonData?.length > 2){
            try {
                optimizationJSONProducerExecute(jsonData);
            } catch (err) {
                console.error(optimization_strings.error_plan_creation, err);
                setToastMessage(`${optimization_strings.error_plan_creation}${err}`);
                setToastVariant("danger");
                setLoading(false);
                setShowToast(true);
            }
            setJsonData("");
        }else{
            setToastMessage(optimization_strings.error_gui);
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
        }        
    };

    const handleModalHistory = () =>{
        setShowModal(true);
    };
    
    useEffect(() => {
        if (optimizationCSVProducerResponse || optimizationJSONProducerResponse) {
            const htmlResponse = (optimizationCSVProducerResponse ? optimizationCSVProducerResponse : optimizationJSONProducerResponse);
            setModalContent(htmlResponse);
            setShowModal(true);
            setLoading(false);
        } else if (optimizationCSVProducerError || optimizationJSONProducerError) {
            setToastMessage(`${optimization_strings.error_plan_creation}`+
                `${(optimizationCSVProducerError ? optimizationCSVProducerError : optimizationJSONProducerError)}`
            );
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
        }
    }, [
        optimizationCSVProducerResponse, 
        optimizationCSVProducerError, 
        optimizationJSONProducerResponse,
        optimizationJSONProducerError,
        setShowToast, setToastMessage, setToastVariant
    ]);

    useEffect(() => {
        if (modalContent) {
            sessionStorage.setItem("optimizationModalContent", modalContent);
        }
    }, [modalContent]);

    return (
        <Col xs={9} style={{ marginLeft: '250px' }}>
            <h2 className="my-4">{optimization_strings.title}</h2>
            <Row>
                <Col className="d-flex">
                    <Card className="flex-fill">
                        <Card.Header className="bg-primary text-white">
                            {optimization_strings.csv_input}
                            <InfoModal 
                                shortText={info_strings.optimization_csv_short}
                                fullText={info_strings.optimization_csv_full}
                                theme={"dark"}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={null}>
                                <Form.Group controlId="formModel" className="mb-3">
                                    <Form.Label>{optimization_strings.model_selector}</Form.Label>
                                    <Form.Select value={model} onChange={handleModelChange}>
                                        <option value="approximation">Approximation</option>
                                        <option value="greedy">Greedy</option>
                                        <option value="ilp">ILP</option>
                                        <option value="genetic">Genetic</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="formCSV" className="mb-3">
                                    <Form.Label>{optimization_strings.csv_input_label}</Form.Label>
                                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} ref={csvFileRef} />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex mt-2">
                    <Card className="flex-fill">
                        <Card.Body>
                            <Button variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        {optimization_strings.submitting}
                                    </>
                                ) : (
                                    optimization_strings.submit
                                )}
                            </Button>
                            <Button variant="primary" hidden={(modalContent.length < 3) || (loading)} disabled={loading} 
                                onClick={handleModalHistory} style={{"marginLeft": "5px"}}
                            >
                                {optimization_strings.history}
                            </Button>
                            <Button variant="primary" hidden={(modalContent.length < 3) || (loading)} disabled={loading} 
                                onClick={null} style={{"marginLeft": "5px"}}
                            >
                                {optimization_strings.pdf_download}
                            </Button>
                            <Button variant="primary" hidden={(modalContent.length < 3) || (loading)} disabled={loading} 
                                onClick={null} style={{"marginLeft": "5px"}}
                            >
                                {optimization_strings.json_download}
                            </Button>
                            <Button variant="primary" hidden={(modalContent.length < 3) || (loading)} disabled={loading} 
                                onClick={null} style={{"marginLeft": "5px"}}
                            >
                                {optimization_strings.csv_download}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col className="d-flex">
                    <Card className="flex-fill">
                        <Card.Header className="bg-primary text-white">
                            {optimization_strings.json_input_label}
                        </Card.Header>
                        <Card.Body>
                            <TestDataConsumer>
                                {(testData) => {
                                    setJsonData(testData);
                                    const parsedData = jsonData ? JSON.parse(jsonData).data : [];
                                    return (<JsonDataTable jsonData={parsedData} />);
                                }}
                            </TestDataConsumer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} fullscreen={fullscreenModal} onHide={handleModalClose} 
                dialogClassName={fullscreenModal ? "" : "modal-90w"} backdrop={"static"} keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{optimization_strings.result_modal}</Modal.Title>
                    <button className={"btn-expand"} onClick={handleModalExpand}/>
                </Modal.Header>
                <Modal.Body>
                    <iframe srcDoc={modalContent} width="100%" height="500px" style={{ border: "none" }} />
                </Modal.Body>
            </Modal>
        </Col>
    );
}

export default Optimization;
