'use client';

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disableNext?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    disableNext = false,
}) => {
    // Helper to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 8) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Logic to match 1 2 3 4 5 6 ... 10
            for (let i = 1; i <= 6; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-16 text-base font-sans">
            {/* Précédent */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${currentPage === 1 ? 'text-[#C5C5C5] cursor-not-allowed' : 'text-black'
                    }`}
            >
                <div className="w-2 h-2 border-l border-t border-current rotate-[-45deg] mr-1" />
                <span className="text-[17px]">Précédent</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-0 mx-2">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-4 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`min-w-[40px] h-10 flex items-center justify-center transition-colors text-[17px] ${currentPage === page
                                        ? 'text-black border-b-2'
                                        : 'text-black'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Suivant */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disableNext || currentPage === totalPages}
                className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${disableNext || currentPage === totalPages ? 'text-[#C5C5C5] cursor-not-allowed' : 'text-black'
                    }`}
            >
                <span className="text-[17px]">Suivant</span>
                <div className="w-2 h-2 border-r border-t border-current rotate-[45deg] ml-1" />
            </button>
        </div>
    );
};

export default Pagination;
