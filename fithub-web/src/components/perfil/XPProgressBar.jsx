import { useState, useEffect } from "react";
import { ProgressBar, Badge } from "react-bootstrap";
import { apiFetch } from "../../services/api";
import "../../styles/gamificacao.css";

export function XPProgressBar() {
  const [progresso, setProgresso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProgresso = async () => {
      try {
        const data = await apiFetch("/api/gamificacao/meu-progresso");
        setProgresso(data);
      } catch (error) {
        console.error("Erro ao carregar progresso de XP:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProgresso();
  }, []);

  if (loading) {
    return (
      <div className="w-100 placeholder-glow mt-3">
        <span className="placeholder col-12 rounded xp-placeholder-loader"></span>
      </div>
    );
  }

  if (!progresso) return null;

  return (
    <div className="mt-3 w-100 p-3 xp-container-card">
      <div className="d-flex justify-content-between align-items-end mb-2">
        <div>
          <Badge
            bg="warning"
            text="dark"
            className="px-2 py-1 fs-6 xp-level-badge"
          >
            <i className="fas fa-star text-dark me-1"></i> Nível{" "}
            {progresso.nivel}
          </Badge>
          <span className="ms-2 fw-bold text-muted text-uppercase xp-level-title">
            {progresso.tituloNivel}
          </span>
        </div>
        <div className="fw-bold text-success xp-values-text">
          {progresso.xpAtualNoNivel}{" "}
          <span className="text-muted fw-normal">
            / {progresso.xpParaProximoNivel} XP
          </span>
        </div>
      </div>

      <ProgressBar className="rounded-pill shadow-inner xp-bar-container">
        <ProgressBar
          now={progresso.percentualProgresso}
          animated
          className="rounded-pill xp-bar-fill"
        />
      </ProgressBar>

      <div className="text-end mt-1">
        <small className="text-muted xp-footer-text">
          Continue treinando para subir de nível!
        </small>
      </div>
    </div>
  );
}