
import React from 'react';
import DataTable from './DataTable';
import type { Exoplanet } from '../types';

interface ResultsTableProps {
  results: Exoplanet[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
        <p className="text-slate-400">No results to display. Adjust your filters and launch a search.</p>
      </div>
    );
  }

  const columns = [
    {
      key: 'kepoi_name' as keyof Exoplanet,
      label: 'KOI Name',
      width: '120px',
      render: (value: string) => (
        <span className="font-medium text-white">{value}</span>
      )
    },
    {
      key: 'kepler_name' as keyof Exoplanet,
      label: 'Kepler Name',
      width: '160px',
      render: (value: string | null, row: Exoplanet) => {
        const display = value || 'N/A';
        if (!value) {
          return <span className="text-slate-500">{display}</span>;
        }
        const targetName = value || row.kepoi_name;
        const url = `https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(targetName)}`;
        return (
          <span className="group inline-flex items-center gap-1 text-cyan-300">
            {display}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Ouvrir la page de ${targetName}`}
              aria-label={`Ouvrir la page de ${targetName}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center text-cyan-300 hover:text-cyan-200"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z" />
                <path d="M5 5h6v2H7v10h10v-4h2v6a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1z" />
              </svg>
            </a>
          </span>
        );
      }
    },
    {
      key: 'koi_disposition' as keyof Exoplanet,
      label: 'Disposition',
      width: '120px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'CONFIRMED' ? 'bg-green-900 text-green-200' :
          value === 'CANDIDATE' ? 'bg-yellow-900 text-yellow-200' :
          'bg-red-900 text-red-200'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'koi_score' as keyof Exoplanet,
      label: 'Score',
      width: '80px',
      render: (value: number | null) => {
        if (value === null) return <span className="text-slate-500">N/A</span>;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            value >= 0.8 ? 'bg-green-800 text-green-200' :
            value >= 0.5 ? 'bg-yellow-800 text-yellow-200' :
            'bg-red-800 text-red-200'
          }`}>
            {value.toFixed(2)}
          </span>
        );
      }
    },
    {
      key: 'koi_period' as keyof Exoplanet,
      label: 'Période (j)',
      width: '100px',
      render: (value: number | null, row: Exoplanet) => (
        <div>
          <div>{value !== null ? value.toFixed(3) : 'N/A'}</div>
          {row.koi_period_err1 && (
            <div className="text-xs text-slate-500">±{row.koi_period_err1.toFixed(5)}</div>
          )}
        </div>
      )
    },
    {
      key: 'koi_prad' as keyof Exoplanet,
      label: 'Rayon (R⊕)',
      width: '100px',
      render: (value: number | null, row: Exoplanet) => (
        <div>
          <div>{value !== null ? value.toFixed(2) : 'N/A'}</div>
          {row.koi_prad_err1 && (
            <div className="text-xs text-slate-500">
              +{row.koi_prad_err1.toFixed(2)}/{row.koi_prad_err2?.toFixed(2)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'koi_teq' as keyof Exoplanet,
      label: 'Temp (K)',
      width: '80px',
      render: (value: number | null) => (
        <span>{value !== null ? Math.round(value) : 'N/A'}</span>
      )
    },
    {
      key: 'koi_insol' as keyof Exoplanet,
      label: 'Insolation',
      width: '90px',
      render: (value: number | null) => (
        <span>{value !== null ? value.toFixed(1) : 'N/A'}</span>
      )
    },
    {
      key: 'koi_smass' as keyof Exoplanet,
      label: 'M★ (M☉)',
      width: '80px',
      render: (value: number | null) => (
        <span>{value !== null ? value.toFixed(2) : 'N/A'}</span>
      )
    },
    {
      key: 'koi_steff' as keyof Exoplanet,
      label: 'T★ (K)',
      width: '80px',
      render: (value: number | null) => (
        <span>{value !== null ? Math.round(value) : 'N/A'}</span>
      )
    },
    {
      key: 'koi_num_transits' as keyof Exoplanet,
      label: 'Transits',
      width: '80px',
      render: (value: number | null) => (
        <span className="text-cyan-300">{value || 'N/A'}</span>
      )
    },
    {
      key: 'ra_str' as keyof Exoplanet,
      label: 'RA',
      width: '100px',
      render: (value: string | null) => (
        <span className="text-xs font-mono">{value || 'N/A'}</span>
      )
    },
    {
      key: 'dec_str' as keyof Exoplanet,
      label: 'Dec',
      width: '100px',
      render: (value: string | null) => (
        <span className="text-xs font-mono">{value || 'N/A'}</span>
      )
    },
    {
      key: 'koi_kepmag' as keyof Exoplanet,
      label: 'Kep Mag',
      width: '80px',
      render: (value: number | null) => (
        <span>{value !== null ? value.toFixed(2) : 'N/A'}</span>
      )
    },
    
  ];

  return <DataTable data={results} columns={columns} pageSize={25} />;
};

export default ResultsTable;
