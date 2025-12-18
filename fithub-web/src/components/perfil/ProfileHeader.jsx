import { Button } from "react-bootstrap";
import { useState, useEffect } from "react"; // Importa useState e useEffect

export function ProfileHeader({ perfil, onEditData, onOpenConfig }) {
  // Estado para controlar erro na imagem
  const [imgError, setImgError] = useState(false);

  // Reseta o estado de erro sempre que o perfil mudar (para tentar carregar nova foto)
  useEffect(() => {
    setImgError(false);
  }, [perfil?.fotoUrl]);

  return (
    <div className="perfil-header d-flex align-items-center gap-4 mb-4 flex-wrap">
      <div className="perfil-avatar overflow-hidden d-flex align-items-center justify-content-center">
        {/* Lógica: Mostra a imagem SE existir URL E não houver erro.
           Caso contrário, mostra o ícone.
        */}
        {perfil?.fotoUrl && !imgError ? (
          <img 
            src={`http://localhost:8080${perfil.fotoUrl}`} 
            alt="Avatar" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            onError={() => setImgError(true)} // Se falhar, ativa o modo de erro
          />
        ) : (
          <i className="fas fa-user fa-4x"></i>
        )}
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