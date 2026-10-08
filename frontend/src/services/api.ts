const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  // Dashboard
  getDashboard: () => fetchJSON<any>('/dashboard'),
  fixMyDay: () => fetchJSON<any>('/dashboard/fix-my-day', { method: 'POST' }),
  
  // Student
  getStudent: () => fetchJSON<any>('/student'),
  updateStudent: (data: any) => fetchJSON<any>('/student', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Tasks
  getTasks: () => fetchJSON<any[]>('/tasks'),
  createTask: (task: any) => fetchJSON<any>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id: string, data: any) => fetchJSON<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id: string) => fetchJSON<any>(`/tasks/${id}`, { method: 'DELETE' }),
  completeTask: (id: string) => fetchJSON<any>(`/tasks/${id}/complete`, { method: 'POST' }),
  postponeTask: (id: string) => fetchJSON<any>(`/tasks/${id}/postpone`, { method: 'POST' }),
  
  // Academic
  getAcademic: () => fetchJSON<any>('/academic'),
  getAttendance: () => fetchJSON<any[]>('/attendance'),
  getAssignments: () => fetchJSON<any[]>('/assignments'),
  getStudySessions: () => fetchJSON<any[]>('/study'),
  createStudySession: (data: any) => fetchJSON<any>('/study', { method: 'POST', body: JSON.stringify(data) }),
  calculateCgpa: (grades: any) => fetchJSON<any>('/academic/cgpa-calculator', { method: 'POST', body: JSON.stringify({ grades }) }),
  
  // Fitness
  getFitness: () => fetchJSON<any>('/fitness'),
  logWorkout: (data: any) => fetchJSON<any>('/fitness/workout', { method: 'POST', body: JSON.stringify(data) }),
  
  // Nutrition
  getNutrition: () => fetchJSON<any>('/nutrition'),
  addMeal: (data: any) => fetchJSON<any>('/nutrition/meal', { method: 'POST', body: JSON.stringify(data) }),
  
  // Finance
  getFinance: () => fetchJSON<any>('/finance'),
  addExpense: (data: any) => fetchJSON<any>('/finance/expense', { method: 'POST', body: JSON.stringify(data) }),
  
  // Career
  getCareer: () => fetchJSON<any>('/career'),
  
  // Goals
  getGoals: () => fetchJSON<any[]>('/goals'),
  getGoalConflicts: () => fetchJSON<any>('/goals/conflicts'),
  updateGoal: (id: string, data: any) => fetchJSON<any>(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  // Regreter
  analyzeRegreter: (taskId: string) => fetchJSON<any>('/regreter/analyze', { method: 'POST', body: JSON.stringify({ taskId }) }),
  regreterDecide: (taskId: string, decision: 'complete' | 'postpone') => 
    fetchJSON<any>('/regreter/decide', { method: 'POST', body: JSON.stringify({ taskId, decision }) }),
  
  // Future Self
  simulate: (scenario: any) => fetchJSON<any>('/future-self/simulate', { method: 'POST', body: JSON.stringify(scenario) }),
  
  // Recovery
  getRecovery: () => fetchJSON<any>('/recovery'),
  activateRecovery: () => fetchJSON<any>('/recovery/activate', { method: 'POST' }),
  
  // Weekly Review
  getWeeklyReview: () => fetchJSON<any>('/weekly-review'),
  
  // AI
  askTwin: (question: string) => fetchJSON<any>('/ai/ask', { method: 'POST', body: JSON.stringify({ question }) }),
  getRisk: () => fetchJSON<any>('/ai/risk'),
  
  // Twin
  getTwinPulse: () => fetchJSON<any>('/twin/pulse'),
  getTwinInsight: () => fetchJSON<any>('/twin/insight'),
  getTwinEvolution: () => fetchJSON<any>('/twin/evolution'),
  
  // Check-ins
  getCheckIns: () => fetchJSON<any[]>('/checkins'),
  createCheckIn: (data: any) => fetchJSON<any>('/checkins', { method: 'POST', body: JSON.stringify(data) }),
  
  // Achievements
  getAchievements: () => fetchJSON<any[]>('/achievements'),
  
  // Notifications
  getNotifications: () => fetchJSON<any[]>('/notifications'),
  markNotificationRead: (id: string) => fetchJSON<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  
  // Productivity
  getProductivity: () => fetchJSON<any>('/dashboard').then((d: any) => {
    // Derive productivity from dashboard and tasks
    return d;
  }),
  
  // Heatmap
  getHeatmap: () => fetchJSON<any[]>('/heatmap'),
};
