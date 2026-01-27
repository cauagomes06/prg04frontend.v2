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
  // NOTA: Como a paginação agora é no Backend, 'competicoes' contém apenas os itens da página atual.
  // Se quiser filtrar "Ativas" no frontend, cuidado para não esconder tudo se a página atual só tiver "Encerradas".
  // Idealmente, a filtragem deveria ser no backend (/buscar?status=ATIVAS), mas vamos exibir o que vier.

  return (
    <Card className="custom-card h-100">
      <div className="custom-card-header">
        <div className="d-flex justify-content-between align-items-center w-100">
          <span>
            <i className="fas fa-fire card-icon"></i> Competições
          </span>
          <span
            className="badge bg-light text-dark opacity-75"
            style={{ fontSize: "0.7em" }}
          >
            Pág {currentPage + 1}
          </span>
        </div>
      </div>
      <Card.Body className="p-0 d-flex flex-column">
        <div className="d-flex flex-column gap-3 p-3 flex-grow-1">
          {competicoes.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="far fa-calendar-times fa-2x mb-3 opacity-25"></i>
              <p className="small">
                Nenhuma competição encontrada nesta página.
              </p>
            </div>
          ) : (
            competicoes.map((comp) => (
              <div key={comp.id} className="comp-item p-3">
                <div
                  className={`status-bar ${comp.status === "ABERTA" ? "aberta" : comp.status === "EM_ANDAMENTO" ? "em-andamento" : "encerrada"}`}
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
                      Inscrever
                    </Button>
                  ) : (
                    <Button
                      variant="light"
                      size="sm"
                      className="flex-grow-1 rounded-pill text-muted border"
                      disabled
                    >
                      {comp.status === "EM_ANDAMENTO" ? "Em Curso" : "Fechada"}
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

        {/* PAGINAÇÃO NO RODAPÉ DO CARD */}
        {totalPages > 1 && (
          <div className="p-3 border-top bg-light d-flex justify-content-between align-items-center">
            <Button
              variant="link"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="text-decoration-none text-dark fw-bold"
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
              className="text-decoration-none text-dark fw-bold"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
