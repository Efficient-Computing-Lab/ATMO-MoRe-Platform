import { useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsInfoCircleFill } from "react-icons/bs";
import info_strings from "../localizations/InfoModals";
import { useLanguage } from "../context/LanguageContext";

function InfoModal({ shortText, fullText, theme }) {
  useLanguage();

  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const button_color = theme === "dark" ? "#f8f9fa" : "#0d6efd";

  return (
    <>
      <OverlayTrigger
        placement="left"
        overlay={<Tooltip id="info-tooltip">{shortText}</Tooltip>}
      >
        <Button
          variant="link"
          className="p-0 m-0 ms-2"
          onClick={handleOpen}
          style={{ 
            color: button_color, 
            fontSize: "1.2rem", 
            verticalAlign: "middle", 
            position: "absolute", 
            top: "5px", 
            right: "5px"
          }}
        >
          <BsInfoCircleFill />
        </Button>
      </OverlayTrigger>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{info_strings.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={{ __html: fullText }} />
        {/*<Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            {info_strings.close}
          </Button>
        </Modal.Footer>*/}
      </Modal>
    </>
  );
}

export default InfoModal;
