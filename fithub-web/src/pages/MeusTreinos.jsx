import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { CreateWorkoutModal } from "../components/treinos/CreateWorkoutModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
// Importamos o componente granular
import { MyWorkoutCard } from "../components/treinos/MyWorkoutCard";

export function MeusTreinos() {
  const { user } = useContext(AuthContext);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (Manter estados dos modais e lógica de isPersonalOrAdmin igual)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);

  const [confirmData, setConfirmData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [successData, setSuccessData] = useState({ show: false, message: "" });

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

  // ... (Manter as funções handleVerDetalhes, executarExclusao, executarPublicacao iguais)
  // Apenas wrappers simples para passar ao card:

  const onVerDetalhes = async (id) => {
    try {
      const detalhes = await apiFetch(`/api/treinos/${id}`);
      setTreinoSelecionado(detalhes);
      setShowDetailModal(true);
    } catch (e) {
      /* ... */
    }
  };

  const onExcluir = (id) => {
    setConfirmData({
      show: true,
      title: "Excluir",
      message: "Tem a certeza?",
      onConfirm: () => {
        /* Lógica de exclusão aqui */
      },
    });
  };

  const onPublicar = (id) => {
    setConfirmData({
      show: true,
      title: "Publicar",
      message: "Publicar na biblioteca global?",
      onConfirm: () => {
        /* Lógica de publicação aqui */
      },
    });
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meus Treinos</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> Criar Novo Treino
        </button>
      </div>

      {treinos.length === 0 ? (
        <p>Você ainda não tem treinos atribuídos.</p>
      ) : (
        <div className="row g-3">
          {treinos.map((treino) => (
            <div className="col-12 col-md-6 col-lg-4" key={treino.id}>
              {/* AQUI ESTÁ A MUDANÇA: Usamos o componente granular */}
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

      {/* Modais permanecem aqui ... */}
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
      {/* ... Confirm e Success Modals */}
    </div>
  );
}
