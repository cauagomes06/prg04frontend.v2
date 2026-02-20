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
  const [totalPaginas, setTotalPaginas] = useState(0);
  const itensPorPagina = 6;

  // Estados de Filtro
  const [filtroMusculo, setFiltroMusculo] = useState("TODOS");
  const [termoBusca, setTermoBusca] = useState("");

  // Estados de Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // --- ESTADO PARA EDIÇÃO ---
  const [exerciseToEdit, setExerciseToEdit] = useState(null);

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
  // 1. CARREGAMENTO DE DADOS
  // =========================================================
  const carregarExercicios = async () => {
    setLoading(true);
    let url = `/api/exercicios/buscar?page=${paginaAtual}&size=${itensPorPagina}`;

    if (filtroMusculo && filtroMusculo !== "TODOS") {
      url += `&grupoMuscular=${filtroMusculo}`;
    } else if (termoBusca) {
      url += `&search=${encodeURIComponent(termoBusca)}`;
    }

    try {
      const data = await apiFetch(url);
      if (data) {
        setExercicios(data.content || []);
        setTotalPaginas(data.totalPages || 0);
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

  useEffect(() => {
    carregarExercicios();
  }, [paginaAtual, filtroMusculo]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPaginaAtual(0);
      carregarExercicios();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  useEffect(() => {
    setPaginaAtual(0);
  }, [filtroMusculo]);

  // =========================================================
  // 3. AÇÕES E CONTROLE DE MODAIS
  // =========================================================

  const handleEdit = (exercicio) => {
    setExerciseToEdit(exercicio);
    setShowCreateModal(true);
  };

  const fecharModalCadastro = () => {
    setShowCreateModal(false);
    // Timeout evita o "piscar" visual dos dados resetando antes do modal sumir
    setTimeout(() => {
      setExerciseToEdit(null);
    }, 300);
  };

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
    <div
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "var(--bg-light)" }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-0">Banco de Exercícios</h2>
          <p className="text-muted mb-0">
            Gerencie o catálogo oficial do sistema.
          </p>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-bold shadow-sm rounded-pill"
          onClick={() => {
            setExerciseToEdit(null);
            setShowCreateModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i> Novo Exercício
        </Button>
      </div>

      {/* SearchBar e Filtros já integrados com as refatorações anteriores */}
      <div className="mb-4">
        <SearchBar
          placeholder="Pesquisar por nome..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onClear={() => setTermoBusca("")}
        />
        <FilterGroup
          options={gruposMusculares}
          selected={filtroMusculo}
          onSelect={(val) => {
            setFiltroMusculo(val);
            setTermoBusca("");
          }}
        />
      </div>

      <ExerciseTable
        exercicios={exercicios}
        loading={loading}
        onDelete={initiateDelete}
        onEdit={handleEdit}
      />

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
        handleClose={fecharModalCadastro}
        onSuccess={() => {
          carregarExercicios();
          setShowSuccessModal(true);
        }}
        exerciseToEdit={exerciseToEdit}
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
