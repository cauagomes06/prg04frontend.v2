import { Card, Button, Badge, Image } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { useNavigate } from "react-router-dom";
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

export function LibraryCard({
  treino,
  onCopiar,
  onVerDetalhes,
  onToggleFollow,
  onAvaliar,
  disabled,
  isMostFollowed,
  onIniciarTreino,
  onError,
  hideCreatorLink = false
}) {
  const navigate = useNavigate();

  const handleValidarInicioTreino = async (e) => {
    e.stopPropagation();
    try {
      const podeTreinar = await apiFetch("/api/execucoes/pode-treinar");
      if (podeTreinar) {
        if (onIniciarTreino) onIniciarTreino(treino);
      } else {
        if (onError)
          onError(
            "Você já realizou um treino hoje! O FitHub permite apenas um registro de atividade por dia.",
          );
      }
    } catch (error) {
      if (onError)
        onError("Não foi possível validar sua permissão de treino agora.");
    }
  };

  const handleNavegarParaPerfil = (e) => {
    e.stopPropagation();
    if (treino.criadorId && !hideCreatorLink) {
      navigate(`/portal/perfil-publico/${treino.criadorId}`);
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card position-relative">
      {/* Badge "Mais Seguido" (Mantém cores fixas pois é um selo de destaque) */}
      {isMostFollowed && (
        <div className="position-absolute m-2 px-3 py-1 bg-warning text-dark fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border badge-most-followed">
          <i className="fas fa-crown text-dark"></i> MAIS SEGUIDO
        </div>
      )}

      {/* Badge de Seguidores (Cores dinâmicas via CSS) */}
      <div className="position-absolute m-2 px-2 py-1 rounded-pill shadow-sm d-flex align-items-center gap-1 badge-users-count">
        <i className="fas fa-users text-muted small"></i>
        <span className="fw-bold small count-text">
          {treino.numeroSeguidores || 0}
        </span>
      </div>

      {/* Imagem/Ícone de Cabeçalho */}
      <div className="card-header-img card-header-library d-flex align-items-center justify-content-center">
        <i className="fas fa-book-reader fa-3x icon-opacity"></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title
            className="fw-bold mb-0 h6 text-truncate pe-2 card-title"
            title={treino.nome}
          >
            {treino.nome}
          </Card.Title>

          {treino.status === "PUBLICO" && (
            <Badge className="border border-success badge-public-status bg-success">
              PÚBLICO
            </Badge>
          )}
        </div>

        {/* Avaliação */}
        <div
          className="d-flex align-items-center mb-2 gap-1"
          title={`Nota: ${treino.mediaNota || 0}`}
        >
          <div className="d-flex">{renderStars(treino.mediaNota || 0)}</div>
          <span className="text-muted ms-1 rating-text-muted">
            ({treino.totalAvaliacoes || 0})
          </span>
        </div>

        {/* Info do Criador */}
        <div
          className={`d-flex align-items-center mb-3 ${treino.criadorId ? "creator-info-wrapper pointer" : "text-muted"}`}
          onClick={handleNavegarParaPerfil}
          title={treino.criadorId ? "Ver perfil do criador" : ""}
          style={{ cursor: treino.criadorId ? "pointer" : "default" }}
        >
          {treino.criadorFoto ? (
            <Image
              src={treino.criadorFoto}
              roundedCircle
              className="me-2 shadow-sm border creator-avatar-sm"
              alt={treino.criadorNome}
              style={{ width: "24px", height: "24px", objectFit: "cover" }}
            />
          ) : (
            <i className="fas fa-user-circle text-muted me-2 fs-5"></i>
          )}
          <span
            className={`small fw-bold text-truncate creator-name-text ${treino.criadorId ? "text-success" : ""}`}
          >
            {treino.criadorNome || "Sistema"}
          </span>
        </div>

        {/* Botões de Ação */}
        <div className="mt-auto d-flex flex-column gap-2">
          <Button
            variant={treino.seguindo ? "outline-danger" : "outline-success"}
            size="sm"
            className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(treino);
            }}
            disabled={disabled}
          >
            <i className={treino.seguindo ? "fas fa-heart" : "far fa-heart"}></i>
            {treino.seguindo ? "Deixar de Seguir" : "Seguir"}
          </Button>

          <Button
            variant="success"
            size="sm"
            className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 text-white shadow-sm"
            onClick={handleValidarInicioTreino}
            disabled={disabled}
          >
            <i className="fas fa-play"></i> Iniciar Treino
          </Button>

          {/* Wrapper dos 3 botões perfeitamente alinhados */}
          <div className="library-actions-row mt-1">
            <Button
              variant="outline-success"
              size="sm"
              className="btn-library-action"
              onClick={(e) => {
                e.stopPropagation();
                onVerDetalhes(treino.id);
              }}
              disabled={disabled}
              title="Ver detalhes"
            >
              <i className="far fa-eye"></i>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              className="btn-library-action"
              onClick={(e) => {
                e.stopPropagation();
                onCopiar(treino);
              }}
              disabled={disabled}
              title="Clonar treino"
            >
              <i className="fas fa-copy"></i>
            </Button>

            <Button
              variant="outline-warning"
              size="sm"
              className="btn-library-action"
              onClick={(e) => {
                e.stopPropagation();
                onAvaliar(treino);
              }}
              disabled={disabled}
              title="Avaliar este treino"
            >
              <i className="fas fa-star"></i>
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}