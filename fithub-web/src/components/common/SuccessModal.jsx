import { Modal, Button } from "react-bootstrap";
import "../../styles/modals.css";

export function SuccessModal({ show, handleClose, message, title }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 rounded-4 success-modal-square shadow-lg overflow-hidden"
    >
      <Modal.Body className="text-center p-5" style={{ backgroundColor: "var(--card-bg)" }}>
        {/* Ícone Animado com cor dinâmica */}
        <div className="success-icon-container mb-4">
          <div className="success-icon-circle" style={{ backgroundColor: "var(--primary-color)" }}>
            <i className="fas fa-check text-white "></i>
          </div>
        </div>

        <h3 className="fw-bold mb-3 text-dark">
          {title || "Sucesso!"}
        </h3>

        <p className="text-muted mb-4">{message}</p>

        <Button
          variant="success"
          onClick={handleClose}
          className="w-100 rounded-pill py-2 fw-bold shadow-sm border-0"
        >
          Entendido
        </Button>
      </Modal.Body>
    </Modal>
  );
}