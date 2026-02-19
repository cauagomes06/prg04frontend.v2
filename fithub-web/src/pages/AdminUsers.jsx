import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../services/api";

// COMPONENTES VISUAIS
import { SearchBar } from "../components/common/SearchBar";
import { UserTable } from "../components/admin/UserTable";
import { EditUserModal } from "../components/admin/EditUserModal";
import { PaginationComponent } from "../components/common/PaginationComponent";
import { FilterGroup } from "../components/common/FilterGroup"; // Import do FilterGroup

// MODAIS DE FEEDBACK
import { ConfirmModal } from "../components/common/ConfirmModal";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  // ESTADO DO FILTRO DE PERFIL
  const [filtroPerfil, setFiltroPerfil] = useState("TODOS");
  const [editingUser, setEditingUser] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // OPÇÕES DE FILTRO
  const opcoesPerfis = ["TODOS", "ROLE_ADMIN", "ROLE_PERSONAL", "ROLE_CLIENTE"];

  // Função de carregamento isolada para ser reutilizada (Agora recebe o perfil)
  const carregarDados = useCallback(
    async (page, search, perfil) => {
      try {
        setLoading(true);
        const querySearch = search
          ? `&search=${encodeURIComponent(search)}`
          : "";
        const queryPerfil =
          perfil && perfil !== "TODOS" ? `&perfil=${perfil}` : "";

        const usersUrl = `/api/usuarios?page=${page}&size=${pageSize}${querySearch}${queryPerfil}`;

        const [pageData, perfisData] = await Promise.all([
          apiFetch(usersUrl),
          apiFetch("/api/perfil"),
        ]);

        if (pageData && pageData.content) {
          setUsuarios(pageData.content);
          setTotalPages(pageData.totalPages);
        } else {
          setUsuarios([]);
          setTotalPages(0);
        }

        if (Array.isArray(perfisData)) setPerfis(perfisData);
      } catch (error) {
        console.error("Erro ao carregar:", error);
        setErrorMsg("Erro ao carregar usuários do servidor.");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  // Efeito com Debounce para busca combinada com filtro
  useEffect(() => {
    const handler = setTimeout(() => {
      carregarDados(currentPage, searchTerm, filtroPerfil);
    }, 400);

    return () => clearTimeout(handler);
  }, [currentPage, searchTerm, filtroPerfil, carregarDados]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const confirmDeleteAction = async () => {
    setShowConfirmDelete(false);
    try {
      await apiFetch(`/api/usuarios/delete/${userToDelete}`, {
        method: "DELETE",
      });
      carregarDados(currentPage, searchTerm, filtroPerfil);
      setSuccessMsg("Usuário removido com sucesso!");
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg(error.message || "Falha ao excluir usuário.");
      setShowError(true);
    }
  };

  const handleSaveEdit = async (novoPerfilId) => {
    if (!novoPerfilId) return;
    try {
      await apiFetch(
        `/api/usuarios/${editingUser.id}/alterar-perfil?novoPerfilId=${novoPerfilId}`,
        { method: "PATCH" },
      );
      carregarDados(currentPage, searchTerm, filtroPerfil);
      setEditingUser(null);
      setSuccessMsg("Perfil atualizado com sucesso!");
      setShowSuccess(true);
    } catch (error) {
      setErrorMsg("Erro ao processar alteração de perfil.");
      setShowError(true);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-3 mb-md-0">
          <i className="fas fa-users-cog me-2 text-success"></i>
          Gerenciar Usuários
        </h2>

        <div className="w-100 w-md-50" style={{ maxWidth: "400px" }}>
          <SearchBar
            placeholder="Buscar por username..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={() => {
              setSearchTerm("");
              setCurrentPage(0);
            }}
          />
        </div>
      </div>

      {/* RENDERIZAÇÃO DO FILTRO GROUP */}
      <div className="mb-4">
        <FilterGroup
          options={opcoesPerfis}
          selected={filtroPerfil}
          onSelect={(val) => {
            setFiltroPerfil(val);
            setCurrentPage(0); // Volta para a pág 0 ao trocar o filtro
          }}
        />
      </div>

      {loading && usuarios.length === 0 ? (
        <div className="text-center p-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          <UserTable
            users={usuarios}
            onEdit={setEditingUser}
            onDelete={(id) => {
              setUserToDelete(id);
              setShowConfirmDelete(true);
            }}
          />

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

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
        title="Excluir Usuário"
        message="Esta ação é irreversível. Deseja continuar?"
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
