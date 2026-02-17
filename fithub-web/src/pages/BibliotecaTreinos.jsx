import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Container, Spinner, Button, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

// Componentes do Domínio
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { LibraryCard } from "../components/treinos/LibraryCard";

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
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE PAGINAÇÃO (Implementados) ---
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;

  // --- ESTADOS DE PESQUISA ---
  const [termoBusca, setTermoBusca] = useState("");

  // --- ESTADOS DE UI/MODAIS ---
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [treinoParaCopiar, setTreinoParaCopiar] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. CARREGAR DADOS PAGINADOS (Lógica de Backend)
  const carregarTreinos = async () => {
    setLoading(true);
    // A paginação ocorre aqui, enviando 'page' e 'size' para o Spring Boot
    const url = `/api/treinos/buscar?page=${currentPage}&size=${pageSize}`;

    try {
      const data = await apiFetch(url);

      if (data && Array.isArray(data.content)) {
        setTreinos(data.content);
        setTotalPages(data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Melhora o UX ao trocar de página
      } else {
        setTreinos([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Erro ao carregar biblioteca:", err);
      setErrorMessage("Não foi possível carregar a biblioteca de treinos.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a busca sempre que a página atual mudar
  useEffect(() => {
    carregarTreinos();
  }, [currentPage]);

  // --- NOVA FUNÇÃO: SEGUIR / DEIXAR DE SEGUIR ---
  const handleToggleFollow = async (treinoAlvo) => {
    const isFollowing = treinoAlvo.seguindo;
    const originalTreinos = [...treinos]; // Backup em caso de erro

    // 1. Atualização Otimista (Visual Imediato)
    const novosTreinos = treinos.map((t) => {
      if (t.id === treinoAlvo.id) {
        return {
          ...t,
          seguindo: !isFollowing,
          numeroSeguidores: t.numeroSeguidores + (isFollowing ? -1 : 1),
        };
      }
      return t;
    });
    setTreinos(novosTreinos);

    // 2. Chamada API
    try {
      const endpoint = isFollowing ? "deixar-de-seguir" : "seguir";
      const method = isFollowing ? "DELETE" : "POST";

      await apiFetch(`/api/treinos/${treinoAlvo.id}/${endpoint}`, { method });
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
      // Reverte se der erro
      setTreinos(originalTreinos);
      setErrorMessage("Erro ao atualizar status. Tente novamente.");
      setShowError(true);
    }
  };
  // 2. LÓGICA DE FILTRAGEM LOCAL (Apenas por texto)
  const treinosFiltrados = treinos.filter((treino) => {
    const nome = treino.nome ? treino.nome.toLowerCase() : "";
    const objetivo = treino.objetivo ? treino.objetivo.toLowerCase() : "";
    const busca = termoBusca.toLowerCase();

    return nome.includes(busca) || objetivo.includes(busca);
  });

  // --- AÇÕES ---
  const handleShowDetalhes = async (id) => {
    try {
      const treinoDetalhado = await apiFetch(`/api/treinos/${id}`);
      setSelectedTreino(treinoDetalhado);
      setShowDetailModal(true);
    } catch (error) {
      setErrorMessage("Erro ao carregar detalhes.");
      setShowError(true);
    }
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

  if (loading)
    return (
      <div className="text-center mt-5 p-5">
        <Spinner animation="border" variant="success" />
        <h3 className="mt-3 text-success fw-bold">Atualizando Biblioteca...</h3>
      </div>
    );

  return (
    <div className="treinos-container py-5 bg-light min-vh-100">
      <Container>
        {/* Header com SearchBar */}
        <div className="mb-5">
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="mb-1 fw-bold text-dark">Biblioteca de Treinos</h1>
              <p className="text-muted">
                Encontre fichas de treino para o seu objetivo.
              </p>
            </Col>
            <Col md={5} className="mt-3 mt-md-0">
              <SearchBar
                placeholder="Pesquisar por nome ou objetivo..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onClear={() => setTermoBusca("")}
              />
            </Col>
          </Row>
        </div>

        {/* Grid de Cards */}
        {treinosFiltrados.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
            <i className="fas fa-search fa-3x text-muted mb-3 opacity-25"></i>
            <h5 className="text-muted">
              Nenhum treino encontrado com este nome nesta página.
            </h5>
            {termoBusca && (
              <Button variant="link" onClick={() => setTermoBusca("")}>
                Limpar pesquisa
              </Button>
            )}
          </div>
        ) : (
          <div className="library-grid mb-5">
            {treinosFiltrados.map((treino, index) => (
              <LibraryCard
                key={treino.id}
                treino={treino}
                onVerDetalhes={handleShowDetalhes}
                onCopiar={(t) => {
                  setTreinoParaCopiar(t);
                  setShowConfirm(true);
                }}
                onToggleFollow={handleToggleFollow}
                isMostFollowed={
                  currentPage === 0 &&
                  index === 0 &&
                  treino.numeroSeguidores > 0
                }
                disabled={isProcessing}
              />
            ))}
          </div>
        )}

        {/* --- CONTROLES DE PAGINAÇÃO (Pill Style) --- */}
        {totalPages > 1 && (
          <div
            className="pagination-wrapper d-flex justify-content-center align-items-center gap-4 mt-5 p-3 bg-white rounded-pill shadow-sm mx-auto"
            style={{ maxWidth: "fit-content" }}
          >
            <Button
              variant="light"
              className="rounded-circle shadow-sm p-2"
              style={{ width: "40px", height: "40px" }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
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
              style={{ width: "40px", height: "40px" }}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              <i className="fas fa-chevron-right text-success"></i>
            </Button>
          </div>
        )}

        {/* Modais de Feedback */}
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
