import React from 'react';

export function PlanTable({ planos, onEdit, onDelete }) {
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
              <th className="border-bottom-0">Nome do Plano</th>
              <th className="border-bottom-0">Descrição</th>
              <th className="border-bottom-0">Preço (R$)</th>
              <th className="text-end pe-4 border-bottom-0">Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos.map((plano) => (
              <tr key={plano.idPlano}>
                <td className="ps-4 text-muted">#{plano.idPlano}</td>
                
                <td className="fw-bold text-dark">
                  {plano.nomePlano || "Sem Nome"}
                </td>

                <td className="text-muted small" style={{ maxWidth: "300px" }}>
                  <span className="text-truncate d-inline-block w-100">
                    {plano.descricaoPlano || "Sem descrição"}
                  </span>
                </td>

                <td>
                  {/* Badge de preço otimizada para os temas */}
                  <span 
                    className="badge px-3 borda-customizada"
                    style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}
                  >
                    R$ {plano.preco?.toFixed(2) || "0.00"}
                  </span>
                </td>

                <td className="text-end pe-4">
                  <button 
                    onClick={() => onEdit(plano)}
                    className="btn btn-sm btn-link text-primary me-2 text-decoration-none shadow-none"
                    title="Editar Plano">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(plano.idPlano)}
                    className="btn btn-sm btn-link text-danger text-decoration-none shadow-none"
                    title="Excluir Plano">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Mensagem caso a lista venha vazia */}
            {planos.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="fas fa-info-circle me-2"></i>
                  Nenhum plano encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}