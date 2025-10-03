
import React from 'react';
import type { Filters } from '../types';
import { DETECTION_METHODS, DISCOVERY_FACILITIES, PLANET_TYPES_MAP } from '../constants';
import { PlanetType } from '../types';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  mode?: 'NASA' | 'IA';
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2 mb-3">{title}</h3>
    {children}
  </div>
);

const Checkbox: React.FC<{ id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white transition-colors duration-200">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500"
    />
    <span>{label}</span>
  </label>
);

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, mode = 'NASA' }) => {

  const handleCheckboxGroupChange = (key: 'discoveryFacilities' | 'planetTypes', value: string, isChecked: boolean) => {
    const currentValues = filters[key] as string[];
    const newValues = isChecked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);
    onFilterChange(key, newValues);
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
      {mode === 'IA' && (
        <FilterSection title="IA Options">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white transition-colors duration-200">
              <input
                type="checkbox"
                checked={!!filters.aiGeneratedOnly}
                onChange={(e) => onFilterChange('aiGeneratedOnly', e.target.checked as any)}
                className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Afficher uniquement les lignes générées par l'IA</span>
            </label>
          </div>
        </FilterSection>
      )}
      <FilterSection title="KOI Disposition">
        <div className="space-y-2">
          {['CANDIDATE', 'CONFIRMED', 'FALSE POSITIVE'].map((disposition) => (
            <Checkbox
              key={disposition}
              id={`disposition-${disposition}`}
              label={disposition}
              checked={filters.discoveryFacilities.includes(disposition)}
              onChange={(isChecked) => handleCheckboxGroupChange('discoveryFacilities', disposition, isChecked)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Planet Type (by Radius)">
         <div className="space-y-2">
          {Object.values(PlanetType).map((type) => (
             <Checkbox
              key={type}
              id={`type-${type}`}
              label={type}
              checked={filters.planetTypes.includes(type)}
              onChange={(isChecked) => handleCheckboxGroupChange('planetTypes', type, isChecked)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Kepler Name">
        <input
          type="text"
          placeholder="e.g., Kepler-452"
          value={filters.hostName}
          onChange={(e) => onFilterChange('hostName', e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </FilterSection>
    </div>
  );
};

export default FilterPanel;
