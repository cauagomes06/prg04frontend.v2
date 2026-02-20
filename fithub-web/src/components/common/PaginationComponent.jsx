import React from 'react';
import { Button } from 'react-bootstrap';

export function PaginationComponent({ currentPage, totalPages, onPageChange, loading }) {
  // Não renderiza nada se houver apenas uma página ou nenhuma
  if (totalPages <= 1) return null;

  return (
    <div
      className="pagination-wrapper d-flex justify-content-center align-items-center gap-4 mt-5 p-3 bg-white rounded-pill shadow-sm mx-auto"
      style={{ maxWidth: "fit-content" }}
    >
      {/* Botão Voltar */}
      <Button
        variant="light"
        className="rounded-circle shadow-sm p-2"
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0 || loading}
      >
        <i className="fas fa-chevron-left text-success"></i>
      </Button>

      {/* Indicador de Páginas */}
      <div className="text-dark">
        <span className="fw-bold fs-5">{currentPage + 1}</span>
        <span className="text-muted mx-2">de</span>
        <span className="fw-bold fs-5">{totalPages}</span>
      </div>

      {/* Botão Próximo */}
      <Button
        variant="light"
        className="rounded-circle shadow-sm p-2"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage >= totalPages - 1 || loading}
      >
        <i className="fas fa-chevron-right text-success"></i>
      </Button>
    </div>
  );
}