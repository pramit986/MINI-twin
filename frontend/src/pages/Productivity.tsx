import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ProductivityData, Task } from '../types';

export default function Productivity() {
  const [data, setData] = useState<ProductivityData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, tasksRes] = await Promise.all([
        api.getProductivity(), 
        api.getTasks()
      ]);
      
      const completed = tasksRes.filter((t: Task) => t.status === 'completed').length;
      const overdue = tasksRes.filter((t: Task) => t.status === 'pending' && new Date(t.deadline) < new Date()).length;
      
      setData({
        tasksCompleted: completed,
        totalTasks: tasksRes.length,
        studyHoursToday: 1.7, 
        averageStudyHours: 2.6,
        thisWeekStudyHours: 11.9,
        completionRate: tasksRes.length > 0 ? Math.round((completed / tasksRes.length) * 100) : 0,
        overdueTasks: overdue,
        currentStreak: 4,
        focusSessions: 3,
        heatmap: [], 
        procrastinationRate: 35
      });
      setTasks(tasksRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      {/* Header */}
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">Productivity Twin</div>
        <button className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
          + Add Task
        </button>
      </div>
      <h1 className="text-display mb-[56px]">Focus & Execution</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[40px] mb-[56px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.completionRate}%</span>
          <span className="text-label">Completion Rate</span>
        </div>
        
        <div className="flex flex-col gap-[6px]">
          <span className={`text-numeral ${data.studyHoursToday < data.averageStudyHours * 0.8 ? 'text-[var(--color-regret)]' : ''}`}>
            {data.studyHoursToday}h
          </span>
          <span className="text-label">Study (vs {data.averageStudyHours}h avg)</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className={`text-numeral ${data.overdueTasks > 0 ? 'text-[var(--color-regret)]' : ''}`}>
            {data.overdueTasks}
          </span>
          <span className="text-label">Overdue Tasks</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.procrastinationRate}%</span>
          <span className="text-label">Procrastination Rate</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-[56px]">
        {/* Task List */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Pending Tasks</h2>
          
          <div className="flex flex-col">
            {pendingTasks.map((task) => (
              <div key={task.id} className="py-[16px] ruled-row border-t-0 flex items-start gap-[12px] group">
                <button className="mt-[2px] w-[14px] h-[14px] border border-[var(--color-line)] rounded-[2px] flex-shrink-0 hover:border-[var(--color-text)] transition-colors" />
                <div className="flex-1 flex flex-col gap-[4px]">
                  <span className="text-[13px] text-[var(--color-text)]">{task.title}</span>
                  <div className="flex items-center gap-[12px] font-mono text-[11px]">
                    <span className={`uppercase ${
                      task.priority === 'high' ? 'text-[var(--color-regret)]' : 
                      task.priority === 'medium' ? 'text-[var(--color-text)]' : 
                      'text-[var(--color-text-3)]'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[var(--color-text-3)]">
                      {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </span>
                    <span className="text-[var(--color-text-3)]">{task.estimatedDuration}m</span>
                  </div>
                </div>
                <div className="flex gap-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[11px] font-mono text-[var(--color-text-2)] hover:text-[var(--color-text)]">[DELAY]</button>
                  <button className="text-[11px] font-mono text-[var(--color-accent)] hover:underline underline-offset-2">[START]</button>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="py-[16px] text-[13px] font-mono text-[var(--color-text-3)]">
                No pending tasks.
              </div>
            )}
          </div>
        </div>
        
        {/* Productivity Intelligence */}
        <div>
           <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Insights</h2>
          
          <div className="flex flex-col">
            <div className="py-[16px] ruled-row border-t-0 flex flex-col gap-[8px]">
              <span className="text-[13px] font-mono text-[var(--color-regret)] uppercase">Consistency Dip</span>
              <span className="text-[13px] text-[var(--color-text-2)] leading-[1.4]">
                You are 34% below your usual study rhythm this week. Focus on small 30-min sessions to rebuild momentum.
              </span>
            </div>
            
            <div className="py-[16px] ruled-row border-t-0 flex flex-col gap-[8px]">
              <span className="text-[13px] font-mono text-[var(--color-text)] uppercase">Peak Focus Time</span>
              <span className="text-[13px] text-[var(--color-text-2)] leading-[1.4]">
                Your highest task completion rate happens between 18:00 and 21:00.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
