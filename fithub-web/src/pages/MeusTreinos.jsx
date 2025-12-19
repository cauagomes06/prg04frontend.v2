import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { CreateWorkoutModal } from "../components/treinos/CreateWorkoutModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal"; // Importante
import { MyWorkoutCard } from "../components/treinos/MyWorkoutCard";

export function MeusTreinos() {
  const { user } = useContext(AuthContext);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);

  // Estados de Feedback
  const [errorData, setErrorData] = useState({ show: false, message: "" });
  const [successData, setSuccessData] = useState({ show: false, message: "" });
  const [confirmData, setConfirmData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const isPersonalOrAdmin =
    user?.nomePerfil &&
    (user.nomePerfil.toUpperCase().includes("ROLE_ADMIN") ||
      user.nomePerfil.toUpperCase().includes("ROLE_PERSONAL"));

  const carregarTreinos = () => {
    if (user?.id) {
      apiFetch(`/api/treinos/usuario/${user.id}`)
        .then((data) => {
          setTreinos(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    carregarTreinos();
  }, [user]);

  // --- HANDLERS ---

  const onVerDetalhes = async (id) => {
    try {
      const detalhes = await apiFetch(`/api/treinos/${id}`);
      setTreinoSelecionado(detalhes);
      setShowDetailModal(true);
    } catch (error) {
      setErrorData({
        show: true,
        message: "Erro ao carregar detalhes: " + error.message,
      });
    }
  };

  // Inicia o fluxo de exclusão (Abre ConfirmModal)
  const onExcluir = (id) => {
    setConfirmData({
      show: true,
      title: "Excluir Treino",
      message:
        "Tem a certeza que deseja apagar este treino? Esta ação é irreversível.",
      onConfirm: () => executarExclusao(id),
    });
  };

  // Executa a exclusão após confirmação
  const executarExclusao = async (id) => {
    setConfirmData({ ...confirmData, show: false }); // Fecha confirmação
    try {
      await apiFetch(`/api/treinos/delete/${id}`, { method: "DELETE" });
      setSuccessData({ show: true, message: "Treino excluído com sucesso!" });
      carregarTreinos();
    } catch (error) {
      setErrorData({
        show: true,
        message: "Erro ao excluir: " + error.message,
      });
    }
  };

  // Inicia o fluxo de publicação (Abre ConfirmModal)
  const onPublicar = (id) => {
    setConfirmData({
      show: true,
      title: "Publicar Treino",
      message: "Deseja tornar este treino público para toda a comunidade?",
      onConfirm: () => executarPublicacao(id),
    });
  };

  // Executa a publicação após confirmação
  const executarPublicacao = async (id) => {
    setConfirmData({ ...confirmData, show: false });
    try {
      await apiFetch(`/api/treinos/${id}/publicar`, { method: "PATCH" }); // Ajuste conforme sua rota real
      setSuccessData({ show: true, message: "Treino publicado com sucesso!" });
      carregarTreinos();
    } catch (error) {
      setErrorData({
        show: true,
        message: "Erro ao publicar: " + error.message,
      });
    }
  };

  if (loading)
    return <div className="p-4 text-center">Carregando treinos...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Meus Treinos</h2>
        <button
          className="btn btn-success rounded-pill px-4 fw-bold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus me-2"></i> Criar Novo Treino
        </button>
      </div>

      {treinos.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
          <i className="fas fa-dumbbell fa-3x text-muted mb-3 opacity-25"></i>
          <p className="text-muted">Você ainda não tem treinos criados.</p>
        </div>
      ) : (
        <div className="row g-4">
          {treinos.map((treino) => (
            <div className="col-12 col-md-6 col-lg-4" key={treino.id}>
              <MyWorkoutCard
                treino={treino}
                isPersonalOrAdmin={isPersonalOrAdmin}
                onVerDetalhes={onVerDetalhes}
                onExcluir={onExcluir}
                onPublicar={onPublicar}
              />
            </div>
          ))}
        </div>
      )}

      {/* --- MODAIS --- */}

      <WorkoutModal
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        treino={treinoSelecionado}
      />

      <CreateWorkoutModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={carregarTreinos}
      />

      {/* Modal de Confirmação (Genérico) */}
      <ConfirmModal
        show={confirmData.show}
        handleClose={() => setConfirmData({ ...confirmData, show: false })}
        handleConfirm={confirmData.onConfirm}
        title={confirmData.title}
        message={confirmData.message}
      />

      {/* Modal de Sucesso */}
      <SuccessModal
        show={successData.show}
        handleClose={() => setSuccessData({ ...successData, show: false })}
        message={successData.message}
      />

      {/* Modal de Erro (Adicionado Corretamente) */}
      <ErrorModal
        show={errorData.show}
        handleClose={() => setErrorData({ ...errorData, show: false })}
        message={errorData.message}
      />
    </div>
  );
}
