import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { SuccessModal } from "../components/common/SuccessModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import "../styles/perfil.css";

// Componentes Granulares
import { ProfileHeader } from "../components/perfil/ProfileHeader";
import { ProfileStats } from "../components/perfil/ProfileStats";
import { EditDataModal } from "../components/perfil/EditDataModal";
import { ConfigModal } from "../components/perfil/ConfigModal";

export function Perfil() {
  // Estados
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modais
  const [showConfig, setShowConfig] = useState(false);
  const [showEditData, setShowEditData] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auxiliares
  const [pendingPlanId, setPendingPlanId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // --- CARREGAR DADOS ---
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

  useEffect(() => {
    carregarPerfil();
  }, []);

  // --- AÇÕES ---

  // 1. Sucesso na edição de dados pessoais
  const handleEditSuccess = () => {
    setSuccessMsg("Dados pessoais atualizados com sucesso!");
    setShowSuccess(true);
    carregarPerfil();
  };

  // 2. Solicitar mudança de plano (Vem do ConfigModal)
  const handlePlanChangeRequest = (novoId) => {
    if (novoId == perfil.planoId) {
      alert("Você já possui este plano.");
      return;
    }
    setPendingPlanId(novoId);
    setShowConfirm(true); // Abre confirmação
  };

  // 3. Confirmar mudança de plano (Chamada API)
  const executarMudancaPlano = async () => {
    try {
      await apiFetch(`/api/planos/mudar/${perfil.id}`, {
        method: "PATCH",
        body: JSON.stringify({ novoPlanoId: pendingPlanId }),
      });

      setShowConfirm(false);
      setShowConfig(false); // Fecha modal de configuração
      setSuccessMsg("Plano alterado com sucesso!");
      setShowSuccess(true);
      carregarPerfil();
    } catch (error) {
      alert("Erro ao mudar plano: " + error.message);
    }
  };

  if (loading)
    return <div className="text-center mt-5">Carregando perfil...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 fw-bold text-dark">Meu Perfil</h1>

      {/* Header (Avatar, Nome, Ações) */}
      <ProfileHeader
        perfil={perfil}
        onEditData={() => setShowEditData(true)}
        onOpenConfig={() => setShowConfig(true)}
      />

      {/* Estatísticas */}
      <ProfileStats
        scoreTotal={perfil?.scoreTotal}
        dataCriacao={perfil?.dataCriacao}
      />

      {/* --- MODAIS --- */}

      {/* 1. Editar Dados Pessoais */}
      <EditDataModal
        show={showEditData}
        handleClose={() => setShowEditData(false)}
        perfil={perfil}
        onSuccess={handleEditSuccess}
      />

      {/* 2. Configurações (Senha/Plano) */}
      <ConfigModal
        show={showConfig}
        handleClose={() => setShowConfig(false)}
        userId={perfil?.id}
        currentPlanId={perfil?.planoId}
        onPlanChangeRequest={handlePlanChangeRequest}
      />

      {/* 3. Confirmação Genérica (usada para plano) */}
      <ConfirmModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={executarMudancaPlano}
        message="Tem a certeza que deseja mudar para este novo plano?"
      />

      {/* 4. Sucesso Genérico */}
      <SuccessModal
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message={successMsg}
      />
    </div>
  );
}
