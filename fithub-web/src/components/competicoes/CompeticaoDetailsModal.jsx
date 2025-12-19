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
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="modal-custom-content">
      <Modal.Header closeButton className="modal-header-custom px-4 pt-4">
        <Modal.Title className="fw-bold">Detalhes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4 pt-2">
        {competicao && (
          <>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h3 className="fw-bold mb-1 text-dark">{competicao.nome}</h3>
                <span className={getStatusClass(competicao.status)}>
                    {competicao.status.replace("_", " ")}
                </span>
              </div>
              {/* BOTÃO DE APAGAR (SÓ PARA ADMIN) */}
              {isAdmin && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="rounded-pill px-3"
                  onClick={() => onDelete(competicao.id, competicao.nome)}
                >
                  <i className="fas fa-trash-alt me-2"></i> Excluir
                </Button>
              )}
            </div>
            
            <div className="bg-light p-3 rounded-3 mb-4">
               <p className="text-muted mb-0" style={{fontSize: "0.95rem", lineHeight: "1.6"}}>
                 {competicao.descricao}
               </p>
            </div>
            
            <Row className="g-3 mb-4">
              <Col xs={6} md={3}>
                <div className="detail-box">
                    <span className="detail-label">Início</span>
                    <span className="detail-value">{new Date(competicao.dataInicio).toLocaleDateString()}</span>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="detail-box">
                    <span className="detail-label">Fim</span>
                    <span className="detail-value">{new Date(competicao.dataFim).toLocaleDateString()}</span>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="detail-box">
                    <span className="detail-label">Pts Vitória</span>
                    <span className="detail-value text-success">{competicao.pontosVitoria}</span>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="detail-box">
                    <span className="detail-label">Inscritos</span>
                    <span className="detail-value">{competicao.totalInscritos}</span>
                </div>
              </Col>
            </Row>

            {canManage && (
              <div className="management-area p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                   <div>
                      <h6 className="fw-bold text-dark mb-0">Área de Gestão</h6>
                      <small className="text-muted">Alterar status da competição</small>
                   </div>
                   <div className="d-flex gap-2">
                      <Form.Select 
                        size="sm" 
                        value={novoStatus} 
                        onChange={(e) => setNovoStatus(e.target.value)}
                        style={{width: "160px", borderRadius: "8px"}}
                      >
                        <option value="ABERTA">ABERTA</option>
                        <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                        <option value="ENCERRADA">ENCERRADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                      </Form.Select>
                      <Button 
                        className="btn-custom-primary rounded-3"
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

            <h5 className="fw-bold mt-4 mb-3">Leaderboard</h5>
            {ranking.length === 0 ? (
              <div className="text-center py-3 text-muted bg-light rounded-3 border border-dashed">
                  Nenhum resultado submetido.
              </div>
            ) : (
              <ListGroup variant="flush" className="rounded-3 overflow-hidden border">
                {ranking.map((r, index) => (
                  <ListGroup.Item key={r.usuarioId} className="px-3 py-2 d-flex justify-content-between bg-white">
                    <div className="d-flex align-items-center">
                      <span className="fw-bold text-muted me-3" style={{width: "20px"}}>#{index + 1}</span>
                      <span className="text-dark">{r.nomeUsuario}</span>
                    </div>
                    <Badge bg="light" text="dark" className="border">
                      {r.resultado}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onHide} className="rounded-pill px-4">Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}