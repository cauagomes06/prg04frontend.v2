import React from 'react';
import "../../styles/planos.css";

export function PlanTable({ planos, onEdit, onDelete }) {
  return (
    <div className="shadow-sm rounded-3 overflow-hidden borda-customizada plan-table-container">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle plan-table">
          <thead className="plan-table-thead">
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

                <td className="text-muted small plan-desc-col">
                  <span className="text-truncate plan-desc-text">
                    {plano.descricaoPlano || "Sem descrição"}
                  </span>
                </td>

                <td>
                  <span className="badge px-3 borda-customizada plan-price-badge">
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