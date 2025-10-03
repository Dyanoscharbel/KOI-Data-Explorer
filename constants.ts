
import { PlanetType } from './types';

export const NASA_TAP_API_URL = "https://koi-data-explorer.vercel.app/api/exoplanets";

export const DISCOVERY_FACILITIES = [
  'Kepler',
  'TESS',
  'TRAPPIST',
  'CoRoT',
  'WASP',
  'KELT',
  'HAT'
];

export const DETECTION_METHODS = [
  'Transit',
  'Radial Velocity',
  'Imaging',
  'Microlensing'
];

export const PLANET_TYPES_MAP: Record<PlanetType, string> = {
  [PlanetType.ROCKY]: '(koi_prad < 1.6)',
  [PlanetType.SUPER_EARTH]: '(koi_prad >= 1.6 AND koi_prad < 4)',
  [PlanetType.GAS_GIANT]: '(koi_prad >= 4)',
};

// Colonnes principales pour la table KOI cumulative (sélection des plus importantes)
export const RESULT_COLUMNS = [

  "dec", "dec_err", "dec_str", "kepid", "kepler_name", "kepoi_name", "koi_bin_oedp_sig",
  "koi_comment", "koi_count", "koi_datalink_dvr", "koi_datalink_dvs", "koi_delivname",
  "koi_depth", "koi_depth_err1", "koi_depth_err2", "koi_dicco_mdec", "koi_dicco_mdec_err",
  "koi_dicco_mra", "koi_dicco_mra_err", "koi_dicco_msky", "koi_dicco_msky_err",
  "koi_dikco_mdec", "koi_dikco_mdec_err", "koi_dikco_mra", "koi_dikco_mra_err",
  "koi_dikco_msky", "koi_dikco_msky_err", "koi_disp_prov", "koi_disposition",
  "koi_dor", "koi_dor_err1", "koi_dor_err2", "koi_duration", "koi_duration_err1",
  "koi_duration_err2", "koi_eccen", "koi_eccen_err1", "koi_eccen_err2", "koi_fittype",
  "koi_fpflag_co", "koi_fpflag_ec", "koi_fpflag_nt", "koi_fpflag_ss", "koi_fwm_pdeco",
  "koi_fwm_pdeco_err", "koi_fwm_prao", "koi_fwm_prao_err", "koi_fwm_sdec", "koi_fwm_sdec_err",
  "koi_fwm_sdeco", "koi_fwm_sdeco_err", "koi_fwm_sra", "koi_fwm_sra_err", "koi_fwm_srao",
  "koi_fwm_srao_err", "koi_fwm_stat_sig", "koi_gmag", "koi_gmag_err", "koi_hmag",
  "koi_hmag_err", "koi_imag", "koi_imag_err", "koi_impact", "koi_impact_err1",
  "koi_impact_err2", "koi_incl", "koi_incl_err1", "koi_incl_err2", "koi_ingress",
  "koi_ingress_err1", "koi_ingress_err2", "koi_insol", "koi_insol_err1", "koi_insol_err2",
  "koi_jmag", "koi_jmag_err", "koi_kepmag", "koi_kepmag_err", "koi_kmag", "koi_kmag_err",
  "koi_ldm_coeff1", "koi_ldm_coeff2", "koi_ldm_coeff3", "koi_ldm_coeff4", "koi_limbdark_mod",
  "koi_longp", "koi_longp_err1", "koi_longp_err2", "koi_max_mult_ev", "koi_max_sngle_ev",
  "koi_model_chisq", "koi_model_dof", "koi_model_snr", "koi_num_transits", "koi_parm_prov",
  "koi_pdisposition", "koi_period", "koi_period_err1", "koi_period_err2", "koi_prad",
  "koi_prad_err1", "koi_prad_err2", "koi_quarters", "koi_rmag", "koi_rmag_err", "koi_ror",
  "koi_ror_err1", "koi_ror_err2", "koi_sage", "koi_sage_err1", "koi_sage_err2", "koi_score",
  "koi_slogg", "koi_slogg_err1", "koi_slogg_err2", "koi_sma", "koi_sma_err1", "koi_sma_err2",
  "koi_smass", "koi_smass_err1", "koi_smass_err2", "koi_smet", "koi_smet_err1", "koi_smet_err2",
  "koi_sparprov", "koi_srad", "koi_srad_err1", "koi_srad_err2", "koi_srho", "koi_srho_err1",
  "koi_srho_err2", "koi_steff", "koi_steff_err1", "koi_steff_err2", "koi_tce_delivname",
  "koi_tce_plnt_num", "koi_teq", "koi_teq_err1", "koi_teq_err2", "koi_time0", "koi_time0_err1",
  "koi_time0_err2", "koi_time0bk", "koi_time0bk_err1", "koi_time0bk_err2", "koi_trans_mod",
  "koi_vet_date", "koi_vet_stat", "koi_zmag", "koi_zmag_err", "ra", "ra_err", "ra_str","rowid",
];

// Toutes les colonnes disponibles (pour référence)
export const ALL_COLUMNS = [
  "dec", "dec_err", "dec_str", "kepid", "kepler_name", "kepoi_name", "koi_bin_oedp_sig",
  "koi_comment", "koi_count", "koi_datalink_dvr", "koi_datalink_dvs", "koi_delivname",
  "koi_depth", "koi_depth_err1", "koi_depth_err2", "koi_dicco_mdec", "koi_dicco_mdec_err",
  "koi_dicco_mra", "koi_dicco_mra_err", "koi_dicco_msky", "koi_dicco_msky_err",
  "koi_dikco_mdec", "koi_dikco_mdec_err", "koi_dikco_mra", "koi_dikco_mra_err",
  "koi_dikco_msky", "koi_dikco_msky_err", "koi_disp_prov", "koi_disposition",
  "koi_dor", "koi_dor_err1", "koi_dor_err2", "koi_duration", "koi_duration_err1",
  "koi_duration_err2", "koi_eccen", "koi_eccen_err1", "koi_eccen_err2", "koi_fittype",
  "koi_fpflag_co", "koi_fpflag_ec", "koi_fpflag_nt", "koi_fpflag_ss", "koi_fwm_pdeco",
  "koi_fwm_pdeco_err", "koi_fwm_prao", "koi_fwm_prao_err", "koi_fwm_sdec", "koi_fwm_sdec_err",
  "koi_fwm_sdeco", "koi_fwm_sdeco_err", "koi_fwm_sra", "koi_fwm_sra_err", "koi_fwm_srao",
  "koi_fwm_srao_err", "koi_fwm_stat_sig", "koi_gmag", "koi_gmag_err", "koi_hmag",
  "koi_hmag_err", "koi_imag", "koi_imag_err", "koi_impact", "koi_impact_err1",
  "koi_impact_err2", "koi_incl", "koi_incl_err1", "koi_incl_err2", "koi_ingress",
  "koi_ingress_err1", "koi_ingress_err2", "koi_insol", "koi_insol_err1", "koi_insol_err2",
  "koi_jmag", "koi_jmag_err", "koi_kepmag", "koi_kepmag_err", "koi_kmag", "koi_kmag_err",
  "koi_ldm_coeff1", "koi_ldm_coeff2", "koi_ldm_coeff3", "koi_ldm_coeff4", "koi_limbdark_mod",
  "koi_longp", "koi_longp_err1", "koi_longp_err2", "koi_max_mult_ev", "koi_max_sngle_ev",
  "koi_model_chisq", "koi_model_dof", "koi_model_snr", "koi_num_transits", "koi_parm_prov",
  "koi_pdisposition", "koi_period", "koi_period_err1", "koi_period_err2", "koi_prad",
  "koi_prad_err1", "koi_prad_err2", "koi_quarters", "koi_rmag", "koi_rmag_err", "koi_ror",
  "koi_ror_err1", "koi_ror_err2", "koi_sage", "koi_sage_err1", "koi_sage_err2", "koi_score",
  "koi_slogg", "koi_slogg_err1", "koi_slogg_err2", "koi_sma", "koi_sma_err1", "koi_sma_err2",
  "koi_smass", "koi_smass_err1", "koi_smass_err2", "koi_smet", "koi_smet_err1", "koi_smet_err2",
  "koi_sparprov", "koi_srad", "koi_srad_err1", "koi_srad_err2", "koi_srho", "koi_srho_err1",
  "koi_srho_err2", "koi_steff", "koi_steff_err1", "koi_steff_err2", "koi_tce_delivname",
  "koi_tce_plnt_num", "koi_teq", "koi_teq_err1", "koi_teq_err2", "koi_time0", "koi_time0_err1",
  "koi_time0_err2", "koi_time0bk", "koi_time0bk_err1", "koi_time0bk_err2", "koi_trans_mod",
  "koi_vet_date", "koi_vet_stat", "koi_zmag", "koi_zmag_err", "ra", "ra_err", "ra_str","rowid",
];
