import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import "../../styles/portal.css";

export function Layout() {
  const { user, logout } = useContext(AuthContext);
  
  // Estados de Perfil e Ranking
  const [userData, setUserData] = useState({ 
    nome: "Carregando...", 
    plano: "...", 
    foto: null 
  });
  const [userRank, setUserRank] = useState(null);
  
  // NOVO ESTADO: Contagem de Notificações
  const [notifCount, setNotifCount] = useState(0);
  
  useEffect(() => {
    // 1. Carregar dados do usuário e ranking
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
           if (posicao !== -1) {
             setUserRank(posicao + 1);
           }
        });
      })
      .catch(err => console.error("Erro ao carregar dados:", err));

    // 2. NOVO: Carregar contagem de notificações não lidas
    apiFetch("/api/notificacoes/contagem-nao-lidas")
      .then(data => {
        // O backend retorna { "contagem": X }
        if (data && typeof data.contagem === 'number') {
          setNotifCount(data.contagem);
        }
      })
      .catch(err => console.error("Erro ao carregar notificações:", err));

  }, []); // Executa ao montar o componente

  return (
    <div className="portal-container">
      <aside className="portal-sidebar active">
        <div className="perfil-usuario">
            {/* Foto / Placeholder */}
            {userData.foto ? (
                <img src={userData.foto} alt="User" />
            ) : (
                <div className="bg-white rounded-circle border border-3 border-success d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: "80px", height: "80px"}}>
                    <i className="fas fa-user fa-2x text-secondary"></i>
                </div>
            )}
            
            <h3 id="sidebar-nome">Olá, {userData.nome}!</h3>
            <p className="text-muted mb-2">{userData.plano}</p>
            
            {/* Rank Badge */}
            {userRank && (
                <div className="badge bg-warning text-dark p-2 px-3 rounded-pill shadow-sm mt-1">
                    <i className="fas fa-trophy me-2"></i>
                    <strong>{userRank}º Lugar</strong>
                </div>
            )}
        </div>
        
        <nav className="portal-menu mt-4">
          <ul>
            <li>
                {/* Link atualizado com Flexbox para alinhar o badge à direita */}
                <Link to="/portal/dashboard" className="d-flex justify-content-between align-items-center pe-3">
                    <span><i className="fas fa-bullhorn"></i> Notificações</span>
                    
                    {/* --- CONTADOR VERMELHO --- */}
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
            
            {/* --- LINK DE AULAS ADICIONADO AQUI --- */}
            <li><Link to="/portal/aulas"><i className="fas fa-calendar-alt"></i> Aulas de Grupo</Link></li>
            
            <li><Link to="/portal/competicoes"><i className="fas fa-trophy"></i> Competições</Link></li>
            
            {/* Link condicional para Exercícios (Staff) */}
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