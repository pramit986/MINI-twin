import { PROTEIN_MULTIPLIERS_ADULT, PROTEIN_MULTIPLIERS_YOUTH, ACTIVITY_MULTIPLIERS, WATER_BASE_ML_PER_KG, WATER_EXERCISE_ML_PER_HOUR, WATER_MIN_ML, WATER_MAX_ML } from './constants';

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number, category: string, percentile?: number } {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  
  // Assuming adult for now, youth LMS requires CDC tables which would be imported via migration
  // and passed in. Since we don't have the LMS params in memory here without DB, 
  // we'll provide standard WHO for adults as a fallback.
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

export function calculateProtein(weightKg: number, age: number, activityLevel: string, goal: string, conditions: string[]): { target: number, range: [number, number], message?: string } {
  if (conditions && conditions.length > 0 && !conditions.includes('none')) {
    return { target: 0, range: [0, 0], message: 'Talk to a doctor before following a protein target' };
  }

  let multiplier = 0.8;
  const act = (activityLevel || 'sedentary').toLowerCase().replace(' ', '_');

  if (age >= 20) {
    multiplier = PROTEIN_MULTIPLIERS_ADULT[act as keyof typeof PROTEIN_MULTIPLIERS_ADULT] || 0.8;
    if (goal === 'gain') multiplier = Math.max(1.6, multiplier);
    else if (goal === 'lose') multiplier = Math.max(1.2, Math.min(1.6, multiplier));
  } else {
    multiplier = PROTEIN_MULTIPLIERS_YOUTH[act as keyof typeof PROTEIN_MULTIPLIERS_YOUTH] || 0.85;
  }

  // Hard caps
  if (age >= 20 && multiplier > 2.0) multiplier = 2.0;
  if (age < 20 && multiplier > 1.5) multiplier = 1.5;

  const target = Math.round(weightKg * multiplier);
  return { target, range: [target - 10, target + 10] };
}

export function calculateWater(weightKg: number, exerciseHours: number): { targetMl: number, glasses: number } {
  let ml = weightKg * WATER_BASE_ML_PER_KG + (exerciseHours * WATER_EXERCISE_ML_PER_HOUR);
  ml = Math.max(WATER_MIN_ML, Math.min(WATER_MAX_ML, ml));
  return { targetMl: Math.round(ml), glasses: Math.round(ml / 250) };
}

export function calculateCalories(weightKg: number, heightCm: number, age: number, sex: string, activityLevel: string, goal: string, conditions: string[]): number | null {
  if (age < 20 || (conditions && conditions.length > 0 && !conditions.includes('none'))) return null;
  
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  if (sex === 'male') bmr += 5;
  else if (sex === 'female') bmr -= 161;
  else bmr -= 78;

  const act = (activityLevel || 'sedentary').toLowerCase().replace(' ', '_');
  const mult = ACTIVITY_MULTIPLIERS[act as keyof typeof ACTIVITY_MULTIPLIERS] || 1.2;
  
  let target = bmr * mult;
  if (goal === 'gain') target *= 1.1;
  else if (goal === 'lose') target *= 0.85;

  return Math.max(bmr, Math.round(target));
}

export function isSafeGoal(age: number, bmi: number, goal: string): { safe: boolean, message?: string } {
  if (age < 20 && goal === 'lose') {
    return { safe: false, message: 'Talk to a doctor or school counsellor about weight goals.' };
  }
  if (age >= 20 && bmi < 18.5 && goal === 'lose') {
    return { safe: false, message: 'Weight loss is not recommended for BMI < 18.5.' };
  }
  return { safe: true };
}
