import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { MyWorkoutCard } from "../components/treinos/MyWorkoutCard";

// Modais
import { WorkoutModal } from "../components/treinos/WorkoutModal";
import { CreateWorkoutModal } from "../components/treinos/CreateWorkoutModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal";

export function MeusTreinos() {
  const { user } = useContext(AuthContext);
  const [treinos, setTreinos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- CONFIGURAÇÃO DA PAGINAÇÃO ---
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8; // Ajustado para 8 conforme seu comentário original

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

  // Lógica de Paginação Frontend
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const treinosAtuais = treinos.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(treinos.length / itensPorPagina);

  const mudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- HANDLERS ---

  const onVerDetalhes = async (id) => {
    try {
      const detalhes = await apiFetch(`/api/treinos/${id}`);
      setTreinoSelecionado(detalhes);
      setShowDetailModal(true);
    } catch (error) {
      setErrorData({ show: true, message: "Erro ao carregar detalhes." });
    }
  };

  // NOVO HANDLER: EDITAR
  const onEditar = (treino) => {
    setTreinoSelecionado(treino);
    setShowCreateModal(true); // Abre o CreateWorkoutModal que deve tratar edição se receber um treino
  };

  const onExcluir = (id) => {
    setConfirmData({
      show: true,
      title: "Excluir Treino",
      message: "Tem certeza que deseja apagar este treino? Esta ação é irreversível.",
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
      setErrorData({ show: true, message: "Erro ao excluir: " + error.message });
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
      setErrorData({ show: true, message: "Erro ao publicar." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-success"></div>
      </div>
    );

  return (
    <div className="p-4 container">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-0">Meus Treinos</h2>
          <p className="text-muted small mb-0">Gerencie suas fichas de treino pessoais.</p>
        </div>
        <button
          className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center"
          onClick={() => {
            setTreinoSelecionado(null); // Reseta para garantir que é uma criação
            setShowCreateModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i> Criar Novo Treino
        </button>
      </div>

      {/* Lista de Cards */}
      {treinos.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
          <i className="fas fa-dumbbell fa-3x text-muted mb-3 opacity-25"></i>
          <p className="text-muted">Você ainda não tem treinos criados.</p>
          <button className="btn btn-link text-success fw-bold" onClick={() => setShowCreateModal(true)}>
            Começar agora
          </button>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {treinosAtuais.map((treino) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={treino.id}>
                <MyWorkoutCard
                  treino={treino}
                  isPersonalOrAdmin={isPersonalOrAdmin}
                  onVerDetalhes={onVerDetalhes}
                  onEditar={onEditar} // Propriedade adicionada
                  onExcluir={onExcluir}
                  onPublicar={onPublicar}
                  disabled={isProcessing}
                />
              </div>
            ))}
          </div>

          {/* CONTROLES DE PAGINAÇÃO */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5 p-3 bg-white rounded-pill shadow-sm mx-auto" style={{ maxWidth: "fit-content" }}>
              <button
                className="btn btn-light rounded-circle shadow-sm border"
                style={{ width: "40px", height: "40px" }}
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                <i className="fas fa-chevron-left text-muted"></i>
              </button>
              <span className="fw-bold text-muted small">Página {paginaAtual} de {totalPaginas}</span>
              <button
                className="btn btn-light rounded-circle shadow-sm border"
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

      {/* --- MODAIS --- */}
      <WorkoutModal
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        treino={treinoSelecionado}
        readOnly={true}
      />
      <CreateWorkoutModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={carregarTreinos}
        treinoParaEditar={treinoSelecionado} // Passa o treino selecionado para edição
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