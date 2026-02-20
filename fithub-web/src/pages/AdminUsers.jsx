import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../services/api";
import { Container, Spinner } from "react-bootstrap";

// COMPONENTES VISUAIS
import { SearchBar } from "../components/common/SearchBar";
import { UserTable } from "../components/admin/UserTable";
import { EditUserModal } from "../components/admin/EditUserModal";
import { PaginationComponent } from "../components/common/PaginationComponent";
import { FilterGroup } from "../components/common/FilterGroup";

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
  const [filtroPerfil, setFiltroPerfil] = useState("TODOS");
  const [editingUser, setEditingUser] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const opcoesPerfis = ["TODOS", "ROLE_ADMIN", "ROLE_PERSONAL", "ROLE_CLIENTE"];

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
    <div
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "var(--bg-light)" }}
    >
      <Container fluid className="px-0">
        {/* CABEÇALHO RESPONSIVO */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              <i className="fas fa-users-cog me-2 text-success"></i>
              Gerenciar Usuários
            </h2>
            <p className="text-muted small mb-0">
              Controle de acessos e permissões da plataforma.
            </p>
          </div>

          <div
            className="flex-grow-1"
            style={{ maxWidth: "500px", marginBottom: "-1.5rem" }}
          >
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

        {/* GRUPO DE FILTROS */}
        <div className="mb-4">
          <FilterGroup
            options={opcoesPerfis}
            selected={filtroPerfil}
            onSelect={(val) => {
              setFiltroPerfil(val);
              setCurrentPage(0);
            }}
          />
        </div>

        {/* ÁREA DA TABELA COM FEEDBACK DE CARREGAMENTO */}
        <div
          className="rounded-4 shadow-sm overflow-hidden borda-customizada"
          style={{ backgroundColor: "var(--card-bg)", minHeight: "400px" }}
        >
          {loading ? (
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ height: "400px" }}
            >
              <Spinner
                animation="border"
                variant="success"
                style={{ width: "3rem", height: "3rem" }}
              />
              <p className="mt-3 fw-bold text-success">
                Sincronizando usuários...
              </p>
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

              {/* PAGINAÇÃO PADRONIZADA */}
              <div className="pb-4">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </Container>

      {/* MODAIS */}
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
        message="Esta ação é irreversível e removerá todos os dados vinculados a este usuário. Deseja continuar?"
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
