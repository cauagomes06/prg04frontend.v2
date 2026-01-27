import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

// Componentes
import { PaginationComponent } from "../components/common/PaginationComponent";
import { CreateExerciseModal } from "../components/exercicios/CreateExerciseModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";
import { SearchBar } from "../components/common/SearchBar";
import { FilterGroup } from "../components/common/FilterGroup";
import { ExerciseTable } from "../components/exercicios/ExerciseTable";

export function Exercicios() {
  const { user } = useContext(AuthContext);

  // Estados de Dados
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE PAGINAÇÃO ---
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0); // Vindo da API
  const itensPorPagina = 6; // Enviado para API

  // Estados de Filtro
  const [filtroMusculo, setFiltroMusculo] = useState("TODOS");
  const [termoBusca, setTermoBusca] = useState("");

  // Estados de Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const gruposMusculares = [
    "TODOS",
    "PEITO",
    "COSTAS",
    "PERNAS",
    "OMBROS",
    "BÍCEPS",
    "TRÍCEPS",
    "ABDÔMEN",
    "GLÚTEOS",
    "PANTURRILHA",
    "FULL BODY",
  ];

  const isPersonalOrAdmin =
    user?.nomePerfil &&
    (user.nomePerfil.toUpperCase().includes("ROLE_ADMIN") ||
      user.nomePerfil.toUpperCase().includes("ROLE_PERSONAL"));

  // =========================================================
  // 1. CARREGAMENTO INTELIGENTE (SERVER-SIDE)
  // =========================================================
  const carregarExercicios = async () => {
    setLoading(true);

    // Constrói a URL base
    let url = `/api/exercicios/buscar?page=${paginaAtual}&size=${itensPorPagina}`;

    if (filtroMusculo && filtroMusculo !== "TODOS") {
      // Se tem grupo muscular, usa o endpoint de grupo
      url += `&grupoMuscular=${filtroMusculo}`;
    } else if (termoBusca) {
      // Se não tem grupo, mas tem busca, usa o endpoint de busca
      url += `&search=${encodeURIComponent(termoBusca)}`;
    }

    try {
      const data = await apiFetch(url);

      // O Backend agora retorna um Page, então pegamos .content
      if (data) {
        setExercicios(data.content || []);
        setTotalPaginas(data.totalPages || 0); // Ajusta a paginação real
      } else {
        setExercicios([]);
        setTotalPaginas(0);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setExercicios([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 2. EFEITOS 
  // =========================================================

  // Dispara quando muda Página ou Filtro de Músculo
  useEffect(() => {
    carregarExercicios();
  }, [paginaAtual, filtroMusculo]);

  // Dispara quando muda a Busca (com Delay/Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Reseta para página 0 sempre que pesquisa algo novo
      setPaginaAtual(0);
      carregarExercicios();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  // Reset de página ao mudar filtro de músculo
  useEffect(() => {
    setPaginaAtual(0);
  }, [filtroMusculo]);

  // =========================================================
  // 3. AÇÕES
  // =========================================================

  const initiateDelete = (id) => {
    setExerciseToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!exerciseToDelete) return;
    try {
      await apiFetch(`/api/exercicios/delete/${exerciseToDelete}`, {
        method: "DELETE",
      });
      setShowDeleteConfirm(false);

      // RECARREGA DO SERVIDOR para garantir que a paginação fique certa
      carregarExercicios();

      setExerciseToDelete(null);
      setShowSuccessModal(true);
    } catch (error) {
      setShowDeleteConfirm(false);
      const msg = error.message?.includes("integridade")
        ? "Não é possível excluir este exercício pois ele faz parte de fichas ativas."
        : error.message || "Erro ao tentar excluir.";

      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  };

  if (!isPersonalOrAdmin) {
    return (
      <div className="p-5 text-center text-muted">
        <h3>Acesso restrito.</h3>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Banco de Exercícios</h2>
          <p className="text-muted mb-0">Gerencie o catálogo de exercícios.</p>
        </div>
        <Button
          variant="success"
          className="px-4 fw-bold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus me-2"></i> Novo Exercício
        </Button>
      </div>

      <SearchBar
        placeholder="Pesquisar por nome..."
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        onClear={() => setTermoBusca("")}
      />

      <div className="mb-4">
        <FilterGroup
          options={gruposMusculares}
          selected={filtroMusculo}
          onSelect={(val) => {
            setFiltroMusculo(val);
            setTermoBusca(""); // Limpa busca texto ao filtrar por grupo (evita conflito)
          }}
        />
      </div>

      <ExerciseTable
        exercicios={exercicios}
        loading={loading}
        onDelete={initiateDelete}
      />

      {/* Paginação usando o total que veio do Back */}
      {totalPaginas > 1 && (
        <PaginationComponent
          currentPage={paginaAtual}
          totalPages={totalPaginas}
          onPageChange={(page) => setPaginaAtual(page)}
        />
      )}

      {/* MODAIS */}
      <CreateExerciseModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          carregarExercicios();
          setShowSuccessModal(true);
        }}
      />

      <ConfirmModal
        show={showDeleteConfirm}
        handleClose={() => setShowDeleteConfirm(false)}
        handleConfirm={confirmDelete}
        title="Excluir Exercício"
        message="Tem certeza que deseja remover este exercício?"
      />

      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        title="Sucesso!"
        message="Operação realizada com sucesso!"
      />
      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        title="Erro"
        message={errorMessage}
      />
    </div>
  );
}
