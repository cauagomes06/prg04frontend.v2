import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { Button, Modal } from "react-bootstrap"; // Removemos Table, Badge, Card, etc.
import { AuthContext } from "../context/AuthContext";

// Componentes
import { CreateExerciseModal } from "../components/exercicios/CreateExerciseModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { SearchBar } from "../components/common/SearchBar";
import { FilterGroup } from "../components/common/FilterGroup";
import { ExerciseTable } from "../components/exercicios/ExerciseTable";

export function Exercicios() {
  const { user } = useContext(AuthContext);

  // --- ESTADOS ---
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Auxiliares
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Filtros
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

  // --- CARREGAMENTO ---
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

  // --- LÓGICA DE FILTRAGEM ---
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

  // --- AÇÕES ---
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
      {/* Cabeçalho */}
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

      {/* Busca Granularizada */}
      <SearchBar
        placeholder="Pesquisar por nome ou descrição..."
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        onClear={() => setTermoBusca("")}
      />

      {/* Filtros Granularizados */}
      <div className="mb-4">
        <FilterGroup
          options={gruposMusculares}
          selected={filtroMusculo}
          onSelect={setFiltroMusculo}
        />
      </div>

      {/* Tabela Granularizada */}
      <ExerciseTable
        exercicios={exerciciosFiltrados}
        loading={loading}
        onDelete={initiateDelete}
      />

      {/* --- MODAIS --- */}

      <CreateExerciseModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          carregarExercicios();
          setShowCreateModal(false);
          setShowSuccessModal(true);
        }}
      />

      {/* Modal de Confirmação Genérico (Substitui o manual) */}
      <ConfirmModal
        show={showDeleteConfirm}
        handleClose={() => setShowDeleteConfirm(false)}
        handleConfirm={confirmDelete}
        title="Excluir Exercício"
        message="Tem certeza que deseja remover este exercício? Esta ação não pode ser desfeita."
      />

      {/* Modal de Sucesso Genérico */}
      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        title="Sucesso!"
        message="Exercício cadastrado/removido com sucesso!"
      />

      {/* Modal de Erro (Este mantemos "manual" pois tem lógica específica de ícone/cor, 
          mas poderia ser um 'AlertModal' genérico no futuro) */}
      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="fas fa-times-circle me-2"></i> Operação Negada
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3 text-danger">
            <i className="fas fa-link fa-3x"></i>
          </div>
          <h5 className="fw-bold">Não é possível excluir!</h5>
          <p className="mt-2 text-secondary">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0">
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
