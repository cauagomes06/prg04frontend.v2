import { Modal, Button } from "react-bootstrap";

export function ErrorModal({ show, handleClose, title, message }) {
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      contentClassName="border-0 rounded-4 overflow-hidden shadow"
    >
      <Modal.Body className="text-center p-5" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="mb-4" style={{ color: "#ef4444" }}>
            <i className="fas fa-times-circle fa-5x opacity-5"></i>
        </div>
        <h4 className="fw-bold text-dark mb-2">{title || "Ops! Algo correu mal"}</h4>
        <p className="text-muted mb-4">{message || "Ocorreu um erro inesperado. Por favor, tente novamente."}</p>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          className="rounded-pill px-5 fw-bold border-0"
          style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
        >
          Fechar
        </Button>
      </Modal.Body>
    </Modal>
  );
}