import "bootstrap/dist/css/bootstrap.min.css";
import { useLayoutEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import logo from "./assets/Logo_Atmomore_dark_min.png";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import Analytics from "./dashboards/Analytics";
import DataManager from "./dashboards/DataManager";
import Prediction from "./dashboards/Prediction";
import Optimization from "./dashboards/Optimization";
import Navbar from "./modulars/Navbar";
import Sidebar from "./modulars/Sidebar";
import Login from "./security/Login";
import Logout from "./security/Logout";
import Register from "./security/Register";
import PrivateRoute from "./utils/PrivateRoute";

function App() {

  useLayoutEffect(() => {
    document.title = "ATMO-MoRe Platform"
  }, []);

  return (
    <LanguageProvider>
      <ToastProvider>
        <div className="App">
          <Navbar logo={logo} />
          <Sidebar />

          <Container fluid style={{paddingTop:"50px"}}>
            <Row>
              <Routes>
                <Route path="/" element={<PrivateRoute><DataManager /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/prediction" element={<PrivateRoute><Prediction /></PrivateRoute>} />
                <Route path="/optimization" element={<PrivateRoute><Optimization /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              </Routes>
            </Row>
          </Container>
        </div>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
