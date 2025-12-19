import { Modal, Button } from "react-bootstrap";

export function SuccessModal({ show, handleClose, message, title }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Sucesso!"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" onClick={handleClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
