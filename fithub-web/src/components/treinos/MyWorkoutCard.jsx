import { Card, Button, Badge } from "react-bootstrap";
import "../../styles/treinos.css";

export function MyWorkoutCard({ treino, isPersonalOrAdmin, onVerDetalhes, onExcluir, onPublicar }) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card">
      
      {/* 1. Cabeçalho Compacto (Altura fixa menor) */}
      <div className="card-header-img card-header-my-workout" style={{ height: '90px' }}>
        <i className="fas fa-dumbbell fa-2x icon-opacity"></i>
      </div>

      {/* 2. Corpo com Padding Reduzido (p-2 em vez de p-3) */}
      <Card.Body className="d-flex flex-column p-2">
        
        {/* Título e Badge na mesma linha */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Card.Title 
            className="fw-bold text-dark mb-0 text-truncate" 
            title={treino.nome}
            style={{ fontSize: '0.95rem', maxWidth: '75%' }}
          >
            {treino.nome}
          </Card.Title>
          
          <Badge 
            bg={treino.status === "PUBLICO" ? "primary" : "secondary"} 
            className="rounded-pill border"
            style={{ fontSize: '0.65rem' }}
          >
            {treino.status === "PUBLICO" ? "Público" : "Privado"}
          </Badge>
        </div>

        {/* Autor */}
        <Card.Subtitle className="mb-2 text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
          <i className="fas fa-user-circle me-1"></i>
          Por: <strong className="text-success">{treino.criadorNome || "Você"}</strong>
        </Card.Subtitle>

        {/* Rodapé de Ações */}
        <div className="mt-auto d-flex flex-column gap-1">
           
           {/* Botões Ver e Excluir na mesma linha */}
           <div className="d-flex gap-1">
              <Button
                variant="outline-secondary"
                size="sm"
                className="flex-grow-1 fw-bold"
                style={{ fontSize: '0.8rem', padding: '0.25rem' }}
                onClick={() => onVerDetalhes(treino.id)}
              >
                <i className="far fa-eye me-1"></i> Ver
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                className="fw-bold"
                title="Excluir treino"
                style={{ fontSize: '0.8rem', padding: '0.25rem', minWidth: '35px' }}
                onClick={() => onExcluir(treino.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </Button>
           </div>

           {/* Botão de Publicar (Condicional) */}
           {isPersonalOrAdmin && treino.status === "PRIVADO" && (
              <Button
                variant="outline-success"
                size="sm"
                className="w-100 fw-bold border-success text-success btn-publicar-hover"
                style={{ fontSize: '0.8rem', padding: '0.25rem' }}
                onClick={() => onPublicar(treino.id)}
              >
                <i className="fas fa-globe me-1"></i> Publicar
              </Button>
           )}
        </div>

      </Card.Body>
    </Card>
  );
}