import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  student, tasks, subjects, workouts, meals, expenses,
  goals, studySessions, checkIns, achievements, notifications,
  careerSkills, heatmapData,
  getAcademicData, getFitnessData, getNutritionData,
  getFinanceData, getProductivityData, getCareerData,
  getDashboardData, getTwinPulse, getTwinInsight,
  getGoalConflict, getWeeklyReview, getTwinEvolution
} from '../data/mockData';
import { riskPredictionService } from '../services/riskPredictionService';
import { procrastinationPredictionService } from '../services/procrastinationPredictionService';
import { regreterService } from '../services/regreterService';
import { futureSimulationService } from '../services/futureSimulationService';
import { recoveryService } from '../services/recoveryService';
import { aiCoachService } from '../services/aiCoachService';

const router = Router();

// ==================== Student ====================
router.get('/student', (_req: Request, res: Response) => {
  res.json(student);
});

router.put('/student', (req: Request, res: Response) => {
  Object.assign(student, req.body);
  res.json(student);
});

// ==================== Dashboard ====================
router.get('/dashboard', (_req: Request, res: Response) => {
  res.json(getDashboardData());
});

// ==================== Tasks ====================
router.get('/tasks', (_req: Request, res: Response) => {
  res.json(tasks);
});

router.post('/tasks', (req: Request, res: Response) => {
  const newTask = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    postponedCount: 0,
    status: 'pending'
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body };
  res.json(tasks[idx]);
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  const removed = tasks.splice(idx, 1);
  res.json(removed[0]);
});

router.post('/tasks/:id/complete', (req: Request, res: Response) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx].status = 'completed';
  tasks[idx].completedAt = new Date().toISOString();
  res.json(tasks[idx]);
});

router.post('/tasks/:id/postpone', (req: Request, res: Response) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx].status = 'postponed';
  tasks[idx].postponedCount += 1;
  const newDeadline = new Date(tasks[idx].deadline);
  newDeadline.setHours(newDeadline.getHours() + 24);
  tasks[idx].deadline = newDeadline.toISOString();
  res.json(tasks[idx]);
});

// ==================== Academic ====================
router.get('/academic', (_req: Request, res: Response) => {
  res.json(getAcademicData());
});

router.get('/attendance', (_req: Request, res: Response) => {
  res.json(subjects.map(s => ({
    subject: s.name,
    code: s.code,
    attended: s.attendedClasses,
    total: s.totalClasses,
    percentage: s.attendancePercentage,
    requiredFor75: Math.max(0, Math.ceil(0.75 * s.totalClasses) - s.attendedClasses),
    canMiss: Math.max(0, s.attendedClasses - Math.ceil(0.75 * s.totalClasses))
  })));
});

router.get('/assignments', (_req: Request, res: Response) => {
  res.json(tasks.filter(t => t.category === 'academic'));
});

router.get('/study', (_req: Request, res: Response) => {
  res.json(studySessions);
});

router.post('/study', (req: Request, res: Response) => {
  const session = { id: uuidv4(), ...req.body, date: new Date().toISOString().split('T')[0] };
  studySessions.push(session);
  res.status(201).json(session);
});

// ==================== Fitness ====================
router.get('/fitness', (_req: Request, res: Response) => {
  res.json(getFitnessData());
});

router.post('/fitness/workout', (req: Request, res: Response) => {
  const workout = {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    ...req.body,
    completed: true
  };
  workouts.push(workout);
  res.status(201).json(workout);
});

// ==================== Nutrition ====================
router.get('/nutrition', (_req: Request, res: Response) => {
  res.json(getNutritionData());
});

router.post('/nutrition/meal', (req: Request, res: Response) => {
  const meal = {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  meals.push(meal);
  res.status(201).json(meal);
});

// ==================== Finance ====================
router.get('/finance', (_req: Request, res: Response) => {
  res.json(getFinanceData());
});

router.post('/finance/expense', (req: Request, res: Response) => {
  const expense = {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

// ==================== Career ====================
router.get('/career', (_req: Request, res: Response) => {
  res.json(getCareerData());
});

// ==================== Goals ====================
router.get('/goals', (_req: Request, res: Response) => {
  res.json(goals);
});

router.get('/goals/conflicts', (_req: Request, res: Response) => {
  res.json(getGoalConflict());
});

router.put('/goals/:id', (req: Request, res: Response) => {
  const idx = goals.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Goal not found' });
  goals[idx] = { ...goals[idx], ...req.body };
  res.json(goals[idx]);
});

// ==================== Regreter ====================
router.post('/regreter/analyze', (req: Request, res: Response) => {
  const { taskId } = req.body;
  const analysis = regreterService.analyze(taskId);
  if (!analysis) return res.status(404).json({ error: 'Task not found' });
  res.json(analysis);
});

router.post('/regreter/decide', (req: Request, res: Response) => {
  const { taskId, decision } = req.body;
  const success = regreterService.executeDecision(taskId, decision);
  if (!success) return res.status(404).json({ error: 'Task not found' });
  res.json({ success, dashboard: getDashboardData() });
});

// ==================== Future Self ====================
router.post('/future-self/simulate', (req: Request, res: Response) => {
  const result = futureSimulationService.simulate(req.body);
  res.json(result);
});

// ==================== Recovery ====================
router.get('/recovery', (_req: Request, res: Response) => {
  res.json(recoveryService.generatePlan());
});

router.post('/recovery/activate', (_req: Request, res: Response) => {
  const result = recoveryService.activateRecovery();
  res.json(result);
});

// ==================== Weekly Review ====================
router.get('/weekly-review', (_req: Request, res: Response) => {
  res.json(getWeeklyReview());
});

// ==================== AI ====================
router.post('/ai/ask', (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });
  const response = aiCoachService.ask(question);
  res.json(response);
});

router.get('/ai/risk', (_req: Request, res: Response) => {
  res.json(riskPredictionService.predict());
});

router.post('/ai/procrastination', (req: Request, res: Response) => {
  const { taskId } = req.body;
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(procrastinationPredictionService.predict(task));
});

// ==================== Twin ====================
router.get('/twin/pulse', (_req: Request, res: Response) => {
  res.json(getTwinPulse());
});

router.get('/twin/insight', (_req: Request, res: Response) => {
  res.json(getTwinInsight());
});

router.get('/twin/evolution', (_req: Request, res: Response) => {
  res.json(getTwinEvolution());
});

// ==================== Check-ins ====================
router.get('/checkins', (_req: Request, res: Response) => {
  res.json(checkIns);
});

router.post('/checkins', (req: Request, res: Response) => {
  const checkIn = {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  checkIns.push(checkIn);
  res.status(201).json(checkIn);
});

// ==================== Achievements ====================
router.get('/achievements', (_req: Request, res: Response) => {
  res.json(achievements);
});

// ==================== Notifications ====================
router.get('/notifications', (_req: Request, res: Response) => {
  res.json(notifications);
});

router.put('/notifications/:id/read', (req: Request, res: Response) => {
  const n = notifications.find(n => n.id === req.params.id);
  if (!n) return res.status(404).json({ error: 'Notification not found' });
  n.read = true;
  res.json(n);
});

// ==================== Heatmap ====================
router.get('/heatmap', (_req: Request, res: Response) => {
  res.json(heatmapData);
});

// ==================== CGPA Calculator ====================
router.post('/academic/cgpa-calculator', (req: Request, res: Response) => {
  const { grades } = req.body; // array of { subjectId, expectedGrade }
  const gradePoints: Record<string, number> = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
  };

  let totalCredits = 0;
  let totalPoints = 0;

  if (grades && Array.isArray(grades)) {
    grades.forEach((g: { subjectId: string; expectedGrade: string }) => {
      const subject = subjects.find(s => s.id === g.subjectId);
      if (subject) {
        const points = gradePoints[g.expectedGrade] || 0;
        totalCredits += subject.credits;
        totalPoints += points * subject.credits;
      }
    });
  }

  const projectedSgpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  const currentTotalCredits = 68; // completed credits
  const currentTotalPoints = student.cgpa * currentTotalCredits;
  const newTotalCredits = currentTotalCredits + totalCredits;
  const projectedCgpa = newTotalCredits > 0
    ? Math.round(((currentTotalPoints + totalPoints) / newTotalCredits) * 100) / 100
    : student.cgpa;

  res.json({
    projectedSgpa,
    projectedCgpa,
    currentCgpa: student.cgpa,
    improvement: Math.round((projectedCgpa - student.cgpa) * 100) / 100
  });
});

export default router;

router.post('/dashboard/fix-my-day', (_req: Request, res: Response) => {
  // Simple mock implementation of fix my day:
  const cnRevision = tasks.find(t => t.title.includes('CN Revision'));
  if (cnRevision) {
    cnRevision.status = 'postponed';
    const d = new Date(cnRevision.deadline);
    d.setHours(d.getHours() + 24);
    cnRevision.deadline = d.toISOString();
  }
  const adsa = tasks.find(t => t.title.includes('ADSA'));
  if (adsa) adsa.estimatedDuration = 60;
  res.json(getDashboardData());
});

