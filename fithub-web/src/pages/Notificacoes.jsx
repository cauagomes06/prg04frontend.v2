import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { apiFetch } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SuccessModal } from "../components/common/SuccessModal";
import { NotificationItem } from "../components/notificacoes/NotificacaoItem";
import { BroadcastModal } from "../components/notificacoes/BroadcastModal";

import "../styles/notificacoes.css";

export function Notificacoes() {
  const { user } = useContext(AuthContext);

  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isAdmin =
    user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN");

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

  const handleMarcarComoLida = async (id) => {
    try {
      await apiFetch(`/api/notificacoes/${id}/ler`, {
        method: "PATCH",
      });

      setNotificacoes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, lida: true } : n
        )
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleBroadcastSuccess = () => {
    setShowSuccess(true);
    carregarNotificacoes();
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "var(--bg-light)" }}
      >
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="notificacoes-container py-5">
      <Container>

        {/* Cabeçalho */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 mt-2 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-2">
              {isAdmin
                ? "Centro de Mensagens"
                : "Notificações"}
            </h2>
            <p className="text-muted mb-0 fs-5">
              Últimas atualizações do sistema.
            </p>
          </div>

          <div className="d-flex gap-2">

            {isAdmin && (
              <Button
                className="btn-custom-primary rounded-pill shadow-sm px-4"
                onClick={() => setShowBroadcast(true)}
              >
                <i className="fas fa-paper-plane me-2"></i>
                Enviar Geral
              </Button>
            )}

            <Button
              variant="outline-secondary"
              onClick={carregarNotificacoes}
              className="rounded-pill shadow-sm px-4 d-flex align-items-center gap-2"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-dark)",
                borderColor: "var(--border-color)",
              }}
            >
              <i className="fas fa-sync-alt"></i>
              Atualizar
            </Button>
          </div>
        </div>

        {/* Lista */}
        <Row>
          <Col lg={9} className="mx-auto">

            {notificacoes.length === 0 ? (
              <div
                className="text-center py-5 rounded-4 shadow-sm"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <i className="far fa-bell-slash fa-3x text-muted mb-3 opacity-25"></i>
                <p className="text-muted fw-bold fs-5">
                  Você não tem novas notificações.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
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