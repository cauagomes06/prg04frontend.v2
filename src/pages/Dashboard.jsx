import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { paymentService } from "../services/PaymentService";

// Importação do CSS Externo
import "../styles/dashboard.css"; 

// Componentes de Analytics
import { AdminStatsCards } from "../components/dashboard/AdminStatsCards";
import { RevenueChart } from "../components/dashboard/RevenueChart";

export function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext); //
  
  // Estados para dados financeiros
  const [stats, setStats] = useState({ total_faturado: 0, quantidade_vendas: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado de erro adicionado

  // Verificação de permissão
  const isAdmin = user?.nomePerfil && user.nomePerfil.includes("ROLE_ADMIN"); //

  // --- CARREGAR DADOS FINANCEIROS ---
  const carregarDadosDashboard = async () => {
    if (!isAdmin) return; // Segurança extra

    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.obterRelatorioFaturamento(); //
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setError("Não foi possível carregar os dados financeiros. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Sincroniza a busca com o carregamento do usuário
  useEffect(() => {
    if (!authLoading) {
      if (isAdmin) {
        carregarDadosDashboard();
      } else {
        setLoading(false);
      }
    }
  }, [isAdmin, authLoading]); // Dependências corrigidas

  // 1. Verificação de Loading do Auth ou Dados
  if (authLoading || (isAdmin && loading)) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="success"/>
    </div>
  );

  // 2. Cláusula de Guarda: Se não for Admin, mostra acesso negado
  if (!isAdmin) {
    return (
      <div className="p-5 text-center text-muted">
        <i className="fas fa-lock fa-3x mb-3 opacity-25"></i>
        <h3>Acesso Restrito</h3>
        <p>Esta página é acessível apenas para administradores do sistema.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-admin-container">
      <Container>
        
        {/* CABEÇALHO DO DASHBOARD */}
        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
          <div>
            <h4 className="dashboard-admin-title mb-1">
                <i className="fas fa-chart-line me-2"></i>
                Painel de Administração
            </h4>
            <p className="text-muted mb-0 small">
                Acompanhe métricas e faturamento da plataforma.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Button variant="light" onClick={carregarDadosDashboard} className="rounded-pill shadow-sm">
              <i className="fas fa-sync-alt"></i> Atualizar
            </Button>
          </div>
        </div>

        {/* ALERTA DE ERRO */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* 1. SEÇÃO DE CARDS */}
        <Row className="mb-4">
          <Col lg={12}>
              <AdminStatsCards dados={stats} />
          </Col>
        </Row>

        {/* 2. SEÇÃO DO GRÁFICO */}
        <Row>
          <Col lg={12}>
            <div className="dashboard-chart-section">
                <h5 className="fw-bold mb-4">Desempenho de Vendas e Faturamento</h5>
                <RevenueChart dados={stats} />
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
}