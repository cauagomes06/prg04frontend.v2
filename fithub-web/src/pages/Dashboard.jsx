import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SuccessModal } from "../components/common/SuccessModal";

// Componentes Granulares
import { NotificationItem } from "../components/notificacoes/NotificacaoItem";
import { BroadcastModal } from "../components/notificacoes/BroadcastModal";
import { AdminStatsCards } from "../components/dashboard/AdminStatsCards"; // <--- Importação do Card

import "../styles/notificacoes.css"; // Reutiliza o estilo das notificações

export function Dashboard() {
  const { user } = useContext(AuthContext);
  
  // Estados
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Verificação de permissão
  const isAdmin = user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN");

  // --- CARREGAR DADOS ---
  const carregarNotificacoes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/notificacoes/minhas");
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  // --- AÇÕES ---
  const handleMarcarComoLida = async (id) => {
    try {
      await apiFetch(`/api/notificacoes/${id}/ler`, { method: "PATCH" });
      // Atualização otimista na lista
      setNotificacoes(prev => prev.map(n => 
        n.id === id ? { ...n, lida: true } : n
      ));
    } catch (error) {
      console.error("Erro ao marcar como lida", error);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="success"/>
    </div>
  );

  return (
    <div className="py-5" style={{backgroundColor: "#f8f9fa", minHeight: "100vh"}}>
      <Container>
        
        {/* 1. SEÇÃO DE ANALYTICS (Visível apenas para Admin) */}
        {isAdmin && (
            <AdminStatsCards />
        )}

        {/* 2. SEÇÃO DE NOTIFICAÇÕES / MENSAGENS */}
        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
          <div>
            <h4 className="fw-bold text-dark mb-1">
                <i className="far fa-bell me-2"></i>
                {isAdmin ? "Centro de Mensagens" : "Minhas Notificações"}
            </h4>
            <p className="text-muted mb-0 small">
                {isAdmin ? "Gerencie a comunicação com os alunos." : "Fique por dentro das novidades."}
            </p>
          </div>

          <div className="d-flex gap-2">
             {isAdmin && (
              <Button 
                className="btn-custom-primary rounded-pill shadow-sm fw-bold" 
                onClick={() => setShowBroadcast(true)}
              >
                <i className="fas fa-paper-plane me-2"></i> Enviar Geral
              </Button>
            )}
            <Button variant="light" onClick={carregarNotificacoes} className="rounded-pill shadow-sm">
              <i className="fas fa-sync-alt"></i>
            </Button>
          </div>
        </div>

        <Row>
          <Col lg={12}>
            {notificacoes.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                <i className="far fa-bell-slash fa-3x text-muted mb-3 opacity-25"></i>
                <p className="text-muted mb-0">Não há novas notificações.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {notificacoes.map((n) => (
                  <NotificationItem 
                    key={n.id} 
                    notificacao={n} 
                    onMarcarComoLida={handleMarcarComoLida} 
                  />
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
      
      {/* Modais Auxiliares */}
      <BroadcastModal 
        show={showBroadcast} 
        onHide={() => setShowBroadcast(false)} 
        onSuccess={() => { setShowSuccess(true); carregarNotificacoes(); }} 
      />

      <SuccessModal 
        show={showSuccess} 
        handleClose={() => setShowSuccess(false)} 
        message="Mensagem enviada para todos os utilizadores com sucesso!" 
      />
    </div>
  );
}