import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Form, Modal, Row, Spinner, Badge } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import prediction_strings from "../localizations/Prediction";
import { PredictionCSVProducer } from "../producers/PredictionCSVProducer";
import { PredictionJSONProducer } from "../producers/PredictionJSONProducer";
import info_strings from "../localizations/InfoModals";
import InfoModal from "../utils/InfoModal";
import JsonDataTable from "../utils/JSONDataTable";
import TestDataConsumer from "../consumers/TestDataConsumer";

function Prediction() {
    useLanguage();
    const { setShowToast, setToastMessage, setToastVariant } = useToast();
    const { predictionCSVProducerResponse, predictionCSVProducerError, predictionCSVProducerExecute } = PredictionCSVProducer();
    const { predictionJSONProducerResponse, predictionJSONProducerError, predictionJSONProducerExecute } = PredictionJSONProducer();
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fullscreenModal, setFullscreenModal] = useState(false);
    const [modalContent, setModalContent] = useState(sessionStorage.getItem("predictionModalContent") || "");
    const csvFileRef = useRef();

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalExpand = () => {
        setFullscreenModal(!fullscreenModal);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleJSONChange = (event) => {
        setJsonData(event.target.value);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowToast(false);
        setLoading(true);

        if (!file && !(jsonData?.length > 2)) {
            setToastMessage(prediction_strings.error_nodata);
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
            return;
        }else if(file){
            const formData = new FormData();
            formData.append("file", file);

            try {
                predictionCSVProducerExecute(formData);
            } catch (err) {
                console.error(prediction_strings.error_server, err);
                setToastMessage(`${prediction_strings.error_server}${err}`);
                setToastVariant("danger");
                setLoading(false);
                setShowToast(true);
            }
            csvFileRef.current.value = "";
            setFile(null);
        }else if(jsonData?.length > 2){
            try {
                predictionJSONProducerExecute(jsonData);
            } catch (err) {
                console.error(prediction_strings.error_plan_creation, err);
                setToastMessage(`${prediction_strings.error_plan_creation}${err}`);
                setToastVariant("danger");
                setLoading(false);
                setShowToast(true);
            }
            setJsonData("");
        }else{
            setToastMessage(prediction_strings.error_gui);
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
        }        
    };

    const handleModalHistory = () =>{
        setShowModal(true);
    };
    
    useEffect(() => {
        if (predictionCSVProducerResponse || predictionJSONProducerResponse) {
            const producerResponse = (predictionCSVProducerResponse ? predictionCSVProducerResponse : predictionJSONProducerResponse);
            setModalContent(JSON.stringify(producerResponse));
            setShowModal(true);
            setLoading(false);
        } else if (predictionCSVProducerError || predictionJSONProducerError) {
            setToastMessage(`${prediction_strings.error_plan_creation}`+
                `${(predictionCSVProducerError ? predictionCSVProducerError : predictionJSONProducerError)}`
            );
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
        }
    }, [
        predictionCSVProducerResponse, 
        predictionCSVProducerError, 
        predictionJSONProducerResponse,
        predictionJSONProducerError,
        setShowToast, setToastMessage, setToastVariant
    ]);

    useEffect(() => {
        if (modalContent) {
            sessionStorage.setItem("predictionModalContent", modalContent);
        }
    }, [modalContent]);

    return (
        <Col xs={9} style={{ marginLeft: '250px' }}>
            <h2 className="my-4">{prediction_strings.title}</h2>
            <Row>
                <Col className="d-flex">
                    <Card className="flex-fill">
                        <Card.Header className="bg-primary text-white">
                            {prediction_strings.csv_input}
                            <InfoModal 
                                shortText={info_strings.prediction_csv_short}
                                fullText={info_strings.prediction_csv_full}
                                theme={"dark"}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={null}>
                                <Form.Group controlId="formCSV" className="mb-3">
                                    <Form.Label>
                                        {prediction_strings.csv_input_label}
                                    </Form.Label>
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
                                        {prediction_strings.submitting}
                                    </>
                                ) : (
                                    prediction_strings.submit
                                )}
                            </Button>
                            <Button variant="primary" hidden={(!modalContent) || (loading)} disabled={loading} 
                                onClick={handleModalHistory} style={{"marginLeft": "5px"}}
                            >
                                {prediction_strings.history}
                            </Button>
                            <Button variant="primary" hidden={(!modalContent) || (loading)} disabled={loading} 
                                onClick={null} style={{"marginLeft": "5px"}}
                            >
                                {prediction_strings.pdf_download}
                            </Button>
                            <Button variant="primary" hidden={(!modalContent) || (loading)} disabled={loading} 
                                onClick={null} style={{"marginLeft": "5px"}}
                            >
                                {prediction_strings.json_download}
                            </Button>
                            <Button variant="primary" hidden={(!modalContent) || (loading)} disabled={loading} 
                                onClick={null} style={{"marginLeft": "5px"}}
                            >
                                {prediction_strings.csv_download}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="d-flex">
                    <Card className="flex-fill">
                        <Card.Header className="bg-primary text-white">
                            {prediction_strings.json_input_label}
                        </Card.Header>
                        <Card.Body>
                            <TestDataConsumer>
                                {(testData) => {
                                    const parsedInData = testData ? JSON.parse(testData).data : "";
                                    setJsonData(JSON.stringify(parsedInData));
                                    const parsedData = jsonData ? JSON.parse(jsonData) : [];
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
                    <Modal.Title>{prediction_strings.result_modal}</Modal.Title>
                    <button className={"btn-expand"} onClick={handleModalExpand}/>
                </Modal.Header>
                <Modal.Body>
                    {modalContent && (
                        <Card className="mb-4">
                        <Card.Header className="bg-primary text-white text-center">
                            {(new Date(+new Date() + 86400000)).toLocaleDateString('el-GR')}
                        </Card.Header>
                        <Card.Body>
                            <Row>
                            {Object.entries(JSON.parse(modalContent)).map(([key, values]) => (
                                <Col key={key} md={4}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-primary text-white text-center">
                                    {prediction_strings[key] || key.replaceAll("_", " ").toUpperCase()}
                                    </Card.Header>
                                    <Card.Body className="d-flex flex-wrap gap-2">
                                    {values.map((atmCode) => (
                                        <Link
                                        to={`/analytics?tab=atm&atm=${atmCode}`}
                                        style={{ textDecoration: "none" }}
                                        key={atmCode}
                                        >
                                        <Badge pill bg="primary" className="p-2">
                                            {atmCode}
                                        </Badge>
                                        </Link>
                                    ))}
                                    </Card.Body>
                                </Card>
                                </Col>
                            ))}
                            </Row>
                        </Card.Body>
                        </Card>
                    )}
                </Modal.Body>
            </Modal>
        </Col>
    );
}

export default Prediction;
