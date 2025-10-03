import React, { useState, useMemo } from 'react';
import type { Exoplanet } from '../types';

interface Column {
  key: keyof Exoplanet;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: Exoplanet) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  data: Exoplanet[];
  columns: Column[];
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

const DataTable: React.FC<DataTableProps> = ({ data, columns, pageSize = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Exoplanet | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage par recherche
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      Object.values(row).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Gestion des valeurs null/undefined
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

      // Tri numérique
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Tri alphabétique
      const aStr = aValue.toString().toLowerCase();
      const bStr = bValue.toString().toLowerCase();
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (column: keyof Exoplanet) => {
    if (sortColumn === column) {
      // Cycle: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: keyof Exoplanet) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    if (sortDirection === 'desc') {
      return (
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    
    return null;
  };

  const renderPaginationButton = (page: number, label?: string) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      disabled={page === currentPage}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        page === currentPage
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      } disabled:cursor-not-allowed`}
    >
      {label || page}
    </button>
  );

  const renderPagination = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    // Bouton précédent
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md transition-colors"
        >
          ← Précédent
        </button>
      );
    }

    // Pages visibles
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(renderPaginationButton(i));
    }

    // Bouton suivant
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md transition-colors"
        >
          Suivant →
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Barre de recherche et informations */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Rechercher dans les données..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset à la première page lors de la recherche
              }}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <div className="text-sm text-slate-400">
              {filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''}
              {searchTerm && ` (filtré${filteredData.length !== data.length ? 's' : ''} sur ${data.length})`}
            </div>
          </div>
          
          <div className="text-sm text-slate-400">
            Page {currentPage} sur {totalPages}
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-slate-800/50' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  {searchTerm ? 'Aucun résultat trouvé pour votre recherche.' : 'Aucune donnée disponible.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row.kepoi_name || index} className="hover:bg-slate-700/50 transition-colors duration-200">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      {column.render ? column.render(row[column.key], row) : (row[column.key] ?? 'N/A')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Affichage de {startIndex + 1} à {Math.min(startIndex + pageSize, sortedData.length)} sur {sortedData.length} résultats
          </div>
          <div className="flex items-center gap-2">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
