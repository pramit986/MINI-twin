import { describe, it, expect } from 'vitest';
import { calculateBMI, calculateProtein, calculateWater, calculateCalories, isSafeGoal } from './calculators';

describe('Health Calculators', () => {
  it('calculates adult BMI correctly', () => {
    const { bmi, category } = calculateBMI(70, 175);
    expect(bmi).toBe(22.9);
    expect(category).toBe('Normal');
  });

  it('calculates protein for sedentary adult', () => {
    const res = calculateProtein(70, 25, 'sedentary', 'maintain', ['none']);
    expect(res.target).toBe(56); // 70 * 0.8
  });

  it('calculates protein for active youth', () => {
    const res = calculateProtein(50, 16, 'active', 'maintain', ['none']);
    expect(res.target).toBe(60); // 50 * 1.2
  });

  it('adjusts protein for adult gain goal', () => {
    const res = calculateProtein(70, 25, 'sedentary', 'gain', ['none']);
    expect(res.target).toBe(112); // 70 * 1.6 (bumped from 0.8 to min 1.6)
  });

  it('blocks protein calculation for medical conditions', () => {
    const res = calculateProtein(70, 25, 'sedentary', 'maintain', ['kidney disease']);
    expect(res.target).toBe(0);
    expect(res.message).toContain('doctor');
  });

  it('calculates water target', () => {
    const res = calculateWater(70, 1);
    expect(res.targetMl).toBe(2810); // 70 * 33 + 500
    expect(res.glasses).toBe(11); // 2810 / 250
  });

  it('calculates adult calories correctly', () => {
    // 70kg, 175cm, 25yo male, sedentary, maintain
    // BMR = 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75
    // Sedentary (1.2) = 2008.5
    const res = calculateCalories(70, 175, 25, 'male', 'sedentary', 'maintain', ['none']);
    expect(res).toBe(2009);
  });

  it('returns null calories for youth', () => {
    const res = calculateCalories(70, 175, 16, 'male', 'sedentary', 'maintain', ['none']);
    expect(res).toBeNull();
  });

  it('enforces safety rules', () => {
    const youthLose = isSafeGoal(16, 22, 'lose');
    expect(youthLose.safe).toBe(false);

    const adultLowBmiLose = isSafeGoal(25, 17, 'lose');
    expect(adultLowBmiLose.safe).toBe(false);

    const adultNormalLose = isSafeGoal(25, 22, 'lose');
    expect(adultNormalLose.safe).toBe(true);
  });
});
