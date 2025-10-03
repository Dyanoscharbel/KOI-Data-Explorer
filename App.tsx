
import React, { useState, useEffect, useCallback } from 'react';
import type { Exoplanet, Filters } from './types';
import { PlanetType } from './types';
import { fetchExoplanetData } from './services/nasaApiService';
import { RESULT_COLUMNS, PLANET_TYPES_MAP } from './constants';
import { downloadCSV, downloadFormattedCSV } from './utils/csvExport';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import QueryDisplay from './components/QueryDisplay';
import ResultsTable from './components/ResultsTable';
import LoadingSpinner from './components/LoadingSpinner';

type Section = 'NASA' | 'IA';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('NASA');
  const [filters, setFilters] = useState<Filters>({
    discoveryFacilities: ['CANDIDATE', 'CONFIRMED'],
    detectionMethod: '',
    planetTypes: [],
    hostName: '',
  });
  const [adqlQuery, setAdqlQuery] = useState('');
  const [results, setResults] = useState<Exoplanet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buildQuery = () => {
      const selectClause = `SELECT ${RESULT_COLUMNS.join(', ')} FROM cumulative`;
      const whereClauses: string[] = [];

      // Filtrer par disposition KOI
      if (filters.discoveryFacilities.length > 0) {
        const dispositions = filters.discoveryFacilities.map(d => `'${d}'`).join(', ');
        whereClauses.push(`koi_disposition IN (${dispositions})`);
      }

      // Les données KOI sont toutes des transits Kepler, donc pas besoin de filtrer par méthode
      // if (filters.detectionMethod) {
      //   whereClauses.push(`discoverymethod = '${filters.detectionMethod}'`);
      // }

      if (filters.hostName) {
        whereClauses.push(`kepler_name LIKE '%${filters.hostName.trim()}%'`);
      }
      
      if (filters.planetTypes.length > 0) {
        const planetTypeClauses = filters.planetTypes
          .map(type => PLANET_TYPES_MAP[type as PlanetType])
          .filter(Boolean);
        if (planetTypeClauses.length > 0) {
            whereClauses.push(`(${planetTypeClauses.join(' OR ')})`);
        }
      }

      const query = whereClauses.length > 0
        ? `${selectClause} WHERE ${whereClauses.join(' AND ')}`
        : selectClause;
      
      setAdqlQuery(query);
    };

    buildQuery();
  }, [filters]);

  const handleFilterChange = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const data = await fetchExoplanetData(adqlQuery);
      setResults(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [adqlQuery]);

  const handleDownloadJSON = useCallback(() => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'koi_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [results]);

  const handleDownloadCSV = useCallback(() => {
    downloadCSV(results, 'koi_data_complete.csv');
  }, [results]);

  const handleDownloadFormattedCSV = useCallback(() => {
    downloadFormattedCSV(results, 'koi_data_formatted.csv');
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header />
      <Navbar active={activeSection} onSelect={setActiveSection} />
      <main className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FilterPanel mode={activeSection} filters={filters} onFilterChange={handleFilterChange} />
            <QueryDisplay query={adqlQuery} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <p className="text-slate-400 text-sm">
                  {results.length > 0 ? `${results.length} records found.` : 'Ready to search the stars.'}
                </p>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                >
                  {isLoading ? 'Searching...' : 'Launch Search'}
                </button>
              </div>
              
              {results.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-xs mb-3">Export Options:</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDownloadJSON}
                      disabled={isLoading}
                      className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-300 font-medium py-2 px-3 rounded text-sm transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0012.172 2H6zm7 1.414L18.586 9H14a1 1 0 01-1-1V3.414z" />
                      </svg>
                      JSON
                    </button>
                    <button
                      onClick={handleDownloadFormattedCSV}
                      disabled={isLoading}
                      className="bg-green-700 hover:bg-green-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded text-sm transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3 5a2 2 0 012-2h3v3H5v14h14v-3h3v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                        <path d="M10 3h11a1 1 0 011 1v11a1 1 0 01-1 1H10a1 1 0 01-1-1V4a1 1 0 011-1zm2 3v6h2V6h-2zm4 2v4h2V8h-2z" />
                      </svg>
                      CSV (Formatted)
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      disabled={isLoading}
                      className="bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded text-sm transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M9 2a1 1 0 00-1 1v2H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H9zm7 5v2H8V7h8zM8 11h8v2H8v-2zm0 4h5v2H8v-2z" />
                      </svg>
                      CSV (Complete)
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    <span className="font-medium">Formatted:</span> Main columns with readable headers • 
                    <span className="font-medium">Complete:</span> All available data columns
                  </p>
                </div>
              )}
            </div>

            <div className="min-h-[400px] flex items-center justify-center">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg w-full text-center">
                  <h3 className="font-bold text-lg mb-2">Search Failed</h3>
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <ResultsTable results={results} />
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-500 border-t border-slate-800 mt-8">
        KOI Data Explorer | Kepler Objects of Interest from NASA Exoplanet Archive
      </footer>
    </div>
  );
};

export default App;
