import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Container, Spinner, Button } from "react-bootstrap"; // Container adicionado aqui
import { AuthContext } from "../context/AuthContext";
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { LibraryCard } from "../components/treinos/LibraryCard";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";

// Componentes Granulares (Certifique-se que criou estes arquivos)
import { SearchBar } from "../components/common/SearchBar";
import { FilterGroup } from "../components/common/FilterGroup";

import "../styles/treinos.css";

export function Biblioteca() {
  const { user } = useContext(AuthContext);

  // --- ESTADOS ---
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modais
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [treinoParaCopiar, setTreinoParaCopiar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtros e Busca (Estes eram os que estavam faltando)
  const [filtroMusculo, setFiltroMusculo] = useState("TODOS");
  const [termoBusca, setTermoBusca] = useState("");

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

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    setLoading(true);
    apiFetch("/api/treinos")
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        // Filtra apenas treinos com status PUBLICO
        const publicos = lista.filter(
          (t) => t.status === "PUBLICO" || t.publico === true
        );
        setTreinos(publicos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar biblioteca:", err);
        setLoading(false);
      });
  }, []);

  // --- LÓGICA DE FILTRAGEM ---
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

  // --- HANDLERS ---
  const handleShowDetalhes = async (id) => {
    try {
      const treinoDetalhado = await apiFetch(`/api/treinos/${id}`);
      setSelectedTreino(treinoDetalhado);
      setShowDetailModal(true);
    } catch (error) {
      alert("Erro ao carregar detalhes.");
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
      alert("Erro ao copiar treino: " + error.message);
    } finally {
      setIsProcessing(false);
      setTreinoParaCopiar(null);
    }
  };

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
        {/* Cabeçalho com Componentes Granulares */}
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

        {/* Grid de Resultados */}
        {treinosFiltrados.length === 0 ? (
          <div className="alert alert-light text-center p-5 border shadow-sm rounded-3">
            <h5 className="text-muted fs-6">Nenhum treino encontrado.</h5>
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
      </Container>
    </div>
  );
}
