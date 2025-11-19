import { useState, useEffect, useContext } from "react"; 
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { WorkoutModal } from "../components/WorkoutModal";
import { CreateWorkoutModal } from "../components/CreateWorkoutModal";
import { SuccessModal } from "../components/SuccessModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { Card, Button } from "react-bootstrap";

export function MeusTreinos() {
  const { user } = useContext(AuthContext);

  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos modais
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Para modais de confirmação
  const [confirmData, setConfirmData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null
  });

  // Para Success Modal
  const [successData, setSuccessData] = useState({
    show: false,
    message: ""
  });

  const [treinoSelecionado, setTreinoSelecionado] = useState(null);

  const isPersonalOrAdmin = user?.nomePerfil && (
    user.nomePerfil.toUpperCase().includes("ROLE_ADMIN") || 
    user.nomePerfil.toUpperCase().includes("ROLE_PERSONAL")
  );

  const carregarTreinos = () => {
    if (user?.id) {
      apiFetch(`/api/treinos/usuario/${user.id}`)
        .then((data) => {
          setTreinos(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar treinos:", err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    carregarTreinos();
  }, [user]);

  // ============================
  // VER DETALHES
  // ============================
  const handleVerDetalhes = async (id) => {
    try {
      const detalhes = await apiFetch(`/api/treinos/${id}`);
      setTreinoSelecionado(detalhes);
      setShowDetailModal(true);
    } catch (error) {
      setSuccessData({
        show: true,
        title:"Erro",
        message: "Erro ao carregar detalhes do treino."
      });
    }
  };

  // ============================
  // CONFIRMAR EXCLUSÃO
  // ============================
  const abrirConfirmExcluir = (id) => {
    setConfirmData({
      show: true,
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este treino?",
      onConfirm: () => executarExclusao(id)
    });
  };

  const executarExclusao = async (id) => {
    setConfirmData({ ...confirmData, show: false });

    try {
      await apiFetch(`/api/treinos/delete/${id}`, { method: "DELETE" });
      setTreinos(treinos.filter(t => t.id !== id));

      setSuccessData({
        show: true,
        title:"Sucesso",
        message: "Treino excluído com sucesso!"
      });
    } catch (error) {
      setSuccessData({
        show: true,
        title:"Erro",
        message: "Erro ao excluir treino: " + error.message
      });
    }
  };

  // ============================
  // CONFIRMAR PUBLICAÇÃO
  // ============================
  const abrirConfirmPublicar = (id) => {
    setConfirmData({
      show: true,
      title: "Publicar treino",
      message: "Deseja publicar este treino na Biblioteca Global?",
      onConfirm: () => executarPublicacao(id)
    });
  };

  const executarPublicacao = async (id) => {
    setConfirmData({ ...confirmData, show: false });

    try {
      await apiFetch(`/api/treinos/${id}/publicar`, { method: "PATCH" });

      setSuccessData({
        show: true,
        title:"Sucesso!",
        message: "Treino publicado com sucesso!"
      });

      carregarTreinos();
    } catch (error) {
      setSuccessData({
        show: true,
        title:"Erro",
        message: "Erro ao publicar treino: " + error.message
      });
    }
  };

  if (loading) return <div className="p-4">Carregando seus treinos...</div>;

  return (
    <div className="p-4">

      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meus Treinos</h2>

        <button 
          className="btn btn-success" 
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> Criar Novo Treino
        </button>
      </div>

      {/* Caso vazio */}
      {treinos.length === 0 ? (
        <p>Você ainda não tem treinos atribuídos.</p>
      ) : (
        <div className="row g-3">
          {treinos.map((treino) => (
            <div className="col-12 col-md-6 col-lg-4" key={treino.id}>
              
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden card-hover">
                <div className="d-flex align-items-center justify-content-center card-top-bg">
                  <i className="fas fa-dumbbell fa-3x icon-dumbbell"></i>
                </div>

                <Card.Body className="d-flex flex-column p-3">

                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title className="fw-bold text-truncate mb-1">
                      {treino.nome}
                    </Card.Title>

                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => abrirConfirmExcluir(treino.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  <Card.Subtitle className="text-muted mb-2 small">
                    <i className="fas fa-user-circle me-1"></i>
                    Criado por:{" "}
                    <strong className="text-success">
                      {treino.criadorNome || "Sistema"}
                    </strong>
                  </Card.Subtitle>

                  <span
                    className={`badge mb-3 ${
                      treino.status === "PUBLICO" ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {treino.status === "PUBLICO" ? "Público" : "Privado"}
                  </span>

                  {isPersonalOrAdmin && treino.status === "PRIVADO" && (
                    <Button
                      variant="outline-success"
                      className="w-100 mb-2 fw-bold"
                      size="sm"
                      onClick={() => abrirConfirmPublicar(treino.id)}
                    >
                      <i className="fas fa-globe me-1"></i>
                      Publicar na Biblioteca
                    </Button>
                  )}

                  <Button
                    variant="success"
                    className="w-100 fw-bold mt-auto"
                    size="sm"
                    onClick={() => handleVerDetalhes(treino.id)}
                  >
                    <i className="fas fa-eye me-2"></i>
                    Ver Ficha
                  </Button>

                </Card.Body>
              </Card>

            </div>
          ))}
        </div>
      )}

      {/* Modais */}
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

      <ConfirmModal
        show={confirmData.show}
        title={confirmData.title}
        message={confirmData.message}
        handleClose={() => setConfirmData({ ...confirmData, show: false })}
        handleConfirm={confirmData.onConfirm}
      />

      <SuccessModal
        show={successData.show}
        message={successData.message}
        handleClose={() => setSuccessData({ ...successData, show: false })}
      />

    </div>
  );
}
