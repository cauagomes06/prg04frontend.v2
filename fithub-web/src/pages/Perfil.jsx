import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { execucaoApi } from "../services/api";
import { paymentService } from "../services/PaymentService";
import { Spinner, Badge, Tabs, Tab } from "react-bootstrap";

import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal";
import { XPProgressBar } from "../components/perfil/XpProgressBar";
import { PaginationComponent } from "../components/common/PaginationComponent";

import "../styles/perfil.css";
import "../styles/Historico.css";

// Componentes Granulares
import { ProfileHeader } from "../components/perfil/ProfileHeader";
import { ProfileStats } from "../components/perfil/ProfileStats";
import { EditDataModal } from "../components/perfil/EditDataModal";
import { ConfigModal } from "../components/perfil/ConfigModal";
import { GaleriaConquistas } from "../components/perfil/GaleriaConquistas"; // <-- Importado o novo componente

export function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // --- ESTADOS DO HISTÓRICO (FEED) ---
  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Modais
  const [showConfig, setShowConfig] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Auxiliares
  const [pendingPlanId, setPendingPlanId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // --- CARREGAMENTO DO PERFIL ---
  const carregarPerfil = async () => {
    try {
      const data = await apiFetch("/api/usuarios/me");
      setPerfil(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setLoading(false);
    }
  };

  // --- CARREGAMENTO DO HISTÓRICO ---
  const carregarHistorico = async () => {
    setLoadingHistorico(true);
    try {
      const data = await execucaoApi.getHistorico(currentPage, pageSize);
      if (data && data.content) {
        setHistorico(data.content);
        setTotalPages(data.totalPages);
      } else {
        setHistorico([]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Não foi possível carregar seu histórico de treinos.");
      setShowError(true);
    } finally {
      setLoadingHistorico(false);
    }
  };

  // Verificar retorno do Mercado Pago e carregar perfil
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "sucesso") {
      setSuccessMsg("Pagamento confirmado! O seu plano foi ativado.");
      setShowSuccess(true);
      setSearchParams({});
    } else if (status === "falha") {
      setErrorMsg("O pagamento falhou ou foi cancelado.");
      setShowError(true);
      setSearchParams({});
    }
    carregarPerfil();
  }, [searchParams]);

  // Disparar a busca do histórico sempre que a página mudar
  useEffect(() => {
    carregarHistorico();
  }, [currentPage]);

  // --- AÇÕES ---
  const handleEditSuccess = () => {
    setSuccessMsg("Dados pessoais atualizados com sucesso!");
    setShowSuccess(true);
    carregarPerfil();
  };

  const handlePlanChangeRequest = (novoId) => {
    if (String(novoId) === String(perfil.planoId)) {
      alert("Você já possui este plano.");
      return;
    }
    setPendingPlanId(novoId);
    setShowConfirm(true);
  };

  const executarMudancaPlano = async () => {
    try {
      setShowConfirm(false);
      setShowConfig(false);
      const checkoutResponse = await paymentService.criarCheckout(
        perfil.id,
        pendingPlanId,
      );

      if (checkoutResponse && checkoutResponse.initPoint) {
        window.location.href = checkoutResponse.initPoint;
      } else {
        alert("Erro: O servidor não retornou o link de pagamento.");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Não foi possível iniciar o pagamento: " + error.message);
    }
  };

  // --- FUNÇÕES AUXILIARES PRO FEED ---
  const calcularDuracao = (inicio, fim) => {
    if (!inicio || !fim) return "0";
    const diffMs = new Date(fim) - new Date(inicio);
    return Math.round(diffMs / 60000);
  };

  const getDia = (dataString) =>
    new Date(dataString).getDate().toString().padStart(2, "0");
  const getMes = (dataString) =>
    new Date(dataString).toLocaleString("pt-BR", { month: "short" });

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );

  return (
    <div className="p-4 historico-container" style={{ minHeight: "100vh" }}>
      <h1 className="mb-4 fw-bold text-dark">Meu Perfil</h1>

      <ProfileHeader
        perfil={perfil}
        onEditData={() => setShowEditData(true)}
        onOpenConfig={() => setShowConfig(true)}
      />

      <div className="my-4">
        <XPProgressBar />
      </div>
      <ProfileStats
        scoreTotal={perfil?.scoreTotal}
        dataCriacao={perfil?.dataCriacao}
      />

      {/* --- INÍCIO DA ESTRUTURA DE ABAS (TABS) --- */}
      <div className="mt-5">
        <Tabs
          defaultActiveKey="historico"
          id="perfil-tabs"
          className="mb-4 custom-tabs"
        >
          {/* ABA 1: HISTÓRICO (O código do seu Feed entrou aqui) */}
          <Tab
            eventKey="historico"
            title={
              <span>
                <i className="fas fa-chart-line text-success me-2"></i>{" "}
                Atividades Recentes
              </span>
            }
          >
            {loadingHistorico ? (
              <div className="text-center py-5">
                <Spinner animation="grow" variant="success" />
              </div>
            ) : historico.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4 mt-3">
                <i className="fas fa-clipboard-list fa-3x text-muted mb-3 opacity-25"></i>
                <h5 className="fw-bold text-dark">
                  Nenhum treino concluído ainda
                </h5>
                <p className="text-muted mb-0">
                  Seus treinos finalizados aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="mt-3">
                <div className="historico-list d-flex flex-column gap-3 mb-4">
                  {historico?.map((exec) => (
                    <div
                      key={exec.id}
                      className="historico-card p-3 shadow-sm d-flex flex-column flex-md-row align-items-md-center gap-3 gap-md-4 bg-white"
                    >
                      {/* Bloco de Data (Verde) */}
                      <div className="historico-date-box d-flex flex-row flex-md-column justify-content-center align-items-center flex-shrink-0">
                        <span className="historico-day me-2 me-md-0">
                          {getDia(exec.dataInicio)}
                        </span>
                        <span className="historico-month">
                          {getMes(exec.dataInicio)}
                        </span>
                      </div>

                      {/* Informações Principais do Treino */}
                      <div className="flex-grow-1">
                        <h5 className="fw-bolder text-dark mb-1">
                          {exec.nomeTreino || "Treino Realizado"}
                        </h5>
                        <div className="d-flex flex-wrap gap-3 text-muted small fw-bold">
                          <span>
                            <i className="far fa-clock me-1"></i>{" "}
                            {calcularDuracao(exec.dataInicio, exec.dataFim)} min
                          </span>
                          <span>
                            <i className="fas fa-dumbbell me-1"></i>{" "}
                            {exec.itens?.length || 0} exercícios
                          </span>
                        </div>
                      </div>

                      {/* Pontos da Sessão */}
                      <div className="historico-pontos d-flex align-items-center gap-2 mt-2 mt-md-0 align-self-start align-self-md-center flex-shrink-0 shadow-sm">
                        <i className="fas fa-star text-warning"></i>+
                        {exec.pontosGanhos || 0} PTS
                      </div>
                    </div>
                  ))}
                </div>

                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                  loading={loadingHistorico}
                />
              </div>
            )}
          </Tab>

          {/* ABA 2: GALERIA DE TROFÉUS */}
          <Tab
            eventKey="conquistas"
            title={
              <span>
                <i className="fas fa-medal me-2 text-warning"></i> Galeria de
                Troféus
              </span>
            }
          >
            {/* Renderiza a galeria passando o ID do usuário que já foi carregado no topo */}
            <div className="mt-3">
              {perfil && <GaleriaConquistas usuarioId={perfil.id} />}
            </div>
          </Tab>
        </Tabs>
      </div>
      {/* --- FIM DA ESTRUTURA DE ABAS --- */}

      {/* --- MODAIS MANTIDOS INTACTOS --- */}
      <EditDataModal
        show={showEditData}
        handleClose={() => setShowEditData(false)}
        perfil={perfil}
        onSuccess={handleEditSuccess}
      />

      <ConfigModal
        show={showConfig}
        handleClose={() => setShowConfig(false)}
        userId={perfil?.id}
        currentPlanId={perfil?.planoId}
        onPlanChangeRequest={handlePlanChangeRequest}
      />

      <ConfirmModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={executarMudancaPlano}
        title="Ir para Pagamento"
        message="Você será redirecionado para o Mercado Pago para concluir a assinatura. Deseja continuar?"
      />

      <SuccessModal
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message={successMsg}
      />

      {ErrorModal && (
        <ErrorModal
          show={showError}
          handleClose={() => setShowError(false)}
          message={errorMsg}
        />
      )}
    </div>
  );
}
