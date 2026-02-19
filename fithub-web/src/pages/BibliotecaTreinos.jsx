import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Container, Spinner, Button, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

// Componentes do Domínio
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { LibraryCard } from "../components/treinos/LibraryCard";
import { AvaliacaoModal } from "../components/treinos/AvaliacaoModal";

// Componentes Comuns
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";
import { SearchBar } from "../components/common/SearchBar";

import "../styles/treinos.css";

export function Biblioteca() {
  const { user } = useContext(AuthContext);

  // --- ESTADOS DE DADOS ---
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true); // Controla o carregamento inicial e trocas

  // --- ESTADOS DE FILTRO E PESQUISA ---
  const [filtroAtivo, setFiltroAtivo] = useState("RECENTES");
  const [termoBusca, setTermoBusca] = useState("");

  // --- ESTADOS DE PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;

  // --- ESTADOS DE UI/MODAIS ---
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [treinoParaCopiar, setTreinoParaCopiar] = useState(null);
  const [treinoParaAvaliar, setTreinoParaAvaliar] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. CARREGAR DADOS (SERVER-SIDE) ---
  const carregarTreinos = async () => {
    setLoading(true); // Ativa o spinner toda vez que a função é chamada
    const url = `/api/treinos/buscar-per-filter?page=${currentPage}&size=${pageSize}&filtro=${filtroAtivo}&termo=${encodeURIComponent(termoBusca)}`;

    try {
      const data = await apiFetch(url);

      if (data && Array.isArray(data.content)) {
        setTreinos(data.content);
        setTotalPages(data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setTreinos([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Erro ao carregar biblioteca:", err);
      setErrorMessage("Não foi possível carregar a biblioteca.");
      setShowError(true);
    } finally {
      setLoading(false); // Desativa o spinner ao finalizar (sucesso ou erro)
    }
  };

  // Efeito com Debounce para busca por texto
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarTreinos();
    }, 400); // Reduzi um pouco o delay do debounce para parecer mais responsivo
    return () => clearTimeout(timer);
  }, [currentPage, filtroAtivo, termoBusca]);

  // --- FUNÇÕES DE AÇÃO ---

  const handleTrocarFiltro = (novoFiltro) => {
    if (filtroAtivo !== novoFiltro) {
      setFiltroAtivo(novoFiltro);
      setCurrentPage(0);
    }
  };

  const handleShowDetalhes = async (id) => {
    try {
      const data = await apiFetch(`/api/treinos/${id}`);
      setSelectedTreino(data);
      setShowDetailModal(true);
    } catch (error) {
      setErrorMessage("Erro ao carregar detalhes do treino.");
      setShowError(true);
    }
  };

  const handleToggleFollow = async (treinoAlvo) => {
    setIsProcessing(true);
    try {
      const endpoint = treinoAlvo.seguindo ? "deixar-de-seguir" : "seguir";
      const method = treinoAlvo.seguindo ? "DELETE" : "POST";
      await apiFetch(`/api/treinos/${treinoAlvo.id}/${endpoint}`, { method });
      await carregarTreinos();
      setSuccessMessage(
        treinoAlvo.seguindo
          ? "Treino removido dos favoritos."
          : "Agora você segue este treino!",
      );
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.message || "Erro ao atualizar seguidores.");
      setShowError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAbrirAvaliacao = (treino) => {
    if (treino.criadorId === user.id) {
      setErrorMessage("Você não pode avaliar o seu próprio treino!");
      setShowError(true);
      return;
    }
    setTreinoParaAvaliar(treino);
    setShowAvaliacaoModal(true);
  };

  const executarCopia = async () => {
    if (!treinoParaCopiar) return;
    setShowConfirm(false);
    setIsProcessing(true);
    try {
      await apiFetch(`/api/treinos/${treinoParaCopiar.id}/clonar`, {
        method: "POST",
      });
      setSuccessMessage(
        `O treino "${treinoParaCopiar.nome}" foi adicionado à sua lista!`,
      );
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage("Erro ao copiar treino.");
      setShowError(true);
    } finally {
      setIsProcessing(false);
      setTreinoParaCopiar(null);
    }
  };

  return (
    <div className="treinos-container py-5 bg-light min-vh-100">
      <Container>
        {/* Header */}
        <div className="mb-4">
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="mb-1 fw-bold text-dark">Biblioteca de Treinos</h1>
              <p className="text-muted">
                Explore e siga os melhores treinos da comunidade.
              </p>
            </Col>
            <Col md={5} className="mt-3 mt-md-0">
              <SearchBar
                placeholder="Pesquisar..."
                value={termoBusca}
                onChange={(e) => {
                  setTermoBusca(e.target.value);
                  setCurrentPage(0);
                }}
                onClear={() => {
                  setTermoBusca("");
                  setCurrentPage(0);
                }}
              />
            </Col>
          </Row>
        </div>

        {/* Barra de Filtros */}
        <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom">
          <Button
            variant={filtroAtivo === "RECENTES" ? "success" : "outline-success"}
            className="rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
            onClick={() => handleTrocarFiltro("RECENTES")}
            disabled={loading} // Desativa enquanto carrega para evitar spam
          >
            <i className="fas fa-history"></i> Recentes
          </Button>

          <Button
            variant={
              filtroAtivo === "MAIS_SEGUIDOS" ? "success" : "outline-success"
            }
            className="rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
            onClick={() => handleTrocarFiltro("MAIS_SEGUIDOS")}
            disabled={loading}
          >
            <i className="fas fa-fire"></i> Populares
          </Button>

          <Button
            variant={
              filtroAtivo === "MELHORES_AVALIADOS"
                ? "success"
                : "outline-success"
            }
            className="rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
            onClick={() => handleTrocarFiltro("MELHORES_AVALIADOS")}
            disabled={loading}
          >
            <i className="fas fa-star"></i> Melhores Avaliados
          </Button>

          <Button
            variant={filtroAtivo === "SEGUINDO" ? "success" : "outline-success"}
            className="rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
            onClick={() => handleTrocarFiltro("SEGUINDO")}
            disabled={loading}
          >
            <i className="fas fa-users-check"></i> Seguindo
          </Button>
        </div>

        {/* --- LOGICA DE EXIBIÇÃO: SPINNER OU GRID --- */}
        {loading ? (
          <div className="text-center py-5 my-5">
            <Spinner
              animation="border"
              variant="success"
              style={{ width: "3rem", height: "3rem" }}
            />
            <h5 className="mt-3 text-success fw-bold">Buscando treinos...</h5>
          </div>
        ) : treinos.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
            <i className="fas fa-search fa-3x text-muted mb-3 opacity-25"></i>
            <h5 className="text-muted">Nenhum treino encontrado.</h5>
            {termoBusca && (
              <Button
                variant="link"
                onClick={() => {
                  setTermoBusca("");
                  setCurrentPage(0);
                }}
              >
                Limpar pesquisa
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="library-grid mb-5">
              {treinos.map((treino, index) => (
                <LibraryCard
                  key={treino.id}
                  treino={treino}
                  onVerDetalhes={handleShowDetalhes}
                  onCopiar={(t) => {
                    setTreinoParaCopiar(t);
                    setShowConfirm(true);
                  }}
                  onToggleFollow={handleToggleFollow}
                  onAvaliar={handleAbrirAvaliacao}
                  disabled={isProcessing}
                />
              ))}
            </div>

            {/* Paginação (dentro do bloco de sucesso) */}
            {totalPages > 1 && (
              <div
                className="pagination-wrapper d-flex justify-content-center align-items-center gap-4 mt-5 p-3 bg-white rounded-pill shadow-sm mx-auto"
                style={{ maxWidth: "fit-content" }}
              >
                <Button
                  variant="light"
                  className="rounded-circle shadow-sm p-2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0 || loading}
                >
                  <i className="fas fa-chevron-left text-success"></i>
                </Button>
                <div className="text-dark">
                  <span className="fw-bold fs-5">{currentPage + 1}</span>
                  <span className="text-muted mx-2">de</span>
                  <span className="fw-bold fs-5">{totalPages}</span>
                </div>
                <Button
                  variant="light"
                  className="rounded-circle shadow-sm p-2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage >= totalPages - 1 || loading}
                >
                  <i className="fas fa-chevron-right text-success"></i>
                </Button>
              </div>
            )}
          </>
        )}

        {/* Modais */}
        <WorkoutModal
          show={showDetailModal}
          handleClose={() => setShowDetailModal(false)}
          treino={selectedTreino}
          readOnly={true}
        />
        <ConfirmModal
          show={showConfirm}
          handleClose={() => setShowConfirm(false)}
          handleConfirm={executarCopia}
          title="Adicionar Treino"
          message={
            treinoParaCopiar ? `Deseja copiar "${treinoParaCopiar.nome}"?` : ""
          }
        />
        <AvaliacaoModal
          show={showAvaliacaoModal}
          handleClose={() => setShowAvaliacaoModal(false)}
          treino={treinoParaAvaliar}
          onSuccess={() => carregarTreinos()}
        />
        <SuccessModal
          show={showSuccess}
          handleClose={() => setShowSuccess(false)}
          message={successMessage}
        />
        <ErrorModal
          show={showError}
          handleClose={() => setShowError(false)}
          message={errorMessage}
        />
      </Container>
    </div>
  );
}
