import type { Exoplanet } from '../types';

/**
 * Convertit un tableau d'objets Exoplanet en format CSV
 */
export const convertToCSV = (data: Exoplanet[]): string => {
  if (data.length === 0) {
    return '';
  }

  // Obtenir toutes les clés de l'objet (colonnes)
  const headers = Object.keys(data[0]) as (keyof Exoplanet)[];
  
  // Créer la ligne d'en-tête
  const csvHeaders = headers.join(',');
  
  // Convertir chaque ligne de données
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      
      // Gérer les valeurs null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Gérer les chaînes de caractères qui contiennent des virgules ou des guillemets
      if (typeof value === 'string') {
        // Échapper les guillemets en les doublant et entourer de guillemets si nécessaire
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      
      // Pour les nombres, les convertir en string
      return String(value);
    }).join(',');
  });
  
  // Combiner en-têtes et données
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Télécharge les données au format CSV
 */
export const downloadCSV = (data: Exoplanet[], filename: string = 'koi_data.csv'): void => {
  const csvContent = convertToCSV(data);
  
  if (!csvContent) {
    console.warn('Aucune donnée à exporter');
    return;
  }
  
  // Créer un blob avec le contenu CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Créer un lien de téléchargement
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Ajouter au DOM, cliquer et nettoyer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libérer la mémoire
  URL.revokeObjectURL(url);
};

/**
 * Convertit les données en CSV avec colonnes sélectionnées et formatage personnalisé
 */
export const convertToFormattedCSV = (data: Exoplanet[]): string => {
  if (data.length === 0) {
    return '';
  }

  // Colonnes principales avec leurs labels
  const selectedColumns: { key: keyof Exoplanet; label: string }[] = [
    { key: 'kepoi_name', label: 'KOI Name' },
    { key: 'kepler_name', label: 'Kepler Name' },
    { key: 'kepid', label: 'KepID' },
    { key: 'koi_disposition', label: 'Disposition' },
    { key: 'koi_score', label: 'Score' },
    { key: 'koi_period', label: 'Period (days)' },
    { key: 'koi_period_err1', label: 'Period Error +' },
    { key: 'koi_period_err2', label: 'Period Error -' },
    { key: 'koi_prad', label: 'Planet Radius (Earth radii)' },
    { key: 'koi_prad_err1', label: 'Planet Radius Error +' },
    { key: 'koi_prad_err2', label: 'Planet Radius Error -' },
    { key: 'koi_teq', label: 'Equilibrium Temperature (K)' },
    { key: 'koi_insol', label: 'Insolation (Earth flux)' },
    { key: 'koi_sma', label: 'Semi-major Axis (AU)' },
    { key: 'koi_eccen', label: 'Eccentricity' },
    { key: 'koi_incl', label: 'Inclination (deg)' },
    { key: 'koi_depth', label: 'Transit Depth (ppm)' },
    { key: 'koi_duration', label: 'Transit Duration (hrs)' },
    { key: 'koi_steff', label: 'Stellar Effective Temperature (K)' },
    { key: 'koi_slogg', label: 'Stellar Surface Gravity (log10(cm/s^2))' },
    { key: 'koi_smet', label: 'Stellar Metallicity (dex)' },
    { key: 'koi_srad', label: 'Stellar Radius (Solar radii)' },
    { key: 'koi_smass', label: 'Stellar Mass (Solar masses)' },
    { key: 'koi_kepmag', label: 'Kepler Magnitude' },
    { key: 'ra_str', label: 'Right Ascension' },
    { key: 'dec_str', label: 'Declination' },
    { key: 'koi_num_transits', label: 'Number of Transits' },
    { key: 'koi_quarters', label: 'Quarters' },
    { key: 'koi_comment', label: 'Comments' }
  ];
  
  // Créer la ligne d'en-tête avec les labels
  const csvHeaders = selectedColumns.map(col => col.label).join(',');
  
  // Convertir chaque ligne de données
  const csvRows = data.map(row => {
    return selectedColumns.map(col => {
      const value = row[col.key];
      
      // Gérer les valeurs null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Gérer les chaînes de caractères
      if (typeof value === 'string') {
        // Échapper les guillemets et entourer de guillemets si nécessaire
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      
      // Pour les nombres, les formater avec une précision appropriée
      if (typeof value === 'number') {
        // Formater selon le type de colonne
        if (col.key.includes('period') && !col.key.includes('err')) {
          return value.toFixed(6); // Période avec haute précision
        } else if (col.key.includes('prad') || col.key.includes('srad') || col.key.includes('smass')) {
          return value.toFixed(3); // Rayons et masses
        } else if (col.key.includes('teq') || col.key.includes('steff')) {
          return Math.round(value).toString(); // Températures en entiers
        } else if (col.key.includes('mag')) {
          return value.toFixed(3); // Magnitudes
        } else if (col.key.includes('err')) {
          return value.toFixed(6); // Erreurs avec haute précision
        } else {
          return value.toString(); // Autres valeurs
        }
      }
      
      return String(value);
    }).join(',');
  });
  
  // Combiner en-têtes et données
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Télécharge les données au format CSV avec formatage personnalisé
 */
export const downloadFormattedCSV = (data: Exoplanet[], filename: string = 'koi_data_formatted.csv'): void => {
  const csvContent = convertToFormattedCSV(data);
  
  if (!csvContent) {
    console.warn('Aucune donnée à exporter');
    return;
  }
  
  // Créer un blob avec le contenu CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Créer un lien de téléchargement
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Ajouter au DOM, cliquer et nettoyer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libérer la mémoire
  URL.revokeObjectURL(url);
};
