import { Card, ListGroup } from "react-bootstrap";

const getPosBadgeClass = (pos) => {
  if (pos === 1) return "badge-pos badge-gold";
  if (pos === 2) return "badge-pos badge-silver";
  if (pos === 3) return "badge-pos badge-bronze";
  return "badge-pos badge-default";
};

export function RankingCard({ ranking }) {
  return (
    <Card className="custom-card">
      <div className="custom-card-header">
        <i className="fas fa-trophy card-icon"></i> Ranking Geral
      </div>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {ranking.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="fas fa-chart-bar fa-2x mb-3 opacity-25"></i>
              <p className="mb-0 small">Nenhum dado disponível.</p>
            </div>
          ) : (
            ranking.map((u) => (
              <ListGroup.Item 
                key={u.usuarioId} 
                className="ranking-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <div className={getPosBadgeClass(u.posicao)}>
                    {u.posicao}
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                      {u.nomeCompleto}
                    </div>
                    {u.posicao === 1 && (
                      <span className="leader-crown">
                        <i className="fas fa-crown me-1"></i>Líder
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-end">
                  <span className="score-text d-block">
                    {u.scoreTotal}
                  </span>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>PONTOS</small>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}