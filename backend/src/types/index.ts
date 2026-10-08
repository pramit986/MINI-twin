// ============================================================
// Student Twin — Shared Types
// ============================================================

export interface Student {
  id: string;
  name: string;
  degree: string;
  semester: number;
  cgpa: number;
  targetCgpa: number;
  avatar: string;
  careerTarget: string;
  monthlyBudget: number;
  proteinTarget: number;
  dailyStudyTarget: number;
  preferredStudyTime: string;
  interventionIntensity: 'gentle' | 'balanced' | 'direct';
  fitnessGoal: string;
  joinedDate: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  grade: string | null;
  assignmentCompletion: number;
  nextExam: string | null;
  risk: 'low' | 'medium' | 'high';
}

export interface AcademicData {
  cgpa: number;
  targetCgpa: number;
  sgpa: number;
  semester: number;
  overallAttendance: number;
  targetAttendance: number;
  assignmentCompletion: number;
  subjects: Subject[];
  studyHoursToday: number;
  averageStudyHours: number;
  totalCredits: number;
  completedCredits: number;
}

export interface Task {
  id: string;
  title: string;
  category: 'academic' | 'fitness' | 'productivity' | 'nutrition' | 'finance' | 'career' | 'personal';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  estimatedDuration: number; // in minutes
  status: 'pending' | 'in-progress' | 'completed' | 'postponed';
  createdAt: string;
  completedAt?: string;
  postponedCount: number;
  impact: 'high' | 'medium' | 'low';
  description?: string;
}

export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  exercises: Exercise[];
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // kg
}

export interface FitnessData {
  weeklyWorkouts: number;
  weeklyTarget: number;
  workoutStreak: number;
  trainingVolume: number;
  consistency: number;
  personalRecords: { exercise: string; weight: number; date: string }[];
  recentWorkouts: Workout[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export interface NutritionData {
  dailyCalories: number;
  calorieTarget: number;
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
  water: number;
  waterTarget: number;
  meals: Meal[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'shopping' | 'education' | 'subscriptions' | 'other';
  date: string;
  description?: string;
}

export interface FinanceData {
  monthlyBudget: number;
  spent: number;
  remaining: number;
  projectedMonthEnd: number;
  expenses: Expense[];
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  weeklyAverage: number;
  thisWeekSpending: number;
}

export interface CareerSkill {
  id: string;
  name: string;
  level: 'strong' | 'develop' | 'missing';
  progress: number; // 0-100
  category: string;
}

export interface CareerData {
  targetRole: string;
  skills: CareerSkill[];
  roadmap: { stage: string; status: 'completed' | 'current' | 'upcoming'; items: string[] }[];
  gapAnalysis: { area: string; current: number; required: number; gap: number }[];
}

export interface Goal {
  id: string;
  name: string;
  category: 'academic' | 'fitness' | 'career' | 'productivity' | 'finance';
  progress: number;
  target: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  weeklyHoursRequired: number;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // minutes
  date: string;
  focusScore: number; // 1-10
  type: 'study' | 'revision' | 'assignment' | 'project';
}

export interface HabitEntry {
  date: string;
  study: boolean;
  gym: boolean;
  assignment: boolean;
  focus: boolean;
  sleep: boolean;
  spending: boolean;
}

export interface ProductivityData {
  tasksCompleted: number;
  totalTasks: number;
  studyHoursToday: number;
  averageStudyHours: number;
  thisWeekStudyHours: number;
  completionRate: number;
  overdueTasks: number;
  currentStreak: number;
  focusSessions: number;
  heatmap: HabitEntry[];
  procrastinationRate: number;
}

export interface TwinPulse {
  academic: 'stable' | 'strong' | 'dipping' | 'critical';
  fitness: 'stable' | 'strong' | 'dipping' | 'critical';
  productivity: 'stable' | 'strong' | 'dipping' | 'critical';
  career: 'stable' | 'strong' | 'dipping' | 'critical';
  routine: 'stable' | 'strong' | 'dipping' | 'critical';
}

export interface TwinInsight {
  plannedWorkload: number;
  availableHours: number;
  conflict: number;
  oneThing: {
    task: string;
    dueTime: string;
    impact: 'high' | 'medium' | 'low';
    estimatedDuration: number;
  };
  momentum: number;
  momentumTrend: 'up' | 'down' | 'stable';
  momentumMessage: string;
}

export interface DashboardData {
  student: Student;
  twinPulse: TwinPulse;
  twinInsight: TwinInsight;
  todaysTasks: Task[];
  notifications: Notification[];
  dailyBrief: string[];
  regreterPreview: string;
  twinState: 'stable' | 'productive' | 'overloaded' | 'recovering';
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

export interface RegreterPath {
  label: string;
  tomorrowWorkload: number;
  examPreparation: number;
  freeTime: number;
  productivityImpact: number;
  academicRisk: string;
}

export interface RegreterAnalysis {
  task: Task;
  pathA: RegreterPath; // Complete now
  pathB: RegreterPath; // Postpone
  consequence: string;
  historicalPattern: string;
  interventionLevel: 'gentle' | 'balanced' | 'direct';
}

export interface SimulationScenario {
  studyHours: number;
  gymDays: number;
  sleepHours: number;
  attendanceRate: number;
  taskCompletionRate: number;
  careerLearningHours: number;
}

export interface SimulationResult {
  timeline: {
    label: string;
    academic: { cgpa: number; attendance: number; risk: string };
    fitness: { consistency: number; streak: number };
    productivity: { completionRate: number; studyHours: number };
    career: { progress: number; skillsGained: number };
    routine: { stability: number; burnoutRisk: string };
    workload: { daily: number; weekly: number };
  }[];
}

export interface RecoveryPlan {
  missedTasks: Task[];
  tonight: Task[];
  tomorrow: Task[];
  lowPriority: Task[];
  hoursRecovered: number;
  message: string;
}

export interface WeeklyReview {
  whatWentWell: string[];
  whatSlipped: string[];
  biggestImprovement: string;
  biggestRisk: string;
  nextWeekFocus: string;
  stats: {
    studyConsistencyChange: number;
    workoutsCompleted: number;
    missedAssignments: number;
    spendingVsAverage: number;
    tasksCompleted: number;
    totalTasks: number;
  };
}

export interface RiskPrediction {
  level: 'low' | 'medium' | 'high';
  score: number;
  factors: string[];
  recommendations: string[];
}

export interface CheckIn {
  id: string;
  date: string;
  mood: 'focused' | 'okay' | 'tired' | 'stressed' | 'low-energy';
  energy: 'low' | 'medium' | 'high';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: string;
}

export interface GoalConflict {
  totalAvailableHours: number;
  totalRequiredHours: number;
  conflictHours: number;
  goals: { name: string; hoursRequired: number }[];
  hasConflict: boolean;
  suggestions: string[];
}

export interface TwinEvolution {
  thirtyDaysAgo: { academic: number; fitness: number; productivity: number; career: number };
  today: { academic: number; fitness: number; productivity: number; career: number };
  timeline: { date: string; academic: number; fitness: number; productivity: number; career: number }[];
}

export interface AskTwinResponse {
  answer: string;
  explanation: string;
  dataUsed: string[];
  suggestions: string[];
}
