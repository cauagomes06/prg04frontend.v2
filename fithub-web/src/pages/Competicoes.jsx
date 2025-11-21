import { useState, useEffect, useContext, useCallback } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  Button,
  Row,
  Col,
  Modal,
  Form,
  Spinner,
  Container,
} from "react-bootstrap";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import CreateCompeticaoModal from "../components/competicoes/CreateCompeticaoModal";

// Importação dos novos componentes granulares
import { RankingCard } from "../components/competicoes/RankingCard";
import { CompetitionsListCard } from "../components/competicoes/CompetitionsListCard";
import { InscriptionsCard } from "../components/competicoes/InscriptionsCard";
import { CompeticaoDetailsModal } from "../components/competicoes/CompeticaoDetailsModal";

import "../styles/competicoes.css";

export function Competicoes() {
  const { user } = useContext(AuthContext);

  // Estados de Dados
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [rankingCompeticao, setRankingCompeticao] = useState([]);
  const [competicaoSelecionada, setCompeticaoSelecionada] = useState(null);

  // Estados de Modais
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);

  // Estados Auxiliares para Ações
  const [confirmTitle, setConfirmTitle] = useState("Confirmar Ação");
  const [confirmMessage, setConfirmMessage] = useState("Tem a certeza?");
  const [selectedInscricaoId, setSelectedInscricaoId] = useState(null);
  const [resultadoValor, setResultadoValor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  // Lógica de Permissão
  const roleUsuario = user?.nomePerfil || user?.perfil?.nomePerfil;
  const canManage =
    roleUsuario &&
    (roleUsuario === "ROLE_ADMIN" || roleUsuario === "ROLE_PERSONAL");
  const isAdmin = roleUsuario === "ROLE_ADMIN";

  // --- BUSCAR DADOS ---
  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const [rankData, compData, inscData] = await Promise.all([
        apiFetch("/api/usuarios/ranking"),
        apiFetch("/api/competicoes/buscar"),
        apiFetch("/api/competicoes/inscricao/usuario"),
      ]);
      setRanking(rankData);
      setCompeticoes(compData);
      setInscricoes(inscData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // --- HANDLERS DE AÇÃO ---

  // 1. Atualizar Status (Admin/Personal)
  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      await apiFetch(`/api/competicoes/${id}/status?status=${novoStatus}`, {
        method: "PATCH",
      });
      setSuccessMessage(`Status atualizado para ${novoStatus}!`);
      setShowSuccessModal(true);
      setShowDetalhesModal(false);
      carregarDados();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  // 2. Excluir Competição (Apenas Admin)
  const solicitarExclusao = (id, nome) => {
    setConfirmTitle("Excluir Competição");
    setConfirmMessage(
      `Tem a certeza que deseja excluir permanentemente a competição "${nome}"?`
    );
    setPendingAction(() => () => handleExcluir(id));
    setShowConfirmModal(true);
  };

  const handleExcluir = async (id) => {
    setShowConfirmModal(false);
    try {
      await apiFetch(`/api/competicoes/${id}`, { method: "DELETE" });
      setSuccessMessage("Competição excluída com sucesso!");
      setShowSuccessModal(true);
      setShowDetalhesModal(false);
      carregarDados();
    } catch (error) {
      alert("Erro ao excluir: " + error.message);
    }
  };

  // 3. Inscrição em Competição
  const solicitarConfirmacaoInscricao = (id) => {
    setConfirmTitle("Confirmar Inscrição");
    setConfirmMessage("Deseja realmente participar desta competição?");
    setPendingAction(() => () => handleInscrever(id));
    setShowConfirmModal(true);
  };

  const handleInscrever = async (id) => {
    setShowConfirmModal(false);
    try {
      await apiFetch(`/api/competicoes/${id}/inscrever`, { method: "POST" });
      setSuccessMessage("Inscrição realizada!");
      setShowSuccessModal(true);
      carregarDados();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  // 4. Ver Detalhes
  const abrirDetalhes = async (competicao) => {
    setCompeticaoSelecionada(competicao);
    setShowDetalhesModal(true);
    try {
      const data = await apiFetch(`/api/competicoes/${competicao.id}/ranking`);
      setRankingCompeticao(data);
    } catch (error) {
      console.error(error);
      setRankingCompeticao([]);
    }
  };

  // 5. Submeter Resultado
  const handleOpenSubmit = (inscricaoId) => {
    setSelectedInscricaoId(inscricaoId);
    setResultadoValor("");
    setShowSubmitModal(true);
  };

  const handleSubmitResultado = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(
        `/api/competicoes/inscricao/${selectedInscricaoId}/resultado`,
        {
          method: "POST",
          body: JSON.stringify({ resultado: resultadoValor }),
        }
      );
      setShowSubmitModal(false);
      setSuccessMessage("Resultado enviado!");
      setShowSuccessModal(true);
      carregarDados();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted small">Carregando dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="competicoes-container py-5">
      <Container>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="page-header-title">Painel de Competições</h2>
            <p className="text-muted mb-0">
              Acompanhe rankings, inscreva-se e supere seus limites.
            </p>
          </div>
          {canManage && (
            <Button
              className="btn-custom-primary rounded-pill px-4 shadow-sm d-flex align-items-center"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-2"></i> Nova Competição
            </Button>
          )}
        </div>

        {/* Grid Layout com Componentes Granulares */}
        <Row className="g-4">
          {/* Coluna 1: Ranking Geral */}
          <Col lg={4} md={6}>
            <RankingCard ranking={ranking} />
          </Col>

          {/* Coluna 2: Competições Disponíveis */}
          <Col lg={4} md={6}>
            <CompetitionsListCard
              competicoes={competicoes}
              onInscrever={solicitarConfirmacaoInscricao}
              onDetalhes={abrirDetalhes}
            />
          </Col>

          {/* Coluna 3: Minhas Inscrições */}
          <Col lg={4} md={12}>
            <InscriptionsCard
              inscricoes={inscricoes}
              competicoes={competicoes}
              onSubmeter={handleOpenSubmit}
            />
          </Col>
        </Row>
      </Container>

      {/* --- MODAIS AUXILIARES --- */}

      <CreateCompeticaoModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={carregarDados}
      />

      {/* Modal Simples de Submissão */}
      <Modal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        centered
        backdrop="static"
        contentClassName="modal-custom-content"
      >
        <Modal.Header closeButton className="modal-header-custom px-4 pt-4">
          <Modal.Title className="fw-bold">Enviar Resultado</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4 pt-2">
          <Form onSubmit={handleSubmitResultado}>
            <Form.Group>
              <Form.Label className="detail-label fw-bold">
                Resultado Alcançado
              </Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg rounded-3"
                placeholder="Ex: 150kg, 50 reps…"
                value={resultadoValor}
                required
                onChange={(e) => setResultadoValor(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="light"
                className="me-2 rounded-pill px-4"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-custom-primary rounded-pill px-4"
              >
                Enviar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={() => pendingAction && pendingAction()}
        title={confirmTitle}
        message={confirmMessage}
      />

      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      {/* Modal de Detalhes Extraído */}
      <CompeticaoDetailsModal
        show={showDetalhesModal}
        onHide={() => setShowDetalhesModal(false)}
        competicao={competicaoSelecionada}
        ranking={rankingCompeticao}
        canManage={canManage}
        isAdmin={isAdmin}
        onUpdateStatus={handleUpdateStatus}
        onDelete={solicitarExclusao}
      />
    </div>
  );
}
