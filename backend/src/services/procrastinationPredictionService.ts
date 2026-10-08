import { Task } from '../types';
import { tasks } from '../data/mockData';

/**
 * Procrastination Prediction Service
 * Deterministic mock logic — designed to be replaceable with ML model.
 */
export class ProcrastinationPredictionService {
  predict(task: Task): { probability: number; factors: string[] } {
    let probability = 0;
    const factors: string[] = [];

    // Task type factor
    if (task.category === 'academic') probability += 15;

    // Duration factor — longer tasks get procrastinated more
    if (task.estimatedDuration > 90) {
      probability += 20;
      factors.push('Long task duration (' + task.estimatedDuration + ' min)');
    } else if (task.estimatedDuration > 60) {
      probability += 10;
    }

    // Deadline distance — further deadlines get procrastinated
    const hoursToDeadline = (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursToDeadline > 48) {
      probability += 25;
      factors.push('Deadline is far away (' + Math.round(hoursToDeadline) + 'h)');
    } else if (hoursToDeadline > 24) {
      probability += 15;
      factors.push('Deadline in ~' + Math.round(hoursToDeadline) + ' hours');
    } else if (hoursToDeadline > 0) {
      probability += 5;
    }

    // Previous delays
    if (task.postponedCount > 0) {
      probability += task.postponedCount * 15;
      factors.push('Previously postponed ' + task.postponedCount + ' time(s)');
    }

    // Time of day (evening = higher procrastination)
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
      probability += 15;
      factors.push('Evening/night hours — lower motivation window');
    } else if (hour >= 16) {
      probability += 8;
    }

    // Day factor — weekends slightly higher
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      probability += 10;
      factors.push('Weekend — higher distraction probability');
    }

    // Workload factor
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    if (pendingCount > 5) {
      probability += 10;
      factors.push('High pending workload (' + pendingCount + ' tasks)');
    }

    // Low priority tasks get procrastinated
    if (task.priority === 'low') {
      probability += 12;
      factors.push('Low priority task');
    }

    // Cap at 95%
    probability = Math.min(probability, 95);

    if (factors.length === 0) {
      factors.push('Low risk — task characteristics suggest likely completion');
    }

    return { probability, factors };
  }
}

export const procrastinationPredictionService = new ProcrastinationPredictionService();
