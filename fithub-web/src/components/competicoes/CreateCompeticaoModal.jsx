import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";
import { ConfirmModal } from "../common/ConfirmModal";
import { SuccessModal } from "../common/SuccessModal";

export default function CreateCompeticaoModal({ show, handleClose, onSuccess }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [pontosVitoria, setPontosVitoria] = useState(0);
  const [tipoOrdenacao, setTipoOrdenacao] = useState("MAIOR_MELHOR");

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatToLocalISO = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    if (show) {
      setNome("");
      setDescricao("");
      setPontosVitoria(0);
      setTipoOrdenacao("MAIOR_MELHOR");
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10);
      setDataInicio(formatToLocalISO(now));
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDataFim(formatToLocalISO(nextWeek));
    }
  }, [show]);

  const handlePreSubmit = () => {
    if (!nome || !descricao) return;
    setShowConfirm(true);
  };

  const handleConfirmarCriacao = async () => {
    setShowConfirm(false);
    try {
      await apiFetch("/api/competicoes/register", {
        method: "POST",
        body: JSON.stringify({
          nome, descricao, dataInicio, dataFim,
          pontosVitoria: parseInt(pontosVitoria),
          tipoOrdenacao,
        }),
      });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (onSuccess) onSuccess();
    if (handleClose) handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered backdrop="static" contentClassName="border-0 rounded-4 overflow-hidden">
        <Modal.Header closeButton className="borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
          <Modal.Title className="fw-bold text-dark">Agendar Competição</Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" style={{ backgroundColor: "var(--card-bg)" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-success small">NOME</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Desafio de Supino"
                value={nome}
                className="border-0 shadow-none p-3"
                style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-success small">DESCRIÇÃO</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Regras e detalhes..."
                className="border-0 shadow-none p-3"
                style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-success small">INÍCIO</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    className="border-0 shadow-none"
                    style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-success small">FIM</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    className="border-0 shadow-none"
                    style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-success small">PONTOS VITÓRIA</Form.Label>
                  <Form.Control
                    type="number"
                    className="border-0 shadow-none"
                    style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                    value={pontosVitoria}
                    onChange={(e) => setPontosVitoria(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-success small">ORDENAÇÃO</Form.Label>
                  <Form.Select
                    className="border-0 shadow-none"
                    style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                    value={tipoOrdenacao}
                    onChange={(e) => setTipoOrdenacao(e.target.value)}
                  >
                    <option value="MAIOR_MELHOR">Maior é melhor (Peso)</option>
                    <option value="MENOR_MELHOR">Menor é melhor (Tempo)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer className="borda-customizada" style={{ backgroundColor: "var(--bg-light)" }}>
          <Button variant="link" onClick={handleClose} className="text-muted fw-bold text-decoration-none">Cancelar</Button>
          <Button variant="success" className="rounded-pill px-4 fw-bold" onClick={handlePreSubmit}>
            Criar Competição
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal show={showConfirm} handleClose={() => setShowConfirm(false)} handleConfirm={handleConfirmarCriacao} title="Confirmar Criação" message={`Deseja realmente criar a competição "${nome}"?`} />
      <SuccessModal show={showSuccess} handleClose={handleCloseSuccess} message="Competição criada com sucesso!" />
    </>
  );
}