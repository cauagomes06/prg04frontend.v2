import React from 'react';

export function PlanTable({ planos, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light text-uppercase small fw-bold text-muted">
            <tr>
              <th className="ps-4">ID</th>
              <th>Nome do Plano</th>
              <th>Descrição</th>
              <th>Preço (R$)</th>
              <th className="text-end pe-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos.map((plano) => (
              <tr key={plano.idPlano}>
                {/* Usando idPlano conforme sua estrutura de dados */}
                <td className="ps-4 text-muted">#{plano.idPlano}</td>
                
                {/* CORREÇÃO: Fallback para o nome não aparecer vazio como na imagem */}
                <td className="fw-bold text-dark">
                  {plano.nomePlano ||"Sem Nome"}
                </td>

                <td className="text-muted small" style={{ maxWidth: "300px" }}>
                  <span className="text-truncate d-inline-block w-100">
                    {plano.descricaoPlano || "Sem descrição"}
                  </span>
                </td>

                <td>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3">
                    R$ {plano.preco?.toFixed(2) || "0.00"}
                  </span>
                </td>

                <td className="text-end pe-4">
                  <button 
                    onClick={() => onEdit(plano)}
                    className="btn btn-sm btn-outline-primary me-2 border-0"
                    title="Editar Plano">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(plano.idPlano)}
                    className="btn btn-sm btn-outline-danger border-0"
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