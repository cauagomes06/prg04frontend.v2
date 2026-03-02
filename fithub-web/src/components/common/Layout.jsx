import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import { ThemeToggle } from "./ThemeToggle";
import { Button, Spinner, Row, Col } from "react-bootstrap"; // Adicionei os componentes do Bootstrap
import "../../styles/portal.css";

export function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = user?.nomePerfil?.includes("ROLE_ADMIN");

  const [userData, setUserData] = useState({
    nome: "Carregando...",
    plano: "...",
    statusPlano: "ATIVO", // Começamos assumindo ativo para não piscar o bloqueio
    foto: null,
  });
  
  const [userRank, setUserRank] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estados para a lista de planos (usados apenas se o plano expirar)
  const [planosDisponiveis, setPlanosDisponiveis] = useState([]);
  const [isRenovando, setIsRenovando] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const loadInitialData = useCallback(async () => {
    try {
      const data = await apiFetch("/api/usuarios/me");
      const primeiroNome = data.pessoa?.nomeCompleto?.split(" ")[0] || "Utilizador";

      setUserData({
        id: data.id,
        nome: primeiroNome,
        plano: data.nomePlano || "Sem Plano",
        statusPlano: data.statusPlano || "INATIVO", // Aqui recebemos o status do backend
        foto: data.fotoUrl,
      });

      // Só carrega o restante se o plano estiver OK ou for Admin
      if (data.statusPlano === "ATIVO" || isAdmin) {
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
      } else {
        // Se estiver inativo, já buscamos os planos para renovação
        const planos = await apiFetch("/api/planos/buscar");
        if (Array.isArray(planos)) setPlanosDisponiveis(planos);
      }

    } catch (err) {
      console.error("Erro crítico ao carregar dados do Layout:", err);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleRenovarPlano = async (planoId) => {
    setIsRenovando(true);
    try {
      await apiFetch("/api/usuarios/alterar-plano", {
        method: "PATCH",
        body: JSON.stringify({ planoId })
      });
      // Sucesso! Recarregamos os dados para liberar o portal
      await loadInitialData();
    } catch (error) {
      alert("Erro ao processar renovação. Tente novamente.");
    } finally {
      setIsRenovando(false);
    }
  };

  // --- TELA DE BLOQUEIO (Renderizada condicionalmente) ---
  if (userData.statusPlano !== "ATIVO" && !isAdmin) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-3" style={{ backgroundColor: "var(--bg-light)" }}>
        <div className="text-center p-5 rounded-4 shadow-lg border" style={{ backgroundColor: "var(--card-bg)", maxWidth: "900px" }}>
          <i className="fas fa-lock fa-4x text-danger mb-4"></i>
          <h2 className="fw-bold text-dark mb-3">Acesso Suspenso</h2>
          <p className="text-muted mb-5 fs-5">
            Seu plano expirou. Escolha uma das opções abaixo para reativar seu acesso instantaneamente.
          </p>

          <Row className="g-4 mb-5">
            {planosDisponiveis.map((p) => (
              <Col md={4} key={p.idPlano}>
                <div className="p-4 rounded-4 border h-100 d-flex flex-column shadow-sm" style={{ backgroundColor: "var(--bg-light)" }}>
                  <h5 className="fw-bold text-dark">{p.nomePlano}</h5>
                  <h3 className="text-success fw-bold my-3">R$ {p.preco}</h3>
                  <Button 
                    variant="success" 
                    className="mt-auto rounded-pill fw-bold"
                    onClick={() => handleRenovarPlano(p.idPlano)}
                    disabled={isRenovando}
                  >
                    {isRenovando ? <Spinner size="sm" /> : "Ativar Agora"}
                  </Button>
                </div>
              </Col>
            ))}
          </Row>

          <Button variant="link" className="text-muted fw-bold text-decoration-none" onClick={logout}>
            <i className="fas fa-sign-out-alt me-2"></i> Sair da Conta
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO NORMAL (SIDEBAR + CONTEÚDO) ---
  return (
    <div className="portal-container">
      {/* HEADER MOBILE */}
      <header className="mobile-header">
        <button className="btn-hamburger" onClick={() => setIsSidebarOpen(true)} aria-label="Abrir menu">
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

      <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>

      <aside className={`portal-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="d-flex align-items-center justify-content-between">
          <ThemeToggle />
          <button className="btn-close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="perfil-usuario">
          {userData.foto && !imgError ? (
            <img src={userData.foto} alt="Avatar" onError={() => setImgError(true)} style={{ objectFit: 'cover' }} />
          ) : (
            <div className="rounded-circle border border-3 border-success d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "100px", height: "100px", backgroundColor: "var(--card-bg)" }}>
              <i className="fas fa-user fa-2x text-secondary"></i>
            </div>
          )}
          <h3 id="sidebar-nome">Olá, {userData.nome}!</h3>
          <p className="text-muted mb-2">{userData.plano}</p>
          {userRank && (
            <div className="badge bg-warning text-dark p-2 px-3 rounded-pill shadow-sm mt-1">
              <i className="fas fa-trophy me-2"></i><strong>{userRank}º Lugar</strong>
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
                {notifCount > 0 && <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.75rem" }}>{notifCount}</span>}
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
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}><i className="fas fa-sign-out-alt"></i> Sair</a>
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

function MenuLink({ to, icon, label }) {
  return (
    <li>
      <Link to={to}><i className={icon}></i> {label}</Link>
    </li>
  );
}