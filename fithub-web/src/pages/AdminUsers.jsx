import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

// COMPONENTES VISUAIS (Granularizados)
import { SearchBar } from "../components/common/SearchBar";
import { UserTable } from "../components/admin/UserTable";
import { EditUserModal } from "../components/admin/EditUserModal";

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
  const [currentPage, setCurrentPage] = useState(0); // Página atual (0-indexado)
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [pageSize, setPageSize] = useState(10); // Tamanho da página (se for ajustável)

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

  // 1. CARREGAR DADOS AO INICIAR
  useEffect(() => {
    carregarDados(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const carregarDados = async (page = 0, search = "") => {
    try {
        setLoading(true);

        // ⚠️ PASSO CRÍTICO: Atualizar a URL da API para incluir parâmetros de paginação e busca
        const usersUrl = `/api/usuarios?page=${page}&size=${pageSize}&search=${search}`;
        
        // Busca usuários (com paginação) e perfis (sem paginação, assumindo que são poucos)
        const [pageData, perfisData] = await Promise.all([
            apiFetch(usersUrl),
            apiFetch('/api/perfil')
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
    setShowConfirmDelete(false); // Fecha pergunta
    try {
      await apiFetch(`/api/usuarios/delete/${userToDelete}`, {
        method: "DELETE",
      });

      // Remove da lista visualmente
      setUsuarios(usuarios.filter((user) => user.id !== userToDelete));

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
        {
          method: "PATCH",
        }
      );

      // Descobre o nome do perfil baseado no ID selecionado (para atualizar a tabela)
      const perfilEncontrado = perfis.find(
        (p) => p.id === Number(novoPerfilId)
      );
      const nomePerfilAtualizado = perfilEncontrado
        ? perfilEncontrado.nome
        : "ROLE_USER";

      // Atualiza a lista localmente
      setUsuarios(
        usuarios.map((u) =>
          u.id === editingUser.id
            ? { ...u, nomePerfil: nomePerfilAtualizado }
            : u
        )
      );

      setEditingUser(null); // Fecha modal
      setSuccessMsg("Perfil do usuário atualizado!");
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("Erro ao atualizar o perfil.");
      setShowError(true);
    }
  };

  // 4. FILTRAGEM DA LISTA (Busca)
  const filteredUsers = usuarios.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nomePerfil?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. RENDERIZAÇÃO
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );

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
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>
      </div>

      {/* Tabela (Componente Separado) */}
      <UserTable
        users={filteredUsers}
        onEdit={setEditingUser}
        onDelete={handleDeleteClick}
      />

      {/* Modal de Edição (Componente Separado) */}
      {/* Passamos a lista de perfis do banco para ele montar o select */}
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
        message="Tem certeza que deseja excluir este usuário permanentemente? Esta ação não pode ser desfeita."
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
