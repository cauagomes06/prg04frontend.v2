import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

// COMPONENTES
import { SearchBar } from "../components/common/SearchBar";
import { UserTable } from "../components/admin/UserTable";
import { EditUserModal } from "../components/admin/EditUserModal";
import { PaginationComponent } from "../components/common/PaginationComponent";

// MODAIS DE FEEDBACK
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    carregarDados(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const carregarDados = async (page = 0, search = "") => {
    try {
      setLoading(true);
      const usersUrl = `/api/usuarios?page=${page}&size=${pageSize}&search=${search}`;
      const [pageData, perfisData] = await Promise.all([
        apiFetch(usersUrl),
        apiFetch("/api/perfil"),
      ]);

      if (pageData?.content) {
        setUsuarios(pageData.content);
        setTotalPages(pageData.totalPages);
      } else {
        setUsuarios([]);
        setTotalPages(0);
      }
      if (Array.isArray(perfisData)) setPerfis(perfisData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDeleteAction = async () => {
    setShowConfirmDelete(false);
    try {
      await apiFetch(`/api/usuarios/delete/${userToDelete}`, {
        method: "DELETE",
      });
      carregarDados(currentPage, searchTerm);
      setSuccessMsg("Usuário excluído!");
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg("Erro ao excluir usuário.");
      setShowError(true);
    }
  };

  const handleSaveEdit = async (novoPerfilId) => {
    try {
      await apiFetch(
        `/api/usuarios/${editingUser.id}/alterar-perfil?novoPerfilId=${novoPerfilId}`,
        { method: "PATCH" }
      );
      carregarDados(currentPage, searchTerm);
      setEditingUser(null);
      setSuccessMsg("Perfil atualizado!");
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg("Erro ao atualizar perfil.");
      setShowError(true);
    }
  };

  if (loading && usuarios.length === 0)
    return (
      <div className="text-center p-5 mt-5">
        <div className="spinner-border text-success"></div>
      </div>
    );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-3 mb-md-0">
          <i className="fas fa-users-cog me-2 text-success"></i> Usuários
        </h2>
        <div className="w-100 w-md-50" style={{ maxWidth: "400px" }}>
          <SearchBar
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            onClear={() => {
              setSearchTerm("");
              setCurrentPage(0);
            }}
          />
        </div>
      </div>

      <UserTable
        users={usuarios}
        onEdit={setEditingUser}
        onDelete={handleDeleteClick}
      />

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EditUserModal
        show={!!editingUser}
        user={editingUser}
        perfisDisponiveis={perfis}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEdit}
      />
      <ConfirmModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={confirmDeleteAction}
        title="Excluir"
        message="Deseja excluir permanentemente?"
      />
      <SuccessModal
        show={showSuccess}
        handleClose={() => setShowSuccess(false)}
        message={successMsg}
      />
      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={errorMsg}
      />
    </div>
  );
}
