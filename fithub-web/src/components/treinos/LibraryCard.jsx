import { Card, Button, Badge } from "react-bootstrap";
import "../../styles/treinos.css"; // Importa os estilos globais

export function LibraryCard({ treino, onCopiar, onVerDetalhes, disabled }) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card">
      {/* Topo com classe CSS específica da biblioteca (Azul) */}
      <div className="card-header-img card-header-library">
         <i className="fas fa-book-reader fa-3x icon-opacity"></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="fw-bold text-dark mb-0 h6 text-truncate" title={treino.nome}>
              {treino.nome}
            </Card.Title>
            {treino.nivel && (
                <Badge bg="light" text="dark" className="border">
                    {treino.nivel}
                </Badge>
            )}
        </div>
        
        <Card.Subtitle className="mb-3 text-muted text-small">
            <i className="fas fa-user-circle me-1"></i>
            Criado por: <strong>{treino.criadorNome || "Sistema"}</strong>
        </Card.Subtitle>

        {/* Rodapé com Botões */}
        <div className="mt-auto d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="flex-grow-1 fw-bold" 
              onClick={() => onVerDetalhes(treino.id)}
              disabled={disabled}
            >
              <i className="far fa-eye"></i> Ver
            </Button>

            <Button 
              className="flex-grow-1 fw-bold btn-custom-primary"
              size="sm"
              onClick={() => onCopiar(treino)}
              disabled={disabled}
            >
              {disabled ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <><i className="fas fa-plus me-1"></i> Adicionar</>
              )}
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
}