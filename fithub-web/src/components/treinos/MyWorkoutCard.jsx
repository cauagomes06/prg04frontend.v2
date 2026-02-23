import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../styles/treinos.css";

const renderStars = (media) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (media >= i) {
      stars.push(<i key={i} className="fas fa-star text-warning small"></i>);
    } else if (media >= i - 0.5) {
      stars.push(
        <i key={i} className="fas fa-star-half-alt text-warning small"></i>,
      );
    } else {
      stars.push(<i key={i} className="far fa-star text-muted small"></i>);
    }
  }
  return stars;
};

export function MyWorkoutCard({
  treino,
  isPersonalOrAdmin,
  onVerDetalhes,
  onEditar,
  onExcluir,
  onPublicar,
  disabled,
}) {
  const isPublic = treino.status === "PUBLICO";

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card position-relative">
      {/* Badge de Status (Público/Privado) */}
      <div
        className={`position-absolute   top-0 start-0 m-1  px-1 py-1 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border border-white badge-status-workout ${isPublic ? "bg-primary text-white small" : "bg-secondary text-white small"}`}
      >
        <i className={isPublic ? "fas fa-globe-americas small " : "fas fa-lock small"}></i>
        {isPublic ? "PÚBLICO" : "PRIVADO"}
      </div>

      {/* Badge de Seguidores */}
      <div className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-white rounded-pill shadow-sm d-flex align-items-center gap-1 badge-users-count">
        <i className="fas fa-users text-muted small"></i>
        <span className="fw-bold small text-dark">
          {treino.numeroSeguidores || 0}
        </span>
      </div>

      <div
        className={`card-header-img ${isPublic ? "card-header-library" : "card-header-my-workout"}`}
      >
        <i
          className={`fas ${isPublic ? "fa-file-signature" : "fa-dumbbell"} fa-3x icon-opacity`}
        ></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title
            className="fw-bold text-dark mb-0 h6 text-truncate pe-2"
            title={treino.nome}
          >
            {treino.nome}
          </Card.Title>
          {treino.nivel && (
            <Badge bg="light" text="dark" className="border flex-shrink-0">
              {treino.nivel}
            </Badge>
          )}
        </div>

        {/* Estrelas */}
        <div className="d-flex align-items-center mb-2 gap-1">
          <div className="d-flex">{renderStars(treino.mediaNota || 0)}</div>
          <span className="text-muted ms-1 rating-text-muted">
            ({treino.totalAvaliacoes || 0})
          </span>
        </div>

        <Card.Subtitle className="mb-0 text-muted text-small d-flex align-items-center">
          <i className="fas fa-calendar-alt me-1"></i>
          Criado em:{" "}
          {treino.dataCriacao
            ? new Date(treino.dataCriacao).toLocaleDateString("pt-BR")
            : "Recente"}
        </Card.Subtitle>

        <div className="mt-auto pt-3 d-flex flex-column gap-2">
          {/* Botão de Publicar (Apenas Admin/Personal e se for privado) */}
          {isPersonalOrAdmin && !isPublic && (
            <Button
              variant="success"
              size="sm"
              className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 text-white shadow-sm text-nowrap"
              onClick={() => onPublicar(treino.id)}
              disabled={disabled}
            >
              <i className="fas fa-upload"></i> Publicar
            </Button>
          )}

          {/* Wrapper de Ações Responsivo */}
          <div className="workout-actions-wrapper">
            <Button
              variant="outline-success"
              size="sm"
              className="btn-detail-action fw-bold d-flex align-items-center justify-content-center gap-2"
              onClick={() => onVerDetalhes(treino.id)}
              disabled={disabled}
            >
              <i className="far fa-eye"></i> Detalhes
            </Button>

            <div className="btn-group-edit-delete">
              <OverlayTrigger overlay={<Tooltip>Editar Treino</Tooltip>}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="flex-grow-1 d-flex align-items-center justify-content-center"
                  onClick={() => onEditar(treino)}
                  disabled={disabled}
                >
                  <i className="fas fa-edit"></i>
                </Button>
              </OverlayTrigger>

              <OverlayTrigger overlay={<Tooltip>Excluir Treino</Tooltip>}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="flex-grow-1 d-flex align-items-center justify-content-center"
                  onClick={() => onExcluir(treino.id)}
                  disabled={disabled}
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
