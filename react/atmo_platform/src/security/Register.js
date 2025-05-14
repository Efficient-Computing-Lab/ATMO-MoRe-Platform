import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RegisterProducer } from "../producers/RegisterProducer";
import security_strings from "../localizations/Security";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { responseData, error, loading, RegisterProducerExecute } = RegisterProducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (responseData) {
      // You can also trigger a toast here
      navigate("/login");
    }
  }, [responseData, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    RegisterProducerExecute(username, password, confirmPassword);
  };

  return (
    <Container className="my-5" style={{ maxWidth: "400px" }}>
      <h2>{security_strings.register_title}</h2>
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
        <Form.Group className="mb-3">
          <Form.Label>{security_strings.confirm_password}</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        {error && (
          <Alert variant="danger">
            {error === "passwords_mismatch"
              ? security_strings.passwords_do_not_match
              : security_strings.register_failed}
          </Alert>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? security_strings.registering : security_strings.register_button}
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
