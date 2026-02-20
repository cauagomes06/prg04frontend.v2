import { Modal, Button } from "react-bootstrap";

export function ConfirmModal({ show, handleClose, handleConfirm, title, message }) {
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      contentClassName="border-0 rounded-4 overflow-hidden shadow"
    >
      <Modal.Header closeButton className="borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
        <Modal.Title className="fw-bold text-dark fs-5">{title || "Confirmar Ação"}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ backgroundColor: "var(--card-bg)" }}>
        <p className="text-muted mb-0">{message || "Tem certeza que deseja continuar?"}</p>
      </Modal.Body>

      <Modal.Footer className="border-0 p-3" style={{ backgroundColor: "var(--card-bg)" }}>
        <Button variant="link" className="text-muted fw-bold text-decoration-none shadow-none" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="success" 
          className="rounded-pill px-4 fw-bold shadow-sm" 
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}