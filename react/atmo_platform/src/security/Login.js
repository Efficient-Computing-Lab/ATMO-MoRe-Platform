import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { LoginProducer } from "../producers/LoginProducer";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import security_strings from "../localizations/Security";

function Login() {
    useLanguage();
    const { setToastMessage, setToastVariant, setShowToast } = useToast();
    const { responseData, error, loading, loginExecute } = LoginProducer();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) {
            loginExecute(username, password);
        }
    };

    const registerRoute = () =>{ 
        navigate("/register");
      }

    useEffect(() => {
        if (responseData) {
            setToastMessage(security_strings.login_success);
            setToastVariant("success");
            setShowToast(true);
            navigate("/"); // redirect after successful login
        }
        if (error) {
            setToastMessage(security_strings.login_failed + ": " + error);
            setToastVariant("danger");
            setShowToast(true);
        }
    }, [responseData, error]);

    return (
        <Row className="justify-content-center" style={{ marginTop: "100px" }}>
            <Col md={4}>
                <Card>
                    <Card.Header className="bg-primary text-white text-center">
                        {security_strings.login_title}
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>{security_strings.username}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>{security_strings.password}</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        {security_strings.logging_in}
                                    </>
                                ) : (
                                    security_strings.login_button
                                )}
                            </Button>
                        </Form>
                        <Button style={{"marginTop":"5px"}} variant="primary" disabled={loading} className="w-100" onClick={registerRoute}>
                            {security_strings.register_button}
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default Login;
