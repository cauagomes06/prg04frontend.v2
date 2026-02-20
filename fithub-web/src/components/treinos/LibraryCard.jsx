import { Card, Button, Badge, Image } from "react-bootstrap";
import "../../styles/treinos.css";

// Função auxiliar para renderizar estrelas estáticas com base na média do DTO
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
}) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card position-relative">
      {/* Badge "Mais Seguido" */}
      {isMostFollowed && (
        <div
          className="position-absolute top-0 start-0 m-2 px-3 py-1 bg-warning text-dark fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border"
          style={{ zIndex: 10, fontSize: "0.7rem", letterSpacing: "0.5px" }}
        >
          <i className="fas fa-crown text-dark"></i> MAIS SEGUIDO
        </div>
      )}

      {/* Badge de Seguidores */}
      <div
        className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill shadow-sm d-flex align-items-center gap-1"
        style={{ zIndex: 10, backgroundColor: "var(--card-bg)" }}
      >
        <i className="fas fa-users text-muted small"></i>
        <span className="fw-bold small text-dark">
          {treino.numeroSeguidores || 0}
        </span>
      </div>

      {/* Imagem/Ícone de Cabeçalho */}
      <div className="card-header-img card-header-library d-flex align-items-center justify-content-center">
        <i className="fas fa-book-reader fa-3x icon-opacity"></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Título e Nível do Treino */}
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

        {/* Exibição de Estrelas */}
        <div
          className="d-flex align-items-center mb-2 gap-1"
          title={`Nota: ${treino.mediaNota || 0}`}
        >
          <div className="d-flex">{renderStars(treino.mediaNota || 0)}</div>
          <span className="text-muted ms-1" style={{ fontSize: "0.75rem" }}>
            ({treino.totalAvaliacoes || 0})
          </span>
        </div>

        {/* INFO DO CRIADOR */}
        <div className="d-flex align-items-center mb-3">
          {treino.criadorFoto ? (
            <Image
              src={treino.criadorFoto}
              roundedCircle
              /* ❌ AQUI: Removi o borderColor de dentro do style */
              style={{ width: "24px", height: "24px", objectFit: "cover" }}
              className="me-2 shadow-sm border"
              alt={treino.criadorNome}
            />
          ) : (
            <i className="fas fa-user-circle text-muted me-2 fs-5"></i>
          )}
          <span className="text-muted small fw-bold text-truncate">
            {treino.criadorNome || "Sistema"}
          </span>
        </div>

        {/* Rodapé com Botões de Ação */}
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
            onClick={(e) => {
              e.stopPropagation();
              if (onIniciarTreino) onIniciarTreino(treino);
            }}
            disabled={disabled}
          >
            <i className="fas fa-play"></i> Iniciar Treino
          </Button>

          {/* Ações Secundárias */}
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
