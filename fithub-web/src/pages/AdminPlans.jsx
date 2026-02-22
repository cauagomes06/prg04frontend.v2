import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { Button, Container, Spinner } from "react-bootstrap";

// COMPONENTES
import { SearchBar } from "../components/common/SearchBar";
import { PlanTable } from "../components/admin/PlanTable";
import { PlanModal } from "../components/planos/PlanModal";

// MODAIS DE FEEDBACK
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

// Estilos customizados
import "../styles/planos.css";

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

  useEffect(() => {
    carregarPlanos();
  }, [searchTerm]);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      const url = `/api/planos/buscar?search=${searchTerm}`;
      const data = await apiFetch(url);

      if (Array.isArray(data)) {
        setPlanos(data);
      } else {
        setPlanos(data?.content || []);
      }
    } catch (error) {
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
      carregarPlanos();
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg(error.message || "Erro ao excluir o plano.");
      setShowError(true);
    }
  };

  return (
    <div className="p-3 p-md-4 min-vh-100">
      <Container fluid className="px-0">
        
        {/* CABEÇALHO ADMINISTRATIVO */}
        <div className="p-3 p-md-4 rounded-4 shadow-sm mb-4 borda-customizada d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 admin-header-card">
          <div className="mb-2 mb-lg-0">
            <h2 className="fw-bold mb-1 text-dark">
              Gerenciamento de Planos
            </h2>
            <p className="text-muted mb-0 small">
              Visualize ou adicione novos planos.
            </p>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-md-start gap-3 w-100 admin-action-container">
            <div className="flex-grow-1 search-wrapper-adjust">
              <SearchBar
                placeholder="Pesquisar planos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            </div>

            <Button
              variant="success"
              className="shadow-sm border-0 d-flex align-items-center justify-content-center px-4 rounded-pill flex-shrink-0 btn-new-plan"
              onClick={() => {
                setPlanToEdit(null);
                setShowPlanModal(true);
              }}
            >
              <i className="fas fa-plus-circle me-2"></i>
              <span className="fw-bold text-nowrap">Novo Plano</span>
            </Button>
          </div>
        </div>

        {/* ÁREA DA TABELA */}
        <div className="rounded-4 shadow-sm overflow-hidden borda-customizada admin-table-wrapper">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" className="loading-spinner-admin" />
              <p className="mt-3 fw-bold text-success">Carregando planos...</p>
            </div>
          ) : (
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
          )}
        </div>
      </Container>

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
        title="Excluir Plano"
        message="Tem certeza que deseja excluir este plano? Atenção: Todos os usuários vinculados a ele perderão seus benefícios e ficarão 'Sem Plano'."
      />

      <SuccessModal
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message="Plano processado com sucesso!"
      />

      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={errorMsg}
      />
    </div>
  );
}