import {
  Modal,
  Button,
  Row,
  Col,
  ListGroup,
  Badge,
  Form,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../styles/competicoes.css";
import { Link } from "react-router-dom";

// Adicionado suporte dinâmico para as cores no novo design
const getStatusClass = (status) => {
  const map = {
    ABERTA: "status-pill status-aberta",
    EM_ANDAMENTO: "status-pill status-em-andamento",
    ENCERRADA: "status-pill status-encerrada",
    CANCELADA: "status-pill status-cancelada",
  };
  return map[status] || "status-pill status-encerrada";
};

export function CompeticaoDetailsModal({
  show,
  onHide,
  competicao,
  ranking,
  canManage,
  isAdmin,
  onUpdateStatus,
  onDelete,
}) {
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
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="comp-modal-content shadow-lg border-0 rounded-4"
    >
      <Modal.Header
        closeButton
        className="comp-modal-header border-bottom border-light-subtle pb-3"
      >
        <Modal.Title className="fw-bolder fs-4 text-dark d-flex align-items-center">
          <i className="fas fa-info-circle me-2 text-success"></i> Detalhes da
          Competição
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 comp-modal-body">
        {competicao && (
          <>
            {/* CABEÇALHO DA COMPETIÇÃO */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
              <div>
                <h2
                  className="fw-black text-dark mb-2"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {competicao.nome}
                </h2>
                <span className={getStatusClass(competicao.status)}>
                  {competicao.status.replace("_", " ")}
                </span>
              </div>
              {isAdmin && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center"
                  onClick={() => onDelete(competicao.id, competicao.nome)}
                >
                  <i className="fas fa-trash-alt me-2"></i> Excluir Competição
                </Button>
              )}
            </div>

            {/* DESCRIÇÃO */}
            <div className="comp-description-box p-4 rounded-4 mb-4 shadow-sm border">
              <h6
                className="fw-bold text-dark mb-2 text-uppercase"
                style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
              >
                Sobre o Desafio
              </h6>
              <p
                className="text-muted mb-0 lh-lg"
                style={{ fontSize: "0.95rem" }}
              >
                {competicao.descricao}
              </p>
            </div>

            {/* ESTATÍSTICAS (GRID) */}
            <Row className="g-3 mb-4">
              {[
                {
                  icon: "fas fa-calendar-play",
                  label: "Início",
                  value: new Date(competicao.dataInicio).toLocaleDateString(),
                },
                {
                  icon: "fas fa-flag-checkered",
                  label: "Fim",
                  value: new Date(competicao.dataFim).toLocaleDateString(),
                },
                {
                  icon: "fas fa-star",
                  label: "Pts Vitória",
                  value: competicao.pontosVitoria,
                  color: "text-success",
                },
                {
                  icon: "fas fa-users",
                  label: "Inscritos",
                  value: competicao.totalInscritos,
                },
              ].map((item, i) => (
                <Col key={i} xs={6} md={3}>
                  <div className="comp-info-stat p-3 rounded-4 text-center border shadow-sm h-100 d-flex flex-column justify-content-center">
                    <i
                      className={`${item.icon} text-muted mb-2 fs-5 opacity-50`}
                    ></i>
                    <span
                      className="d-block small text-muted text-uppercase fw-bold mb-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`d-block fw-black fs-5 ${item.color || "text-dark"}`}
                    >
                      {item.value}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>

            {/* ÁREA DE GESTÃO (APENAS PARA ADMIN/PERSONAL) */}
            {canManage && (
              <div className="comp-management-box p-4 mb-4 rounded-4 shadow-sm">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <h6 className="fw-bold text-dark mb-1 d-flex align-items-center">
                      <i className="fas fa-cog me-2 text-success"></i> Área de
                      Gestão
                    </h6>
                    <small className="text-muted d-block">
                      Altere o status atual desta competição
                    </small>
                  </div>
                  <div
                    className="d-flex gap-2 w-100"
                    style={{ maxWidth: "300px" }}
                  >
                    <Form.Select
                      size="sm"
                      value={novoStatus}
                      onChange={(e) => setNovoStatus(e.target.value)}
                      className="comp-select-custom shadow-none border rounded-3 fw-semibold text-dark"
                      style={{ height: "40px" }}
                    >
                      <option value="ABERTA">ABERTA</option>
                      <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                      <option value="ENCERRADA">ENCERRADA</option>
                      <option value="CANCELADA">CANCELADA</option>
                    </Form.Select>
                    <Button
                      variant="success"
                      className="rounded-3 px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      onClick={handleSalvarStatus}
                      disabled={novoStatus === competicao.status}
                      style={{ height: "40px", whiteSpace: "nowrap" }}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* LEADERBOARD */}
            <div className="mt-5">
              <h5 className="fw-black mb-3 text-dark d-flex align-items-center border-bottom border-light-subtle pb-2">
                <i className="fas fa-medal me-2 text-warning fs-4"></i>{" "}
                Leaderboard
              </h5>

              {ranking.length === 0 ? (
                <div className="text-center py-5 text-muted rounded-4 border border-dashed comp-empty-state">
                  <i className="fas fa-trophy fs-1 mb-3 opacity-25"></i>
                  <p className="mb-0 fw-semibold">
                    Nenhum resultado submetido ainda.
                  </p>
                  <small>
                    Os resultados aparecerão aqui assim que a competição
                    iniciar.
                  </small>
                </div>
              ) : (
                <ListGroup
                  variant="flush"
                  className="rounded-4 overflow-hidden border shadow-sm comp-leaderboard-list"
                >
                  {ranking.map((r, index) => {
                    // Lógica para as medalhas dos top 3
                    let badgeClass = "badge-default";
                    if (index === 0) badgeClass = "badge-gold shadow-sm";
                    if (index === 1) badgeClass = "badge-silver shadow-sm";
                    if (index === 2) badgeClass = "badge-bronze shadow-sm";

                    return (
                      <ListGroup.Item
                        key={r.usuarioId}
                        className="px-4 py-3 d-flex justify-content-between align-items-center leaderboard-list-item border-bottom"
                      >
                        <div className="d-flex align-items-center">
                          <div className={`badge-pos me-3 ${badgeClass}`}>
                            #{index + 1}
                          </div>
                          <Link
                            to={`/portal/perfil-publico/${r.usuarioId}`}
                            className="text-dark fw-bold text-decoration-none"
                            style={{ fontSize: "1.05rem" }}
                          >
                            {r.nomeUsuario}
                          </Link>
                        </div>
                        <Badge
                          bg="success"
                          pill
                          className="px-3 py-2 fs-6 shadow-sm leaderboard-badge-res"
                        >
                          {r.resultado}
                        </Badge>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="comp-modal-footer border-top border-light-subtle pt-3">
        <Button
          variant="light"
          onClick={onHide}
          className="rounded-pill px-5 py-2 fw-bold border shadow-sm btn-close-modal"
        >
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
