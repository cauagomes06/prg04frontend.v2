import React from 'react';
import { Button } from 'react-bootstrap';

export function PaginationComponent({ currentPage, totalPages, onPageChange, loading }) {
  // Não renderiza nada se houver apenas uma página ou nenhuma
  if (totalPages <= 1) return null;

  return (
    <div
      className="pagination-wrapper d-flex justify-content-center align-items-center gap-4 mt-5 p-3 rounded-pill shadow-sm mx-auto"
      style={{ 
        maxWidth: "fit-content",
        backgroundColor: "var(--card-bg)", /* Fundo dinâmico (branco/cinza escuro) */
        border: "1px solid var(--border-color)" /* Borda segura */
      }}
    >
      {/* Botão Voltar */}
      <Button
        variant="link" /* Removemos 'light' para evitar cores fixas do Bootstrap */
        className="rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center text-decoration-none"
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0 || loading}
        style={{ 
          width: "40px", 
          height: "40px", 
          backgroundColor: "var(--bg-light)", /* Destaca o botão contra o fundo */
          border: "1px solid var(--border-color)"
        }}
      >
        <i className="fas fa-chevron-left text-success"></i>
      </Button>

      {/* Indicador de Páginas */}
      <div className="text-dark d-flex align-items-center gap-2">
        <span className="fw-bold fs-5">{currentPage + 1}</span>
        <span className="text-muted small text-uppercase fw-bold">de</span>
        <span className="fw-bold fs-5">{totalPages}</span>
      </div>

      {/* Botão Próximo */}
      <Button
        variant="link"
        className="rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center text-decoration-none"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage >= totalPages - 1 || loading}
        style={{ 
          width: "40px", 
          height: "40px", 
          backgroundColor: "var(--bg-light)", 
          border: "1px solid var(--border-color)"
        }}
      >
        <i className="fas fa-chevron-right text-success"></i>
      </Button>
    </div>
  );
}