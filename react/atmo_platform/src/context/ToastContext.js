import React, { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

// Create Context
const ToastContext = createContext();

// Create a Provider Component
export const ToastProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  return (
    <ToastContext.Provider value={{ setShowToast, setToastMessage, setToastVariant }}>
      {children}

      {/* Centralized Toast Component */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toastVariant}
          delay={6000}
          autohide
        >
          <Toast.Header><strong className="me-auto">{toastVariant.toUpperCase()}</strong></Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Custom Hook for easy access
export const useToast = () => useContext(ToastContext);
