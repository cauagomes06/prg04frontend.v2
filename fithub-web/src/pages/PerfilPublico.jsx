import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Spinner, Button, Image } from "react-bootstrap";
import { apiFetch } from "../services/api";

import { LibraryCard } from "../components/treinos/LibraryCard";
import { PaginationComponent } from "../components/common/PaginationComponent";
import { ErrorModal } from "../components/common/ErrorModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { WorkoutPlayer } from "../components/treinos/WorkoutPlayer";

import "../styles/treinos.css";

export function PerfilPublico() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- ESTADOS DO PERFIL ---
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  // --- ESTADOS DOS TREINOS ---
  const [treinos, setTreinos] = useState([]);
  const [loadingTreinos, setLoadingTreinos] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;

  // --- ESTADOS DE FEEDBACK E MODAIS ---
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [treinoEmExecucao, setTreinoEmExecucao] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [treinoParaCopiar, setTreinoParaCopiar] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FUNÇÕES DE BUSCA ---
  const carregarDadosPerfil = async () => {
    try {
      setLoadingPerfil(true);
      const data = await apiFetch(`/api/usuarios/${id}/perfil-publico`);
      setPerfil(data);
    } catch (error) {
      handleMostrarErro("Perfil não encontrado ou indisponível.");
    } finally {
      setLoadingPerfil(false);
    }
  };

  const carregarTreinosPublicos = async () => {
    try {
      setLoadingTreinos(true);
      const data = await apiFetch(`/api/treinos/usuario/${id}/publicos?page=${currentPage}&size=${pageSize}`);
      
      if (data && Array.isArray(data.content)) {
        setTreinos(data.content);
        setTotalPages(data.totalPages);
      } else {
        setTreinos([]);
      }
    } catch (error) {
      handleMostrarErro("Erro ao carregar os treinos deste usuário.");
    } finally {
      setLoadingTreinos(false);
    }
  };

  useEffect(() => {
    carregarDadosPerfil();
  }, [id]);

  useEffect(() => {
    carregarTreinosPublicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentPage]);

  // --- HANDLERS COMPARTILHADOS ---
  const handleMostrarErro = (mensagem) => {
    setErrorMessage(mensagem);
    setShowError(true);
  };

  const handleShowDetalhes = async (treinoId) => {
    try {
      const data = await apiFetch(`/api/treinos/${treinoId}`);
      setSelectedTreino(data);
      setShowDetailModal(true);
    } catch (error) {
      handleMostrarErro("Erro ao carregar detalhes do treino.");
    }
  };

  const executarCopia = async () => {
    if (!treinoParaCopiar) return;
    setShowConfirm(false);
    setIsProcessing(true);
    try {
      await apiFetch(`/api/treinos/${treinoParaCopiar.id}/clonar`, { method: "POST" });
      setSuccessMessage(`O treino "${treinoParaCopiar.nome}" foi copiado para sua lista!`);
      setShowSuccess(true);
    } catch (error) {
      handleMostrarErro("Erro ao copiar treino.");
    } finally {
      setIsProcessing(false);
      setTreinoParaCopiar(null);
    }
  };

  const handleToggleFollow = async (treinoAlvo) => {
    setIsProcessing(true);
    try {
      const endpoint = treinoAlvo.seguindo ? "deixar-de-seguir" : "seguir";
      const method = treinoAlvo.seguindo ? "DELETE" : "POST";
      await apiFetch(`/api/treinos/${treinoAlvo.id}/${endpoint}`, { method });
      await carregarTreinosPublicos(); 
    } catch (error) {
      handleMostrarErro("Erro ao atualizar seguidores.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingPerfil) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="success" className="mb-3" />
        <h5 className="text-success fw-bold">Carregando perfil...</h5>
      </div>
    );
  }

  if (!perfil && !loadingPerfil) {
    return (
      <Container className="py-5 text-center min-vh-100">
        <div className="py-5">
          <i className="fas fa-user-slash fa-4x text-muted mb-3 opacity-25"></i>
          <h3 className="text-muted fw-bold">Usuário não encontrado</h3>
          <Button variant="success" className="mt-3 rounded-pill px-4" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2"></i> Voltar
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="perfil-publico-container py-5 min-vh-100 perfil-publico-bg">
      <Container>
        {/* BOTÃO VOLTAR */}
        <Button variant="link" className="text-muted text-decoration-none fw-bold p-0 mb-4" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i> Voltar
        </Button>

        {/* HEADER DO PERFIL */}
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm mb-5 position-relative overflow-hidden perfil-header-card">
          <Row className="align-items-center text-center text-md-start">
            <Col md={3} lg={2} className="mb-4 mb-md-0 d-flex justify-content-center">
              {perfil.fotoUrl ? (
                <Image src={perfil.fotoUrl} roundedCircle className="shadow border perfil-avatar" />
              ) : (
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm border perfil-avatar-placeholder">
                  <i className="fas fa-user text-muted fa-4x opacity-50"></i>
                </div>
              )}
            </Col>
            
            <Col md={9} lg={10}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-center w-100">
                
                <div className="text-center text-md-start mb-4 mb-md-0">
                  <h2 className="fw-black text-dark mb-1">{perfil.nomeCompleto}</h2>
                  <p className="text-muted mb-0">@{perfil.username}</p>
                </div>
                
                {/* BADGE DE NÍVEL DESTAQUE */}
                <div className="p-3 rounded-4 shadow-sm border bg-white d-flex flex-column align-items-center justify-content-center hover-effect status-card-perfil">
                  <span className="d-block text-uppercase fw-bold text-muted mb-2 status-label-perfil">
                    Status Atual
                  </span>
                  
                  <div className="d-flex align-items-center justify-content-center gap-3 mb-3 w-100">
                    <div className="text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow level-circle-perfil">
                      {perfil.nivel}
                    </div>
                    
                    <div className="text-start">
                      <span className="d-block fw-black text-dark fs-5 lh-1">{perfil.tituloNivel}</span>
                      <small className="text-muted fw-bold level-subtitle-perfil">NÍVEL ALCANÇADO</small>
                    </div>
                  </div>

                  <Badge bg="warning" text="dark" className="rounded-pill px-4 py-2 shadow-sm w-100 d-flex justify-content-center align-items-center gap-2 xp-badge-perfil">
                    <i className="fas fa-star"></i> 
                    <span className="fw-bold">{perfil.scoreTotal} XP</span>
                  </Badge>
                </div>

              </div>
            </Col>
          </Row>
        </div>

        {/* GRID DE TREINOS DO USUÁRIO */}
        <div className="mb-4">
          <h4 className="fw-bold text-dark border-bottom pb-2">
            <i className="fas fa-dumbbell text-success me-2"></i>
            Treinos de {perfil.nomeCompleto.split(" ")[0]}
          </h4>
        </div>

        {loadingTreinos ? (
          <div className="text-center py-5">
            <Spinner animation="grow" variant="success" />
          </div>
        ) : treinos.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
            <i className="fas fa-folder-open fa-3x text-muted mb-3 opacity-25"></i>
            <h5 className="text-muted fw-bold">Nenhum treino público.</h5>
            <p className="text-muted small">Este usuário ainda não compartilhou treinos com a comunidade.</p>
          </div>
        ) : (
          <>
            <div className="row g-3 g-md-4 mb-4">
              {treinos.map((treino) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={treino.id}>
                  <LibraryCard
                    treino={treino}
                    onVerDetalhes={handleShowDetalhes}
                    onCopiar={(t) => { setTreinoParaCopiar(t); setShowConfirm(true); }}
                    onToggleFollow={handleToggleFollow}
                    disabled={isProcessing}
                    onIniciarTreino={(t) => setTreinoEmExecucao(t)}
                    onError={handleMostrarErro} 
                  />
                </div>
              ))}
            </div>

            <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} loading={loadingTreinos} />
          </>
        )}

        {/* MODAIS */}
        {treinoEmExecucao && (
          <WorkoutPlayer treino={treinoEmExecucao} onFechar={() => setTreinoEmExecucao(null)} />
        )}

        <WorkoutModal
          show={showDetailModal}
          handleClose={() => setShowDetailModal(false)}
          treino={selectedTreino}
          readOnly={true}
          onIniciarTreino={(t) => setTreinoEmExecucao(t)}
          onError={handleMostrarErro}
        />

        <ConfirmModal show={showConfirm} handleClose={() => setShowConfirm(false)} handleConfirm={executarCopia} title="Adicionar Treino" message={treinoParaCopiar ? `Deseja copiar "${treinoParaCopiar.nome}"?` : ""} />
        <SuccessModal show={showSuccess} handleClose={() => setShowSuccess(false)} message={successMessage} />
        <ErrorModal show={showError} handleClose={() => setShowError(false)} message={errorMessage} />
      </Container>
    </div>
  );
}