import { Card, Button, Badge } from "react-bootstrap";
import "../../styles/treinos.css"; // Importa os estilos específicos de treinos

export function LibraryCard({ 
  treino, 
  onCopiar, 
  onVerDetalhes, 
  onToggleFollow, 
  disabled,
  isMostFollowed // Nova prop para identificar o treino com mais seguidores
}) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card position-relative">
      
      {/* Badge "Mais Seguido" (Destaque Dourado) */}
      {isMostFollowed && (
        <div 
          className="position-absolute top-0 start-0 m-2 px-3 py-1 bg-warning text-dark fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border border-white"
          style={{ zIndex: 10, fontSize: '0.7rem', letterSpacing: '0.5px' }}
        >
          <i className="fas fa-crown text-dark"></i>
          MAIS POPULAR
        </div>
      )}

      {/* Badge de Contagem de Seguidores */}
      <div 
        className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-white rounded-pill shadow-sm d-flex align-items-center gap-1"
        style={{ zIndex: 10 }}
      >
        <i className="fas fa-users text-muted small"></i>
        <span className="fw-bold small text-dark">{treino.numeroSeguidores || 0}</span>
      </div>

      {/* Cabeçalho do Card (Área da "Imagem") */}
      <div className="card-header-img card-header-library">
         <i className="fas fa-book-reader fa-3x icon-opacity"></i>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Título e Nível */}
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
        
        {/* Criador do Treino */}
        <Card.Subtitle className="mb-3 text-muted text-small d-flex justify-content-between align-items-center">
            <span>
                <i className="fas fa-user-circle me-1"></i>
                {treino.criadorNome || "Sistema"}
            </span>
        </Card.Subtitle>

        {/* Grupo de Ações */}
        <div className="mt-auto d-flex flex-column gap-2">
            
            {/* Botão de Seguir/Deixar de Seguir (Ação Principal) */}
            <Button
                variant={treino.seguindo ? "outline-danger" : "success"}
                size="sm"
                className={`w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${!treino.seguindo ? 'text-white' : ''}`}
                onClick={() => onToggleFollow(treino)}
                disabled={disabled}
            >
                <i className={treino.seguindo ? "fas fa-heart" : "far fa-heart"}></i>
                {treino.seguindo ? "Deixar de Seguir" : "Seguir Treino"}
            </Button>

            {/* Linha de Ações Secundárias (Ver e Copiar) */}
            <div className="d-flex gap-2">
                <Button 
                  variant="outline-success" 
                  size="sm" 
                  className="flex-grow-1 fw-bold" 
                  onClick={() => onVerDetalhes(treino.id)}
                  disabled={disabled}
                >
                  <i className="far fa-eye me-1"></i> Ver
                </Button>

                <Button 
                  variant="outline-success"
                  className="flex-grow-1 fw-bold"
                  size="sm"
                  onClick={() => onCopiar(treino)}
                  disabled={disabled}
                  title="Criar uma cópia editável"
                >
                  <i className="fas fa-copy me-1"></i> Copiar
                </Button>
            </div>
        </div>
      </Card.Body>
    </Card>
  );
}