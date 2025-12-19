import { Button } from "react-bootstrap";

export function NotificationItem({ notificacao, onMarcarComoLida }) {
  
  // Função auxiliar de data (encapsulada aqui ou num utils)
  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    return new Date(dataIso).toLocaleString("pt-BR", { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  // Lógica do Ícone
  const isVitoria = notificacao.mensagem && 
    (notificacao.mensagem.includes("Venceu") || notificacao.mensagem.includes("ganhou"));

  return (
    <div className={`notificacao-card p-3 d-flex align-items-start ${!notificacao.lida ? 'nao-lida' : ''}`}>
      {/* Ícone */}
      <div className="notificacao-icon me-3">
        {isVitoria ? (
          <i className="fas fa-trophy text-warning"></i>
        ) : (
          <i className="far fa-bell"></i>
        )}
      </div>

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="fw-bold mb-1 text-dark">
            Notificação
            {!notificacao.lida && <span className="notificacao-badge-new">Nova</span>}
          </h6>
          <span className="notificacao-time">
            {formatarData(notificacao.dataCriacao)}
          </span>
        </div>
        
        <p className="text-muted mb-2 small" style={{ lineHeight: "1.5" }}>
          {notificacao.mensagem}
        </p>


        {/* Botão de Ação */}
        {!notificacao.lida && (
          <div className="d-flex gap-2 mt-1">
            <button 
              className="btn-mark-read" 
              onClick={() => onMarcarComoLida(notificacao.id)}
            >
              <i className="fas fa-check me-1"></i> Marcar como lida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}