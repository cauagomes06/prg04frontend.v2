import { Row, Col, Card } from "react-bootstrap";

// Agora ele recebe 'stats' direto do Dashboard principal
export function AdminStatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: "Alunos Ativos",
      value: stats.totalAlunos || 0,
      icon: "fa-users",
      color: "primary",
    },
    {
      label: "Personais",
      value: stats.totalPersonais || 0,
      icon: "fa-id-card",
      color: "info",
    },
    {
      label: "Aulas Agendadas",
      value: stats.aulasAgendadas || 0,
      icon: "fa-calendar-alt",
      color: "warning",
    },
    {
      label: "Competições",
      value: stats.competicoesAtivas || 0,
      icon: "fa-trophy",
      color: "danger",
    },
    {
      label: "Receita Mensal Estimada",
      value: `R$ ${(stats.receitaEstimadaMensal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: "fa-sack-dollar",
      color: "success",
      fullWidth: true,
      isRevenue: true,
    },
  ];

  return (
    <div className="mb-4">
      <Row className="g-3">
        {cards.map((item, idx) => (
          <Col
            key={idx}
            md={item.fullWidth ? 12 : 6}
            lg={item.fullWidth ? 12 : 3}
          >
            <Card className="dashboard-info-card h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div
                  className={`bg-${item.color} bg-opacity-10 p-3 rounded-circle me-3 text-${item.color}`}
                >
                  <i className={`fas ${item.icon} fa-2x`}></i>
                </div>
                <div>
                  <h3
                    className={`dashboard-info-value mb-0 ${!item.isRevenue ? "vendas" : ""}`}
                  >
                    {item.value}
                  </h3>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">
                    {item.label}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
