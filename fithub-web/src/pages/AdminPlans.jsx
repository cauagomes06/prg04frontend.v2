import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { Button } from "react-bootstrap";

// COMPONENTES
import { SearchBar } from "../components/common/SearchBar";
import { PlanTable } from "../components/admin/PlanTable";
import { PlanModal } from "../components/planos/PlanModal";

// MODAIS DE FEEDBACK
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export default function AdminPlans() {
  const [planos, setPlanos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ESTADOS DOS MODAIS
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Carrega os dados sempre que a página abrir ou o termo de busca mudar
  useEffect(() => {
    carregarPlanos();
  }, [searchTerm]);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      // Ajustado para o seu endpoint que retorna List<Plano>
      const url = `/api/planos/buscar?search=${searchTerm}`;
      const data = await apiFetch(url);

      console.log("Resposta da API:", data); // Verifique no console se é um Array []

      if (Array.isArray(data)) {
        setPlanos(data);
      } else {
        // Fallback caso o backend mude a estrutura inesperadamente
        setPlanos(data?.content || []);
      }
    } catch (error) {
      // CORREÇÃO: Garante que a mensagem de erro apareça (resolvendo a imagem 3d3286)
      setErrorMsg(error.message || "Não foi possível carregar os planos.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setShowConfirmDelete(false);
    try {
      await apiFetch(`/api/planos/delete/${planToDelete}`, {
        method: "DELETE",
      });
      carregarPlanos(); // Recarrega a lista após apagar
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg(error.message || "Erro ao excluir o plano.");
      setShowError(true);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0">
            <i className="fas fa-tags me-2 text-success"></i> Planos
          </h2>
          <p className="text-muted mb-0">
            Gerencie os planos ativos da academia.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <SearchBar
            placeholder="Buscar planos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="success"
            className="fw-bold"
            onClick={() => {
              setPlanToEdit(null);
              setShowPlanModal(true);
            }}
          >
            <i className="fas fa-plus me-2"></i> Novo
          </Button>
        </div>
      </div>

      {/* TABELA SEM PAGINAÇÃO */}
      <PlanTable
        planos={planos}
        onEdit={(p) => {
          setPlanToEdit(p);
          setShowPlanModal(true);
        }}
        onDelete={(id) => {
          setPlanToDelete(id);
          setShowConfirmDelete(true);
        }}
      />

      {/* MODAIS */}
      <PlanModal
        show={showPlanModal}
        planToEdit={planToEdit}
        handleClose={() => setShowPlanModal(false)}
        onSuccess={carregarPlanos}
      />

      <ConfirmModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={confirmDelete}
      />

      <SuccessModal
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message="Operação concluída com sucesso!"
      />
      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={errorMsg}
      />
    </div>
  );
}
