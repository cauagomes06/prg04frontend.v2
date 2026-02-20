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

export function CompetitionsListCard({
  competicoes,
  onInscrever,
  onDetalhes,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <Card className="custom-card h-100 shadow-sm border-0">
      <div
        className="custom-card-header borda-customizada"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="fw-bold text-dark">
            <i className="fas fa-fire card-icon text-danger me-2"></i>{" "}
            Competições
          </span>
          <span
            className="badge borda-customizada"
            style={{
              fontSize: "0.7em",
              backgroundColor: "var(--bg-light)",
              color: "var(--text-dark)",
            }}
          >
            Pág {currentPage + 1}
          </span>
        </div>
      </div>
      <Card.Body
        className="p-0 d-flex flex-column"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <div className="d-flex flex-column gap-3 p-3 flex-grow-1">
          {competicoes.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="far fa-calendar-times fa-2x mb-3 opacity-25"></i>
              <p className="small">Nenhuma competição encontrada.</p>
            </div>
          ) : (
            competicoes.map((comp) => (
              <div
                key={comp.id}
                className="comp-item p-3 borda-customizada rounded-3"
                style={{
                  backgroundColor: "var(--bg-light)",
                  position: "relative",
                }}
              >
                <div
                  className={`status-bar ${comp.status.toLowerCase()}`}
                ></div>
                <div className="d-flex justify-content-between align-items-start mb-2 ps-2">
                  <h6
                    className="fw-bold mb-0 text-dark text-truncate"
                    title={comp.nome}
                    style={{ maxWidth: "150px" }}
                  >
                    {comp.nome}
                  </h6>
                  <span
                    className={getStatusClass(comp.status)}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {comp.status}
                  </span>
                </div>
                <div className="d-flex align-items-center text-muted small ps-2 mb-3">
                  <i className="far fa-clock me-1"></i> Fim:{" "}
                  {new Date(comp.dataFim).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </div>
                <div className="d-flex gap-2 ps-2">
                  {comp.status === "ABERTA" ? (
                    <Button
                      className="btn-success flex-grow-1 rounded-pill"
                      size="sm"
                      onClick={() => onInscrever(comp.id)}
                    >
                      Inscrever
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="flex-grow-1 rounded-pill text-muted borda-customizada"
                      disabled
                    >
                      {comp.status === "EM_ANDAMENTO" ? "Em Curso" : "Fechada"}
                    </Button>
                  )}
                  <Button
                    variant="outline-success"
                    className="rounded-pill px-3 borda-customizada"
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

        {totalPages > 1 && (
          <div
            className="p-3 border-top d-flex justify-content-between align-items-center mt-auto"
            style={{
              backgroundColor: "var(--bg-light)",
              borderColor: "var(--border-color) !important",
            }}
          >
            <Button
              variant="link"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="text-decoration-none text-dark fw-bold shadow-none"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <span className="small text-muted fw-bold">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="link"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
              className="text-decoration-none text-dark fw-bold shadow-none"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
