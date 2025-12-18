import { Card, Row, Col } from "react-bootstrap";

export function ProfileStats({ scoreTotal, dataCriacao }) {
  return (
    <Row>
      <Col md={6}>
        <Card className="card-estats border-0 mb-3">
          <Card.Body>
            <h4 className="card-estats-title mb-4 pb-2 border-bottom">
              Estatísticas
            </h4>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Score Total</span>
              <span className="fw-bold fs-5 text-success">
                {scoreTotal || 0} pts
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Membro desde</span>
              <span className="fw-bold">
                {dataCriacao
                  ? new Date(dataCriacao).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}