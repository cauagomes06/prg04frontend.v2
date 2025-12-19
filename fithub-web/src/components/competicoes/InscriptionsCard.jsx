import { Card, ListGroup, Button } from "react-bootstrap";

export function InscriptionsCard({ inscricoes, competicoes, onSubmeter }) {
  return (
    <Card className="custom-card">
      <div className="custom-card-header">
        <i className="fas fa-clipboard-check card-icon"></i> Minhas Inscrições
      </div>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {inscricoes.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="fas fa-dumbbell fa-2x mb-3 opacity-25"></i>
              <p className="small mb-0">Você não está inscrito em nada.</p>
            </div>
          ) : (
            inscricoes.map((insc) => {
              const comp = competicoes.find(c => c.id === insc.competicaoId || c.nome === insc.competicaoNome);
              const statusAtual = comp ? comp.status : "DESCONHECIDO";
              const isEmAndamento = statusAtual === "EM_ANDAMENTO";

              return (
                <ListGroup.Item key={insc.idInscricao} className="ranking-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-dark mb-1">{insc.competicaoNome}</div>
                      <div className="small text-muted">
                        Status: <span className={insc.resultado ? "text-success fw-bold" : "text-warning fw-bold"}>
                          {insc.resultado ? "Concluído" : "Pendente"}
                        </span>
                      </div>
                    </div>
                    
                    {insc.resultado ? (
                       <div className="bg-light px-3 py-1 rounded-3 border">
                          <strong className="text-dark">{insc.resultado}</strong>
                       </div>
                    ) : (
                      <Button 
                        className={isEmAndamento ? "btn-custom-primary rounded-pill px-3" : "btn-light rounded-pill px-3 text-muted"}
                        size="sm" 
                        disabled={!isEmAndamento}
                        onClick={() => onSubmeter(insc.idInscricao)}
                      >
                        {isEmAndamento ? "Submeter Resultado" : 
                         statusAtual === "ABERTA" ? "Aguarde Início" : "Encerrada"}
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}