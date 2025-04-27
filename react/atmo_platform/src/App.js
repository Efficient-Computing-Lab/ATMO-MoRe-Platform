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
                <Route path="/" element={<DataManager />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/optimization" element={<Optimization />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Row>
          </Container>
        </div>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
