import { v4 as uuidv4 } from 'uuid';
import {
  Student, Subject, AcademicData, Task, Workout, Exercise,
  FitnessData, Meal, NutritionData, Expense, FinanceData,
  CareerSkill, CareerData, Goal, StudySession, HabitEntry,
  ProductivityData, TwinPulse, TwinInsight, DashboardData,
  Notification, WeeklyReview, CheckIn, Achievement, GoalConflict,
  TwinEvolution
} from '../types';

// ============================================================
// Student
// ============================================================
export const student: Student = {
  id: 'student-001',
  name: 'Pramit',
  degree: 'Computer Engineering',
  semester: 5,
  cgpa: 7.15,
  targetCgpa: 8.0,
  avatar: '🧑‍💻',
  careerTarget: 'Product Manager',
  monthlyBudget: 10000,
  proteinTarget: 150,
  dailyStudyTarget: 3,
  preferredStudyTime: 'evening',
  interventionIntensity: 'balanced',
  fitnessGoal: '5 workouts/week',
  joinedDate: '2026-08-01'
};

// ============================================================
// Subjects
// ============================================================
export const subjects: Subject[] = [
  {
    id: 'sub-1', name: 'Advanced Data Structures & Algorithms', code: 'ADSA',
    credits: 4, totalClasses: 42, attendedClasses: 34, attendancePercentage: 81,
    grade: null, assignmentCompletion: 70, nextExam: '2026-10-18', risk: 'medium'
  },
  {
    id: 'sub-2', name: 'Computer Networks', code: 'CN',
    credits: 3, totalClasses: 38, attendedClasses: 33, attendancePercentage: 87,
    grade: null, assignmentCompletion: 85, nextExam: '2026-10-22', risk: 'low'
  },
  {
    id: 'sub-3', name: 'Database Management Systems', code: 'DBMS',
    credits: 4, totalClasses: 40, attendedClasses: 32, attendancePercentage: 80,
    grade: null, assignmentCompletion: 78, nextExam: '2026-10-20', risk: 'medium'
  },
  {
    id: 'sub-4', name: 'Operating Systems', code: 'OS',
    credits: 3, totalClasses: 36, attendedClasses: 31, attendancePercentage: 86,
    grade: null, assignmentCompletion: 90, nextExam: '2026-10-25', risk: 'low'
  },
  {
    id: 'sub-5', name: 'Software Engineering', code: 'SE',
    credits: 3, totalClasses: 34, attendedClasses: 26, attendancePercentage: 76,
    grade: null, assignmentCompletion: 65, nextExam: '2026-10-28', risk: 'high'
  }
];

// ============================================================
// Tasks
// ============================================================
export let tasks: Task[] = [
  {
    id: 'task-1', title: 'ADSA assignment',
    category: 'academic', priority: 'high', deadline: '2026-10-04T23:59:00',
    estimatedDuration: 108, status: 'pending', createdAt: '2026-10-04T10:00:00',
    postponedCount: 0, impact: 'high', description: 'Complete the dynamic programming assignment for ADSA'
  },
  {
    id: 'task-2', title: 'CN revision',
    category: 'academic', priority: 'medium', deadline: '2026-10-05T18:00:00',
    estimatedDuration: 45, status: 'pending', createdAt: '2026-10-04T14:00:00',
    postponedCount: 0, impact: 'medium', description: 'Revise Transport Layer protocols for CN'
  },
  {
    id: 'task-3', title: 'Gym',
    category: 'fitness', priority: 'medium', deadline: '2026-10-04T20:00:00',
    estimatedDuration: 90, status: 'pending', createdAt: '2026-10-04T06:00:00',
    postponedCount: 0, impact: 'medium'
  },
  {
    id: 'task-4', title: 'Project meeting',
    category: 'academic', priority: 'high', deadline: '2026-10-04T16:00:00',
    estimatedDuration: 60, status: 'pending', createdAt: '2026-10-04T12:00:00',
    postponedCount: 0, impact: 'high'
  },
  {
    id: 'task-5', title: 'DBMS notes',
    category: 'academic', priority: 'medium', deadline: '2026-10-06T23:59:00',
    estimatedDuration: 39, status: 'pending', createdAt: '2026-10-04T16:00:00',
    postponedCount: 1, impact: 'medium'
  },
  {
    id: 'task-6', title: 'Read Product Management Article',
    category: 'career', priority: 'low', deadline: '2026-10-07T23:59:00',
    estimatedDuration: 30, status: 'completed', createdAt: '2026-10-03T09:00:00',
    postponedCount: 0, impact: 'low'
  },
  {
    id: 'task-7', title: 'OS Assignment - Process Scheduling',
    category: 'academic', priority: 'high', deadline: '2026-10-08T23:59:00',
    estimatedDuration: 90, status: 'completed', createdAt: '2026-10-02T11:00:00',
    postponedCount: 0, impact: 'high'
  },
  {
    id: 'task-8', title: 'SQL Practice - Career Prep',
    category: 'career', priority: 'medium', deadline: '2026-10-09T23:59:00',
    estimatedDuration: 45, status: 'completed', createdAt: '2026-10-03T10:00:00',
    postponedCount: 0, impact: 'medium'
  }
];

// ============================================================
// Workouts
// ============================================================
export let workouts: Workout[] = [
  {
    id: 'w-1', date: '2026-10-01', type: 'Push Day', duration: 55, completed: true,
    exercises: [
      { id: 'e-1', name: 'Bench Press', sets: 4, reps: 8, weight: 60 },
      { id: 'e-2', name: 'Overhead Press', sets: 3, reps: 10, weight: 35 },
      { id: 'e-3', name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 22 },
      { id: 'e-4', name: 'Lateral Raises', sets: 3, reps: 15, weight: 8 },
      { id: 'e-5', name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 20 }
    ]
  },
  {
    id: 'w-2', date: '2026-10-02', type: 'Pull Day', duration: 50, completed: true,
    exercises: [
      { id: 'e-6', name: 'Deadlift', sets: 4, reps: 6, weight: 100 },
      { id: 'e-7', name: 'Barbell Row', sets: 4, reps: 8, weight: 55 },
      { id: 'e-8', name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
      { id: 'e-9', name: 'Face Pulls', sets: 3, reps: 15, weight: 12 },
      { id: 'e-10', name: 'Bicep Curls', sets: 3, reps: 12, weight: 12 }
    ]
  },
  {
    id: 'w-3', date: '2026-09-29', type: 'Leg Day', duration: 60, completed: true,
    exercises: [
      { id: 'e-11', name: 'Squat', sets: 4, reps: 8, weight: 80 },
      { id: 'e-12', name: 'Leg Press', sets: 3, reps: 12, weight: 120 },
      { id: 'e-13', name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 60 },
      { id: 'e-14', name: 'Calf Raises', sets: 4, reps: 15, weight: 40 }
    ]
  }
];

// ============================================================
// Meals
// ============================================================
export let meals: Meal[] = [
  { id: 'm-1', name: 'Oats + Banana + Protein Shake', time: '08:30', calories: 480, protein: 38, carbs: 62, fat: 12, date: '2026-10-04' },
  { id: 'm-2', name: 'Dal Rice + Paneer', time: '13:00', calories: 650, protein: 35, carbs: 78, fat: 22, date: '2026-10-04' },
  { id: 'm-3', name: 'Chicken Sandwich + Juice', time: '17:00', calories: 420, protein: 32, carbs: 45, fat: 14, date: '2026-10-04' },
  { id: 'm-4', name: 'Roti + Sabzi + Curd', time: '20:30', calories: 290, protein: 21, carbs: 25, fat: 10, date: '2026-10-04' }
];

// ============================================================
// Expenses
// ============================================================
export let expenses: Expense[] = [
  { id: 'exp-1', title: 'Canteen Lunch', amount: 120, category: 'food', date: '2026-10-04' },
  { id: 'exp-2', title: 'Bus Pass', amount: 500, category: 'transport', date: '2026-10-01' },
  { id: 'exp-3', title: 'Udemy Course', amount: 449, category: 'education', date: '2026-10-02' },
  { id: 'exp-4', title: 'Stationery', amount: 180, category: 'shopping', date: '2026-10-03' },
  { id: 'exp-5', title: 'Netflix', amount: 199, category: 'subscriptions', date: '2026-10-01' },
  { id: 'exp-6', title: 'Snacks', amount: 85, category: 'food', date: '2026-10-03' },
  { id: 'exp-7', title: 'Auto Rickshaw', amount: 60, category: 'transport', date: '2026-10-02' },
  { id: 'exp-8', title: 'Protein Powder', amount: 1800, category: 'food', date: '2026-10-01' },
  { id: 'exp-9', title: 'Chai + Snacks', amount: 75, category: 'food', date: '2026-10-04' },
  { id: 'exp-10', title: 'Printing', amount: 40, category: 'education', date: '2026-10-03' },
  { id: 'exp-11', title: 'Grocery', amount: 650, category: 'food', date: '2026-10-02' },
  { id: 'exp-12', title: 'Spotify', amount: 59, category: 'subscriptions', date: '2026-10-01' },
  { id: 'exp-13', title: 'T-Shirt', amount: 499, category: 'shopping', date: '2026-10-01' },
  { id: 'exp-14', title: 'Coffee', amount: 180, category: 'food', date: '2026-10-04' },
  { id: 'exp-15', title: 'Xerox Notes', amount: 45, category: 'education', date: '2026-10-04' },
  { id: 'exp-16', title: 'Dinner Out', amount: 350, category: 'food', date: '2026-10-03' },
  { id: 'exp-17', title: 'Auto to College', amount: 40, category: 'transport', date: '2026-10-04' },
  { id: 'exp-18', title: 'Earphones', amount: 1420, category: 'shopping', date: '2026-10-02' }
];

// ============================================================
// Career Skills
// ============================================================
export const careerSkills: CareerSkill[] = [
  { id: 'cs-1', name: 'Communication', level: 'strong', progress: 75, category: 'Soft Skills' },
  { id: 'cs-2', name: 'SQL', level: 'develop', progress: 45, category: 'Technical' },
  { id: 'cs-3', name: 'Product Analytics', level: 'develop', progress: 35, category: 'Core PM' },
  { id: 'cs-4', name: 'Market Research', level: 'missing', progress: 15, category: 'Core PM' },
  { id: 'cs-5', name: 'Leadership', level: 'develop', progress: 50, category: 'Soft Skills' },
  { id: 'cs-6', name: 'Product Strategy', level: 'missing', progress: 10, category: 'Core PM' },
  { id: 'cs-7', name: 'User Research', level: 'missing', progress: 20, category: 'Core PM' },
  { id: 'cs-8', name: 'Data Analysis', level: 'develop', progress: 40, category: 'Technical' },
  { id: 'cs-9', name: 'Wireframing', level: 'develop', progress: 55, category: 'Design' },
  { id: 'cs-10', name: 'A/B Testing', level: 'missing', progress: 5, category: 'Technical' }
];

// ============================================================
// Goals
// ============================================================
export let goals: Goal[] = [
  { id: 'g-1', name: '9.0 CGPA', category: 'academic', progress: 65, target: 100, unit: '%', deadline: '2027-06-30', status: 'at-risk', weeklyHoursRequired: 15 },
  { id: 'g-2', name: 'Gym 5x/week', category: 'fitness', progress: 60, target: 100, unit: '%', deadline: '2026-12-31', status: 'on-track', weeklyHoursRequired: 7 },
  { id: 'g-3', name: 'Learn MERN Stack', category: 'career', progress: 40, target: 100, unit: '%', deadline: '2027-03-31', status: 'behind', weeklyHoursRequired: 10 },
  { id: 'g-4', name: 'CAT Preparation', category: 'academic', progress: 20, target: 100, unit: '%', deadline: '2027-11-30', status: 'behind', weeklyHoursRequired: 8 },
  { id: 'g-5', name: '8h Sleep/day', category: 'productivity', progress: 70, target: 100, unit: '%', deadline: '2026-12-31', status: 'on-track', weeklyHoursRequired: 0 }
];

// ============================================================
// Study Sessions
// ============================================================
export let studySessions: StudySession[] = [
  { id: 'ss-1', subject: 'ADSA', duration: 90, date: '2026-10-03', focusScore: 7, type: 'study' },
  { id: 'ss-2', subject: 'CN', duration: 60, date: '2026-10-03', focusScore: 8, type: 'revision' },
  { id: 'ss-3', subject: 'DBMS', duration: 45, date: '2026-10-02', focusScore: 6, type: 'assignment' },
  { id: 'ss-4', subject: 'OS', duration: 75, date: '2026-10-02', focusScore: 7, type: 'study' },
  { id: 'ss-5', subject: 'ADSA', duration: 50, date: '2026-10-01', focusScore: 5, type: 'study' },
  { id: 'ss-6', subject: 'SE', duration: 30, date: '2026-10-01', focusScore: 4, type: 'project' }
];

// ============================================================
// Heatmap
// ============================================================
export const heatmapData: HabitEntry[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-09-05');
  date.setDate(date.getDate() + i);
  const dayOfWeek = date.getDay();
  return {
    date: date.toISOString().split('T')[0],
    study: Math.random() > 0.3,
    gym: dayOfWeek !== 0 && dayOfWeek !== 3 && Math.random() > 0.3,
    assignment: Math.random() > 0.5,
    focus: Math.random() > 0.4,
    sleep: Math.random() > 0.25,
    spending: Math.random() > 0.4
  };
});

// ============================================================
// Check-ins
// ============================================================
export let checkIns: CheckIn[] = [
  { id: 'ci-1', date: '2026-10-03', mood: 'okay', energy: 'medium' },
  { id: 'ci-2', date: '2026-10-02', mood: 'focused', energy: 'high' },
  { id: 'ci-3', date: '2026-10-01', mood: 'tired', energy: 'low' }
];

// ============================================================
// Achievements
// ============================================================
export const achievements: Achievement[] = [
  { id: 'ach-1', name: 'First Week', description: 'Complete your first full week with Student Twin', icon: '🎯', unlocked: true, unlockedDate: '2026-08-07', category: 'general' },
  { id: 'ach-2', name: 'Locked In', description: 'Complete all planned tasks for 3 consecutive days', icon: '🔒', unlocked: true, unlockedDate: '2026-09-15', category: 'productivity' },
  { id: 'ach-3', name: 'Comeback', description: 'Recover from an overloaded state', icon: '💪', unlocked: false, category: 'recovery' },
  { id: 'ach-4', name: 'Consistent', description: 'Maintain 7-day study streak', icon: '📚', unlocked: true, unlockedDate: '2026-09-20', category: 'academic' },
  { id: 'ach-5', name: 'Fitness Mode', description: 'Complete 5 workouts in a week', icon: '🏋️', unlocked: false, category: 'fitness' },
  { id: 'ach-6', name: 'Academic Momentum', description: 'Improve CGPA by 0.5 in a semester', icon: '📈', unlocked: false, category: 'academic' }
];

// ============================================================
// Notifications
// ============================================================
export let notifications: Notification[] = [
  {
    id: 'n-1', message: 'Your ADSA assignment is still incomplete. Starting now keeps tomorrow\'s workload below 4 hours.',
    type: 'urgent', timestamp: '2026-10-04T18:00:00', read: false, actionLabel: 'Start Now', actionRoute: '/regreter'
  },
  {
    id: 'n-2', message: 'You\'re one workout away from your weekly fitness target.',
    type: 'info', timestamp: '2026-10-04T17:30:00', read: false, actionLabel: 'Log Workout', actionRoute: '/fitness'
  },
  {
    id: 'n-3', message: 'Your spending is 8% below your usual weekly average. Good job!',
    type: 'success', timestamp: '2026-10-04T16:00:00', read: true
  },
  {
    id: 'n-4', message: 'You have 3 deadlines within 48 hours.',
    type: 'warning', timestamp: '2026-10-04T15:00:00', read: false, actionLabel: 'View Tasks', actionRoute: '/productivity'
  }
];

// ============================================================
// Helper Functions
// ============================================================
export function getFinanceData(): FinanceData {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categories = ['food', 'transport', 'shopping', 'education', 'subscriptions', 'other'];
  const breakdown = categories.map(cat => {
    const amount = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { category: cat, amount, percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0 };
  });

  const daysInMonth = 31;
  const currentDay = 4;
  const projectedMonthEnd = Math.round((totalSpent / currentDay) * daysInMonth);

  return {
    monthlyBudget: student.monthlyBudget,
    spent: totalSpent,
    remaining: student.monthlyBudget - totalSpent,
    projectedMonthEnd,
    expenses,
    categoryBreakdown: breakdown.filter(b => b.amount > 0),
    weeklyAverage: Math.round(totalSpent / (currentDay / 7)),
    thisWeekSpending: expenses.filter(e => {
      const d = new Date(e.date);
      return d >= new Date('2026-09-28');
    }).reduce((sum, e) => sum + e.amount, 0)
  };
}

export function getAcademicData(): AcademicData {
  const overallAttendance = Math.round(
    subjects.reduce((sum, s) => sum + s.attendancePercentage, 0) / subjects.length
  );
  const assignmentCompletion = Math.round(
    subjects.reduce((sum, s) => sum + s.assignmentCompletion, 0) / subjects.length
  );
  const todayStudy = studySessions.filter(s => s.date === '2026-10-04').reduce((sum, s) => sum + s.duration, 0) / 60;
  const avgStudy = studySessions.reduce((sum, s) => sum + s.duration, 0) / 60 / 4;

  return {
    cgpa: student.cgpa,
    targetCgpa: student.targetCgpa,
    sgpa: 7.4,
    semester: student.semester,
    overallAttendance,
    targetAttendance: 75,
    assignmentCompletion,
    subjects,
    studyHoursToday: Math.round(todayStudy * 10) / 10,
    averageStudyHours: Math.round(avgStudy * 10) / 10,
    totalCredits: 85,
    completedCredits: 68
  };
}

export function getNutritionData(): NutritionData {
  const todayMeals = meals.filter(m => m.date === '2026-10-04');
  return {
    dailyCalories: todayMeals.reduce((sum, m) => sum + m.calories, 0),
    calorieTarget: 2300,
    protein: todayMeals.reduce((sum, m) => sum + m.protein, 0),
    proteinTarget: student.proteinTarget,
    carbs: todayMeals.reduce((sum, m) => sum + m.carbs, 0),
    carbsTarget: 280,
    fat: todayMeals.reduce((sum, m) => sum + m.fat, 0),
    fatTarget: 75,
    water: 2.1,
    waterTarget: 3,
    meals: todayMeals
  };
}

export function getFitnessData(): FitnessData {
  const totalVolume = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((eSum, e) => eSum + (e.sets * e.reps * e.weight), 0)
  , 0);

  return {
    weeklyWorkouts: 3,
    weeklyTarget: 5,
    workoutStreak: 2,
    trainingVolume: totalVolume,
    consistency: 68,
    personalRecords: [
      { exercise: 'Deadlift', weight: 100, date: '2026-10-02' },
      { exercise: 'Squat', weight: 80, date: '2026-09-29' },
      { exercise: 'Bench Press', weight: 60, date: '2026-10-01' }
    ],
    recentWorkouts: workouts
  };
}

export function getProductivityData(): ProductivityData {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => t.status === 'pending' && new Date(t.deadline) < new Date()).length;
  return {
    tasksCompleted: completed,
    totalTasks: tasks.length,
    studyHoursToday: 1.7,
    averageStudyHours: 2.6,
    thisWeekStudyHours: 11.9,
    completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    overdueTasks: overdue,
    currentStreak: 4,
    focusSessions: 3,
    heatmap: heatmapData,
    procrastinationRate: 35
  };
}

export function getCareerData(): CareerData {
  return {
    targetRole: student.careerTarget,
    skills: careerSkills,
    roadmap: [
      { stage: 'Current State', status: 'completed', items: ['Engineering degree', 'Basic coding', 'Communication skills'] },
      { stage: 'Skill Development', status: 'current', items: ['SQL mastery', 'Product Analytics', 'Data Analysis', 'Market Research'] },
      { stage: 'Projects', status: 'upcoming', items: ['Product case studies', 'Side project', 'Data analysis portfolio'] },
      { stage: 'Internship', status: 'upcoming', items: ['PM internship', 'APM programs', 'Startup experience'] },
      { stage: 'Target Role', status: 'upcoming', items: ['Associate Product Manager', 'Product Manager'] }
    ],
    gapAnalysis: [
      { area: 'Product Analytics', current: 35, required: 80, gap: 45 },
      { area: 'SQL', current: 45, required: 85, gap: 40 },
      { area: 'Market Research', current: 15, required: 70, gap: 55 },
      { area: 'Product Strategy', current: 10, required: 75, gap: 65 },
      { area: 'User Research', current: 20, required: 70, gap: 50 },
      { area: 'A/B Testing', current: 5, required: 60, gap: 55 }
    ]
  };
}

export function getTwinPulse(): TwinPulse {
  return {
    academic: 'stable',
    fitness: 'strong',
    productivity: 'dipping',
    career: 'stable',
    routine: 'stable'
  };
}

export function getTwinInsight(): TwinInsight {
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const plannedWorkload = pendingTasks.reduce((sum, t) => sum + t.estimatedDuration, 0) / 60;

  return {
    plannedWorkload: Math.round(plannedWorkload * 10) / 10,
    availableHours: 4.2,
    conflict: Math.round((plannedWorkload - 4.2) * 10) / 10,
    oneThing: {
      task: tasks.find(t => t.status === 'pending' && t.priority === 'high')?.title || 'No urgent tasks',
      dueTime: '11:59 PM Tonight',
      impact: 'high',
      estimatedDuration: 120
    },
    momentum: 78,
    momentumTrend: 'up',
    momentumMessage: "You're building a good week."
  };
}

export function getDashboardData(): DashboardData {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const insight = getTwinInsight();

  let twinState: DashboardData['twinState'] = 'stable';
  if (insight.conflict > 2) twinState = 'overloaded';
  else if (insight.momentum > 80) twinState = 'productive';
  else if (tasks.filter(t => t.status === 'postponed').length > 2) twinState = 'recovering';

  return {
    student,
    twinPulse: getTwinPulse(),
    twinInsight: insight,
    todaysTasks: pendingTasks.filter(t => {
      const d = new Date(t.deadline);
      return d <= new Date('2026-10-05T00:00:00');
    }),
    notifications: notifications.filter(n => !n.read),
    dailyBrief: [
      'ADSA assignment - Due tonight',
      'CN revision - Transport Layer',
      'Gym - Upper Body workout'
    ],
    regreterPreview: 'Two possible versions of tomorrow.',
    twinState
  };
}

export function getGoalConflict(): GoalConflict {
  const availableHours = 32;
  const goalHours = goals.map(g => ({ name: g.name, hoursRequired: g.weeklyHoursRequired }));
  const totalRequired = goalHours.reduce((sum, g) => sum + g.hoursRequired, 0);

  return {
    totalAvailableHours: availableHours,
    totalRequiredHours: totalRequired,
    conflictHours: Math.max(0, totalRequired - availableHours),
    goals: goalHours,
    hasConflict: totalRequired > availableHours,
    suggestions: totalRequired > availableHours ? [
      'Consider reducing CAT preparation to 5h/week and focusing closer to exam date',
      'MERN stack learning can be reduced to 6h/week by focusing on core concepts first',
      'Combine career learning with academic projects where possible'
    ] : []
  };
}

export function getWeeklyReview(): WeeklyReview {
  return {
    whatWentWell: [
      'Study consistency improved by 18% over last week',
      'Completed 2 extra workouts compared to last week',
      'Spending was ₹420 below weekly average',
      'Met CN revision target ahead of schedule'
    ],
    whatSlipped: [
      'ADSA assignment pushed to deadline',
      'Missed 1 SE lecture',
      'Sleep schedule inconsistent (avg 6.2h vs 8h target)',
      'Career skill development hours below target'
    ],
    biggestImprovement: '+18% study consistency — your best week in the last month',
    biggestRisk: 'SE attendance at 76% — 1 more miss puts you below 75% requirement',
    nextWeekFocus: 'Clear ADSA backlog, attend all SE lectures, resume career skill sessions',
    stats: {
      studyConsistencyChange: 18,
      workoutsCompleted: 3,
      missedAssignments: 1,
      spendingVsAverage: -420,
      tasksCompleted: 12,
      totalTasks: 18
    }
  };
}

export function getTwinEvolution(): TwinEvolution {
  return {
    thirtyDaysAgo: { academic: 62, fitness: 45, productivity: 55, career: 20 },
    today: { academic: 72, fitness: 68, productivity: 65, career: 35 },
    timeline: Array.from({ length: 30 }, (_, i) => {
      const date = new Date('2026-09-05');
      date.setDate(date.getDate() + i);
      const progress = i / 29;
      return {
        date: date.toISOString().split('T')[0],
        academic: Math.round(62 + progress * 10 + (Math.random() - 0.5) * 5),
        fitness: Math.round(45 + progress * 23 + (Math.random() - 0.5) * 8),
        productivity: Math.round(55 + progress * 10 + (Math.random() - 0.5) * 7),
        career: Math.round(20 + progress * 15 + (Math.random() - 0.5) * 4)
      };
    })
  };
}
