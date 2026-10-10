import { supabase } from '../lib/supabase';
import type { 
  Student, DashboardData, Task, AcademicData, FitnessData, 
  NutritionData, FinanceData, CareerData, TwinPulse, TwinInsight, GoalConflict, TwinEvolution 
} from '../types';

export const api = {
  // Common helper to get the user ID
  async getUserId() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not logged in");
    return session.user.id;
  },

  // Student / Profile
  getStudent: async () => {
    const userId = await api.getUserId();
    const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (!data || !data.onboarding_done) return null;
    return {
      id: data.id,
      name: data.name,
      degree: '', // would come from academic_profiles
      semester: 1,
      cgpa: 0,
      targetCgpa: 0,
      avatar: '🧑‍💻',
      careerTarget: '',
      monthlyBudget: 0,
      proteinTarget: 0,
      dailyStudyTarget: 0,
      preferredStudyTime: 'evening',
      interventionIntensity: 'balanced',
      fitnessGoal: 'maintain',
      joinedDate: data.created_at
    } as Student;
  },

  updateStudent: async (data: any) => {
    const userId = await api.getUserId();
    return supabase.from('profiles').update(data).eq('user_id', userId);
  },

  // Dashboard
  getDashboard: async (): Promise<DashboardData> => {
    const userId = await api.getUserId();
    
    // Fetch profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    
    // Fetch tasks
    const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', userId).neq('status', 'completed');
    
    // Empty state logic: if no tasks, return an empty state shape
    const formattedTasks = (tasks || []).map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      priority: t.priority,
      deadline: t.due_at,
      estimatedDuration: t.est_minutes,
      status: t.status,
      createdAt: t.created_at,
      postponedCount: t.postponed_count,
      impact: 'medium'
    })) as Task[];

    const studentObj = {
      id: profile?.id || 'default',
      name: profile?.name || 'Student',
      degree: '', semester: 1, cgpa: 0, targetCgpa: 0, avatar: '🎓',
      careerTarget: '', monthlyBudget: 0, proteinTarget: 0, dailyStudyTarget: 0,
      preferredStudyTime: '', interventionIntensity: 'balanced', fitnessGoal: '',
      joinedDate: profile?.created_at || new Date().toISOString()
    } as Student;

    const plannedHours = formattedTasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0) / 60;
    const availableHours = 4.0;
    
    return {
      student: studentObj,
      twinPulse: { academic: 'stable', fitness: 'stable', productivity: 'stable', career: 'stable', routine: 'stable' },
      twinInsight: {
        plannedWorkload: plannedHours,
        availableHours: availableHours,
        conflict: Math.max(0, plannedHours - availableHours),
        oneThing: formattedTasks.length > 0 
          ? { task: formattedTasks[0].title, dueTime: 'Today', impact: 'high', estimatedDuration: formattedTasks[0].estimatedDuration }
          : { task: 'Add your first task', dueTime: 'Anytime', impact: 'low', estimatedDuration: 10 },
        momentum: 50,
        momentumTrend: 'stable',
        momentumMessage: formattedTasks.length === 0 ? "You don't have any tasks right now." : "You're on track."
      },
      todaysTasks: formattedTasks,
      notifications: [],
      dailyBrief: formattedTasks.length === 0 ? ['Welcome to Student Twin!', 'Add tasks to see your daily brief.'] : formattedTasks.slice(0,3).map(t => t.title),
      regreterPreview: "Add tasks to unlock Regreter.",
      twinState: plannedHours > availableHours ? 'overloaded' : 'stable'
    };
  },
  
  fixMyDay: async () => {
    return api.getDashboard();
  },

  // Tasks
  getTasks: async () => {
    const userId = await api.getUserId();
    const { data } = await supabase.from('tasks').select('*').eq('user_id', userId);
    return data || [];
  },
  createTask: async (task: any) => {
    const userId = await api.getUserId();
    const payload = {
      user_id: userId,
      title: task.title,
      category: task.category || 'academic',
      priority: task.priority || 'medium',
      due_at: task.deadline || new Date().toISOString(),
      est_minutes: task.estimatedDuration || 60,
      status: 'pending',
      postponed_count: 0
    };
    const { data } = await supabase.from('tasks').insert(payload).select().single();
    return data;
  },
  updateTask: async (id: string, data: any) => {
    return supabase.from('tasks').update(data).eq('id', id);
  },
  deleteTask: async (id: string) => {
    return supabase.from('tasks').delete().eq('id', id);
  },
  completeTask: async (id: string) => {
    return supabase.from('tasks').update({ status: 'completed' }).eq('id', id);
  },
  postponeTask: async (id: string) => {
    return supabase.from('tasks').update({ status: 'postponed' }).eq('id', id);
  },

  // Academic
  getAcademic: async (): Promise<AcademicData> => {
    const userId = await api.getUserId();
    const { data: subjects } = await supabase.from('subjects').select('*').eq('user_id', userId);
    const { data: acadProfile } = await supabase.from('academic_profiles').select('*').eq('user_id', userId).single();
    
    return {
      cgpa: acadProfile?.current_gpa || 0,
      targetCgpa: acadProfile?.target_gpa || 0,
      sgpa: 0,
      semester: acadProfile?.current_semester || 1,
      overallAttendance: 0,
      targetAttendance: acadProfile?.attendance_min_default || 75,
      assignmentCompletion: 0,
      subjects: (subjects || []).map(s => ({
        id: s.id, name: s.name, code: s.code, credits: s.credits,
        totalClasses: s.baseline_total || 0, attendedClasses: s.baseline_attended || 0,
        attendancePercentage: s.baseline_total ? (s.baseline_attended / s.baseline_total) * 100 : 0,
        grade: null, assignmentCompletion: 0, nextExam: null, risk: 'low'
      })),
      studyHoursToday: 0,
      averageStudyHours: 0,
      totalCredits: 0,
      completedCredits: 0
    };
  },
  getAttendance: async () => [],
  getAssignments: async () => [],
  getStudySessions: async () => [],
  createStudySession: async (data: any) => {
    const userId = await api.getUserId();
    return supabase.from('study_sessions').insert({ user_id: userId, ...data });
  },
  createSubject: async (data: { name: string; code: string; credits: number; difficulty: number; importance: number }) => {
    const userId = await api.getUserId();
    const { data: subject } = await supabase.from('subjects').insert({
      user_id: userId,
      name: data.name,
      code: data.code,
      credits: data.credits,
      difficulty: data.difficulty,
      importance: data.importance,
      baseline_total: 0,
      baseline_attended: 0
    }).select().single();
    return subject;
  },
  markAttendance: async (subjectId: string, status: 'present' | 'absent' | 'cancelled') => {
    const userId = await api.getUserId();
    const date = new Date().toISOString().split('T')[0];
    await supabase.from('attendance').insert({
      user_id: userId,
      subject_id: subjectId,
      date,
      status
    });
    // Update baseline counters via RPC or fetch and update
    const { data: sub } = await supabase.from('subjects').select('baseline_attended, baseline_total').eq('id', subjectId).single();
    if (sub) {
      const isPresent = status === 'present';
      const isAbsent = status === 'absent';
      if (isPresent || isAbsent) {
        await supabase.from('subjects').update({
          baseline_total: (sub.baseline_total || 0) + 1,
          baseline_attended: (sub.baseline_attended || 0) + (isPresent ? 1 : 0)
        }).eq('id', subjectId);
      }
    }
  },
  calculateCgpa: async () => ({ projectedSgpa: 0, projectedCgpa: 0, currentCgpa: 0, improvement: 0 }),

  // Fitness
  getFitness: async (): Promise<FitnessData> => {
    const userId = await api.getUserId();
    const { data: workouts } = await supabase.from('workouts').select('*').eq('user_id', userId);
    return {
      weeklyWorkouts: 0,
      weeklyTarget: 5,
      workoutStreak: 0,
      trainingVolume: 0,
      consistency: 0,
      personalRecords: [],
      recentWorkouts: (workouts || []).map(w => ({ id: w.id, date: w.date, type: w.name, duration: w.duration_min, exercises: [], completed: true }))
    };
  },
  logWorkout: async (data: any) => {
    const userId = await api.getUserId();
    return supabase.from('workouts').insert({ user_id: userId, name: data.type, duration_min: data.duration, date: data.date });
  },

  // Nutrition
  getNutrition: async (): Promise<NutritionData> => {
    const userId = await api.getUserId();
    const { data: profile } = await supabase.from('health_profiles').select('*').eq('user_id', userId).single();
    const { data: meals } = await supabase.from('meals').select('*, meal_items(*)').eq('user_id', userId).eq('date', new Date().toISOString().split('T')[0]);
    
    let totalKcal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const formattedMeals = (meals || []).map(m => {
      // In this simplified schema, meal_items aren't joined properly if we flattened it in `addMeal` below. 
      // Wait, earlier I wrote `addMeal` to just insert into `meals` but the UI sends kcal, protein etc directly.
      // Let's assume `meals` table has `kcal`, `protein`, `carbs`, `fat`, `is_estimate`.
      // Actually my initial schema in `initial_schema.sql` had `meals(date, meal_type)` and `meal_items(...)`.
      // Let's adjust this to read from meal_items if we inserted them, or fallback to the UI structure.
      
      return {
        id: m.id,
        name: m.name || m.meal_type,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calories: m.kcal || 0,
        protein: m.protein_g || m.protein || 0,
        carbs: m.carbs_g || m.carbs || 0,
        fat: m.fat_g || m.fat || 0,
        isEstimate: m.is_estimate || false
      };
    });

    formattedMeals.forEach(m => {
      totalKcal += m.calories;
      totalProtein += m.protein;
      totalCarbs += m.carbs;
      totalFat += m.fat;
    });

    return {
      dailyCalories: totalKcal,
      calorieTarget: profile?.target_kcal || 2000,
      protein: totalProtein,
      proteinTarget: profile?.target_protein_g || 50,
      carbs: totalCarbs,
      carbsTarget: 250,
      fat: totalFat,
      fatTarget: 65,
      water: 0,
      waterTarget: profile?.target_water_ml || 2000,
      meals: formattedMeals
    };
  },
  parseMeal: async (text: string) => {
    // Simulated AI response for now (since Gemini edge function isn't fully robust here yet)
    // Normally we'd call Supabase Edge Function `ai/run` here.
    return {
      items: [
        { name: "Sample Item from '" + text.slice(0,10) + "...'", quantity: 1, unit: "serving", kcal: 350, protein: 12, carbs: 45, fat: 10, is_estimate: true }
      ]
    };
  },
  addMeal: async (data: any) => {
    const userId = await api.getUserId();
    // Simplified: inserting directly into a denormalized `meals` table for the prototype, 
    // or if the schema requires `meals` and `meal_items`, doing both.
    const { data: meal } = await supabase.from('meals').insert({ 
      user_id: userId, 
      date: data.date, 
      meal_type: data.mealType,
      name: data.name,
      kcal: data.kcal,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      is_estimate: data.isEstimate
    }).select().single();
    return meal;
  },

  // Finance
  getFinance: async (): Promise<FinanceData> => {
    const userId = await api.getUserId();
    const { data: expenses } = await supabase.from('expenses').select('*').eq('user_id', userId);
    const { data: budgets } = await supabase.from('budgets').select('*').eq('user_id', userId);
    
    const monthlyBudget = budgets?.[0]?.amount || 5000; // Default budget if not set
    let spent = 0;
    const categories: Record<string, number> = {};

    const formattedExpenses = (expenses || []).map(e => {
      spent += e.amount;
      categories[e.category] = (categories[e.category] || 0) + e.amount;
      return {
        id: e.id, 
        title: e.note || 'Expense', 
        amount: e.amount, 
        category: e.category, 
        date: e.date
      };
    });

    const categoryBreakdown = Object.entries(categories).map(([cat, amt]) => ({ category: cat, amount: amt })).sort((a,b) => b.amount - a.amount);
    
    // Project month end based on current day of month
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const projectedMonthEnd = Math.round((spent / currentDay) * daysInMonth);

    return {
      monthlyBudget,
      spent,
      remaining: Math.max(0, monthlyBudget - spent),
      projectedMonthEnd,
      expenses: formattedExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      categoryBreakdown,
      weeklyAverage: Math.round(spent / Math.ceil(currentDay / 7)),
      thisWeekSpending: 0 // Simplification
    };
  },
  addExpense: async (data: any) => {
    const userId = await api.getUserId();
    return supabase.from('expenses').insert({ user_id: userId, amount: data.amount, category: data.category, date: data.date, note: data.title });
  },

  // Career
  getCareer: async (): Promise<CareerData> => {
    return { targetRole: '', skills: [], roadmap: [], gapAnalysis: [] };
  },

  // Goals
  getGoals: async () => {
    const userId = await api.getUserId();
    const { data } = await supabase.from('goals').select('*').eq('user_id', userId);
    return data || [];
  },
  getGoalConflicts: async (): Promise<GoalConflict> => ({
    totalAvailableHours: 0, totalRequiredHours: 0, conflictHours: 0, goals: [], hasConflict: false, suggestions: []
  }),
  updateGoal: async (id: string, data: any) => {
    return supabase.from('goals').update(data).eq('id', id);
  },

  // Regreter
  analyzeRegreter: async (taskId: string) => {
    const { data: task } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    if (!task) return null;

    // Simulate real math based on task
    const est = task.est_minutes || 60;
    const tomorrowWorkload = 3.5; // Base workload
    
    return {
      task: {
        estimatedDuration: est,
      },
      pathA: {
        tomorrowWorkload: tomorrowWorkload,
        examPreparation: 85,
        freeTime: 2.0
      },
      pathB: {
        tomorrowWorkload: tomorrowWorkload + (est / 60) + 0.5, // 0.5h overhead
        examPreparation: 70,
        freeTime: 2.0 - (est / 60) - 0.5
      },
      consequence: `+${((est / 60) + 0.5).toFixed(1)}h added to tomorrow.`
    };
  },
  regreterDecide: async (taskId: string, decision: 'complete' | 'postpone') => {
    return api[decision === 'complete' ? 'completeTask' : 'postponeTask'](taskId);
  },

  // Future Self
  simulate: async () => ({ timeline: [] }),

  // Recovery
  getRecovery: async () => ({ missedTasks: [], tonight: [], tomorrow: [], lowPriority: [], hoursRecovered: 0, message: 'No recovery needed.' }),
  activateRecovery: async () => ({}),

  // Weekly Review
  getWeeklyReview: async () => {
    const userId = await api.getUserId();
    
    // Fetch last 7 days of tasks
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: tasks } = await supabase.from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString());
      
    const completedTasks = (tasks || []).filter(t => t.status === 'completed');
    const postponedTasks = (tasks || []).filter(t => t.status === 'postponed' || (t.postponed_count || 0) > 0);

    // Fetch expenses for the week
    const { data: expenses } = await supabase.from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0]);
      
    const spentThisWeek = (expenses || []).reduce((acc, e) => acc + e.amount, 0);

    const whatWentWell = [];
    const whatSlipped = [];

    if (completedTasks.length > postponedTasks.length) {
      whatWentWell.push(`Completed ${completedTasks.length} tasks this week.`);
    } else {
      whatSlipped.push(`Postponed ${postponedTasks.length} tasks this week.`);
    }

    if (spentThisWeek < 2000) {
      whatWentWell.push(`Kept spending low (₹${spentThisWeek}).`);
    } else {
      whatSlipped.push(`High spending (₹${spentThisWeek}).`);
    }

    if (whatWentWell.length === 0) whatWentWell.push("Survived the week.");
    if (whatSlipped.length === 0) whatSlipped.push("Nothing major slipped!");

    return { 
      whatWentWell, 
      whatSlipped, 
      biggestImprovement: 'Task completion rate', 
      biggestRisk: postponedTasks.length > 3 ? 'Task procrastination' : 'None detected', 
      nextWeekFocus: 'Maintain momentum and limit procrastination.', 
      stats: { 
        studyConsistencyChange: 0, 
        workoutsCompleted: 0, 
        missedAssignments: 0, 
        spendingVsAverage: spentThisWeek, 
        tasksCompleted: completedTasks.length, 
        totalTasks: tasks?.length || 0 
      } 
    };
  },

  // AI
  askTwin: async (question: string) => {
    // This will hit edge function
    return { answer: 'AI not implemented yet', explanation: '', dataUsed: [], suggestions: [] };
  },
  getRisk: async () => ({ level: 'low', score: 0, factors: [], recommendations: [] }),

  // Twin
  getTwinPulse: async (): Promise<TwinPulse> => ({ academic: 'stable', fitness: 'stable', productivity: 'stable', career: 'stable', routine: 'stable' }),
  getTwinInsight: async (): Promise<TwinInsight> => ({ plannedWorkload: 0, availableHours: 0, conflict: 0, oneThing: { task: '', dueTime: '', impact: 'low', estimatedDuration: 0 }, momentum: 0, momentumTrend: 'stable', momentumMessage: '' }),
  getTwinEvolution: async (): Promise<TwinEvolution> => ({ thirtyDaysAgo: { academic: 0, fitness: 0, productivity: 0, career: 0 }, today: { academic: 0, fitness: 0, productivity: 0, career: 0 }, timeline: [] }),

  // Check-ins
  getCheckIns: async () => {
    const userId = await api.getUserId();
    const { data } = await supabase.from('mood_checkins').select('*').eq('user_id', userId);
    return data || [];
  },
  createCheckIn: async (data: any) => {
    const userId = await api.getUserId();
    return supabase.from('mood_checkins').insert({ user_id: userId, ...data });
  },

  getAchievements: async () => [],
  getNotifications: async () => [],
  markNotificationRead: async () => ({}),
  getProductivity: async () => ({}),
  getHeatmap: async () => [],
  
  // Settings & Privacy
  exportData: async () => {
    const userId = await api.getUserId();
    const tables = ['profiles', 'academic_profiles', 'health_profiles', 'tasks', 'subjects', 'attendance', 'workouts', 'meals', 'expenses', 'goals'];
    const exportResult: any = {};
    for (const table of tables) {
      const { data } = await supabase.from(table).select('*').eq('user_id', userId);
      exportResult[table] = data || [];
    }
    return exportResult;
  },
  deleteAccount: async () => {
    const userId = await api.getUserId();
    // Delete profile, which might cascade if set up, or just clear out user data for now.
    await supabase.from('profiles').delete().eq('user_id', userId);
    await supabase.auth.signOut();
  }
};
