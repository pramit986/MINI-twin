import { AskTwinResponse } from '../types';
import {
  tasks, student, getAcademicData, getProductivityData,
  getFitnessData, getNutritionData, getFinanceData, getCareerData,
  getTwinInsight, goals
} from '../data/mockData';
import { riskPredictionService } from './riskPredictionService';

/**
 * AI Coach Service
 * Generates contextual responses using actual student data.
 * Designed to be replaceable with LLM (Gemini/OpenAI/Claude).
 */
export class AICoachService {
  ask(question: string): AskTwinResponse {
    const q = question.toLowerCase();
    const academic = getAcademicData();
    const productivity = getProductivityData();
    const fitness = getFitnessData();
    const nutrition = getNutritionData();
    const finance = getFinanceData();
    const career = getCareerData();
    const insight = getTwinInsight();
    const risk = riskPredictionService.predict();

    // Pattern matching on question
    if (q.includes('falling behind') || q.includes('behind') || q.includes('struggling')) {
      return {
        answer: `You've dropped from ${productivity.averageStudyHours}h average study time to ${productivity.studyHoursToday}h this week. Your pending workload is also up ${Math.round((insight.plannedWorkload / 4.2 - 1) * 100)}%, and the ADSA assignment is due tonight. Your productivity completion rate is at ${productivity.completionRate}%, which is below your usual baseline.`,
        explanation: 'This analysis is based on your study session logs from the past 7 days, your current task queue, and your historical productivity patterns. The drop in study consistency correlates with an increase in pending workload, creating a compounding effect.',
        dataUsed: ['Study sessions (last 7 days)', 'Task queue', 'Productivity metrics', 'Academic workload'],
        suggestions: [
          'Complete the ADSA assignment tonight to prevent workload cascading',
          'Schedule 2.5h focused study block tomorrow morning',
          'Consider pausing low-priority career tasks this week',
          'Use Recovery Mode if you fall further behind'
        ]
      };
    }

    if (q.includes('study or gym') || q.includes('gym or study')) {
      const pendingHighPriority = tasks.filter(t => t.priority === 'high' && t.status === 'pending');
      if (pendingHighPriority.length > 1) {
        return {
          answer: `Right now, study should take priority. You have ${pendingHighPriority.length} high-priority academic tasks pending, including the ADSA assignment due tonight. Your gym consistency is at ${fitness.consistency}% and you've already logged ${fitness.weeklyWorkouts} workouts this week, so missing one won't impact your fitness trajectory significantly.`,
          explanation: 'When academic tasks are near deadline, the consequence of postponing study is higher than skipping one workout. Your fitness streak shows good consistency — one rest day won\'t break the pattern.',
          dataUsed: ['Task priorities', 'Deadlines', 'Gym consistency', 'Weekly workouts'],
          suggestions: [
            'Finish ADSA assignment first',
            'Do a short 20-minute workout if you have energy later',
            'Schedule full gym session for tomorrow'
          ]
        };
      }
      return {
        answer: `Both are manageable today. Your academic workload is light (${insight.plannedWorkload}h pending) and you've done ${fitness.weeklyWorkouts}/${fitness.weeklyTarget} workouts. Consider gym first since morning workouts tend to improve your focus scores.`,
        explanation: 'When neither area has urgent deadlines, the decision depends on which has lower current momentum. Your fitness consistency can use the boost.',
        dataUsed: ['Task queue', 'Workout frequency', 'Focus patterns'],
        suggestions: ['Hit the gym first', 'Follow with study session after', 'Keep total study at 2.5h minimum']
      };
    }

    if (q.includes('biggest problem') || q.includes('biggest issue') || q.includes('main issue')) {
      const topIssues: string[] = [];
      if (productivity.studyHoursToday < productivity.averageStudyHours * 0.75) {
        topIssues.push('Study consistency has dropped 34% below your baseline');
      }
      if (insight.conflict > 0) {
        topIssues.push(`You have ${insight.conflict}h more planned workload than available time`);
      }
      if (risk.level !== 'low') {
        topIssues.push(`Academic risk is at ${risk.level} level`);
      }

      return {
        answer: topIssues.length > 0
          ? `Your biggest challenge this week: ${topIssues[0]}. ${topIssues.length > 1 ? 'Additionally, ' + topIssues.slice(1).join('. ') + '.' : ''}`
          : 'No critical issues detected this week. Your metrics are within healthy range.',
        explanation: 'This assessment combines your study logs, task completion rates, workload analysis, and academic risk indicators to identify the most impactful area to focus on.',
        dataUsed: ['Study consistency', 'Workload analysis', 'Risk prediction', 'Task completion'],
        suggestions: [
          'Address study consistency first — it compounds across all metrics',
          'Use the Regreter to make strategic decisions about tonight\'s tasks',
          'Check your Future Self simulation to see how changes impact your week'
        ]
      };
    }

    if (q.includes('academic') || q.includes('cgpa') || q.includes('grades') || q.includes('performance')) {
      return {
        answer: `Your CGPA is ${academic.cgpa} with a target of ${academic.targetCgpa}. Overall attendance is ${academic.overallAttendance}% and assignment completion is at ${academic.assignmentCompletion}%. ${risk.level === 'medium' || risk.level === 'high' ? 'Academic risk is ' + risk.level + ': ' + risk.factors[0] + '.' : 'Academic risk is low.'}`,
        explanation: 'Academic performance is tracked through CGPA, attendance, and assignment completion across all subjects. Risk prediction considers trends, not just current numbers.',
        dataUsed: ['CGPA history', 'Attendance records', 'Assignment completion', 'Risk factors'],
        suggestions: risk.recommendations
      };
    }

    if (q.includes('focus') || q.includes('tomorrow') || q.includes('should i do') || q.includes('what should')) {
      const topTask = tasks.find(t => t.priority === 'high' && t.status === 'pending');
      return {
        answer: topTask
          ? `Your top priority: "${topTask.title}" — it's ${topTask.priority} priority and ${topTask.estimatedDuration >= 60 ? 'takes about ' + (topTask.estimatedDuration / 60) + ' hours' : 'takes about ' + topTask.estimatedDuration + ' minutes'}. After that, focus on maintaining your study consistency by hitting at least ${productivity.averageStudyHours}h of study time.`
          : `No high-priority tasks pending. Use today to get ahead — consider working on career skills or upcoming assignments.`,
        explanation: 'Prioritization is based on deadline proximity, task impact, and your current workload balance.',
        dataUsed: ['Task priorities', 'Deadlines', 'Study baseline'],
        suggestions: [
          topTask ? `Start with ${topTask.title}` : 'Pick up a medium-priority task',
          'Aim for ' + productivity.averageStudyHours + 'h study time',
          'Log at least one workout if you haven\'t'
        ]
      };
    }

    if (q.includes('postpone') || q.includes('skip') || q.includes('what happens if')) {
      return {
        answer: `If you postpone your current high-priority tasks, tomorrow's workload will increase by approximately ${Math.round(insight.conflict * 1.5 * 10) / 10}h. Your productivity completion rate will drop to ${Math.max(0, productivity.completionRate - 8)}%, and you may enter a workload cascade where each postponement makes the next day harder.`,
        explanation: 'The Regreter feature shows detailed side-by-side comparisons. Postponement has compounding effects — today\'s delay becomes tomorrow\'s overload.',
        dataUsed: ['Current workload', 'Task queue', 'Postponement history'],
        suggestions: [
          'Open the Regreter to see specific consequences',
          'Complete at least one high-priority task tonight',
          'If overwhelmed, activate Recovery Mode for a structured catch-up plan'
        ]
      };
    }

    if (q.includes('improv') || q.includes('better') || q.includes('getting better') || q.includes('progress')) {
      return {
        answer: `Positive trends: Your fitness consistency has increased from 45% to ${fitness.consistency}% over the past month. Study sessions have become more regular. You've completed ${productivity.tasksCompleted} tasks this cycle. Career skill progress is at 35%, up from 20% last month.`,
        explanation: 'Improvement is measured by comparing your current metrics with your 30-day baseline across all domains.',
        dataUsed: ['30-day fitness trend', 'Study session frequency', 'Task completion history', 'Career progress'],
        suggestions: [
          'Keep gym consistency above 65% to maintain the trend',
          'Your academic metrics need the most attention right now',
          'Consider adding one more career skill session per week'
        ]
      };
    }

    if (q.includes('consistency') || q.includes('inconsistent') || q.includes('hurting')) {
      return {
        answer: `Your main consistency blockers: 1) Study hours variance is high (${productivity.studyHoursToday}h today vs ${productivity.averageStudyHours}h baseline). 2) Sleep schedule shows irregularity. 3) Task postponement rate is ${productivity.procrastinationRate}%. The combination of irregular sleep and study patterns creates a cycle that's hard to break.`,
        explanation: 'Consistency is measured by comparing daily metrics against your rolling 14-day average. High variance indicates inconsistency even if averages look okay.',
        dataUsed: ['Study hour variance', 'Sleep data', 'Postponement rate', 'Task completion patterns'],
        suggestions: [
          'Set a fixed study time block each day (your preference: evening)',
          'Reduce task postponement by starting with the easiest subtask',
          'Use the daily check-in to track energy and adjust plans accordingly'
        ]
      };
    }

    // Default response using current data
    return {
      answer: `Here's your current snapshot: CGPA ${academic.cgpa}, attendance ${academic.overallAttendance}%, ${productivity.tasksCompleted}/${productivity.totalTasks} tasks completed, ${fitness.weeklyWorkouts}/${fitness.weeklyTarget} workouts this week, ₹${finance.remaining} remaining budget. ${insight.conflict > 0 ? 'You have a workload conflict of ' + insight.conflict + 'h.' : 'Your workload is manageable.'} Academic risk is ${risk.level}.`,
      explanation: 'This is a cross-domain summary of your current state based on all available data in your Student Twin.',
      dataUsed: ['Academic data', 'Productivity metrics', 'Fitness data', 'Finance data', 'Risk assessment'],
      suggestions: [
        'Try asking specific questions like "Why am I falling behind?"',
        '"What should I focus on tomorrow?"',
        '"What happens if I postpone this?"'
      ]
    };
  }
}

export const aiCoachService = new AICoachService();
