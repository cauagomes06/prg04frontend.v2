import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import "../../styles/treinos.css";

export function WorkoutModal({
  show,
  handleClose,
  treino,
  readOnly = false,
  onIniciarTreino,
  onError,
}) {
  const formatarDescanso = (descanso) => {
    if (!descanso) return "N/A";
    if (!isNaN(descanso)) return `${descanso}s`;
    return descanso;
  };

  const handleValidarInicioTreino = async () => {
    try {
      const podeTreinar = await apiFetch("/api/execucoes/pode-treinar");
      if (podeTreinar) {
        handleClose();
        onIniciarTreino(treino);
      } else {
        if (onError) onError("Limite diário atingido! Você já realizou um treino hoje. Volte amanhã para novos desafios.");
      }
    } catch (error) {
      if (onError) onError("Erro ao verificar permissão de treino. Tente novamente mais tarde.");
    }
  };

  return (
<Modal
  show={show}
  onHide={handleClose}
  size="lg"
  centered
  contentClassName="workout-modal-container custom-card" // custom-card já tem suporte ao dark
>
  <Modal.Header
    closeButton
    className="workout-modal-header border-0"
    // Removemos o data-bs-theme="dark" fixo para ele seguir o global
  >
    <Modal.Title className="workout-modal-title">
      <i className="fas fa-dumbbell me-2 icon-opacity"></i>
      {treino?.nome || "Detalhes do Treino"}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body className="workout-modal-body">
    {treino ? (
      <div className="workout-modal-content-wrapper">
        <div className="workout-info-section">
          <h5 className="section-label">Sobre o Treino</h5>
          <p className="workout-description">
            {treino.descricao || "Sem descrição disponível."}
          </p>

          <div className="badge-group">
            <Badge bg="success" className="workout-badge shadow-sm">
              <i className="fas fa-clock me-1"></i>{" "}
              {treino.duracaoMinutos ? `${treino.duracaoMinutos} min` : "Livre"}
            </Badge>

            <Badge className={`workout-badge shadow-sm ${treino.status === "PUBLICO" ? "bg-primary" : "bg-secondary"}`}>
              {treino.status === "PUBLICO" ? "Público" : "Privado"}
            </Badge>
          </div>
        </div>

        <hr className="modal-divider" />

        <h5 className="section-title-exercises">
          <i className="fas fa-list-ol me-2"></i> Sequência de Exercícios
        </h5>

        {(treino.items || []).length > 0 ? (
          <ListGroup variant="flush" className="exercise-list-group">
            {treino?.items.map((item, index) => (
              <ListGroup.Item key={index} className="exercise-item-row shadow-sm">
                <div className="exercise-main-info">
                  <div className="exercise-number-badge">
                    {index + 1}
                  </div>
                  <div className="exercise-name">
                    {item.nomeExercicio || "Exercício não identificado"}
                  </div>
                </div>

                <div className="exercise-stats-grid">
                  <div className="stat-box">
                    <div className="stat-value">{item.series}</div>
                    <small className="stat-label">Séries</small>
                  </div>

                  <div className="divider-v d-none d-md-block"></div>

                  <div className="stat-box">
                    <div className="stat-value text-success">{item.repeticoes}</div>
                    <small className="stat-label">Reps</small>
                  </div>

                  <div className="divider-v d-none d-md-block"></div>

                  <div className="stat-box">
                    <div className="stat-value text-warning">{formatarDescanso(item.descanso)}</div>
                    <small className="stat-label">Descanso</small>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="empty-exercises-alert">
            <i className="fas fa-exclamation-triangle fa-2x mb-3 text-warning"></i>
            <p className="mb-0 fw-bold">Nenhum exercício cadastrado.</p>
          </div>
        )}
      </div>
    ) : (
      <div className="loader-container">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )}
  </Modal.Body>
  
  <Modal.Footer className="workout-modal-footer border-0">
    <Button variant="outline-secondary" className="btn-modal-back" onClick={handleClose}>
      Voltar
    </Button>
    <Button variant="success" className="btn-modal-start" onClick={handleValidarInicioTreino}>
      <i className="fas fa-play me-2"></i> Iniciar Treino
    </Button>
  </Modal.Footer>
</Modal>
  );
}