
import React, { useCallback } from 'react';

interface QueryDisplayProps {
  query: string;
}

const QueryDisplay: React.FC<QueryDisplayProps> = ({ query }) => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(query);
  }, [query]);

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-cyan-400">Generated ADQL Query</h3>
        <button
          onClick={handleCopy}
          className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-md text-sm transition-colors duration-200"
        >
          Copy
        </button>
      </div>
      <pre className="bg-black/50 p-3 rounded-md overflow-x-auto text-sm text-yellow-300">
        <code className="font-mono">{query}</code>
      </pre>
    </div>
  );
};

export default QueryDisplay;
