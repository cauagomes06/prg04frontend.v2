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

// Estilos customizados (pode colocar no seu arquivo CSS global ou criar um AdminPlans.css)
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

  // Carrega os dados sempre que a página abrir ou o termo de busca mudar
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
    <div className="admin-plans-wrapper p-4 min-vh-100 bg-light">
      <Container fluid>
        <div className="admin-plans-header bg-white p-4 rounded-4 shadow-sm position-relative mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="fw-bold mb-0 text-dark">
                Gerenciamento de Planos
              </h2>
              <p className="text-muted mb-0 small">
                Visualize ou adicione novos planos.
              </p>
            </div>

            <div className="search-wrapper">
              <SearchBar
                placeholder="Pesquisar planos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="success"
            className="btn-add-plano-fixed shadow-sm border-0"
            onClick={() => {
              setPlanToEdit(null);
              setShowPlanModal(true);
            }}
          >
            <i className="fas fa-plus-circle me-2"></i>
            <span>Novo Plano</span>
          </Button>
        </div>

        {/* ÁREA DA TABELA */}
        <div className="bg-white rounded-4 shadow-sm overflow-hidden border-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Carregando planos...</p>
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
