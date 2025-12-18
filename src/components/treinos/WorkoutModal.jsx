import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import "../../styles/treinos.css"; // Importa os estilos globais e variáveis

export function WorkoutModal({ show, handleClose, treino, readOnly = false }) {
  
  // Função auxiliar para formatar o tempo de descanso
  const formatarDescanso = (descanso) => {
    if (!descanso) return "N/A";
    // Se o descanso for um número, assume segundos
    if (!isNaN(descanso)) return `${descanso}s`;
    return descanso;
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      centered
      // 1. Aplica o estilo de card arredondado e com sombra (custom-card style)
      contentClassName="rounded-4 border-0 overflow-hidden shadow-lg custom-card"
    >
      {/* 2. Cabeçalho usa o estilo de "Meus Treinos" (Verde Claro/Verde Escuro) */}
      {/* Usamos text-white para garantir contraste caso o fundo seja mais escuro */}
      <Modal.Header 
        closeButton 
        className="card-header-my-workout border-0 text-white" 
        data-bs-theme="dark" // Garante que o ícone de fechar fique branco
      >
        <Modal.Title className="fw-bold d-flex align-items-center text-dark">
          {/* O ícone herda a cor do .card-header-my-workout (var(--primary-green)) */}
          <i className="fas fa-dumbbell me-2 icon-opacity"></i> 
          {treino?.nome || "Detalhes do Treino"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {treino ? (
          <div>
            {/* Cabeçalho com Detalhes Gerais */}
            <div className="mb-4 text-center text-md-start">
              <h5 className="text-muted mb-2 text-uppercase small fw-bold">Sobre o Treino</h5>
              <p className="lead fs-6 mb-3 text-dark">{treino.descricao || "Sem descrição disponível."}</p>
              
              <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-start">
                
                {/* Badge para Duração */}
                <Badge bg="success" className="p-2 rounded-pill shadow-sm">
                  <i className="fas fa-clock me-1"></i> {treino.duracaoMinutos ? `${treino.duracaoMinutos} min` : "Livre"}
                </Badge>
                
                {/* Badge para Status (usando classes Bootstrap/Variáveis se definidas) */}
                <Badge 
                  className={`p-2 rounded-pill shadow-sm 
                  ${treino.status === "PUBLICO" ? "bg-primary" : "bg-secondary"}`}
                >
                   {treino.status === "PUBLICO" ? "Público" : "Privado"}
                </Badge>
              </div>
            </div>

            <hr className="text-muted opacity-25" />

            {/* Lista de Exercícios */} 
            <h5 className="mb-3 text-success fw-bold">
              <i className="fas fa-list-ol me-2"></i>
              Sequência de Exercícios
            </h5>
            
            {(treino.items || []).length > 0 ? (
              <ListGroup variant="flush" className="gap-2">
                {treino.items.map((item, index) => (
                  <ListGroup.Item 
                    key={index} 
                    // 3. Estiliza o item como um "mini card" com sombra e cantos
                    className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3 px-3 border-0 rounded-3 shadow-sm bg-light hover-effect"
                  >
                    <div className="d-flex align-items-center gap-3 w-100 mb-3 mb-md-0">
                      
                      {/* Círculo do número */}
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0" style={{width: '40px', height: '40px', fontWeight: 'bold'}}>
                        {index + 1}
                      </div>
                      
                      <div>
                        <div className="fw-bold fs-5 text-dark">
                          {item.nomeExercicio || "Exercício não identificado"}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-4 text-center justify-content-center w-100 w-md-auto">
                      <div className="px-2">
                        <div className="fw-bold text-dark fs-5">{item.series}</div>
                        <small className="text-muted text-uppercase text-filter-small">Séries</small>
                      </div>
                      <div className="border-start mx-1"></div>
                      <div className="px-2">
                        <div className="fw-bold text-success fs-5">{item.repeticoes}</div>
                        <small className="text-muted text-uppercase text-filter-small">Reps</small>
                      </div>
                      <div className="border-start mx-1"></div>
                      <div className="px-2">
                        <div className="fw-bold text-warning fs-5">{formatarDescanso(item.descanso)}</div>
                        <small className="text-muted text-uppercase text-filter-small">Descanso</small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="alert alert-warning text-center p-4 rounded-4 border-0 shadow-sm">
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
      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={handleClose} className="rounded-pill px-4 fw-bold">
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}