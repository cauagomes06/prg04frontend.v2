import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import { apiFetch } from "../services/api";
import { paymentService } from "../services/PaymentService";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ErrorModal } from "../components/common/ErrorModal"; 
import "../styles/perfil.css";

// Componentes Granulares (Mantenha os imports)
import { ProfileHeader } from "../components/perfil/ProfileHeader";
import { ProfileStats } from "../components/perfil/ProfileStats";
import { EditDataModal } from "../components/perfil/EditDataModal";
import { ConfigModal } from "../components/perfil/ConfigModal";

export function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams(); 

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

  // --- NOVO: Verificar retorno do Mercado Pago ---
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "sucesso") {
      setSuccessMsg("Pagamento confirmado! O seu plano foi ativado.");
      setShowSuccess(true);
      // Remove o parametro da URL para ficar limpo
      setSearchParams({});
    } else if (status === "falha") {
      setErrorMsg("O pagamento falhou ou foi cancelado.");
      setShowError(true);
      setSearchParams({});
    }
    carregarPerfil();
  }, [searchParams]);

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

  // 3. Confirmar mudança de plano -> Gera Pagamento
  const executarMudancaPlano = async () => {
    try {
      // Fecha os modais para não ficarem abertos quando o usuário voltar
      setShowConfirm(false);
      setShowConfig(false);
      
      // Chama o backend para gerar o link do novo plano
      const checkoutResponse = await paymentService.criarCheckout(
        perfil.id, 
        pendingPlanId
      );

      // Redireciona para o Mercado Pago
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

  if (loading) return <div className="text-center mt-5">Carregando perfil...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 fw-bold text-dark">Meu Perfil</h1>

      <ProfileHeader
        perfil={perfil}
        onEditData={() => setShowEditData(true)}
        onOpenConfig={() => setShowConfig(true)}
      />

      <ProfileStats
        scoreTotal={perfil?.scoreTotal}
        dataCriacao={perfil?.dataCriacao}
      />

      {/* --- MODAIS --- */}
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
      
      {/* Se tiver o componente ErrorModal */}
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