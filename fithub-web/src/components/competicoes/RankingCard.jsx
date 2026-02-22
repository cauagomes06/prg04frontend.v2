import { Card, ListGroup, Button } from "react-bootstrap";
import "../../styles/competicoes.css";

const getPosBadgeClass = (pos) => {
  const base = "badge-pos ";
  if (pos === 1) return base + "badge-gold shadow-sm";
  if (pos === 2) return base + "badge-silver";
  if (pos === 3) return base + "badge-bronze";
  return base + "badge-default";
};

export function RankingCard({ ranking, currentPage, totalPages, onPageChange }) {
  return (
    <Card className="custom-card h-100 shadow-sm border-0">
      <div className="comp-card-header">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 w-100">
          <h5 className="comp-card-title">
            <i className="fas fa-trophy text-warning"></i>
            Ranking Geral
          </h5>
          <span className="badge comp-list-badge-page py-2 px-3">
            TOP {ranking.length > 0 ? ranking[0].posicao : 0} - {ranking.length > 0 ? ranking[ranking.length - 1].posicao : 0}
          </span>
        </div>
      </div>

      <Card.Body className="p-0 d-flex flex-column">
        <ListGroup variant="flush" className="flex-grow-1">
          {ranking.length === 0 ? (
            <div className="p-5 text-center comp-empty-state">
              <i className="fas fa-chart-line fa-2x mb-3 opacity-25"></i>
              <p className="fw-bold mb-0">Ranking ainda não formado.</p>
            </div>
          ) : (
            ranking.map((u) => (
              <ListGroup.Item key={u.usuarioId || u.username} className="ranking-item border-0">
                {/* Lado Esquerdo: Badge + Nome (Container com flex-grow para ocupar o espaço disponível) */}
                <div className="d-flex align-items-center overflow-hidden flex-grow-1 me-2">
                  <div className={getPosBadgeClass(u.posicao)}>{u.posicao}</div>
                  <div className="ms-3 text-truncate">
                    <div className="ranking-user-name mb-0 text-truncate" title={u.nome || u.nomeCompleto}>
                      {u.nome || u.nomeCompleto || "Usuário"}
                    </div>
                    {u.posicao === 1 && (
                      <span className="text-warning fw-bold text-uppercase d-block" style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}>
                        <i className="fas fa-crown me-1"></i>Líder Atual
                      </span>
                    )}
                  </div>
                </div>

                {/* Lado Direito: Score (Container com flex-shrink-0 para NUNCA quebrar ou sumir) */}
                <div className="flex-shrink-0 text-end">
                  <span className="score-text">{u.scoreTotal}</span>
                  <span className="score-label ms-1">Pts</span>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>

        {totalPages > 1 && (
          <div className="comp-card-footer mt-auto">
            <Button
              variant="link"
              size="sm"
              className="comp-pagination-btn p-0 shadow-none"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left fa-lg"></i>
            </Button>
            <span className="comp-pagination-info fw-bold">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="link"
              size="sm"
              className="comp-pagination-btn p-0 shadow-none"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <i className="fas fa-chevron-right fa-lg"></i>
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}