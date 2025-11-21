import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SuccessModal } from "../components/common/SuccessModal";

// Importação dos novos componentes granulares
import { NotificationItem } from "../components/notificacoes/NotificacaoItem";
import { BroadcastModal } from "../components/notificacoes/BroadcastModal";

import "../styles/notificacoes.css";

export function Notificacoes() {
  const { user } = useContext(AuthContext);
  
  // Estados
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controlo de Modais
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isAdmin = user?.nomePerfil === "ROLE_ADMIN";

  // --- CARREGAR DADOS ---
  const carregarNotificacoes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/notificacoes/minhas");
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
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
      // Atualização otimista da UI
      setNotificacoes(prev => prev.map(n => 
        n.id === id ? { ...n, lida: true } : n
      ));
    } catch (error) {
      console.error("Erro ao marcar como lida", error);
    }
  };

  const handleBroadcastSuccess = () => {
    setShowSuccess(true);
    carregarNotificacoes(); // Atualiza para ver se o próprio admin recebeu
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Spinner animation="border" variant="success" />
    </div>
  );

  return (
    <div className="notificacoes-container py-5">
      <Container>
        {/* Cabeçalho */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Notificações</h2>
            <p className="text-muted mb-0">Central de mensagens e alertas.</p>
          </div>
          
          <div className="d-flex gap-2">
             {isAdmin && (
              <Button 
                className="btn-custom-primary rounded-pill shadow-sm" 
                onClick={() => setShowBroadcast(true)}
              >
                <i className="fas fa-paper-plane me-2"></i> Enviar Geral
              </Button>
            )}

            <Button variant="light" onClick={carregarNotificacoes} className="rounded-pill shadow-sm">
              <i className="fas fa-sync-alt me-2"></i> Atualizar
            </Button>
          </div>
        </div>

        {/* Lista de Notificações */}
        <Row>
          <Col lg={8} className="mx-auto">
            {notificacoes.length === 0 ? (
              <div className="text-center py-5">
                <i className="far fa-bell-slash fa-3x text-muted mb-3 opacity-25"></i>
                <p className="text-muted">Você não tem novas notificações.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {notificacoes.map((notificacao) => (
                  <NotificationItem 
                    key={notificacao.id} 
                    notificacao={notificacao} 
                    onMarcarComoLida={handleMarcarComoLida} 
                  />
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Modais */}
      <BroadcastModal 
        show={showBroadcast} 
        onHide={() => setShowBroadcast(false)} 
        onSuccess={handleBroadcastSuccess} 
      />

      <SuccessModal 
        show={showSuccess} 
        handleClose={() => setShowSuccess(false)} 
        message="Notificação enviada para todos os utilizadores com sucesso!" 
      />
    </div>
  );
}