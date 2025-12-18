import { Modal, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

export function ParticipantsModal({ show, handleClose, aulaId }) {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && aulaId) {
      setLoading(true);
      setError("");
      // Chama o endpoint que criámos no passo anterior
      apiFetch(`/api/aulas/${aulaId}/participantes`)
        .then(setParticipantes)
        .catch((err) => setError(err.message || "Erro ao carregar."))
        .finally(() => setLoading(false));
    }
  }, [show, aulaId]);

  return (
    <Modal show={show} onHide={handleClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">
            <i className="fas fa-users me-2 text-success"></i> Participantes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" size="sm" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="small">{error}</Alert>
        ) : participantes.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p className="mb-0">Nenhum aluno inscrito nesta aula.</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {participantes.map((p, idx) => (
              <ListGroup.Item key={p.idUsuario || idx} className="d-flex align-items-center py-3">
                <span className="badge bg-light text-dark border me-3 rounded-circle p-2" style={{width: "35px", height: "35px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    {idx + 1}
                </span>
                <div>
                    <span className="fw-bold d-block text-dark">{p.nomeCompleto}</span>
                    <small className="text-muted" style={{fontSize: "0.75rem"}}>ID: #{p.idUsuario}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={handleClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}