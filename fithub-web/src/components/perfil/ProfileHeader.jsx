import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../styles/perfil.css";

export function ProfileHeader({ perfil, onEditData, onOpenConfig }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [perfil?.fotoUrl]);

  return (
    <div className="perfil-header d-flex align-items-center gap-4 mb-4 flex-wrap">
      {/* Container do Avatar */}
      <div className="perfil-avatar overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0">
        {perfil?.fotoUrl && !imgError ? (
          <img
            src={`${perfil?.fotoUrl}?t=${new Date().getTime()}`}
            alt="Avatar"
            className="perfil-header-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <i className="fas fa-user fa-3x text-muted opacity-50"></i>
        )}
      </div>

      {/* Informações do Perfil */}
      <div className="flex-grow-1">
        <h2 className="fw-bold mb-1 text-dark">
          {perfil?.pessoa?.nomeCompleto}
        </h2>
        <div className="d-flex flex-column gap-1">
          <p className="text-muted mb-0 small">
            <i className="fas fa-envelope me-2 text-success"></i>{" "}
            {perfil?.username}
          </p>
          <p className="text-muted mb-0 small">
            <i className="fas fa-phone me-2 text-success"></i>{" "}
            {perfil?.pessoa?.telefone || "Sem telefone"}
          </p>
          <div className="mt-2">
            <span className="badge badge-plano text-success rounded-pill border border-success border-opacity-25">
              {perfil?.nomePlano || "Sem Plano"}
            </span>
          </div>
        </div>
      </div>

      {/* Container de Ações */}
      <div className="d-flex gap-3 flex-wrap mt-2 mt-md-0">
        <Button
          variant="outline-success"
          onClick={onEditData}
          className="rounded-pill px-4 fw-bold shadow-sm btn-profile-action"
        >
          <i className="fas fa-pen me-2"></i> Editar
        </Button>

        <Button
          variant="success"
          onClick={onOpenConfig}
          className="rounded-pill px-4 fw-bold shadow-sm btn-profile-action"
        >
          <i className="fas fa-cog me-2"></i> Configurações
        </Button>
      </div>
    </div>
  );
}
