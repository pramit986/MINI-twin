import { SimulationScenario, SimulationResult } from '../types';
import { getAcademicData, getProductivityData, getFitnessData } from '../data/mockData';

/**
 * Future Simulation Service
 * Deterministic simulation of future outcomes based on behavior changes.
 * Prototype simulation — not a real prediction model.
 */
export class FutureSimulationService {
  simulate(scenario: SimulationScenario): SimulationResult {
    const academic = getAcademicData();
    const fitness = getFitnessData();
    const productivity = getProductivityData();

    const baseCgpa = academic.cgpa;
    const baseAttendance = academic.overallAttendance;
    const baseFitnessConsistency = fitness.consistency;
    const baseCompletionRate = productivity.completionRate;

    const timelineLabels = ['Today', 'Tomorrow', '3 Days', '7 Days'];
    const dayMultipliers = [0, 1, 3, 7];

    const timeline = timelineLabels.map((label, i) => {
      const mult = dayMultipliers[i] / 7; // fraction of a week

      // Academic projection
      const studyImpact = (scenario.studyHours - 2.6) * 0.02 * mult;
      const attendanceImpact = (scenario.attendanceRate - baseAttendance) * 0.01 * mult;
      const projectedCgpa = Math.round((baseCgpa + studyImpact + attendanceImpact) * 100) / 100;
      const projectedAttendance = Math.round(baseAttendance + (scenario.attendanceRate - baseAttendance) * mult);

      // Academic risk
      let academicRisk = 'Low';
      if (projectedAttendance < 75 || projectedCgpa < 6.5) academicRisk = 'High';
      else if (projectedAttendance < 80 || projectedCgpa < 7.0) academicRisk = 'Medium';

      // Fitness projection
      const fitnessConsistency = Math.round(baseFitnessConsistency + (scenario.gymDays - 3) * 5 * mult);
      const fitnessStreak = fitness.workoutStreak + Math.round(scenario.gymDays * mult);

      // Productivity projection
      const completionImpact = (scenario.taskCompletionRate - baseCompletionRate) * mult;
      const projectedCompletion = Math.round(baseCompletionRate + completionImpact);
      const projectedStudyHours = Math.round(scenario.studyHours * 10) / 10;

      // Career projection
      const careerProgress = Math.round(35 + scenario.careerLearningHours * 2 * mult);
      const skillsGained = Math.round(scenario.careerLearningHours * 0.5 * mult * 10) / 10;

      // Routine projection
      const sleepFactor = scenario.sleepHours >= 7 ? 1 : scenario.sleepHours / 7;
      const routineStability = Math.round(65 + (sleepFactor - 0.8) * 50 * mult);
      let burnoutRisk = 'Low';
      const totalDailyHours = scenario.studyHours + scenario.gymDays * 1.2 + scenario.careerLearningHours;
      if (totalDailyHours > 10 && scenario.sleepHours < 7) burnoutRisk = 'High';
      else if (totalDailyHours > 8) burnoutRisk = 'Medium';

      // Workload
      const dailyWorkload = Math.round((scenario.studyHours + scenario.careerLearningHours + (scenario.gymDays > 0 ? 1 : 0)) * 10) / 10;

      return {
        label,
        academic: { cgpa: projectedCgpa, attendance: projectedAttendance, risk: academicRisk },
        fitness: { consistency: Math.min(100, Math.max(0, fitnessConsistency)), streak: fitnessStreak },
        productivity: { completionRate: Math.min(100, Math.max(0, projectedCompletion)), studyHours: projectedStudyHours },
        career: { progress: Math.min(100, Math.max(0, careerProgress)), skillsGained },
        routine: { stability: Math.min(100, Math.max(0, routineStability)), burnoutRisk },
        workload: { daily: dailyWorkload, weekly: Math.round(dailyWorkload * 7 * 10) / 10 }
      };
    });

    return { timeline };
  }
}

export const futureSimulationService = new FutureSimulationService();
