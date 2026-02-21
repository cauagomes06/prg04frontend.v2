import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import "../../styles/treinos.css";

export function WorkoutModal({
  show,
  handleClose,
  treino,
  readOnly = false,
  onIniciarTreino,
  onError, // Nova prop para subir mensagens de erro
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
      contentClassName="rounded-4 border-0 overflow-hidden shadow-lg custom-card"
    >
      <Modal.Header
        closeButton
        className="card-header-my-workout border-0 text-white"
        data-bs-theme="dark"
      >
        <Modal.Title className="fw-bold d-flex align-items-center text-dark fs-5">
          <i className="fas fa-dumbbell me-2 icon-opacity"></i>
          {treino?.nome || "Detalhes do Treino"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3 p-md-4">
        {treino ? (
          <div>
            {/* Cabeçalho com Detalhes Gerais */}
            <div className="mb-4 text-center text-md-start">
              <h5 className="text-muted mb-2 text-uppercase small fw-bold">
                Sobre o Treino
              </h5>
              <p className="lead fs-6 mb-3 text-dark px-2 px-md-0">
                {treino.descricao || "Sem descrição disponível."}
              </p>

              <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-start">
                <Badge bg="success" className="p-2 px-3 rounded-pill shadow-sm">
                  <i className="fas fa-clock me-1"></i>{" "}
                  {treino.duracaoMinutos
                    ? `${treino.duracaoMinutos} min`
                    : "Livre"}
                </Badge>

                <Badge
                  className={`p-2 px-3 rounded-pill shadow-sm ${treino.status === "PUBLICO" ? "bg-primary" : "bg-secondary"}`}
                >
                  {treino.status === "PUBLICO" ? "Público" : "Privado"}
                </Badge>
              </div>
            </div>

            <hr className="text-muted opacity-25 mb-4" />

            {/* Lista de Exercícios */}
            <h5 className="mb-3 text-success fw-bold px-2 px-md-0">
              <i className="fas fa-list-ol me-2"></i> Sequência de Exercícios
            </h5>

            {(treino.items || []).length > 0 ? (
              <ListGroup variant="flush" className="gap-3">
                {treino?.items.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3 px-3 px-md-4 border-0 rounded-4 shadow-sm bg-light hover-effect"
                  >
                    <div className="d-flex align-items-center gap-3 w-100 mb-3 mb-md-0">
                      <div
                        className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                        style={{
                          width: "42px",
                          height: "42px",
                          fontWeight: "900",
                          fontSize: "1.1rem",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="fw-bold fs-5 text-dark lh-sm pe-2">
                        {item.nomeExercicio || "Exercício não identificado"}
                      </div>
                    </div>

                    <div className="d-flex flex-row justify-content-between justify-content-md-end text-center w-100 flex-md-shrink-0 pt-2 pt-md-0 border-top border-md-0 mt-2 mt-md-0">
                      <div className="px-2 px-md-3 mt-2 mt-md-0">
                        <div className="fw-black text-dark fs-5">
                          {item.series}
                        </div>
                        <small
                          className="text-muted text-uppercase fw-bold"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Séries
                        </small>
                      </div>

                      <div className="d-none d-md-block border-start mx-1 my-2 opacity-50"></div>

                      <div className="px-2 px-md-3 mt-2 mt-md-0">
                        <div className="fw-black text-success fs-5">
                          {item.repeticoes}
                        </div>
                        <small
                          className="text-muted text-uppercase fw-bold"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Reps
                        </small>
                      </div>

                      <div className="d-none d-md-block border-start mx-1 my-2 opacity-50"></div>

                      <div className="px-2 px-md-3 mt-2 mt-md-0">
                        <div className="fw-black text-warning fs-5">
                          {formatarDescanso(item.descanso)}
                        </div>
                        <small
                          className="text-muted text-uppercase fw-bold"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Descanso
                        </small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="alert alert-warning text-center p-4 rounded-4 border-0 shadow-sm mx-2 mx-md-0">
                <i className="fas fa-exclamation-triangle fa-2x mb-3 text-warning"></i>
                <p className="mb-0 fw-bold">Nenhum exercício cadastrado.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 bg-light rounded-bottom-4 p-3 p-md-4">
        <Button
          variant="outline-secondary"
          className="fw-bold px-4 rounded-pill"
          onClick={handleClose}
        >
          Voltar
        </Button>
        <Button
          variant="success"
          className="fw-bold px-4 px-md-5 rounded-pill shadow-sm"
          onClick={handleValidarInicioTreino}
        >
          <i className="fas fa-play me-2"></i> Iniciar Treino
        </Button>
      </Modal.Footer>
    </Modal>
  );
}