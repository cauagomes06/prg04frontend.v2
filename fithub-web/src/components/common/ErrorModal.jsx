import { Modal, Button } from "react-bootstrap";

export function ErrorModal({ show, handleClose, title, message }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
            <i className="fas fa-exclamation-circle me-2"></i> 
            {title || "Erro"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-4">
        <div className="text-danger mb-3">
            <i className="fas fa-times-circle fa-4x"></i>
        </div>
        <p className="fs-5">{message || "Ocorreu um erro inesperado."}</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}