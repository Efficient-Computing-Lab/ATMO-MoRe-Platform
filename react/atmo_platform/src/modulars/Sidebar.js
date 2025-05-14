import { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LogoutProducer } from "../producers/LogoutProducer";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import sidebar_strings from "../localizations/Sidebar";
import security_strings from "../localizations/Security";

function Sidebar() {
  useLanguage();
  const { setToastMessage, setToastVariant, setShowToast } = useToast();
  const { responseData, error, loading, logoutExecute } = LogoutProducer();
  const navigate = useNavigate();

  const handleLogout = (e) => {
      e.preventDefault();
      logoutExecute();
      window.location.reload();
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
    <div className="sidebar p-3">
      <h4>{sidebar_strings.title}</h4>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/" end>
          {sidebar_strings.datasets}
        </Nav.Link>
        <Nav.Link as={NavLink} to="/prediction">
          {sidebar_strings.prediction}
        </Nav.Link>
        <Nav.Link as={NavLink} to="/optimization">
          {sidebar_strings.optimization}
        </Nav.Link>
        <Nav.Link as={NavLink} to="/analytics">
          {sidebar_strings.analytics}
        </Nav.Link>
        <Nav.Link onClick={handleLogout}>
          {security_strings.logout_button}
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;