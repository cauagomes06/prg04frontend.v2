import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import { ThemeToggle } from "./ThemeToggle";
import "../../styles/portal.css";

// 1. IMPORTAR O TOAST E O SOM (Ajuste o caminho se necessário)
import { TrophyToast } from "./TrophyToast";
import trophySound from "../../sounds/trophy.mp3";

export function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = user?.nomePerfil?.includes("ROLE_ADMIN");

  const [userData, setUserData] = useState({
    nome: "Carregando...",
    plano: "...",
    foto: null,
  });
  const [userRank, setUserRank] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ==========================================
  // ESTADOS E FUNÇÃO GLOBAL PARA O TROFÉU
  // ==========================================
  const [showTrophy, setShowTrophy] = useState(false);
  const [conquista, setConquista] = useState(null);

  const handleGanhouTrofeu = useCallback((novaConquista) => {
    setConquista(novaConquista);
    setShowTrophy(true);
    try {
      const audio = new Audio(trophySound);
      audio.volume = 0.5;
      audio.play();
    } catch (error) {
      console.error("Erro ao reproduzir som da conquista:", error);
    }
  }, []);
  // ==========================================

  // Fecha a sidebar ao mudar de rota
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  // Função centralizada para carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    try {
      const data = await apiFetch("/api/usuarios/me");
      const primeiroNome = data.pessoa?.nomeCompleto?.split(" ")[0] || "Utilizador";

      setUserData({
        id: data.id,
        nome: primeiroNome,
        plano: data.nomePlano || "Sem Plano",
        foto: data.fotoUrl,
      });

      Promise.allSettled([
        apiFetch("/api/usuarios/ranking?page=0&size=50").then((dataRanking) => {
          const listaRanking = dataRanking.content || [];
          const posicao = listaRanking.findIndex(r => r.usuarioId === data.id || r.id === data.id);
          if (posicao !== -1) setUserRank(posicao + 1);
        }),
        apiFetch("/api/notificacoes/contagem-nao-lidas").then((dataNotif) => {
          if (dataNotif && typeof dataNotif.contagem === "number") {
            setNotifCount(dataNotif.contagem);
          }
        })
      ]);

    } catch (err) {
      console.error("Erro crítico ao carregar dados do Layout:", err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <div className="portal-container">
      {/* HEADER MOBILE */}
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
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">Novos alertas</span>
            </span>
          )}
        </Link>
      </header>

      {/* OVERLAY */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* SIDEBAR (Mantida igual ao seu original) */}
      <aside className={`portal-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="d-flex align-items-center justify-content-between">
          <ThemeToggle />
          <button
            className="btn-close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="perfil-usuario">
          {userData.foto && !imgError ? (
            <img
              src={userData.foto}
              alt="Avatar do usuário"
              onError={() => setImgError(true)}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle border border-3 border-success d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "var(--card-bg)",
              }}
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
                <MenuLink to="/portal/dashboard" icon="fas fa-chart-line" label="Dashboard" />
                <MenuLink to="/portal/admin" icon="fas fa-users-cog" label="Gerenciar Usuários" />
                <MenuLink to="/portal/admin/planos" icon="fas fa-tags" label="Gerenciar Planos" />
              </>
            )}

            <li>
              <Link to="/portal/notificacoes" className="d-flex justify-content-between align-items-center pe-3">
                <span><i className="fas fa-bullhorn"></i> Notificações</span>
                {notifCount > 0 && (
                  <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.75rem" }}>
                    {notifCount}
                  </span>
                )}
              </Link>
            </li>

            <MenuLink to="/portal/perfil" icon="fas fa-user-circle" label="Meu Perfil" />
            <MenuLink to="/portal/treinos" icon="fas fa-dumbbell" label="Meus Treinos" />
            <MenuLink to="/portal/biblioteca" icon="fas fa-book-open" label="Biblioteca" />
            <MenuLink to="/portal/aulas" icon="fas fa-calendar-alt" label="Aulas de Grupo" />
            <MenuLink to="/portal/competicoes" icon="fas fa-trophy" label="Competições" />

            {user?.nomePerfil && (user.nomePerfil.includes("ROLE_ADMIN") || user.nomePerfil.includes("ROLE_PERSONAL")) && (
              <MenuLink to="/portal/exercicios" icon="fas fa-bolt" label="Banco de Exercícios" />
            )}

            <li className="menu-divider"></li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                <i className="fas fa-sign-out-alt"></i> Sair
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="portal-conteudo">
        {/* 2. PASSAR A FUNÇÃO COMO CONTEXTO PARA TODAS AS PÁGINAS FILHAS */}
        <Outlet context={{ handleGanhouTrofeu }} />
      </main>

      {/* 3. O COMPONENTE RENDERIZADO GLOBALMENTE */}
      <TrophyToast 
        show={showTrophy} 
        onClose={() => setShowTrophy(false)} 
        conquista={conquista} 
      />
    </div>
  );
}

function MenuLink({ to, icon, label }) {
  return (
    <li>
      <Link to={to}>
        <i className={icon}></i> {label}
      </Link>
    </li>
  );
}