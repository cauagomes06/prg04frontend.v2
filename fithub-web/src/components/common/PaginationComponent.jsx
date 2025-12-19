import React from 'react';

export function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  // Não renderiza nada se houver apenas uma página ou nenhuma
  if (totalPages <= 1) return null;

  // Cria um array com os números das páginas (ex: [0, 1, 2])
  const pages = [...Array(totalPages).keys()];

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination shadow-sm">
        {/* Botão Anterior */}
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button 
            className="page-link border-0 text-success" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <i className="fas fa-chevron-left small"></i>
          </button>
        </li>

        {/* Números das Páginas */}
        {pages.map((page) => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button 
              className={`page-link border-0 ${currentPage === page ? 'bg-success text-white' : 'text-dark'}`}
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
          </li>
        ))}

        {/* Botão Próximo */}
        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link border-0 text-success" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            <i className="fas fa-chevron-right small"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}