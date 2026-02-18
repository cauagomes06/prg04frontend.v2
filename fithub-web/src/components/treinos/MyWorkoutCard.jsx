import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../styles/treinos.css";

// Lógica de estrelas para manter a consistência visual
const renderStars = (media) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (media >= i) {
            stars.push(<i key={i} className="fas fa-star text-warning small"></i>);
        } else if (media >= i - 0.5) {
            stars.push(<i key={i} className="fas fa-star-half-alt text-warning small"></i>);
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
    onEditar, // <--- NOVA PROP
    onExcluir, 
    onPublicar, 
    disabled 
}) {
    const isPublic = treino.status === "PUBLICO";

    return (
        <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-effect custom-card position-relative">
            
            {/* Badge de Status (Flutuante na Esquerda) */}
            <div 
                className={`position-absolute top-0 start-0 m-2 px-3 py-1 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border border-white ${isPublic ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                style={{ zIndex: 10, fontSize: '0.7rem', letterSpacing: '0.5px' }}
            >
                <i className={isPublic ? "fas fa-globe-americas" : "fas fa-lock"}></i>
                {isPublic ? "PÚBLICO" : "PRIVADO"}
            </div>

            {/* Badge de Seguidores (Flutuante na Direita) */}
            <div className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-white rounded-pill shadow-sm d-flex align-items-center gap-1" style={{ zIndex: 10 }}>
                <i className="fas fa-users text-muted small"></i>
                <span className="fw-bold small text-dark">{treino.numeroSeguidores || 0}</span>
            </div>

            {/* Header com Ícone Grande */}
            <div className={`card-header-img ${isPublic ? 'card-header-library' : 'card-header-my-workout'}`}>
                <i className={`fas ${isPublic ? 'fa-file-signature' : 'fa-dumbbell'} fa-3x icon-opacity`}></i>
            </div>

            <Card.Body className="d-flex flex-column p-3">
                {/* Título e Nível */}
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <Card.Title className="fw-bold text-dark mb-0 h6 text-truncate" title={treino.nome}>
                        {treino.nome}
                    </Card.Title>
                    {treino.nivel && <Badge bg="light" text="dark" className="border">{treino.nivel}</Badge>}
                </div>

                {/* Área de Avaliação (Estrelas) */}
                <div className="d-flex align-items-center mb-2 gap-1">
                    <div className="d-flex">{renderStars(treino.mediaNota || 0)}</div>
                    <span className="text-muted ms-1" style={{fontSize: '0.75rem'}}>
                        ({treino.totalAvaliacoes || 0})
                    </span>
                </div>
                
                <Card.Subtitle className="mb-3 text-muted text-small d-flex align-items-center">
                    <i className="fas fa-calendar-alt me-1"></i> 
                    Criado em: {treino.dataCriacao ? new Date(treino.dataCriacao).toLocaleDateString() : "Recente"}
                </Card.Subtitle>

                {/* Rodapé com Botões de Ação */}
                <div className="mt-auto d-flex flex-column gap-2">
                    
                    {/* Botão de Publicar (Aparece se for privado e o usuário puder publicar) */}
                    {isPersonalOrAdmin && !isPublic && (
                        <Button
                            variant="success"
                            size="sm"
                            className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 text-white shadow-sm"
                            onClick={() => onPublicar(treino.id)}
                            disabled={disabled}
                        >
                            <i className="fas fa-upload"></i> Publicar na Biblioteca
                        </Button>
                    )}

                    <div className="d-flex gap-2">
                        {/* Ver Detalhes */}
                        <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2" 
                            onClick={() => onVerDetalhes(treino.id)} 
                            disabled={disabled}
                        >
                            <i className="far fa-eye"></i> Detalhes
                        </Button>

                        {/* --- NOVO BOTÃO: Editar --- */}
                        <OverlayTrigger overlay={<Tooltip>Editar Treino</Tooltip>}>
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="fw-bold px-3" 
                                onClick={() => onEditar(treino)} // Passa o objeto treino completo para editar
                                disabled={disabled}
                            >
                                <i className="fas fa-edit"></i>
                            </Button>
                        </OverlayTrigger>

                        {/* Excluir */}
                        <OverlayTrigger overlay={<Tooltip>Excluir Treino</Tooltip>}>
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="fw-bold px-3" 
                                onClick={() => onExcluir(treino.id)} 
                                disabled={disabled}
                            >
                                <i className="fas fa-trash-alt"></i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}