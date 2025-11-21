import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

import { CreateExerciseModal } from "../components/exercicios/CreateExerciseModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal"; 
import { SearchBar } from "../components/common/SearchBar";
import { FilterGroup } from "../components/common/FilterGroup";
import { ExerciseTable } from "../components/exercicios/ExerciseTable";

export function Exercicios() {
  const { user } = useContext(AuthContext);

  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
    "GLÚTEOS",
    "PANTURRILHA",
    "FULL BODY",
  ];

  const isPersonalOrAdmin =
    user?.nomePerfil &&
    (user.nomePerfil.toUpperCase().includes("ROLE_ADMIN") ||
      user.nomePerfil.toUpperCase().includes("ROLE_PERSONAL"));

  const carregarExercicios = () => {
    setLoading(true);
    apiFetch("/api/exercicios/buscar")
      .then((data) => {
        setExercicios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarExercicios();
  }, []);

  const exerciciosFiltrados = exercicios.filter((ex) => {
    const termoMusculo = filtroMusculo.toUpperCase();
    const matchMusculo =
      filtroMusculo === "TODOS" ||
      ex.grupoMuscular?.toUpperCase().includes(termoMusculo);
    const textoBusca = termoBusca.toLowerCase();
    const matchBusca =
      ex.nome.toLowerCase().includes(textoBusca) ||
      ex.descricao?.toLowerCase().includes(textoBusca);
    return matchMusculo && matchBusca;
  });

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
      setExercicios(exercicios.filter((ex) => ex.id !== exerciseToDelete));
      setExerciseToDelete(null);
      setShowSuccessModal(true); // Feedback de sucesso
    } catch (error) {
      setShowDeleteConfirm(false);
      if (error.message && error.message.includes("integridade")) {
        setErrorMessage(
          "Não é possível excluir este exercício pois ele faz parte de uma ou mais fichas de treino ativas."
        );
      } else {
        setErrorMessage(error.message || "Ocorreu um erro ao tentar excluir.");
      }
      setShowErrorModal(true);
    }
  };

  if (!isPersonalOrAdmin) {
    return (
      <div className="p-5 text-center text-muted">
        <h3>Acesso restrito a Instrutores.</h3>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Banco de Exercícios</h2>
          <p className="text-muted mb-0">
            Gerencie o catálogo de exercícios da academia.
          </p>
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
        placeholder="Pesquisar por nome ou descrição..."
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        onClear={() => setTermoBusca("")}
      />
      <div className="mb-4">
        <FilterGroup
          options={gruposMusculares}
          selected={filtroMusculo}
          onSelect={setFiltroMusculo}
        />
      </div>

      <ExerciseTable
        exercicios={exerciciosFiltrados}
        loading={loading}
        onDelete={initiateDelete}
      />

      <CreateExerciseModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          carregarExercicios();
          setShowCreateModal(false);
          setShowSuccessModal(true);
        }}
      />
      <ConfirmModal
        show={showDeleteConfirm}
        handleClose={() => setShowDeleteConfirm(false)}
        handleConfirm={confirmDelete}
        title="Excluir Exercício"
        message="Tem certeza que deseja remover este exercício? Esta ação não pode ser desfeita."
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
        title="Operação Negada"
        message={errorMessage}
      />
    </div>
  );
}
