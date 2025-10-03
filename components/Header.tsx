
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-700">
      <div className="container mx-auto flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.88 5.38c.44-.06.88-.13 1.31-.18.44-.05.88-.1 1.32-.14 2.87-.29 5.62 1.58 6.2 4.49.58 2.9-1.29 5.65-4.2 6.23-2.9.58-5.65-1.29-6.23-4.19-.24-1.19.02-2.43.68-3.48.2-.31.42-.61.66-.88.24-.27.5-.52.78-.75.31-.25.64-.48.98-.68zm-3.61 2.3c.31-1.25 1.15-2.26 2.29-2.73-.59.39-1.12.87-1.57 1.42-.45.55-.8 1.18-1.03 1.87-.11.34-.19.7-.24 1.06-.05.36-.05.73-.01 1.09.28 2.45 2.5 4.2 4.95 3.92 2.45-.28 4.2-2.5 3.92-4.95-.08-.71-.34-1.38-.75-1.95s-.96-1.02-1.6-1.33c.96.25 1.77 1.03 2.05 2 .28.97-.04 2.05-.82 2.73s-1.79 1-2.76.71c-.97-.28-1.63-1.15-1.7-2.13-.04-.53.08-1.06.34-1.52z"/>
        </svg>
        <div>
            <h1 className="text-2xl font-bold text-cyan-400">KOI Data Explorer</h1>
            <p className="text-sm text-slate-400">Kepler Objects of Interest - Cumulative Data</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
