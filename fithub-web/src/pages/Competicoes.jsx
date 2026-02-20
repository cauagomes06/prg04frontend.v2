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
  const [ranking, setRanking] = useState([]);
  const [rankingPage, setRankingPage] = useState(0);
  const [rankingTotalPages, setRankingTotalPages] = useState(0);

  const [competicoes, setCompeticoes] = useState([]);
  const [compPage, setCompPage] = useState(0);
  const [compTotalPages, setCompTotalPages] = useState(0);

  const [inscricoes, setInscricoes] = useState([]);

  // --- ESTADOS DE UI / MODAIS ---
  const [rankingCompeticao, setRankingCompeticao] = useState([]); 
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
  const canManage = roleUsuario && (roleUsuario === "ROLE_ADMIN" || roleUsuario === "ROLE_PERSONAL");
  const isAdmin = roleUsuario === "ROLE_ADMIN";

  // =========================================================
  // 1. BUSCA DE DADOS (CALLBACKS)
  // =========================================================

  const carregarRanking = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/usuarios/ranking?page=${rankingPage}&size=5`);
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

  const carregarCompeticoes = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/competicoes/buscar?page=${compPage}&size=5&sort=dataInicio,desc`);
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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([carregarRanking(), carregarCompeticoes(), carregarInscricoes()]);
      setLoading(false);
    };
    init();
  }, [carregarRanking, carregarCompeticoes, carregarInscricoes]);

  // =========================================================
  // 3. AÇÕES E HANDLERS
  // =========================================================

  // Função essencial reintroduzida para corrigir o Uncaught ReferenceError
  const handleOpenSubmit = (inscricaoId) => {
    setSelectedInscricaoId(inscricaoId);
    setResultadoValor("");
    setShowSubmitModal(true);
  };

  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      await apiFetch(`/api/competicoes/${id}/status?status=${novoStatus}`, { method: "PATCH" });
      setSuccessMessage(`Status atualizado para ${novoStatus}!`);
      setShowSuccessModal(true);
      setShowDetalhesModal(false);
      carregarCompeticoes();
    } catch (error) {
      setErrorMessage("Erro ao atualizar status: " + error.message);
      setShowErrorModal(true);
    }
  };

  const solicitarExclusao = (id, nome) => {
    setConfirmTitle("Excluir Competição");
    setConfirmMessage(`Tem a certeza que deseja excluir permanentemente a competição "${nome}"?`);
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
      setErrorMessage("Erro ao excluir: " + error.message);
      setShowErrorModal(true);
    }
  };

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
      carregarInscricoes();
    } catch (error) {
      setErrorMessage("Não foi possível realizar a inscrição: " + error.message);
      setShowErrorModal(true);
    }
  };

  const abrirDetalhes = async (competicao) => {
    setRankingCompeticao([]); // Limpa ranking anterior
    setCompeticaoSelecionada(competicao);
    setShowDetalhesModal(true);
    try {
      const data = await apiFetch(`/api/competicoes/${competicao.id}/ranking`);
      setRankingCompeticao(data || []);
    } catch (error) {
      console.error(error);
      setRankingCompeticao([]);
    }
  };

  const handleSubmitResultado = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/competicoes/inscricao/${selectedInscricaoId}/resultado`, {
        method: "POST",
        body: JSON.stringify({ resultado: resultadoValor }),
      });
      setShowSubmitModal(false);
      setSuccessMessage("Resultado enviado com sucesso!");
      setShowSuccessModal(true);
      carregarInscricoes();
    } catch (error) {
      setErrorMessage("Erro ao enviar resultado: " + error.message);
      setShowErrorModal(true);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--bg-light)' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="competicoes-container py-5 min-vh-100" style={{ backgroundColor: "var(--bg-light)" }}>
      <Container>
        {/* CABEÇALHO */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
          <div>
            <h2 className="page-header-title text-dark">
              <i className="fas fa-trophy me-2 text-warning"></i> Painel de Competições
            </h2>
            <p className="text-muted mb-0">Acompanhe rankings, inscreva-se e supere seus limites.</p>
          </div>
          {canManage && (
            <Button
              variant="success"
              className="rounded-pill px-4 shadow-sm d-flex align-items-center fw-bold"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-2"></i> Nova Competição
            </Button>
          )}
        </div>

        {/* GRID DE CARDS */}
        <Row className="g-4">
          <Col lg={4} md={6}>
            <RankingCard
              ranking={ranking}
              currentPage={rankingPage}
              totalPages={rankingTotalPages}
              onPageChange={setRankingPage}
            />
          </Col>

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
      <CreateCompeticaoModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          carregarCompeticoes();
          setSuccessMessage("Competição criada!");
          setShowSuccessModal(true);
        }}
      />

      {/* Modal de Resultado */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="borda-customizada" style={{ backgroundColor: 'var(--bg-light)' }}>
          <Modal.Title className="fw-bold text-dark">Enviar Resultado</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
          <Form onSubmit={handleSubmitResultado}>
            <Form.Group>
              <Form.Label className="fw-bold text-success small">RESULTADO ALCANÇADO</Form.Label>
              <Form.Control
                type="text"
                className="border-0 p-3 shadow-none"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}
                placeholder="Ex: 150kg, 50 reps…"
                value={resultadoValor}
                required
                onChange={(e) => setResultadoValor(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button variant="link" className="text-muted fw-bold text-decoration-none" onClick={() => setShowSubmitModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="success" className="rounded-pill px-4 fw-bold shadow-sm">
                Enviar Resultado
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
      <SuccessModal show={showSuccessModal} handleClose={() => setShowSuccessModal(false)} message={successMessage} />
      <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} message={errorMessage} />

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