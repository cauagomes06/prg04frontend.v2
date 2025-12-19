import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

// COMPONENTES VISUAIS
import { SearchBar } from "../components/common/SearchBar";
import { UserTable } from "../components/admin/UserTable";
import { EditUserModal } from "../components/admin/EditUserModal";
import { PaginationComponent } from "../components/common/PaginationComponent"; // IMPORTADO AQUI

// MODAIS DE FEEDBACK
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export default function AdminUsers() {
  // --- ESTADOS DE DADOS ---
  const [usuarios, setUsuarios] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS PARA PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // --- ESTADOS DE INTERFACE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // --- ESTADOS DE MODAIS ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // 1. CARREGAR DADOS AO INICIAR OU MUDAR PÁGINA/BUSCA
  useEffect(() => {
    carregarDados(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Resetar para a página 0 quando o usuário digitar na busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const carregarDados = async (page = 0, search = "") => {
    try {
      setLoading(true);
      const usersUrl = `/api/usuarios?page=${page}&size=${pageSize}&search=${search}`;

      const [pageData, perfisData] = await Promise.all([
        apiFetch(usersUrl),
        apiFetch("/api/perfil"),
      ]);

      if (pageData && Array.isArray(pageData.content)) {
        setUsuarios(pageData.content);
        setTotalPages(pageData.totalPages);
      } else {
        setUsuarios([]);
        setTotalPages(0);
      }

      if (Array.isArray(perfisData)) setPerfis(perfisData);
    } catch (error) {
      setErrorMsg("Erro ao carregar usuários.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // 2. DELETAR USUÁRIO
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
      // Recarregar a página atual para atualizar a lista do banco
      carregarDados(currentPage, searchTerm);
      setSuccessMsg("Usuário excluído com sucesso!");
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg("Não foi possível excluir o usuário.");
      setShowError(true);
    }
  };

  // 3. EDITAR PERFIL
  const handleSaveEdit = async (novoPerfilId) => {
    if (!novoPerfilId) {
      setErrorMsg("Por favor, selecione um perfil válido.");
      setShowError(true);
      return;
    }

    try {
      await apiFetch(
        `/api/usuarios/${editingUser.id}/alterar-perfil?novoPerfilId=${novoPerfilId}`,
        { method: "PATCH" }
      );

      carregarDados(currentPage, searchTerm); // Atualiza dados do servidor
      setEditingUser(null);
      setSuccessMsg("Perfil do usuário atualizado!");
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg("Erro ao atualizar o perfil.");
      setShowError(true);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-3 mb-md-0">
          <i className="fas fa-users-cog me-2 text-success"></i>
          Gerenciar Usuários
        </h2>

        <div className="w-100 w-md-50" style={{ maxWidth: "400px" }}>
          <SearchBar
            placeholder="Buscar por nome ou perfil..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={() => {
              setSearchTerm("");
              setCurrentPage(0);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Tabela */}
          <UserTable
            users={usuarios}
            onEdit={setEditingUser}
            onDelete={handleDeleteClick}
          />

          {/* COMPONENTE DE PAGINAÇÃO */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {/* Modal de Edição */}
      <EditUserModal
        show={!!editingUser}
        user={editingUser}
        perfisDisponiveis={perfis}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEdit}
      />

      {/* Modais de Feedback */}
      <ConfirmModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={confirmDeleteAction}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
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
