import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { LogoutProducer } from "../producers/LogoutProducer";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import security_strings from "../localizations/Security";

function Logout() {
    useLanguage();
    const { setToastMessage, setToastVariant, setShowToast } = useToast();
    const { responseData, error, loading, logoutExecute } = LogoutProducer();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        logoutExecute();
    };

    useEffect(() => {
        if (responseData) {
            setToastMessage(security_strings.logout_success);
            setToastVariant("success");
            setShowToast(true);
            navigate("/"); // redirect after successful login
        }
        if (error) {
            setToastMessage(security_strings.logout_failed + ": " + error);
            setToastVariant("danger");
            setShowToast(true);
        }
    }, [responseData, error]);

    return (
        <Row className="justify-content-center" style={{ marginTop: "100px" }}>
            <Col md={4}>
                <Card>
                    <Card.Header className="bg-primary text-white text-center">
                        {security_strings.logout_title}
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        {security_strings.logging_out}
                                    </>
                                ) : (
                                    security_strings.logout_button
                                )}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default Logout;
