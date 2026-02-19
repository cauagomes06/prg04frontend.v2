import React from "react";

export function UserTable({ users, onEdit, onDelete }) {
  const getBadgeClass = (perfil) => {
    const p = perfil?.toUpperCase() || "";
    if (p.includes("ADMIN")) return "bg-danger text-white";
    if (p.includes("PERSONAL")) return "bg-warning text-dark";
    if (p.includes("CLIENTE")) return "bg-info text-dark";
    return "bg-secondary text-white";
  };

  const formatPerfil = (perfil) =>
    perfil ? perfil.replace("ROLE_", "") : "SEM PERFIL";

  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light text-uppercase small fw-bold text-muted">
            <tr>
              <th className="ps-4">ID</th>
              <th>Usuário</th>
              <th>Perfil</th>
              <th>Plano</th>
              <th className="text-end pe-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="ps-4 text-muted">#{user.id}</td>
                <td className="fw-bold text-dark">
                  <td className="fw-bold text-dark">
                    <div className="d-flex align-items-center">
                      {user.fotoUrl ? (
                        <img
                          src={user.fotoUrl}
                          className="rounded-circle me-2 shadow-sm border"
                          style={{
                            width: "32px",
                            height: "32px",
                            objectFit: "cover",
                          }}
                          alt={user.username}
                          onError={(e) => {
                            // Se a URL der erro (ex: imagem apagada do Supabase), coloca o placeholder padrão
                            e.target.src =
                              "https://via.placeholder.com/32?text=U";
                          }}
                        />
                      ) : (
                        // Ícone usado quando o usuário não tem nenhuma foto cadastrada
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
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getBadgeClass(user.nomePerfil)}`}
                  >
                    {formatPerfil(user.nomePerfil)}
                  </span>
                </td>
                <td>
                  <span className="badge bg-white text-dark border fw-normal">
                    {user.nomePlano || "Nenhum Plano"}
                  </span>
                </td>
                <td className="text-end pe-4">
                  <button
                    onClick={() => onEdit(user)}
                    className="btn btn-sm btn-light text-primary me-2 border-0 shadow-xs"
                    title="Editar Perfil"
                  >
                    <i className="fas fa-user-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="btn btn-sm btn-light text-danger border-0 shadow-xs"
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
