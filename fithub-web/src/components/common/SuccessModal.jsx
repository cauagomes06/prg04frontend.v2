import { Modal, Button } from "react-bootstrap";
import "../../styles/modals.css"

export function SuccessModal({ show, handleClose, message, title }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="success-modal-square" // Classe para o formato quadrado
    >
      <Modal.Body className="text-center p-5">
        {/* Ícone Animado */}
        <div className="success-icon-container mb-4">
          <div className="success-icon-circle">
            <i className="fas fa-check"></i>
          </div>
        </div>

        <h3 className="fw-bold mb-3" style={{ color: "#166534" }}>
          {title || "Sucesso!"}
        </h3>

        <p className="text-muted mb-4">{message}</p>

        <Button
          variant="success"
          onClick={handleClose}
          className="w-100 rounded-3 py-2 fw-bold"
          style={{ backgroundColor: "#22c55e", border: "none" }}
        >
          Entendido
        </Button>
      </Modal.Body>
    </Modal>
  );
}
