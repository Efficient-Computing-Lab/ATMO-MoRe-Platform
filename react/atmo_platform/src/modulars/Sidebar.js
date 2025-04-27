import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import sidebar_strings from "../localizations/Sidebar";

function Sidebar() {
  useLanguage();

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
      </Nav>
    </div>
  );
}

export default Sidebar;