import { Button } from "react-bootstrap";

export function ProfileHeader({ perfil, onEditData, onOpenConfig }) {
  return (
    <div className="perfil-header d-flex align-items-center gap-4 mb-4 flex-wrap">
      <div className="perfil-avatar">
        <i className="fas fa-user fa-4x"></i>
      </div>

      <div className="flex-grow-1">
        <h2 className="fw-bold">{perfil?.pessoa?.nomeCompleto}</h2>
        <p className="text-muted mb-1">
          <i className="fas fa-envelope me-2"></i> {perfil?.username}
        </p>
        <p className="text-muted mb-2">
          <i className="fas fa-phone me-2"></i> {perfil?.pessoa?.telefone || "Sem telefone"}
        </p>
        <span className="badge badge-plano text-success rounded-pill">
          {perfil?.nomePlano || "Sem Plano"}
        </span>
      </div>

      <div className="d-flex gap-2">
        <Button variant="outline-success" onClick={onEditData}>
          <i className="fas fa-pen me-2"></i> Editar Dados
        </Button>

        <Button className="btn-green px-3" onClick={onOpenConfig}>
          <i className="fas fa-cog me-2"></i> Configurações
        </Button>
      </div>
    </div>
  );
}