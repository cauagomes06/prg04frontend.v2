import { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { apiFetch } from "../../services/api";

export function AdminStatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/dashboard/stats")
      .then(setStats)
      .catch(err => console.error("Erro ao carregar stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>;
  if (!stats) return null;

  const cards = [
    { label: "Alunos Ativos", value: stats.totalAlunos, icon: "fa-users", color: "primary" },
    { label: "Personais", value: stats.totalPersonais, icon: "fa-id-card", color: "info" },
    { label: "Aulas Agendadas", value: stats.aulasAgendadas, icon: "fa-calendar-alt", color: "warning" },
    { label: "Competições", value: stats.competicoesAtivas, icon: "fa-trophy", color: "danger" },
    { 
        label: "Receita Mensal", 
        value: `R$ ${stats.receitaEstimadaMensal?.toFixed(2)}`, 
        icon: "fa-sack-dollar", 
        color: "success", 
        fullWidth: true 
    },
  ];

  return (
    <div className="mb-5">
        <h4 className="fw-bold text-dark mb-3"><i className="fas fa-chart-line me-2"></i>Visão Geral</h4>
        <Row className="g-3">
            {cards.map((item, idx) => (
                <Col key={idx} md={item.fullWidth ? 12 : 6} lg={item.fullWidth ? 12 : 3}>
                    <Card className={`border-0 shadow-sm h-100 border-start border-4 border-${item.color}`}>
                        <Card.Body className="d-flex align-items-center">
                            <div className={`bg-${item.color} bg-opacity-10 p-3 rounded-circle me-3 text-${item.color}`}>
                                <i className={`fas ${item.icon} fa-2x`}></i>
                            </div>
                            <div>
                                <h3 className="fw-bold mb-0">{item.value}</h3>
                                <p className="text-muted mb-0 small text-uppercase fw-bold">{item.label}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
  );
}