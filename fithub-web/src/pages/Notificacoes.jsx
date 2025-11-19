import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { apiFetch } from "../services/api";
import "../styles/notificacoes.css"; 

export function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarNotificacoes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/notificacoes/minhas");
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  // Função para marcar como lida
  const marcarComoLida = async (id) => {
    try {
      // Endpoint ajustado: /api/notificacoes/{id}/ler
      await apiFetch(`/api/notificacoes/${id}/ler`, { method: "PATCH" });
      
      // Atualiza localmente para evitar reload
      setNotificacoes(prev => prev.map(n => 
        n.id === id ? { ...n, lida: true } : n
      ));
    } catch (error) {
      console.error("Erro ao marcar como lida", error);
    }
  };

  // Formatar data amigável
  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    return data.toLocaleString("pt-BR", { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Spinner animation="border" variant="success" />
    </div>
  );

  return (
    <div className="notificacoes-container py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Notificações</h2>
            <p className="text-muted mb-0">Suas atualizações e conquistas recentes.</p>
          </div>
          <Button variant="light" onClick={carregarNotificacoes} className="rounded-pill shadow-sm">
            <i className="fas fa-sync-alt me-2"></i> Atualizar
          </Button>
        </div>

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
                  <div 
                    key={notificacao.id} 
                    className={`notificacao-card p-3 d-flex align-items-start ${!notificacao.lida ? 'nao-lida' : ''}`}
                  >
                    {/* Ícone Dinâmico */}
                    <div className="notificacao-icon me-3">
                      {notificacao.mensagem && (notificacao.mensagem.includes("Venceu") || notificacao.mensagem.includes("ganhou")) ? (
                        <i className="fas fa-trophy text-warning"></i>
                      ) : (
                        <i className="far fa-bell"></i>
                      )}
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="fw-bold mb-1 text-dark">
                          {/* Se não tiver título no DTO, usa um padrão */}
                          {notificacao.titulo || "Nova Mensagem"}
                          {!notificacao.lida && <span className="notificacao-badge-new">Nova</span>}
                        </h6>
                        <span className="notificacao-time">
                          {formatarData(notificacao.dataCriacao)}
                        </span>
                      </div>
                      
                      <p className="text-muted mb-2 small" style={{lineHeight: "1.5"}}>
                        {notificacao.mensagem}
                      </p>

                      {/* Ações */}
                      <div className="d-flex gap-2 mt-2">
                        {!notificacao.lida && (
                          <button 
                            className="btn-mark-read" 
                            onClick={() => marcarComoLida(notificacao.id)}
                          >
                            <i className="fas fa-check me-1"></i> Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}