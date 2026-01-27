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

// Componentes Comuns
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal";

// Componentes de Competição
import CreateCompeticaoModal from "../components/competicoes/CreateCompeticaoModal";
import { RankingCard } from "../components/competicoes/RankingCard";
import { CompetitionsListCard } from "../components/competicoes/CompetitionsListCard";
import { InscriptionsCard } from "../components/competicoes/InscriptionsCard";
import { CompeticaoDetailsModal } from "../components/competicoes/CompeticaoDetailsModal";

import "../styles/competicoes.css";

export function Competicoes() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE DADOS PAGINADOS ---

  // 1. Ranking Geral de Usuários
  const [ranking, setRanking] = useState([]);
  const [rankingPage, setRankingPage] = useState(0);
  const [rankingTotalPages, setRankingTotalPages] = useState(0);

  // 2. Lista de Competições
  const [competicoes, setCompeticoes] = useState([]);
  const [compPage, setCompPage] = useState(0);
  const [compTotalPages, setCompTotalPages] = useState(0);

  // 3. Minhas Inscrições (Lista simples)
  const [inscricoes, setInscricoes] = useState([]);

  // --- ESTADOS DE UI / MODAIS ---
  const [rankingCompeticao, setRankingCompeticao] = useState([]); // Ranking específico de uma competicao (detalhes)
  const [competicaoSelecionada, setCompeticaoSelecionada] = useState(null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Mensagens e Ações
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  // Submit de Resultado
  const [selectedInscricaoId, setSelectedInscricaoId] = useState(null);
  const [resultadoValor, setResultadoValor] = useState("");

  // Permissões
  const roleUsuario = user?.nomePerfil || user?.perfil?.nomePerfil;
  const canManage =
    roleUsuario &&
    (roleUsuario === "ROLE_ADMIN" || roleUsuario === "ROLE_PERSONAL");
  const isAdmin = roleUsuario === "ROLE_ADMIN";

  // =========================================================
  // 1. BUSCA DE DADOS (CALLBACKS)
  // =========================================================

  // Carrega Ranking Geral (Paginado)
  const carregarRanking = useCallback(async () => {
    try {
      // Busca 5 usuários por página para caber no Card
      const data = await apiFetch(
        `/api/usuarios/ranking?page=${rankingPage}&size=5`,
      );
      if (data && data.content) {
        setRanking(data.content);
        setRankingTotalPages(data.totalPages);
      } else {
        setRanking([]);
        setRankingTotalPages(0);
      }
    } catch (error) {
      console.error("Erro ao carregar ranking geral:", error);
    }
  }, [rankingPage]);

  // Carrega Competições (Paginado)
  const carregarCompeticoes = useCallback(async () => {
    try {
      // Busca 5 competições por página, ordenadas por data de início (mais recentes primeiro)
      const data = await apiFetch(
        `/api/competicoes/buscar?page=${compPage}&size=5&sort=dataInicio,desc`,
      );
      if (data && data.content) {
        setCompeticoes(data.content);
        setCompTotalPages(data.totalPages);
      } else {
        setCompeticoes([]);
        setCompTotalPages(0);
      }
    } catch (error) {
      console.error("Erro ao carregar competições:", error);
    }
  }, [compPage]);

  // Carrega Minhas Inscrições (Lista fixa)
  const carregarInscricoes = useCallback(async () => {
    try {
      const data = await apiFetch("/api/competicoes/inscricao/usuario");
      setInscricoes(data || []);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
    }
  }, []);

  // =========================================================
  // 2. EFEITOS (TRIGGERS)
  // =========================================================

  // Carga Inicial Completa
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        carregarRanking(),
        carregarCompeticoes(),
        carregarInscricoes(),
      ]);
      setLoading(false);
    };
    init();
  }, []); // Executa apenas na montagem inicial

  // Atualiza Ranking quando muda a página do ranking
  useEffect(() => {
    carregarRanking();
  }, [rankingPage, carregarRanking]);

  // Atualiza Competições quando muda a página de competições
  useEffect(() => {
    carregarCompeticoes();
  }, [compPage, carregarCompeticoes]);

  // =========================================================
  // 3. AÇÕES E HANDLERS
  // =========================================================

  const mostrarErro = (msg) => {
    setErrorMessage(msg);
    setShowErrorModal(true);
  };

  // Atualizar Status (Admin/Personal)
  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      await apiFetch(`/api/competicoes/${id}/status?status=${novoStatus}`, {
        method: "PATCH",
      });
      setSuccessMessage(`Status atualizado para ${novoStatus}!`);
      setShowSuccessModal(true);
      setShowDetalhesModal(false);
      carregarCompeticoes(); // Recarrega a lista para refletir a mudança
    } catch (error) {
      mostrarErro("Erro ao atualizar status: " + error.message);
    }
  };

  // Excluir Competição
  const solicitarExclusao = (id, nome) => {
    setConfirmTitle("Excluir Competição");
    setConfirmMessage(
      `Tem a certeza que deseja excluir permanentemente a competição "${nome}"?`,
    );
    setPendingAction(() => () => handleExcluir(id));
    setShowConfirmModal(true);
  };

  const handleExcluir = async (id) => {
    setShowConfirmModal(false);
    try {
      await apiFetch(`/api/competicoes/delete/${id}`, { method: "DELETE" });
      setSuccessMessage("Competição excluída com sucesso!");
      setShowSuccessModal(true);
      setShowDetalhesModal(false);
      carregarCompeticoes();
    } catch (error) {
      mostrarErro("Erro ao excluir: " + error.message);
    }
  };

  // Inscrever-se
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
      carregarInscricoes(); // Atualiza o card de inscrições
    } catch (error) {
      mostrarErro("Não foi possível realizar a inscrição: " + error.message);
    }
  };

  // Detalhes da Competição
  const abrirDetalhes = async (competicao) => {
    setCompeticaoSelecionada(competicao);
    setShowDetalhesModal(true);
    try {
      // Ranking interno da competição específica (Mantido como lista ou endpoint separado)
      const data = await apiFetch(`/api/competicoes/${competicao.id}/ranking`);
      setRankingCompeticao(data || []);
    } catch (error) {
      console.error(error);
      setRankingCompeticao([]);
    }
  };

  // Submeter Resultado
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
        },
      );
      setShowSubmitModal(false);
      setSuccessMessage("Resultado enviado com sucesso!");
      setShowSuccessModal(true);
      carregarInscricoes(); // Atualiza para mostrar "Concluído"
    } catch (error) {
      mostrarErro("Erro ao enviar resultado: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="competicoes-container py-5">
      <Container>
        {/* CABEÇALHO */}
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

        {/* GRID DE CARDS */}
        <Row className="g-4">
          {/* 1. CARD RANKING GERAL (Paginado) */}
          <Col lg={4} md={6}>
            <RankingCard
              ranking={ranking}
              currentPage={rankingPage}
              totalPages={rankingTotalPages}
              onPageChange={setRankingPage}
            />
          </Col>

          {/* 2. CARD LISTA DE COMPETIÇÕES (Paginado) */}
          <Col lg={4} md={6}>
            <CompetitionsListCard
              competicoes={competicoes}
              currentPage={compPage}
              totalPages={compTotalPages}
              onPageChange={setCompPage}
              onInscrever={solicitarConfirmacaoInscricao}
              onDetalhes={abrirDetalhes}
            />
          </Col>

          {/* 3. CARD MINHAS INSCRIÇÕES */}
          <Col lg={4} md={12}>
            <InscriptionsCard
              inscricoes={inscricoes}
              competicoes={competicoes}
              onSubmeter={handleOpenSubmit}
            />
          </Col>
        </Row>
      </Container>

      {/* --- MODAIS --- */}

      {/* Criar Competição */}
      <CreateCompeticaoModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          carregarCompeticoes();
          setShowSuccessModal(true);
          setSuccessMessage("Competição criada!");
        }}
      />

      {/* Enviar Resultado */}
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

      {/* Modais de Feedback e Detalhes */}
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

      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />

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
