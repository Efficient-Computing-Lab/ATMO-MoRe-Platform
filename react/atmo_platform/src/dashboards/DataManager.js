import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner, Badge } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import data_manager_strings from "../localizations/DataManager";
import { DatahandlerRefreshProducer } from "../producers/DatahandlerRefreshProducer";
import info_strings from "../localizations/InfoModals";
import InfoModal from "../utils/InfoModal";

function DataManager() {
    useLanguage();
    const { setShowToast, setToastMessage, setToastVariant } = useToast();
    const { responseData, error, datahandlerRefreshProducerExecute } = DatahandlerRefreshProducer();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fullscreenModal, setFullscreenModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalExpand = () => {
        setFullscreenModal(!fullscreenModal);
    };

    const handleDataRefresh = async () => {
        if(!loading){
            setShowToast(false);
            setLoading(true);
            try {
                datahandlerRefreshProducerExecute();
            } catch (err) {
                console.error("Error executing refresh:", err);
            }
        }
    };

    useEffect(() => {
        if (responseData) {
            setModalContent(responseData);
            setShowModal(true);
            setLoading(false);
        } else if (error) {
            setToastMessage("Failed to refresh data: " + error);
            setToastVariant("danger");
            setLoading(false);
            setShowToast(true);
        }
    }, [responseData, error, setShowToast, setToastMessage, setToastVariant]);

    useLayoutEffect(() => {
        const hasAutoRefreshed = sessionStorage.getItem("dataAutoRefreshTriggered");
        if(!hasAutoRefreshed){
            sessionStorage.setItem("dataAutoRefreshTriggered", "true");
            handleDataRefresh();
        }
    },[]);

    return (
        <Col style={{ marginLeft: "250px" }}>
            <h2 className="my-4">{data_manager_strings.title}</h2>
            <Row>
                <Col className="d-flex">
                    <div className="card flex-fill">
                        <h5 className="card-header bg-primary text-light">
                            {data_manager_strings.dataset_upload_title}
                            <InfoModal 
                                shortText={info_strings.dataset_zip_short}
                                fullText={info_strings.dataset_zip_full}
                                theme={"dark"}
                            />
                        </h5>
                        <div className="card-body">
                            <Form>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>{data_manager_strings.dataset_upload}</Form.Label>
                                    <Form.Control type="file" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    {data_manager_strings.dataset_upload_submit}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Col>
                <Col className="d-flex">
                    <div className="card flex-fill">
                        <h5 className="card-header bg-primary text-light">{data_manager_strings.data_refresh_title}</h5>
                        <div className="card-body">
                            <Button variant="primary" onClick={handleDataRefresh} disabled={loading}>
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
                                        {data_manager_strings.refresh_data_loading}
                                    </>
                                ) : (
                                    data_manager_strings.refresh_data
                                )}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal show={showModal} fullscreen={fullscreenModal} onHide={handleModalClose} 
                dialogClassName={fullscreenModal ? "" : "modal-90w"} backdrop={"static"} keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{data_manager_strings.result_modal}</Modal.Title>
                    <button className={"btn-expand"} onClick={handleModalExpand}/>
                </Modal.Header>
                <Modal.Body>
                    {modalContent && (
                        <Row>
                            {Object.entries(modalContent).map(([key, value]) => (
                                <Col key={key} md={4}>
                                    <Card className="mb-3">
                                        <Card.Header className="bg-primary text-white text-center">
                                            {key.replace('_', ' ').toUpperCase()}
                                        </Card.Header>
                                        <Card.Body className="d-flex flex-wrap gap-2">
                                            <Badge pill bg={value.success ? "success" : "danger"} className="p-2">
                                                {value.success ? "Refreshed" : "Error"}
                                            </Badge>
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

export default DataManager;
