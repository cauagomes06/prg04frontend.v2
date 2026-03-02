import { useState, useEffect } from "react";
import { Row, Col, Spinner, Badge } from "react-bootstrap";
import "../../styles/conquistas.css";
import { apiFetch } from "../../services/api"; // <-- CORRIGIDO AQUI

export function GaleriaConquistas({ usuarioId }) {
  const [conquistas, setConquistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      carregarConquistas();
    }
  }, [usuarioId]);

  const carregarConquistas = async () => {
    try {
      setLoading(true);
      // <-- CORRIGIDO AQUI
      const data = await apiFetch(`/api/conquistas/usuario/${usuarioId}`);
      setConquistas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
      setConquistas([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted fw-bold">Polindo troféus...</p>
      </div>
    );
  }

  return (
    <div className="galeria-container py-4 fle">
      <Row className="g-4 ">
        {conquistas?.map((c) => (
          <Col key={c.id} xs={6} md={4} lg={3}>
            <div
              className={`medal-card h-100 p-3 text-center ${c.desbloqueada ? "unlocked" : "locked"}`}
            >
              {/* Ícone da Medalha */}
              <div
                className={`medal-icon-wrapper medal-${c.tipo.toLowerCase()} mx-auto mb-3`}
              >
                <i className={`fas ${c.icone}`}></i>
              </div>

              {/* Informações */}
              <h6 className="medal-name mb-1">{c.nome}</h6>
              <p className="medal-desc small text-muted mb-2">{c.descricao}</p>

              {/* Status de Desbloqueio */}
              {c.desbloqueada ? (
                <Badge bg="success" className="medal-date-badge px-2 py-1">
                  <i className="fas fa-check me-1"></i>
                  {new Date(c.dataDesbloqueio).toLocaleDateString("pt-BR")}
                </Badge>
              ) : (
                <div className="medal-locked-text small text-muted">
                  <i className="fas fa-lock me-1"></i> Bloqueado
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {conquistas.length === 0 && (
        <div className="text-center p-5 text-muted">
          <i className="fas fa-trophy fa-3x mb-3 opacity-25"></i>
          <p>Nenhuma conquista configurada no sistema ainda.</p>
        </div>
      )}
    </div>
  );
}
