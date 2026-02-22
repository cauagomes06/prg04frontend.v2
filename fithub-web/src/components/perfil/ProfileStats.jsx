import { Card, Row, Col } from "react-bootstrap";
import "../../styles/perfil.css"; // Importando o novo arquivo

export function ProfileStats({ scoreTotal, dataCriacao }) {
  return (
    <Row>
      <Col md={6}>
        <Card className="shadow-sm border-0 mb-3 rounded-4 stats-card-custom">
          <Card.Body className="p-4">
            <h4 className="fw-bold text-dark mb-4 pb-2 stats-header-title">
              <i className="fas fa-chart-pie me-2 text-success"></i> Estatísticas
            </h4>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-bold text-uppercase stats-label">
                Score Total
              </span>
              <span className="fw-bold fs-4 stats-score-value">
                {scoreTotal?.toLocaleString() || 0} 
                <small className="stats-score-unit ms-1">PTS</small>
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted fw-bold text-uppercase stats-label">
                Membro desde
              </span>
              <span className="fw-bold text-dark">
                {dataCriacao
                  ? new Date(dataCriacao).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                  : "N/A"}
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}