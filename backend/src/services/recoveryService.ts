import { RecoveryPlan, Task } from '../types';
import { tasks } from '../data/mockData';

/**
 * Recovery Service
 * Generates a recovery plan when multiple tasks are missed.
 */
export class RecoveryService {
  generatePlan(): RecoveryPlan {
    const now = new Date();
    const missedTasks = tasks.filter(t =>
      (t.status === 'postponed' || (t.status === 'pending' && new Date(t.deadline) < now))
    );

    const pendingHighPriority = tasks.filter(t =>
      t.status === 'pending' && t.priority === 'high' && new Date(t.deadline) >= now
    );

    const pendingMedium = tasks.filter(t =>
      t.status === 'pending' && t.priority === 'medium' && new Date(t.deadline) >= now
    );

    const pendingLow = tasks.filter(t =>
      t.status === 'pending' && t.priority === 'low' && new Date(t.deadline) >= now
    );

    // Tonight: high priority + missed
    const tonight = [...missedTasks.slice(0, 2), ...pendingHighPriority.slice(0, 2)].slice(0, 3);

    // Tomorrow: remaining high + medium
    const tomorrow = [...pendingHighPriority.filter(t => !tonight.includes(t)), ...pendingMedium.slice(0, 2)].slice(0, 3);

    // Low priority
    const lowPriority = pendingLow;

    // Hours recovered if plan is followed
    const hoursRecovered = Math.round(
      tonight.reduce((sum, t) => sum + t.estimatedDuration, 0) / 60 * 10
    ) / 10;

    const message = missedTasks.length > 0
      ? `You missed ${missedTasks.length} planned task${missedTasks.length > 1 ? 's' : ''} today. Here's your recovery plan.`
      : 'Your schedule is getting tight. Here\'s an optimized plan to stay on track.';

    return {
      missedTasks,
      tonight,
      tomorrow,
      lowPriority,
      hoursRecovered,
      message
    };
  }

  activateRecovery(): { success: boolean; message: string } {
    // When recovery mode is activated, prioritize tasks
    const now = new Date();
    const missedTasks = tasks.filter(t =>
      t.status === 'postponed' || (t.status === 'pending' && new Date(t.deadline) < now)
    );

    // Reset postponed tasks to pending with updated deadlines
    missedTasks.forEach(t => {
      if (t.status === 'postponed') {
        t.status = 'pending';
        const newDeadline = new Date();
        newDeadline.setHours(newDeadline.getHours() + 24);
        t.deadline = newDeadline.toISOString();
      }
    });

    return {
      success: true,
      message: `Recovery mode activated. ${missedTasks.length} task(s) rescheduled.`
    };
  }
}

export const recoveryService = new RecoveryService();
