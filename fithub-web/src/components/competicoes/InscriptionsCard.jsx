import { Card, ListGroup, Button } from "react-bootstrap";
import "../../styles/competicoes.css";

export function InscriptionsCard({ inscricoes, competicoes, onSubmeter }) {
  return (
    <Card className="custom-card h-100 shadow-sm border-0">
      {/* Cabeçalho Unificado */}
      <div className="comp-card-header">
        <h5 className="comp-card-title">
          <i className="fas fa-clipboard-check text-success"></i>
          Minhas Inscrições
        </h5>
      </div>
      
      <Card.Body className="p-0 d-flex flex-column">
        <div className="d-flex flex-column p-3 flex-grow-1">
          {inscricoes.length === 0 ? (
            <div className="p-5 text-center comp-empty-state">
              <i className="fas fa-dumbbell fa-2x mb-3 opacity-25"></i>
              <p className="fw-bold mb-0">Você não está inscrito em nada.</p>
            </div>
          ) : (
            inscricoes.map((insc) => {
              const comp = competicoes.find(
                (c) => c.id === insc.competicaoId || c.nome === insc.competicaoNome
              );
              const statusAtual = comp ? comp.status : "DESCONHECIDO";
              const isEmAndamento = statusAtual === "EM_ANDAMENTO";

              return (
                /* Usando a classe comp-item para ter a mesma separação individual */
                <div key={insc.idInscricao} className="comp-item p-3 borda-customizada rounded-3">
                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <div className="flex-grow-1 text-truncate">
                      <div className="comp-item-title mb-1 text-truncate" title={insc.competicaoNome}>
                        {insc.competicaoNome}
                      </div>
                      <div className="inscription-status-label">
                        Status:{" "}
                        <span className={insc.resultado ? "text-success fw-bold" : "text-warning fw-bold"}>
                          {insc.resultado ? "Concluído" : "Pendente"}
                        </span>
                      </div>
                    </div>

                    {insc.resultado ? (
                      <div className="result-display-badge px-3 py-1 rounded-3 shadow-sm">
                        {insc.resultado}
                      </div>
                    ) : (
                      <Button
                        className={
                          isEmAndamento
                            ? "btn-success rounded-pill px-3 fw-bold shadow-sm"
                            : "btn-wait-start rounded-pill px-3 fw-bold opacity-50"
                        }
                        size="sm"
                        disabled={!isEmAndamento}
                        onClick={() => onSubmeter(insc.idInscricao)}
                      >
                        {isEmAndamento ? "Submeter" : "Aguarde"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card.Body>
    </Card>
  );
}