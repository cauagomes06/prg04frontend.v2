import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api"; 

import "../styles/dashboard.css"; 

import { AdminStatsCards } from "../components/dashboard/AdminStatsCards";
import { RevenueChart } from "../components/dashboard/RevenueChart";

export function Dashboard() {
  const { user } = useContext(AuthContext);
  
  // Estado inicializado vazio
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificação de permissão
  const isAdmin = user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN");

  // --- CARREGAR DADOS DO DASHBOARD DA API REAL ---
  const carregarDadosDashboard = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/dashboard/stats");
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      carregarDadosDashboard();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--bg-light)' }}>
      <Spinner animation="border" variant="success"/>
    </div>
  );

  return (
    <div className="dashboard-admin-container">
      <Container>
        
        {/* CABEÇALHO DO DASHBOARD */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-2 gap-3">
          <div>
            <h4 className="dashboard-admin-title mb-1 text-dark">
                <i className="fas fa-chart-line me-2 text-success"></i>
                {isAdmin ? "Painel de Administração" : "Meu Resumo"}
            </h4>
            <p className="text-muted mb-0 small">
                {isAdmin 
                  ? "Acompanhe as métricas da plataforma." 
                  : "Visualize suas estatísticas de uso."}
            </p>
          </div>

          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={carregarDadosDashboard} 
              className="rounded-pill shadow-sm d-flex align-items-center gap-2"
              style={{ backgroundColor: "var(--card-bg)", color: "var(--text-dark)", borderColor: "var(--border-color)" }}
            >
              <i className="fas fa-sync-alt"></i> Atualizar
            </Button>
          </div>
        </div>

        {/* 1. SEÇÃO DE CARDS */}
        {isAdmin && stats && (
          <Row className="mb-4">
            <Col lg={12}>
                {/* Repassamos os dados centralizados para os cards */}
                <AdminStatsCards stats={stats} />
            </Col>
          </Row>
        )}

        {/* 2. SEÇÃO DO GRÁFICO */}
        <Row>
          <Col lg={12}>
            <div className="dashboard-chart-section">
               <h5 className="fw-bold mb-4 text-dark">Visão Geral da Plataforma</h5>
               
               {isAdmin && stats ? (
                 <RevenueChart dados={stats} />
               ) : (
                 <div className="text-center py-5">
                   <i className="fas fa-user-clock fa-3x text-muted mb-3 opacity-25"></i>
                   <p className="text-muted">Seu progresso pessoal será exibido aqui em breve.</p>
                 </div>
               )}
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
}