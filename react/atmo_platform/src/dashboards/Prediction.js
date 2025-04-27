import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner, Badge } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import prediction_strings from "../localizations/Prediction";
import { PredictionCSVProducer } from "../producers/PredictionCSVProducer";
import { PredictionJSONProducer } from "../producers/PredictionJSONProducer";

function Prediction() {
    useLanguage();
    const { setShowToast, setToastMessage, setToastVariant } = useToast();
    const { predictionCSVProducerResponse, predictionCSVProducerError, predictionCSVProducerExecute } = PredictionCSVProducer();
    const { predictionJSONProducerResponse, predictionJSONProducerError, predictionJSONProducerExecute } = PredictionJSONProducer();
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fullscreenModal, setFullscreenModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
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
            setModalContent(producerResponse);
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

    return (
        <Col xs={9} style={{ marginLeft: '250px' }}>
            <h2 className="my-4">{prediction_strings.title}</h2>
            <Row>
                <Col className="d-flex">
                    <Card className="flex-fill">
                        <Card.Header className="bg-primary text-white">
                            {prediction_strings.csv_input}
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={null}>
                                <Form.Group controlId="formCSV" className="mb-3">
                                    <Form.Label>{prediction_strings.csv_input_label}</Form.Label>
                                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} ref={csvFileRef} />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex">
                    <Card className="flex-fill">
                        <Card.Header className="bg-primary text-white">
                            {prediction_strings.json_input}
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={null}>
                                <Form.Group controlId="formJSON" className="mb-3">
                                    <Form.Label>{prediction_strings.json_input_label}</Form.Label>
                                    <textarea className="form-control" rows="15" onChange={handleJSONChange} value={jsonData}></textarea>
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
            <Modal show={showModal} fullscreen={fullscreenModal} onHide={handleModalClose} 
                dialogClassName={fullscreenModal ? "" : "modal-90w"} backdrop={"static"} keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{prediction_strings.result_modal}</Modal.Title>
                    <button className={"btn-expand"} onClick={handleModalExpand}/>
                </Modal.Header>
                <Modal.Body>
                    {modalContent && (
                        <Row>
                            {Object.entries(modalContent).map(([key, values]) => (
                                <Col key={key} md={4}>
                                    <Card className="mb-3">
                                        <Card.Header className="bg-primary text-white text-center">
                                            {key.replace('_', ' ').toUpperCase()}
                                        </Card.Header>
                                        <Card.Body className="d-flex flex-wrap gap-2">
                                            {values.map((atmCode) => (
                                                <Badge key={atmCode} pill bg="primary" className="p-2">
                                                    {atmCode}
                                                </Badge>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Modal.Body>
            </Modal>
        </Col>
    );
}

export default Prediction;
