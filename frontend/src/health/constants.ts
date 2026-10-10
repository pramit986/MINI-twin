// Health constants and multipliers
// Sources:
// Protein multipliers: ICMR-NIN 2020 / WHO
// Calorie multipliers (Mifflin-St Jeor): standard metabolic reference

export const PROTEIN_MULTIPLIERS_ADULT = {
  sedentary: 0.8,
  light: 1.0,
  moderate: 1.2,
  active: 1.4,
  very_active: 1.6
};

export const PROTEIN_MULTIPLIERS_YOUTH = {
  base: 0.85,
  light: 0.95,
  moderate: 1.05,
  active: 1.2,
  very_active: 1.2
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export const WATER_BASE_ML_PER_KG = 33;
export const WATER_EXERCISE_ML_PER_HOUR = 500;
export const WATER_MIN_ML = 1500;
export const WATER_MAX_ML = 4500;
