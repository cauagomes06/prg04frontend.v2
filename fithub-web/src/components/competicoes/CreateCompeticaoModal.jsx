import { Modal, Button, Form, Row, Col } from "react-bootstrap";import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";
import { ConfirmModal } from "../common/ConfirmModal";
import { SuccessModal } from "../common/SuccessModal";

export default function CreateCompeticaoModal({ show, handleClose, onSuccess }) {
  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [pontosVitoria, setPontosVitoria] = useState(0);
  const [tipoOrdenacao, setTipoOrdenacao] = useState("MAIOR_MELHOR");

  // Estados dos Modais
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Função auxiliar para formatar data no padrão datetime-local
  const formatToLocalISO = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Resetar campos ao abrir
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

  // 1. Validação simples antes de abrir a confirmação
  const handlePreSubmit = () => {
    if (!nome || !descricao) {
      alert("Por favor, preencha o nome e a descrição.");
      return;
    }
    setShowConfirm(true);
  };

  // 2. Ação confirmada: Chama API
  const handleConfirmarCriacao = async () => {
    setShowConfirm(false); // Fecha o modal de confirmação
    
    try {
      await apiFetch("/api/competicoes/register", {
        method: "POST",
        body: JSON.stringify({
          nome,
          descricao,
          dataInicio,
          dataFim,
          pontosVitoria: parseInt(pontosVitoria),
          tipoOrdenacao,
        }),
      });

      // 3. Sucesso: Abre modal de sucesso
      setShowSuccess(true);
      
    } catch (err) {
      console.error("Erro ao criar competição:", err);
      const msg = err.message || "Erro desconhecido";
      alert("Não foi possível criar a competição.\n\nErro: " + msg);
    }
  };

  // 4. Ao fechar o modal de sucesso, finaliza tudo
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (onSuccess) onSuccess(); // Recarrega a lista no pai
    if (handleClose) handleClose(); // Fecha o modal de criação
  };

  return (
    <>
      {/* --- MODAL DE CRIAÇÃO (FORMULÁRIO) --- */}
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Criar Nova Competição</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Desafio de Supino"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Regras e detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Início (Margem de segurança)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fim</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pontos Vitória</Form.Label>
                  <Form.Control
                    type="number"
                    value={pontosVitoria}
                    onChange={(e) => setPontosVitoria(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ordenação</Form.Label>
                  <Form.Select
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

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handlePreSubmit}>
            Criar Competição
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <ConfirmModal 
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleConfirmarCriacao}
        title="Confirmar Criação"
        message={`Deseja realmente criar a competição "${nome}"?`}
      />

      {/* --- MODAL DE SUCESSO --- */}
      <SuccessModal 
        show={showSuccess}
        handleClose={handleCloseSuccess}
        message="Competição criada com sucesso!"
      />
    </>
  );
}