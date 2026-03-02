import React from "react";

export function NotificationItem({ notificacao, onMarcarComoLida }) {

  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    return new Date(dataIso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isVitoria =
    notificacao.mensagem &&
    (notificacao.mensagem.includes("Venceu") ||
      notificacao.mensagem.includes("ganhou"));

  return (
    <div
      className={`notificacao-card d-flex align-items-start ${
        !notificacao.lida ? "nao-lida" : ""
      }`}
    >
      {/* Ícone */}
      <div className="notificacao-icon me-4">
        {isVitoria ? (
          <i className="fas fa-trophy text-warning"></i>
        ) : (
          <i className="far fa-bell"></i>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-grow-1">

        {/* Cabeçalho */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="notificacao-titulo mb-0">
            Notificação
            {!notificacao.lida && (
              <span className="badge bg-success ms-2 rounded-pill px-3 py-1">
                Nova
              </span>
            )}
          </h5>

          <span className="notificacao-time">
            {formatarData(notificacao.dataCriacao)}
          </span>
        </div>

        {/* Mensagem */}
        <p className="notificacao-mensagem">
          {notificacao.mensagem}
        </p>

        {/* Botão */}
        {!notificacao.lida && (
          <div className="mt-2">
            <button
              className="btn-mark-read"
              onClick={() => onMarcarComoLida(notificacao.id)}
            >
              <i className="fas fa-check me-2"></i>
              Marcar como lida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}