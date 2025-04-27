import { Navbar as BootstrapNavbar, Dropdown, Nav } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import navbar_strings from "../localizations/Navbar";

function Navbar({ logo }) {
  const { language, changeLanguage } = useLanguage();

  return (
    <BootstrapNavbar variant="dark" className="navbar">
      <BootstrapNavbar.Brand href="#home">
        <img
          src={logo}
          height="30"
          className="d-inline-block align-top logo-main"
          alt="ATMO-MoRe logo"
        />{" "}
        {navbar_strings.title}
      </BootstrapNavbar.Brand>
      <Nav className="ms-auto">
        <Dropdown>
          <Dropdown.Toggle variant="secondary">{navbar_strings.language}: {language?language.toUpperCase():"GR"}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage("gr")}>Ελληνικά</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </BootstrapNavbar>
  );
}

export default Navbar;
