import React from 'react';
import { Pagination } from 'react-bootstrap';

export function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        <Pagination.First 
          disabled={currentPage === 0} 
          onClick={() => onPageChange(0)} 
        />
        <Pagination.Prev 
          disabled={currentPage === 0} 
          onClick={() => onPageChange(currentPage - 1)} 
        />
        
        {/* Mostra a página atual e o total */}
        <Pagination.Item active>
          {currentPage + 1} de {totalPages}
        </Pagination.Item>

        <Pagination.Next 
          disabled={currentPage === totalPages - 1} 
          onClick={() => onPageChange(currentPage + 1)} 
        />
        <Pagination.Last 
          disabled={currentPage === totalPages - 1} 
          onClick={() => onPageChange(totalPages - 1)} 
        />
      </Pagination>
    </div>
  );
}