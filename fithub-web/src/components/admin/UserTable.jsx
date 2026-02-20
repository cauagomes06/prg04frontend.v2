import React from "react";

export function UserTable({ users, onEdit, onDelete }) {
  const getBadgeClass = (perfil) => {
    const p = perfil?.toUpperCase() || "";
    if (p.includes("ADMIN")) return "bg-danger text-white";
    if (p.includes("PERSONAL")) return "bg-warning text-dark";
    if (p.includes("CLIENTE")) return "bg-success text-dark";
    return "bg-secondary text-white";
  };

  const formatPerfil = (perfil) =>
    perfil ? perfil.replace("ROLE_", "") : "SEM PERFIL";

  return (
    <div 
      className="shadow-sm rounded-3 overflow-hidden borda-customizada" 
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <div className="table-responsive">
        <table 
          className="table table-hover mb-0 align-middle"
          style={{ 
            '--bs-table-bg': 'transparent', 
            '--bs-table-color': 'var(--text-dark)', 
            '--bs-table-border-color': 'var(--border-color)',
            '--bs-table-hover-bg': 'var(--bg-light)'
          }}
        >
          <thead style={{ backgroundColor: "var(--bg-light)" }}>
            <tr className="text-uppercase small fw-bold text-muted">
              <th className="ps-4 border-bottom-0">ID</th>
              <th className="border-bottom-0">Usuário</th>
              <th className="border-bottom-0">Perfil</th>
              <th className="border-bottom-0">Plano</th>
              <th className="text-end pe-4 border-bottom-0">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="ps-4 text-muted">#{user.id}</td>
                <td className="fw-bold text-dark">
                  <div className="d-flex align-items-center">
                    {user.fotoUrl ? (
                      <img
                        src={user.fotoUrl}
                        className="rounded-circle me-2 shadow-sm border-0"
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "cover",
                        }}
                        alt={user.username}
                        onError={(e) => {
                          // Se a URL der erro, coloca o placeholder padrão
                          e.target.src = "https://via.placeholder.com/32?text=U";
                        }}
                      />
                    ) : (
                      <i
                        className="fas fa-user-circle text-muted me-2"
                        style={{ fontSize: "32px" }}
                      ></i>
                    )}

                    <span
                      className="text-truncate"
                      style={{ maxWidth: "150px" }}
                    >
                      {user.username}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getBadgeClass(user.nomePerfil)}`}
                  >
                    {formatPerfil(user.nomePerfil)}
                  </span>
                </td>
                <td>
                  <span 
                    className="badge fw-normal borda-customizada"
                    style={{ backgroundColor: "var(--bg-light)", color: "var(--text-dark)" }}
                  >
                    {user.nomePlano || "Nenhum Plano"}
                  </span>
                </td>
                <td className="text-end pe-4">
                  {/* Botões ajustados para não terem o fundo branco forçado */}
                  <button
                    onClick={() => onEdit(user)}
                    className="btn btn-sm btn-link text-primary me-2 text-decoration-none shadow-none"
                    title="Editar Perfil"
                  >
                    <i className="fas fa-user-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="btn btn-sm btn-link text-danger text-decoration-none shadow-none"
                    title="Excluir Usuário"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="fas fa-user-slash fa-2x mb-3 d-block opacity-25"></i>
                  Nenhum usuário corresponde aos critérios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}