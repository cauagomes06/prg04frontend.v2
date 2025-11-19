import { Modal, Button, ListGroup, Badge } from "react-bootstrap";

export function WorkoutModal({ show, handleClose, treino }) {
  
  // Função auxiliar para formatar o tempo de descanso
  const formatarDescanso = (descanso) => {
    if (!descanso) return "N/A";
    // Se o descanso for um número, assume segundos
    if (!isNaN(descanso)) return `${descanso}s`;
    return descanso; // Se já for string (ex: "60s" ou "1 min"), retorna direto
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold text-success">
          <i className="fas fa-dumbbell me-2"></i>
          {treino?.nome || "Detalhes do Treino"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {treino ? (
          <div className="p-2">
            {/* Cabeçalho com Detalhes Gerais */}
            <div className="mb-4">
              <h5 className="text-muted mb-2">Sobre o Treino</h5>
              <p className="lead fs-6 mb-3">{treino.descricao || "Sem descrição disponível."}</p>
              
              <div className="d-flex gap-2 flex-wrap">
                <Badge bg="success-subtle" text="dark" className="p-2">
                  <i className="fas fa-clock me-1"></i> {treino.duracaoMinutos ? `${treino.duracaoMinutos} min` : "Duração livre"}
                </Badge>
              </div>
            </div>

            <hr />

            {/* Lista de Exercícios */} 
            <h5 className="mb-3 text-success">
              <i className="fas fa-list-ol me-2"></i>
              Sequência de Exercícios
            </h5>
            
            {/* Verifica 'items' (nome que vem do backend) */}
            {(treino.items || []).length > 0 ? (
              <ListGroup variant="flush">
                {treino.items.map((item, index) => (
                  <ListGroup.Item 
                    key={index} 
                    className="d-flex justify-content-between align-items-center py-3 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', color: '#0ad354', fontWeight: 'bold'}}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="fw-bold fs-5">
                          {item.nomeExercicio || "Exercício não identificado"}
                        </div>
                        <div className="text-muted small">
                          {/* Se tiver mais detalhes do exercício no futuro, coloque aqui */}
                          {/* Ex: item.grupoMuscular */}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-4 text-center">
                      <div>
                        <div className="fw-bold text-primary">{item.series}</div>
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>SÉRIES</small>
                      </div>
                      <div>
                        <div className="fw-bold text-success">{item.repeticoes}</div>
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>REPS</small>
                      </div>
                      <div>
                        <div className="fw-bold text-warning">{formatarDescanso(item.descanso)}</div>
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>DESCANSO</small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="alert alert-warning text-center p-4">
                <i className="fas fa-exclamation-triangle fa-2x mb-3 text-warning"></i>
                <p className="mb-0">Nenhum exercício foi cadastrado nesta ficha ainda.</p>
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
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}