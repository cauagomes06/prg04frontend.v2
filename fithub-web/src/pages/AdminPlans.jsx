import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { Button } from "react-bootstrap"; // Adicionado para o botão

// COMPONENTES
import { SearchBar } from "../components/common/SearchBar";
import { PlanTable } from "../components/admin/PlanTable";
import { PaginationComponent } from "../components/common/PaginationComponent";
import { PlanModal } from "../components/planos/PlanModal"; // Novo Componente

// MODAIS DE FEEDBACK
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export default function AdminPlans() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINAÇÃO E BUSCA
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // ESTADOS DE MODAIS
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    carregarPlanos();
  }, [currentPage, searchTerm]);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      const url = `/api/planos/buscar?page=${currentPage}&size=10&search=${searchTerm}`;
      const data = await apiFetch(url);
      
      if (data?.content) {
        setPlanos(data.content);
        setTotalPages(data.totalPages);
      } else {
        setPlanos(Array.isArray(data) ? data : []);
        setTotalPages(0);
      }
    } catch (error) {
      setErrorMsg("Não foi possível carregar os planos.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (plano) => {
    setPlanToEdit(plano);
    setShowPlanModal(true);
  };

  const handleCreateClick = () => {
    setPlanToEdit(null);
    setShowPlanModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDelete(false);
    try {
      await apiFetch(`/api/planos/delete/${planToDelete}`, { method: "DELETE" });
      setSuccessMsg("Plano excluído com sucesso!");
      setShowSuccess(true);
      carregarPlanos();
    } catch (error) {
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("foreign key") || msg.includes("integridade")) {
        setErrorMsg("Não é possível excluir este plano pois existem usuários vinculados a ele.");
      } else {
        setErrorMsg("Ocorreu um erro ao tentar excluir o plano.");
      }
      setShowError(true);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">
            <i className="fas fa-tags me-2 text-success"></i> Gerenciar Planos
          </h2>
          <p className="text-muted mb-0">Adicione, edite ou remova planos da academia.</p>
        </div>

        <div className="d-flex align-items-center mt-3 mt-md-0">
          <div className="me-3" style={{ width: "300px" }}>
            <SearchBar 
              placeholder="Buscar planos..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              onClear={() => { setSearchTerm(""); setCurrentPage(0); }}
            />
          </div>
          <Button variant="success" className="fw-bold" onClick={handleCreateClick}>
            <i className="fas fa-plus me-2"></i> Novo Plano
          </Button>
        </div>
      </div>

      <PlanTable 
        planos={planos} 
        onEdit={handleEditClick} 
        onDelete={(id) => { setPlanToDelete(id); setShowConfirmDelete(true); }} 
      />

      <PaginationComponent 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <PlanModal 
        show={showPlanModal}
        planToEdit={planToEdit}
        handleClose={() => setShowPlanModal(false)}
        onSuccess={() => {
          carregarPlanos();
          setSuccessMsg(planToEdit ? "Plano atualizado!" : "Plano cadastrado!");
          setShowSuccess(true);
        }}
      />

      <ConfirmModal 
        show={showConfirmDelete} 
        handleClose={() => setShowConfirmDelete(false)} 
        handleConfirm={confirmDelete}
        title="Excluir Plano"
        message="Tem certeza que deseja remover este plano permanentemente?"
      />

      <SuccessModal show={showSuccess} handleClose={() => setShowSuccess(false)} message={successMsg} />
      <ErrorModal show={showError} handleClose={() => setShowError(false)} message={errorMsg} />
    </div>
  );
}