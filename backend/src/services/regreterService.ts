import { Task, RegreterAnalysis, RegreterPath } from '../types';
import { tasks, getProductivityData } from '../data/mockData';
import { procrastinationPredictionService } from './procrastinationPredictionService';

/**
 * Regreter Service
 * Analyzes consequences of completing vs postponing a task.
 */
export class RegreterService {
  analyze(taskId: string): RegreterAnalysis | null {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    const productivity = getProductivityData();
    const taskDurationHours = task.estimatedDuration / 60; // 1.8h for ADSA

    // tomorrow workload without this task
    const tomorrowWorkloadBase = 3.2; 
    
    // Path A: Complete now
    const pathA: RegreterPath = {
      label: 'Complete Now',
      tomorrowWorkload: tomorrowWorkloadBase,
      examPreparation: 68,
      freeTime: 1.8, 
      productivityImpact: Math.round(productivity.completionRate + 8),
      academicRisk: 'Low'
    };

    // Path B: Postpone
    // 20% overhead
    const overhead = taskDurationHours * 0.2;
    const addedTime = taskDurationHours + overhead; // e.g. 1.8 + 0.36 = 2.16 ~ 2.2
    
    const pathB: RegreterPath = {
      label: 'Postpone',
      tomorrowWorkload: Math.round((tomorrowWorkloadBase + addedTime) * 10) / 10,
      examPreparation: 51,
      freeTime: Math.round((5.0 - (tomorrowWorkloadBase + addedTime)) * 10) / 10, // capacity 5.0h
      productivityImpact: Math.max(0, Math.round(productivity.completionRate - 5)),
      academicRisk: task.priority === 'high' ? 'High' : 'Medium'
    };

    // Consequence
    const consequence = `+${addedTime.toFixed(1)}h additional workload`;

    // Historical pattern
    const historicalPattern = '3 of your last 4 similar tasks were postponed.';

    // Determine intervention level based on student preference (default: balanced)
    const interventionLevel: RegreterAnalysis['interventionLevel'] = 'balanced';

    return {
      task,
      pathA,
      pathB,
      consequence,
      historicalPattern,
      interventionLevel
    };
  }

  /**
   * Execute a decision — actually mutate the task state
   */
  executeDecision(taskId: string, decision: 'complete' | 'postpone'): boolean {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    if (decision === 'complete') {
      tasks[taskIndex].status = 'completed';
      tasks[taskIndex].completedAt = new Date().toISOString();
    } else {
      tasks[taskIndex].status = 'postponed';
      tasks[taskIndex].postponedCount += 1;
      // Push deadline by 24 hours
      const newDeadline = new Date(tasks[taskIndex].deadline);
      newDeadline.setHours(newDeadline.getHours() + 24);
      tasks[taskIndex].deadline = newDeadline.toISOString();
    }

    return true;
  }
}

export const regreterService = new RegreterService();
