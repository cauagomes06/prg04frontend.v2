import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import "../../styles/portal.css";

export function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  
  const isAdmin = user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN");
  
  // Estados de Dados
  const [userData, setUserData] = useState({ 
    nome: "Carregando...", 
    plano: "...", 
    foto: null 
  });
  const [userRank, setUserRank] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  // Estado do Menu Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Fecha a sidebar sempre que mudar de rota (clicar num link)
  useEffect(() => {
      setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    // 1. Carregar dados
    apiFetch("/api/usuarios/me")
      .then(data => {
        const primeiroNome = data.pessoa?.nomeCompleto?.split(" ")[0] || "Utilizador";
        setUserData({
          id: data.id,
          nome: primeiroNome,
          plano: data.nomePlano || "Sem Plano",
          foto: null 
        });

        return apiFetch("/api/usuarios/ranking").then(ranking => {
           const posicao = ranking.findIndex(r => r.usuarioId === data.id || r.id === data.id);
           if (posicao !== -1) setUserRank(posicao + 1);
        });
      })
      .catch(err => console.error("Erro ao carregar dados:", err));

    // 2. Notificações
    apiFetch("/api/notificacoes/contagem-nao-lidas")
      .then(data => {
        if (data && typeof data.contagem === 'number') {
          setNotifCount(data.contagem);
        }
      })
      .catch(err => console.error("Erro ao carregar notificações:", err));

  }, []);

  return (
    <div className="portal-container">
      
      {/* HEADER MOBILE (Só aparece em telas pequenas via CSS) */}
      <header className="mobile-header">
          <button 
            className="btn-hamburger" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menu"
          >
              <i className="fas fa-bars"></i>
          </button>
          <h5 className="mb-0 fw-bold text-success">FitHub</h5>
          
          {/* Atalho de Notificação no Header Mobile */}
          <Link to="/portal/notificacoes" className="text-dark position-relative">
             <i className="far fa-bell fa-lg"></i>
             {notifCount > 0 && (
                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">Novos alertas</span>
                 </span>
             )}
          </Link>
      </header>

      {/* OVERLAY (Fundo escuro) */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside className={`portal-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        {/* Botão de Fechar (Só mobile) */}
        <button className="btn-close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
        </button>

        <div className="perfil-usuario">
            {userData.foto ? (
                <img src={userData.foto} alt="User" />
            ) : (
                <div className="bg-white rounded-circle border border-3 border-success d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: "80px", height: "80px"}}>
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
                <li>
                    <Link to="/portal/dashboard">
                        <i className="fas fa-chart-line"></i> Dashboard
                    </Link>
                </li>
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

            <li><Link to="/portal/perfil"><i className="fas fa-user-circle"></i> Meu Perfil</Link></li>
            <li><Link to="/portal/treinos"><i className="fas fa-dumbbell"></i> Meus Treinos</Link></li>
            <li><Link to="/portal/biblioteca"><i className="fas fa-book-open"></i> Biblioteca</Link></li>
            <li><Link to="/portal/aulas"><i className="fas fa-calendar-alt"></i> Aulas de Grupo</Link></li>
            <li><Link to="/portal/competicoes"><i className="fas fa-trophy"></i> Competições</Link></li>
            
            {user?.nomePerfil && (user.nomePerfil.includes("ROLE_ADMIN") || user.nomePerfil.includes("ROLE_PERSONAL")) && (
               <li><Link to="/portal/exercicios"><i className="fas fa-bolt"></i> Banco de Exercícios</Link></li>
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
        <Outlet />
      </main>
    </div>
  );
}