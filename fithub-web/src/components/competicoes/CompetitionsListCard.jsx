import { Card, Button } from "react-bootstrap";

const getStatusClass = (status) => {
  const map = {
    ABERTA: "status-pill aberta",
    EM_ANDAMENTO: "status-pill em-andamento",
    ENCERRADA: "status-pill encerrada",
    CANCELADA: "status-pill cancelada",
  };
  return map[status] || "status-pill encerrada";
};

export function CompetitionsListCard({ competicoes, onInscrever, onDetalhes }) {
  // Filtra aqui ou recebe já filtrado, mas filtrar aqui garante a lógica visual
  const ativas = competicoes.filter(
    (c) => c.status === "ABERTA" || c.status === "EM_ANDAMENTO"
  );

  return (
    <Card className="custom-card">
      <div className="custom-card-header">
        <i className="fas fa-fire card-icon"></i> Competições Ativas
      </div>
      <Card.Body className="p-0">
        <div className="d-flex flex-column gap-3 p-3">
          {ativas.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="far fa-calendar-times fa-2x mb-3 opacity-25"></i>
              <p className="small">Nenhuma competição ativa.</p>
            </div>
          ) : (
            ativas.map((comp) => (
              <div key={comp.id} className="comp-item p-3">
                <div
                  className={`status-bar ${
                    comp.status === "ABERTA" ? "aberta" : "em-andamento"
                  }`}
                ></div>

                <div className="d-flex justify-content-between align-items-start mb-2 ps-2">
                  <h6 className="fw-bold mb-0 text-dark">{comp.nome}</h6>
                  <span className={getStatusClass(comp.status)}>
                    {comp.status === "ABERTA"
                      ? "INSCRIÇÕES ABERTAS"
                      : "EM ANDAMENTO"}
                  </span>
                </div>

                <div className="d-flex align-items-center text-muted small ps-2 mb-3">
                  <i className="far fa-clock me-1"></i>
                  Fim:{" "}
                  {new Date(comp.dataFim).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </div>

                <div className="d-flex gap-2 ps-2">
                  {comp.status === "ABERTA" ? (
                    <Button
                      className="btn-custom-primary flex-grow-1 rounded-pill"
                      size="sm"
                      onClick={() => onInscrever(comp.id)}
                    >
                      Inscrever-se
                    </Button>
                  ) : (
                    <Button
                      variant="light"
                      size="sm"
                      className="flex-grow-1 rounded-pill text-muted border"
                      disabled
                    >
                      Iniciado
                    </Button>
                  )}
                  <Button
                    className="btn-custom-ghost rounded-pill px-3"
                    size="sm"
                    onClick={() => onDetalhes(comp)}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
