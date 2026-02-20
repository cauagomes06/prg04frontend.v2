import { Modal, Button, Row, Col, ListGroup, Badge, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

const getStatusClass = (status) => {
  const map = {
    ABERTA: "status-pill aberta",
    EM_ANDAMENTO: "status-pill em-andamento",
    ENCERRADA: "status-pill encerrada",
    CANCELADA: "status-pill cancelada"
  };
  return map[status] || "status-pill encerrada";
};

export function CompeticaoDetailsModal({ show, onHide, competicao, ranking, canManage, isAdmin, onUpdateStatus, onDelete }) {
  const [novoStatus, setNovoStatus] = useState("");

  useEffect(() => {
    if (competicao) setNovoStatus(competicao.status);
  }, [competicao]);

  const handleSalvarStatus = () => {
    if (novoStatus && novoStatus !== competicao.status) {
      onUpdateStatus(competicao.id, novoStatus);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 overflow-hidden">
      <Modal.Header closeButton className="borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
        <Modal.Title className="fw-bold text-dark">Detalhes da Competição</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4" style={{ backgroundColor: "var(--card-bg)" }}>
        {competicao && (
          <>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h3 className="fw-bold mb-1 text-dark">{competicao.nome}</h3>
                <span className={getStatusClass(competicao.status)}>
                    {competicao.status.replace("_", " ")}
                </span>
              </div>
              {isAdmin && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="rounded-pill px-3 borda-customizada"
                  onClick={() => onDelete(competicao.id, competicao.nome)}
                >
                  <i className="fas fa-trash-alt me-2"></i> Excluir
                </Button>
              )}
            </div>
            
            <div className="p-3 rounded-3 mb-4 borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
               <p className="text-muted mb-0" style={{fontSize: "0.95rem", lineHeight: "1.6"}}>
                 {competicao.descricao}
               </p>
            </div>
            
            <Row className="g-3 mb-4">
              {[
                { label: "Início", value: new Date(competicao.dataInicio).toLocaleDateString() },
                { label: "Fim", value: new Date(competicao.dataFim).toLocaleDateString() },
                { label: "Pts Vitória", value: competicao.pontosVitoria, color: "text-success" },
                { label: "Inscritos", value: competicao.totalInscritos }
              ].map((item, i) => (
                <Col key={i} xs={6} md={3}>
                  <div className="p-3 rounded-3 text-center borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
                      <span className="d-block small text-muted text-uppercase fw-bold mb-1">{item.label}</span>
                      <span className={`d-block fw-bold fs-5 ${item.color || 'text-dark'}`}>{item.value}</span>
                  </div>
                </Col>
              ))}
            </Row>

            {canManage && (
              <div className="p-3 mb-4 rounded-3 borda-customizada" style={{ border: "1px dashed var(--primary-color)" }}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                   <div>
                      <h6 className="fw-bold text-dark mb-0">Área de Gestão</h6>
                      <small className="text-muted">Alterar status da competição</small>
                   </div>
                   <div className="d-flex gap-2">
                      <Form.Select 
                        size="sm" 
                        value={novoStatus} 
                        onChange={(e) => setNovoStatus(e.target.value)}
                        className="shadow-none border-0"
                        style={{width: "160px", borderRadius: "8px", backgroundColor: "var(--bg-light)", color: "var(--text-dark)"}}
                      >
                        <option value="ABERTA">ABERTA</option>
                        <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                        <option value="ENCERRADA">ENCERRADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                      </Form.Select>
                      <Button 
                        variant="success"
                        className="rounded-pill px-3 fw-bold"
                        size="sm" 
                        onClick={handleSalvarStatus}
                        disabled={novoStatus === competicao.status}
                      >
                        Salvar
                      </Button>
                    </div>
                </div>
              </div>
            )}

            <h5 className="fw-bold mt-4 mb-3 text-dark"><i className="fas fa-medal me-2 text-warning"></i>Leaderboard</h5>
            {ranking.length === 0 ? (
              <div className="text-center py-4 text-muted rounded-3 borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
                  Nenhum resultado submetido.
              </div>
            ) : (
              <ListGroup variant="flush" className="rounded-3 overflow-hidden borda-customizada">
                {ranking.map((r, index) => (
                  <ListGroup.Item key={r.usuarioId} className="px-3 py-3 d-flex justify-content-between align-items-center bg-transparent border-color-custom">
                    <div className="d-flex align-items-center">
                      <span className="fw-bold text-muted me-3" style={{width: "25px"}}>#{index + 1}</span>
                      <span className="text-dark fw-bold">{r.nomeUsuario}</span>
                    </div>
                    <Badge pill style={{ backgroundColor: "var(--bg-light)", color: "var(--primary-color)", border: "1px solid var(--border-color)" }} className="px-3 py-2">
                      {r.resultado}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
        <Button variant="outline-secondary" onClick={onHide} className="rounded-pill px-4">Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}