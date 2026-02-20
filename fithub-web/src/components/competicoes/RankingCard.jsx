import { Card, ListGroup, Button } from "react-bootstrap";

const getPosBadgeClass = (pos) => {
  if (pos === 1) return "badge-pos badge-gold";
  if (pos === 2) return "badge-pos badge-silver";
  if (pos === 3) return "badge-pos badge-bronze";
  return "badge-pos badge-default";
};

export function RankingCard({
  ranking,
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
            <i className="fas fa-trophy card-icon text-warning me-2"></i>{" "}
            Ranking Geral
          </span>
          <span
            className="badge borda-customizada"
            style={{
              fontSize: "0.7em",
              backgroundColor: "var(--bg-light)",
              color: "var(--text-dark)",
            }}
          >
            Top {ranking.length > 0 ? ranking[0].posicao : 0} -{" "}
            {ranking.length > 0 ? ranking[ranking.length - 1].posicao : 0}
          </span>
        </div>
      </div>

      <Card.Body
        className="p-0 d-flex flex-column"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <ListGroup variant="flush" className="flex-grow-1 bg-transparent">
          {ranking.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="fas fa-chart-line fa-2x mb-3 opacity-25"></i>
              <p className="mb-0 small">Ranking ainda não formado.</p>
            </div>
          ) : (
            ranking.map((u) => (
              <ListGroup.Item
                key={u.usuarioId || u.username}
                className="ranking-item d-flex justify-content-between align-items-center bg-transparent borda-customizada"
              >
                <div className="d-flex align-items-center">
                  <div className={getPosBadgeClass(u.posicao)}>{u.posicao}</div>
                  <div className="ms-2">
                    <div
                      className="fw-bold text-dark"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {u.nome || u.nomeCompleto || "Usuário"}
                    </div>
                    {u.posicao === 1 && (
                      <span
                        className="leader-crown text-warning"
                        style={{ fontSize: "0.75rem", fontWeight: "bold" }}
                      >
                        <i className="fas fa-crown me-1"></i>Líder
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-end">
                  <span className="score-text d-block fw-bold text-success">
                    {u.scoreTotal}
                  </span>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    PONTOS
                  </small>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>

        {totalPages > 1 && (
          <div
            className="p-2 border-top d-flex justify-content-between align-items-center mt-auto"
            style={{
              backgroundColor: "var(--bg-light)",
              borderColor: "var(--border-color) !important",
            }}
          >
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none text-dark shadow-none"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <span className="small text-muted fw-bold">
              Página {currentPage + 1} de {totalPages}
            </span>
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none text-dark shadow-none"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
