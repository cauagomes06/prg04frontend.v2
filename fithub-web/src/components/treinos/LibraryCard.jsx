import { Card, Button, Badge, Image } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import { useNavigate } from "react-router-dom"; // IMPORTAÇÃO CORRIGIDA AQUI NO TOPO
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
}) {

  const navigate = useNavigate(); // HOOK INICIALIZADO AQUI

  const handleValidarInicioTreino = async (e) => {
    e.stopPropagation();
    try {
      const podeTreinar = await apiFetch("/api/execucoes/pode-treinar");
      if (podeTreinar) {
        if (onIniciarTreino) onIniciarTreino(treino);
      } else {
        if (onError) onError("Você já realizou um treino hoje! O FitHub permite apenas um registro de atividade por dia.");
      }
    } catch (error) {
      if (onError) onError("Não foi possível validar sua permissão de treino agora.");
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card position-relative">
      {isMostFollowed && (
        <div
          className="position-absolute top-0 start-0 m-2 px-3 py-1 bg-warning text-dark fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border"
          style={{ zIndex: 10, fontSize: "0.7rem", letterSpacing: "0.5px" }}
        >
          <i className="fas fa-crown text-dark"></i> MAIS SEGUIDO
        </div>
      )}

      <div
        className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill shadow-sm d-flex align-items-center gap-1"
        style={{ zIndex: 10, backgroundColor: "var(--card-bg)" }}
      >
        <i className="fas fa-users text-muted small"></i>
        <span className="fw-bold small text-dark">
          {treino.numeroSeguidores || 0}
        </span>
      </div>

      <div className="card-header-img card-header-library d-flex align-items-center justify-content-center">
        <i className="fas fa-book-reader fa-3x icon-opacity"></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title
            className="fw-bold text-dark mb-0 h6 text-truncate pe-2"
            title={treino.nome}
          >
            {treino.nome}
          </Card.Title>

          {treino.status === "PUBLICO" && (
            <Badge
              className="border border-success"
              style={{
                fontSize: "0.65rem",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary-color)",
              }}
            >
              PÚBLICO
            </Badge>
          )}
        </div>

        <div
          className="d-flex align-items-center mb-2 gap-1"
          title={`Nota: ${treino.mediaNota || 0}`}
        >
          <div className="d-flex">{renderStars(treino.mediaNota || 0)}</div>
          <span className="text-muted ms-1" style={{ fontSize: "0.75rem" }}>
            ({treino.totalAvaliacoes || 0})
          </span>
        </div>

        {/* --- DIV DO CRIADOR COM NAVEGAÇÃO --- */}
        <div 
          className="d-flex align-items-center mb-3" 
          style={{ cursor: treino.criadorId ? "pointer" : "default" }}
          onClick={(e) => {
            e.stopPropagation(); // Evita que clique na foto dispare outras ações do card
            if (treino.criadorId) {
              navigate(`/portal/perfil/${treino.criadorId}`);
            }
          }}
          title={treino.criadorId ? "Ver perfil do criador" : ""}
        >
          {treino.criadorFoto ? (
            <Image
              src={treino.criadorFoto}
              roundedCircle
              style={{ width: "24px", height: "24px", objectFit: "cover" }}
              className="me-2 shadow-sm border"
              alt={treino.criadorNome}
            />
          ) : (
            <i className="fas fa-user-circle text-muted me-2 fs-5"></i>
          )}
          <span className={`small fw-bold text-truncate ${treino.criadorId ? 'text-success hover-text-dark' : 'text-muted'}`} style={{ transition: "color 0.2s ease" }}>
            {treino.criadorNome || "Sistema"}
          </span>
        </div>

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
            <i
              className={treino.seguindo ? "fas fa-heart" : "far fa-heart"}
            ></i>
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

          <div className="d-flex gap-2 mt-1">
            <Button
              variant="outline-success"
              size="sm"
              className="flex-grow-1 fw-bold"
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
              variant="outline-success"
              size="sm"
              className="flex-grow-1 fw-bold"
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
              className="flex-grow-0 fw-bold"
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