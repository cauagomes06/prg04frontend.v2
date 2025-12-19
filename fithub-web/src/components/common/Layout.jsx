import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import "../../styles/portal.css";

export function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN");

  const [userData, setUserData] = useState({
    nome: "Carregando...",
    plano: "...",
    foto: null,
  });
  const [userRank, setUserRank] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    // 1. Carregar dados básicos do utilizador
    apiFetch("/api/usuarios/me")
      .then((data) => {
        const primeiroNome =
          data.pessoa?.nomeCompleto?.split(" ")[0] || "Utilizador";
        setImgError(false);
        setUserData({
          id: data.id,
          nome: primeiroNome,
          plano: data.nomePlano || "Sem Plano",
          foto: data.fotoUrl,
        });

        // 2. Tenta carregar o ranking (falha silenciosamente se for cliente sem acesso)
        apiFetch("/api/usuarios/ranking")
          .then((ranking) => {
            const posicao = ranking.findIndex(
              (r) => r.usuarioId === data.id || r.id === data.id
            );
            if (posicao !== -1) setUserRank(posicao + 1);
          })
          .catch((err) =>
            console.warn("Aviso: Usuário não tem acesso ao ranking.")
          );
      })
      .catch((err) => console.error("Erro ao carregar dados do usuário:", err));

    // 3. Tenta carregar notificações (falha silenciosamente se não tiver permissão)
    apiFetch("/api/notificacoes/contagem-nao-lidas")
      .then((data) => {
        if (data && typeof data.contagem === "number") {
          setNotifCount(data.contagem);
        }
      })
      .catch((err) =>
        console.warn("Aviso: Usuário não tem acesso às notificações.")
      );
  }, []);

  return (
    <div className="portal-container">
      <header className="mobile-header">
        <button
          className="btn-hamburger"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <h5 className="mb-0 fw-bold text-success">FitHub</h5>
        <Link to="/portal/notificacoes" className="text-dark position-relative">
          <i className="far fa-bell fa-lg"></i>
          {notifCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          )}
        </Link>
      </header>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`portal-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button
          className="btn-close-sidebar"
          onClick={() => setIsSidebarOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="perfil-usuario">
          {userData.foto && !imgError ? (
            <img
              src={`http://localhost:8080${userData.foto}`}
              alt="User"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="bg-white rounded-circle border border-3 border-success d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "100px", height: "100px" }}
            >
              <i className="fas fa-user fa-2x text-secondary"></i>
            </div>
          )}
          <h3 id="sidebar-nome">Olá, {userData.nome}!</h3>
          <p className="text-muted mb-2">{userData.plano}</p>
          {userRank && (
            <div className="badge bg-warning text-dark p-2 px-3 rounded-pill shadow-sm mt-1">
              <i className="fas fa-trophy me-2"></i>
              <strong>{userRank}º Lugar</strong>
            </div>
          )}
        </div>

        <nav className="portal-menu mt-4">
          <ul>
            {isAdmin && (
              <>
                <li>
                  <Link to="/portal/admin/dashboard">
                    <i className="fas fa-chart-line"></i> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/portal/admin">
                    <i className="fas fa-users-cog"></i> Gerenciar Usuários
                  </Link>
                </li>
                <li>
                  <Link to="/portal/admin/planos">
                    <i className="fas fa-tags"></i> Gerenciar Planos
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/portal/notificacoes"
                className="d-flex justify-content-between align-items-center pe-3"
              >
                <span>
                  <i className="fas fa-bullhorn"></i> Notificações
                </span>
                {notifCount > 0 && (
                  <span className="badge bg-danger rounded-pill">
                    {notifCount}
                  </span>
                )}
              </Link>
            </li>

            <li>
              <Link to="/portal/perfil">
                <i className="fas fa-user-circle"></i> Meu Perfil
              </Link>
            </li>
            <li>
              <Link to="/portal/treinos">
                <i className="fas fa-dumbbell"></i> Meus Treinos
              </Link>
            </li>
            <li>
              <Link to="/portal/biblioteca">
                <i className="fas fa-book-open"></i> Biblioteca
              </Link>
            </li>
            <li>
              <Link to="/portal/aulas">
                <i className="fas fa-calendar-alt"></i> Aulas de Grupo
              </Link>
            </li>
            <li>
              <Link to="/portal/competicoes">
                <i className="fas fa-trophy"></i> Competições
              </Link>
            </li>

            {user?.nomePerfil &&
              (user.nomePerfil.includes("ROLE_ADMIN") ||
                user.nomePerfil.includes("ROLE_PERSONAL")) && (
                <li>
                  <Link to="/portal/exercicios">
                    <i className="fas fa-bolt"></i> Banco de Exercícios
                  </Link>
                </li>
              )}

            <li className="menu-divider"></li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Sair
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="portal-conteudo">
        <Outlet />
      </main>
    </div>
  );
}
