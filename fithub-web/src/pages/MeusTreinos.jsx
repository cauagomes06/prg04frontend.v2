import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { GamificationContext } from "../context/GamificationContext";

import { MyWorkoutCard } from "../components/treinos/MyWorkoutCard";
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { CreateWorkoutModal } from "../components/treinos/CreateWorkoutModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal";
import { WorkoutPlayer } from "../components/treinos/WorkoutPlayer";



import "../styles/treinos.css";

export function MeusTreinos() {
  const { user } = useContext(AuthContext);
  const { ganharConquista } = useContext(GamificationContext);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [treinoEmExecucao, setTreinoEmExecucao] = useState(null);


  const [errorData, setErrorData] = useState({ show: false, message: "" });
  const [successData, setSuccessData] = useState({ show: false, message: "" });
  const [confirmData, setConfirmData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // --- FUNÇÃO PARA MOSTRAR O ERRO VINDO DO FILHO ---
  const handleMostrarErro = (mensagem) => {
    setErrorData({ show: true, message: mensagem });
  };



  const isPersonalOrAdmin =
    user?.nomePerfil &&
    (user.nomePerfil.toUpperCase().includes("ROLE_ADMIN") ||
      user.nomePerfil.toUpperCase().includes("ROLE_PERSONAL"));

  const carregarTreinos = () => {
    if (user?.id) {
      setLoading(true);
      apiFetch(`/api/treinos/usuario/${user.id}`)
        .then((data) => {
          setTreinos(data || []);
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

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const treinosAtuais = treinos.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(treinos.length / itensPorPagina);

  const mudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onVerDetalhes = async (id) => {
    try {
      const detalhes = await apiFetch(`/api/treinos/${id}`);
      setTreinoSelecionado(detalhes);
      setShowDetailModal(true);
    } catch (error) {
      handleMostrarErro("Erro ao carregar detalhes.");
    }
  };

  const onEditar = (treino) => {
    setTreinoSelecionado(treino);
    setShowCreateModal(true);
  };

  const onExcluir = (id) => {
    setConfirmData({
      show: true,
      title: "Excluir Treino",
      message:
        "Tem certeza que deseja apagar este treino? Esta ação é irreversível.",
      onConfirm: () => executarExclusao(id),
    });
  };

  const executarExclusao = async (id) => {
    setConfirmData({ ...confirmData, show: false });
    setIsProcessing(true);
    try {
      await apiFetch(`/api/treinos/delete/${id}`, { method: "DELETE" });
      setSuccessData({ show: true, message: "Treino excluído com sucesso!" });
      carregarTreinos();
    } catch (error) {
      handleMostrarErro("Erro ao excluir: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onPublicar = (id) => {
    setConfirmData({
      show: true,
      title: "Publicar Treino",
      message: "Deseja tornar este treino público para toda a comunidade?",
      onConfirm: () => executarPublicacao(id),
    });
  };

  const executarPublicacao = async (id) => {
    setConfirmData({ ...confirmData, show: false });
    setIsProcessing(true);
    try {
      await apiFetch(`/api/treinos/${id}/publicar`, { method: "PATCH" });
      setSuccessData({ show: true, message: "Treino publicado com sucesso!" });
      carregarTreinos();
    } catch (error) {
      handleMostrarErro("Erro ao publicar.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center mt-5">
        <div className="spinner-border text-success"></div>
      </div>
    );

  return (
    <div className="p-3 p-md-4 container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 mb-md-5 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Meus Treinos</h2>
          <p className="text-muted small mb-0">
            Gerencie suas fichas de treino pessoais.
          </p>
        </div>
        <button
          className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center w-20 w-md-auto"
          onClick={() => {
            setTreinoSelecionado(null);
            setShowCreateModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i> Criar Novo Treino
        </button>
      </div>

      {treinos.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-4 px-3">
          <i className="fas fa-dumbbell fa-3x text-muted mb-3 opacity-25"></i>
          <h5 className="fw-bold text-dark">
            Você ainda não tem treinos criados.
          </h5>
          <button
            className="btn btn-link text-success fw-bold p-0 mt-2 fs-5"
            onClick={() => setShowCreateModal(true)}
          >
            Começar agora
          </button>
        </div>
      ) : (
        <>
          <div className="row g-3 g-md-4">
            {treinosAtuais.map((treino) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={treino.id}
              >
                <MyWorkoutCard
                  treino={treino}
                  isPersonalOrAdmin={isPersonalOrAdmin}
                  onVerDetalhes={onVerDetalhes}
                  onEditar={onEditar}
                  onExcluir={onExcluir}
                  onPublicar={onPublicar}
                  disabled={isProcessing}
                  onTreinoFinalizado={ganharConquista} 
                />
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div
              className="d-flex justify-content-center align-items-center gap-3 mt-5 p-2 px-md-3 bg-white rounded-pill shadow-sm mx-auto"
              style={{ maxWidth: "fit-content" }}
            >
              <button
                className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                <i className="fas fa-chevron-left text-muted"></i>
              </button>
              <span className="fw-bold text-muted small px-2">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                <i className="fas fa-chevron-right text-muted"></i>
              </button>
            </div>
          )}
        </>
      )}

      {treinoEmExecucao && (
        <WorkoutPlayer
          treino={treinoEmExecucao}
          onFechar={() => setTreinoEmExecucao(null)}
          onTreinoFinalizado={ganharConquista} 
        />
      )}

      <WorkoutModal
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        treino={treinoSelecionado}
        readOnly={true}
        onIniciarTreino={(t) => setTreinoEmExecucao(t)}
        onError={handleMostrarErro}
      />

      <CreateWorkoutModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={carregarTreinos}
        treinoParaEditar={treinoSelecionado}
      />
      
      <ConfirmModal
        show={confirmData.show}
        handleClose={() => setConfirmData({ ...confirmData, show: false })}
        handleConfirm={confirmData.onConfirm}
        title={confirmData.title}
        message={confirmData.message}
      />
      
      <SuccessModal
        show={successData.show}
        handleClose={() => setSuccessData({ ...successData, show: false })}
        message={successData.message}
      />

      <ErrorModal
        show={errorData.show}
        handleClose={() => setErrorData({ ...errorData, show: false })}
        message={errorData.message}
      />


    </div>
  );
}