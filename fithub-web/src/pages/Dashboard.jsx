import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { paymentService } from "../services/PaymentService";

// Importação do CSS Externo
import "../styles/dashboard.css"; 

// Componentes de Analytics
import { AdminStatsCards } from "../components/dashboard/AdminStatsCards";
import { RevenueChart } from "../components/dashboard/RevenueChart";

export function Dashboard() {
  const { user } = useContext(AuthContext);
  
  // Estados para dados financeiros
  const [stats, setStats] = useState({ total_faturado: 0, quantidade_vendas: 0 });
  const [loading, setLoading] = useState(true);

  // Verificação de permissão
  const isAdmin = user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN");

  // --- CARREGAR DADOS FINANCEIROS ---
  const carregarDadosDashboard = async () => {
    setLoading(true);
    try {
      const data = await paymentService.obterRelatorioFaturamento();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="success"/>
    </div>
  );

  return (
    <div className="dashboard-admin-container">
      <Container>
        
        {/* CABEÇALHO DO DASHBOARD (Mantendo sua estrutura de layout) */}
        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
          <div>
            <h4 className="dashboard-admin-title mb-1">
                <i className="fas fa-chart-line me-2"></i>
                {isAdmin ? "Painel de Administração" : "Meu Resumo"}
            </h4>
            <p className="text-muted mb-0 small">
                {isAdmin 
                  ? "Acompanhe métricas e faturamento da plataforma." 
                  : "Visualize suas estatísticas de uso."}
            </p>
          </div>

          <div className="d-flex gap-2">
            <Button variant="light" onClick={carregarDadosDashboard} className="rounded-pill shadow-sm">
              <i className="fas fa-sync-alt"></i> Atualizar
            </Button>
          </div>
        </div>

        {/* 1. SEÇÃO DE CARDS (Usando classes do CSS externo) */}
        {isAdmin && (
          <Row className="mb-4">
            <Col lg={12}>
                <AdminStatsCards dados={stats} />
            </Col>
          </Row>
        )}

        {/* 2. SEÇÃO DO GRÁFICO (Usando classe dashboard-chart-section do CSS externo) */}
        <Row>
          <Col lg={12}>
            <div className="dashboard-chart-section">
               <h5 className="fw-bold mb-4">Desempenho de Vendas e Faturamento</h5>
               
               {isAdmin ? (
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