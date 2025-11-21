import { Modal, Button } from "react-bootstrap";

export function ConfirmModal({ show, handleClose, handleConfirm, title, message }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirmar ação"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message || "Tem certeza que deseja continuar?"}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
