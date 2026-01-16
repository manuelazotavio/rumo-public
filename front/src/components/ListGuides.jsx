import React, { useState, useMemo, useEffect } from 'react';
import CardGuide from './CardGuide';


const ListGuides = ({ guides = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const guidesPerPage = 9;
  
  const safeGuides = Array.isArray(guides) ? guides : [];
  
  useEffect(() => {
    setCurrentPage(1);
  }, [safeGuides]);
  
  const currentGuides = useMemo(() => {
    const startIndex = (currentPage - 1) * guidesPerPage;
    const endIndex = startIndex + guidesPerPage;
    return safeGuides.slice(startIndex, endIndex);
  }, [safeGuides, currentPage, guidesPerPage]);
  
 
  const totalPages = Math.ceil(safeGuides.length / guidesPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="list-guides">
        {currentGuides.map((item) => (
          <CardGuide key={item.id} guide={item} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Página {currentPage} de {totalPages} - 
            Mostrando {currentGuides.length} de {safeGuides.length} guias
          </div>
          
          <div className="pagination">
            {currentPage > 1 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(1)}
                title="Primeira página"
              >
                ««
              </button>
            )}
            
            {currentPage > 1 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                title="Página anterior"
              >
                ‹
              </button>
            )}
            
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            
  
            {currentPage < totalPages && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                title="Próxima página"
              >
                ›
              </button>
            )}
            

            {currentPage < totalPages && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(totalPages)}
                title="Última página"
              >
                »»
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ListGuides
