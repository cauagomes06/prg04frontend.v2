import { Card, Button } from "react-bootstrap";
import "../../styles/competicoes.css";

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
      {/* Cabeçalho Unificado e Simétrico */}
      <div className="comp-card-header">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 w-100">
          <div className="d-flex align-items-center">
            <i className="fas fa-fire text-danger"></i>
            <h5 className="comp-card-title mb-0">Competições</h5>
          </div>
          <span className="badge comp-list-badge-page py-2 px-3">
            PÁGINA {currentPage + 1}
          </span>
        </div>
      </div>

      <Card.Body className="p-0 d-flex flex-column">
        <div className="d-flex flex-column p-3 flex-grow-1">
          {competicoes.length === 0 ? (
            <div className="text-center comp-empty-state py-5">
              <i className="far fa-calendar-times fa-2x mb-3 opacity-50"></i>
              <p className="fw-bold">Nenhuma competição encontrada.</p>
            </div>
          ) : (
            competicoes.map((comp) => (
              <div
                key={comp.id}
                className="comp-item p-3 borda-customizada rounded-3"
              >
                <div className={`status-bar ${comp.status.toLowerCase()}`}></div>

                <div className="d-flex justify-content-between align-items-start mb-2 ps-2">
                  <h6
                    className="comp-item-title mb-0 text-truncate"
                    title={comp.nome}
                  >
                    {comp.nome}
                  </h6>
                  <span
                    className={`${getStatusClass(comp.status)} comp-item-status-text`}
                  >
                    {comp.status.replace("_", " ")}
                  </span>
                </div>

                <div className="comp-item-date ps-2 mb-3">
                  <i className="far fa-calendar-alt"></i> Fim:{" "}
                  <span className="fw-bold">
                    {new Date(comp.dataFim).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="d-flex gap-2 ps-2">
                  {comp.status === "ABERTA" ? (
                    <Button
                      className="btn-success flex-grow-1 rounded-pill fw-bold shadow-sm"
                      size="sm"
                      onClick={() => onInscrever(comp.id)}
                    >
                      Inscrever
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="flex-grow-1 rounded-pill borda-customizada fw-bold opacity-50"
                      disabled
                    >
                      {comp.status === "EM_ANDAMENTO" ? "Em Curso" : "Fechada"}
                    </Button>
                  )}
                  <Button
                    variant="outline-success"
                    className="rounded-pill px-3 borda-customizada fw-bold shadow-sm"
                    size="sm"
                    onClick={() => onDetalhes(comp)}
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé de Paginação Unificado */}
        {totalPages > 1 && (
          <div className="p-3 d-flex justify-content-between align-items-center mt-auto comp-card-pagination">
            <Button
              variant="link"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="text-decoration-none shadow-none comp-pagination-btn p-0"
            >
              <i className="fas fa-chevron-left fa-lg"></i>
            </Button>

            <span className="small comp-pagination-info fw-bold text-uppercase">
              {currentPage + 1} / {totalPages}
            </span>

            <Button
              variant="link"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
              className="text-decoration-none shadow-none comp-pagination-btn p-0"
            >
              <i className="fas fa-chevron-right fa-lg"></i>
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}