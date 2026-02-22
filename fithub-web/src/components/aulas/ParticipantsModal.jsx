import { Modal, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";
import "../../styles/aulas.css";

export function ParticipantsModal({ show, handleClose, aulaId }) {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && aulaId) {
      setLoading(true);
      setError("");
      apiFetch(`/api/aulas/${aulaId}/participantes`)
        .then(setParticipantes)
        .catch((err) => setError(err.message || "Erro ao carregar."))
        .finally(() => setLoading(false));
    }
  }, [show, aulaId]);

  return (
    <Modal show={show} onHide={handleClose} centered scrollable contentClassName="border-0 rounded-4 shadow">
      <Modal.Header closeButton className="borda-customizada">
        <Modal.Title className="h5 fw-bold text-dark">
            <i className="fas fa-users me-2 text-success"></i> Participantes
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0 participants-modal-body">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" size="sm" />
            <p className="small text-muted mt-2">Buscando lista...</p>
          </div>
        ) : error ? (
          <div className="p-3">
            <Alert variant="danger" className="small mb-0">{error}</Alert>
          </div>
        ) : participantes.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-user-slash fa-2x mb-3 opacity-25"></i>
            <p className="mb-0 fw-bold">Nenhum aluno inscrito nesta aula.</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {participantes.map((p, idx) => (
              <ListGroup.Item 
                key={p.idUsuario || idx} 
                className="d-flex align-items-center py-3 px-4 participant-item"
              >
                <div className="participant-index rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0">
                    {idx + 1}
                </div>
                <div>
                    <span className="participant-name">{p.nomeCompleto}</span>
                    <small className="participant-id text-muted">ID: #{p.idUsuario}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer className="borda-customizada border-0">
        <Button variant="outline-secondary" className="rounded-pill px-4 fw-bold" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}