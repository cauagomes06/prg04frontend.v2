import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

// COMPONENTES
import { CreateExerciseModal } from "../components/exercicios/CreateExerciseModal";
import { ExerciseTable } from "../components/exercicios/ExerciseTable";
import { PaginationComponent } from "../components/common/PaginationComponent";
import { SearchBar } from "../components/common/SearchBar";
import { FilterGroup } from "../components/common/FilterGroup";

// MODAIS
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export function Exercicios() {
  const { user } = useContext(AuthContext);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroMusculo, setFiltroMusculo] = useState("TODOS");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const gruposMusculares = [
    "TODOS",
    "PEITO",
    "COSTAS",
    "PERNAS",
    "OMBROS",
    "BRAÇOS",
    "ABDÔMEN",
    "GLÚTEOS",
    "PANTURRILHA",
    "FULL BODY",
  ];

  const carregarExercicios = async () => {
    try {
      setLoading(true);
      const musculoParam =
        filtroMusculo !== "TODOS" ? `&grupoMuscular=${filtroMusculo}` : "";
      const data = await apiFetch(
        `/api/exercicios/buscar?page=${currentPage}&size=${pageSize}&search=${searchTerm}${musculoParam}`
      );

      if (data?.content) {
        setExercicios(data.content);
        setTotalPages(data.totalPages);
      } else {
        setExercicios(Array.isArray(data) ? data : []);
        setTotalPages(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarExercicios();
  }, [currentPage, searchTerm, filtroMusculo]);

  const confirmDelete = async () => {
    try {
      await apiFetch(`/api/exercicios/delete/${exerciseToDelete}`, {
        method: "DELETE",
      });
      setShowDeleteConfirm(false);
      carregarExercicios();
      setShowSuccess(true);
    } catch (error) {
      setShowDeleteConfirm(false);
      setErrorMessage("Erro ao excluir exercício.");
      setShowError(true);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Banco de Exercícios</h2>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          Novo Exercício
        </Button>
      </div>

      <SearchBar
        placeholder="Pesquisar..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(0);
        }}
        onClear={() => {
          setSearchTerm("");
          setCurrentPage(0);
        }}
      />

      <div className="mb-4">
        <FilterGroup
          options={gruposMusculares}
          selected={filtroMusculo}
          onSelect={(val) => {
            setFiltroMusculo(val);
            setCurrentPage(0);
          }}
        />
      </div>

      <ExerciseTable
        exercicios={exercicios}
        loading={loading}
        onDelete={(id) => {
          setExerciseToDelete(id);
          setShowDeleteConfirm(true);
        }}
      />

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <CreateExerciseModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => carregarExercicios()}
      />
      <ConfirmModal
        show={showDeleteConfirm}
        handleClose={() => setShowDeleteConfirm(false)}
        handleConfirm={confirmDelete}
        title="Excluir"
        message="Remover este exercício?"
      />
      <SuccessModal
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message="Sucesso!"
      />
      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={errorMessage}
      />
    </div>
  );
}
