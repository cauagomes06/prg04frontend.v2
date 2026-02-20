import { Card, Row, Col } from "react-bootstrap";

export function ProfileStats({ scoreTotal, dataCriacao }) {
  return (
    <Row>
      <Col md={6}>
        {/* Adicionada a classe borda-customizada e background variável */}
        <Card 
          className="shadow-sm border-0 mb-3 rounded-4" 
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <Card.Body className="p-4">
            <h4 
              className="fw-bold text-dark mb-4 pb-2" 
              style={{ borderBottom: "2px solid var(--border-color)" }}
            >
              <i className="fas fa-chart-pie me-2 text-success"></i> Estatísticas
            </h4>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-bold small text-uppercase">Score Total</span>
              <span className="fw-bold fs-4 text-success">
                {scoreTotal?.toLocaleString() || 0} <small style={{ fontSize: '0.6em' }}>PTS</small>
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted fw-bold small text-uppercase">Membro desde</span>
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