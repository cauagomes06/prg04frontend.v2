import { Card, Button } from "react-bootstrap";
import "../../styles/treinos.css"; // Importa os estilos globais

export function MyWorkoutCard({ treino, isPersonalOrAdmin, onVerDetalhes, onExcluir, onPublicar }) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card">
      {/* Topo com classe CSS específica de meus treinos (Verde) */}
      <div className="card-header-img card-header-my-workout">
        <i className="fas fa-dumbbell fa-3x icon-opacity"></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">

        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="fw-bold text-truncate mb-1 text-dark" title={treino.nome}>
            {treino.nome}
          </Card.Title>

          <button
            className="btn btn-sm btn-outline-danger border-0"
            onClick={() => onExcluir(treino.id)}
            title="Excluir treino"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>

        <Card.Subtitle className="text-muted mb-2 text-small">
          <i className="fas fa-user-circle me-1"></i>
          Criado por: <strong className="text-success">{treino.criadorNome || "Você"}</strong>
        </Card.Subtitle>

        <span className={`badge mb-3 align-self-start ${treino.status === "PUBLICO" ? "bg-primary" : "bg-secondary"} rounded-pill`}>
          {treino.status === "PUBLICO" ? "Público" : "Privado"}
        </span>

        <div className="mt-auto d-grid gap-2">
            {/* Botão de Publicar (Apenas se for Privado e Usuário for Admin/Personal) */}
            {isPersonalOrAdmin && treino.status === "PRIVADO" && (
              <Button
                variant="outline-success"
                className="w-100 fw-bold"
                size="sm"
                onClick={() => onPublicar(treino.id)}
              >
                <i className="fas fa-globe me-1"></i> Publicar
              </Button>
            )}

            <Button
              className="w-100 fw-bold btn-custom-primary"
              size="sm"
              onClick={() => onVerDetalhes(treino.id)}
            >
              <i className="fas fa-eye me-2"></i> Ver Ficha
            </Button>
        </div>

      </Card.Body>
    </Card>
  );
}