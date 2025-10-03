import React from 'react';

type Section = 'NASA' | 'IA';

interface NavbarProps {
  active: Section;
  onSelect: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ active, onSelect }) => {
  return (
    <nav className="bg-slate-800 border border-slate-700 rounded-lg mx-auto mt-2 w-fit px-3">
      <div className="px-2">
        <ul className="flex items-center justify-center gap-6">
          <li>
            <button
              type="button"
              onClick={() => onSelect('NASA')}
              className={`py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                active === 'NASA'
                  ? 'text-white bg-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              KOI Database (NASA)
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onSelect('IA')}
              className={`py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                active === 'IA'
                  ? 'text-white bg-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              KOI Analyse (AI)
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

