import { Task, RiskPrediction } from '../types';
import { tasks, subjects, studySessions, getProductivityData, getAcademicData } from '../data/mockData';

/**
 * Risk Prediction Service
 * Deterministic mock logic for academic risk assessment.
 * Designed to be replaceable with Python/FastAPI + ML models.
 */
export class RiskPredictionService {
  predict(): RiskPrediction {
    const academic = getAcademicData();
    const productivity = getProductivityData();
    const factors: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Attendance factor
    if (academic.overallAttendance < 80) {
      riskScore += 25;
      factors.push('Attendance declining — currently at ' + academic.overallAttendance + '%');
      recommendations.push('Attend all classes this week to stabilize attendance');
    } else if (academic.overallAttendance < 85) {
      riskScore += 10;
    }

    // Assignment completion
    if (academic.assignmentCompletion < 75) {
      riskScore += 20;
      factors.push('Assignment completion below 75%');
      recommendations.push('Prioritize pending assignments before new study sessions');
    }

    // Study consistency
    if (productivity.studyHoursToday < productivity.averageStudyHours * 0.7) {
      riskScore += 20;
      factors.push('Study consistency below baseline — ' + productivity.studyHoursToday + 'h vs ' + productivity.averageStudyHours + 'h average');
      recommendations.push('Add one focused study session today to get back on track');
    }

    // Overdue tasks
    if (productivity.overdueTasks > 0) {
      riskScore += 15;
      factors.push(productivity.overdueTasks + ' overdue task(s) detected');
      recommendations.push('Complete overdue tasks first to reduce compounding workload');
    }

    // Upcoming deadlines
    const upcomingDeadlines = tasks.filter(t => {
      const deadline = new Date(t.deadline);
      const now = new Date();
      const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours < 48 && t.status === 'pending';
    });
    if (upcomingDeadlines.length >= 2) {
      riskScore += 15;
      factors.push(upcomingDeadlines.length + ' deadlines within 48 hours');
      recommendations.push('Allocate focused blocks for each upcoming deadline');
    }

    // Subject-level risks
    const highRiskSubjects = subjects.filter(s => s.risk === 'high');
    if (highRiskSubjects.length > 0) {
      riskScore += 15;
      factors.push('High-risk subjects: ' + highRiskSubjects.map(s => s.code).join(', '));
      recommendations.push('Schedule extra study time for ' + highRiskSubjects[0].code);
    }

    // Determine level
    let level: RiskPrediction['level'] = 'low';
    if (riskScore >= 50) level = 'high';
    else if (riskScore >= 25) level = 'medium';

    if (factors.length === 0) {
      factors.push('All academic metrics within healthy range');
    }
    if (recommendations.length === 0) {
      recommendations.push('Keep up the current pace — your metrics look stable');
    }

    return { level, score: Math.min(riskScore, 100), factors, recommendations };
  }
}

export const riskPredictionService = new RiskPredictionService();
