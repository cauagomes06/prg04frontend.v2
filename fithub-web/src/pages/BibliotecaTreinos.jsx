import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Container, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

// Componentes do Domínio
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { LibraryCard } from "../components/treinos/LibraryCard";

// Componentes Comuns
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";
import { SearchBar } from "../components/common/SearchBar";
import { FilterGroup } from "../components/common/FilterGroup";

import "../styles/treinos.css";

export function Biblioteca() {
  const { user } = useContext(AuthContext);

  // --- ESTADOS DE DADOS ---
  const [treinos, setTreinos] = useState([]); // Armazena a página atual vinda do banco
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE PAGINAÇÃO (Novos) ---
  const [currentPage, setCurrentPage] = useState(0); // Página atual (0-indexado)
  const [totalPages, setTotalPages] = useState(0);   // Total de páginas disponíveis
  const pageSize = 12; // Quantidade de itens buscados por vez no banco

  // --- ESTADOS DE FILTRO LOCAL ---
  const [filtroMusculo, setFiltroMusculo] = useState("TODOS");
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

  const gruposMusculares = [
    "TODOS",
    "PEITO",
    "COSTAS",
    "PERNAS",
    "OMBROS",
    "BRAÇOS",
    "ABDÔMEN",
    "FULL BODY",
  ];

  // 1. CARREGAR DADOS PAGINADOS (Backend)
  const carregarTreinos = async () => {
    setLoading(true);
    // Busca apenas a página específica, sem filtros de busca (pois você quer filtrar no front)
    const url = `/api/treinos/buscar?page=${currentPage}&size=${pageSize}`;

    try {
      const data = await apiFetch(url);
      
      if (data && Array.isArray(data.content)) {
        setTreinos(data.content);
        setTotalPages(data.totalPages);
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

  // 2. USE EFFECT - Dispara sempre que a página mudar
  useEffect(() => {
    carregarTreinos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); 

  // 3. LÓGICA DE FILTRAGEM LOCAL (Mantida como solicitado)
  // Aplica os filtros APENAS nos itens carregados da página atual
  const treinosFiltrados = treinos.filter((treino) => {
    const termoMusculo = filtroMusculo.toUpperCase();
    const nome = treino.nome ? treino.nome.toUpperCase() : "";
    const objetivo = treino.objetivo ? treino.objetivo.toUpperCase() : "";

    const matchMusculo =
      filtroMusculo === "TODOS" ||
      nome.includes(termoMusculo) ||
      objetivo.includes(termoMusculo);
      
    const matchBusca =
      nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      objetivo.toLowerCase().includes(termoBusca.toLowerCase());

    return matchMusculo && matchBusca;
  });

  // --- AÇÕES DO USUÁRIO ---

  const handleShowDetalhes = async (id) => {
    try {
      const treinoDetalhado = await apiFetch(`/api/treinos/${id}`);
      setSelectedTreino(treinoDetalhado);
      setShowDetailModal(true);
    } catch (error) {
      setErrorMessage("Não foi possível carregar os detalhes do treino.");
      setShowError(true);
    }
  };

  const solicitarCopia = (treino) => {
    setTreinoParaCopiar(treino);
    setShowConfirm(true);
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
        `O treino "${treinoParaCopiar.nome}" foi adicionado aos seus treinos!`
      );
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage("Erro ao copiar treino: " + error.message);
      setShowError(true);
    } finally {
      setIsProcessing(false);
      setTreinoParaCopiar(null);
    }
  };

  // --- RENDERIZAÇÃO ---

  if (loading)
    return (
      <div className="text-center mt-5 p-5">
        <Spinner animation="border" variant="success" />
        <h3 className="mt-3">Carregando biblioteca...</h3>
      </div>
    );

  return (
    <div className="treinos-container py-5">
      <Container>
        {/* Header e Filtros */}
        <div className="mb-5">
          <h1 className="mb-1 fw-bold text-dark">Biblioteca de Treinos</h1>
          <p className="text-muted small mb-4">
            Fichas de treino públicas da comunidade.
          </p>
          
          <SearchBar
            placeholder="Pesquisar treino por nome ou objetivo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onClear={() => setTermoBusca("")}
          />
          
          <FilterGroup
            options={gruposMusculares}
            selected={filtroMusculo}
            onSelect={setFiltroMusculo}
          />
        </div>

        {/* Lista de Treinos (Filtrada Localmente) */}
        {treinosFiltrados.length === 0 ? (
          <div className="alert alert-light text-center p-5 border shadow-sm rounded-3">
            <h5 className="text-muted fs-6">Nenhum treino encontrado nesta página.</h5>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button
                variant="link"
                size="sm"
                onClick={() => setFiltroMusculo("TODOS")}
              >
                Limpar Filtros
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => setTermoBusca("")}
              >
                Limpar Pesquisa
              </Button>
            </div>
          </div>
        ) : (
          <div className="library-grid">
            {treinosFiltrados.map((treino) => (
              <LibraryCard
                key={treino.id}
                treino={treino}
                onVerDetalhes={handleShowDetalhes}
                onCopiar={solicitarCopia}
                disabled={isProcessing}
              />
            ))}
          </div>
        )}

        {/* --- CONTROLES DE PAGINAÇÃO --- */}
        {/* Exibe apenas se houver mais de uma página no total */}
        {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                <Button
                    variant="outline-success"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0 || isProcessing}
                >
                    <i className="fas fa-chevron-left me-2"></i> Anterior
                </Button>
                
                <span className="text-muted fw-bold small">
                    Página {currentPage + 1} de {totalPages}
                </span>
                
                <Button
                    variant="outline-success"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1 || isProcessing}
                >
                    Próxima <i className="fas fa-chevron-right ms-2"></i>
                </Button>
            </div>
        )}

        {/* --- MODAIS --- */}
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
            treinoParaCopiar
              ? `Deseja copiar o treino "${treinoParaCopiar.nome}" para a sua aba 'Meus Treinos'?`
              : ""
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
