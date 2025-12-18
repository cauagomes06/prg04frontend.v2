import React from 'react';

const API_BASE_URL = 'http://localhost:8080';

export function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  
  const getBadgeClass = (perfil) => {
    if (!perfil) return 'bg-secondary';
    if (perfil.includes('ADMIN')) return 'bg-danger';
    if (perfil.includes('PERSONAL')) return 'bg-warning text-dark';
    if (perfil.includes('CLIENTE')) return 'bg-info text-dark';
    return 'bg-secondary';
  };

  // Gera a lista de números de página para exibir
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
                   <div className="d-flex align-items-center">
                    {user.fotoUrl ? (
                        <img 
                            src={`${API_BASE_URL}${user.fotoUrl}`} 
                            className="rounded-circle me-2 shadow-sm" 
                            style={{width: '32px', height: '32px', objectFit: 'cover'}}
                            alt="Avatar"
                        />
                    ) : (
                        <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-2 border" 
                             style={{width: '32px', height: '32px'}}>
                            <i className="fas fa-user text-secondary small"></i>
                        </div>
                    )}
                    {user.username}
                  </div>
                </td>
                <td>
                  <span className={`badge rounded-pill ${getBadgeClass(user.nomePerfil)}`}>
                    {user.nomePerfil ? user.nomePerfil.replace('ROLE_', '') : 'SEM PERFIL'}
                  </span>
                </td>
                <td>
                  <span className="badge bg-white text-dark border">
                    {user.nomePlano || "Sem Plano"}
                  </span>
                </td>
                <td className="text-end pe-4">
                  <button onClick={() => onEdit(user)} className="btn btn-sm btn-outline-primary me-2 border-0"><i className="fas fa-pen"></i></button>
                  <button onClick={() => onDelete(user.id)} className="btn btn-sm btn-outline-danger border-0"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ COM PAGINAÇÃO */}
      <div className="card-footer bg-white border-top-0 py-3">
        <nav className="d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
          </span>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                Anterior
              </button>
            </li>
            
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number - 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(number - 1)}>
                  {number}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                Próximo
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}