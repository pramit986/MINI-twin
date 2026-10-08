import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardData } from '../types';
import TwinVisualization from '../components/TwinVisualization';
import { ArrowUpRight, ArrowRight, MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const dashboard = await api.getDashboard();
      setData(dashboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading || !data) return <DashboardSkeleton />;

  // Calculate planned time based on pending tasks
  const plannedHoursNum = data.twinInsight.plannedWorkload;
  const plannedHours = plannedHoursNum.toFixed(1);
  const availableHoursNum = data.twinInsight.availableHours;
  const conflictHoursNum = data.twinInsight.conflict;
  const hasConflict = conflictHoursNum > 0;
  
  // Sort tasks chronologically (using createdAt as a proxy for start time here)
  const sortedTasks = [...data.todaysTasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Regreter computed values
  const regreterRemaining = 1.8;
  const postponeOverhead = regreterRemaining * 1.2;
  const tomorrowWorkload = 3.2;
  const postponeWorkload = (tomorrowWorkload + postponeOverhead).toFixed(1);

  // Twin visualization data
  const twinVisualData = {
    plannedWorkload: plannedHours
  };

  return (
    <div className="w-full flex flex-col text-body">
      {/* Row 1 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-[40px] items-start">
        <div className="md:col-span-7 header-block">
          {/* 1. small date label */}
          <div className="font-mono text-[11px] text-[var(--color-text-3)] uppercase tracking-wider">
            Monday, 5 October
          </div>
          
          {/* 2 & 3. Headline & subline container */}
          <div>
            <h1 className="font-display mb-0" style={{ fontSize: 'clamp(2rem, 1.4rem + 2vw, 3.25rem)', lineHeight: 1.15 }}>
              Good morning, Pramit.
            </h1>
            <p className="text-[var(--color-text-2)] max-w-[52ch] mt-[12px]" style={{ lineHeight: 1.6 }}>
              {hasConflict ? "Your workload today is above your available time." : "Your workload today fits your available time."}
            </p>
          </div>
          
          {/* 4. Stat row */}
          <div className="stat-row">
            <div className="stat">
              <span className="font-mono tabular-nums leading-none" style={{ fontSize: '2.5rem' }}>{plannedHours}h</span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-text-3)] uppercase">Planned</span>
            </div>
            <div className="stat">
              <span className="font-mono tabular-nums leading-none" style={{ fontSize: '2.5rem' }}>{availableHoursNum}h</span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-text-3)] uppercase">Available</span>
            </div>
            {hasConflict && (
              <div className="stat">
                <span className="font-mono tabular-nums leading-none text-[var(--color-regret)]" style={{ fontSize: '2.5rem' }}>+{conflictHoursNum.toFixed(1)}h</span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-regret)] uppercase">Conflict</span>
              </div>
            )}
            <div className="stat">
              <span className="font-mono tabular-nums leading-none flex items-center gap-[4px]" style={{ fontSize: '2.5rem' }}>
                {data.twinInsight.momentum} <ArrowUpRight size={32} strokeWidth={1.5} />
              </span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-text-3)] uppercase">Momentum</span>
            </div>
          </div>
          
          {/* 5. Buttons row */}
          <div className="actions">
            <button className="btn-primary">Fix my day</button>
            <button className="btn-text h-[40px]">Why?</button>
          </div>
        </div>
        
        <div className="md:col-span-5 flex justify-end">
          <TwinVisualization state={hasConflict ? 'overloaded' : 'stable'} size="large" data={twinVisualData} />
        </div>
      </section>

      {/* Row 2: Your One Thing */}
      <section className="section py-[32px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] ruled-row py-[32px]">
          <div>
            <div className="text-label mb-[12px]">Your one thing</div>
            <h2 className="font-display text-[28px] leading-[1.1] truncate" style={{fontSize: '28px'}}>
              {data.twinInsight.oneThing.task}
            </h2>
            <p className="text-[var(--color-text-2)] mt-[12px]">
              Highest impact action for your current state.
            </p>
          </div>
          <div className="flex items-start justify-between md:justify-end md:gap-[40px]">
            <div className="flex gap-[40px]">
              <div className="flex flex-col gap-[6px]">
                <span className="text-label">Due</span>
                <span>{data.twinInsight.oneThing.dueTime}</span>
              </div>
              <div className="flex flex-col gap-[6px]">
                <span className="text-label">Estimated</span>
                <span>{data.twinInsight.oneThing.estimatedDuration} min</span>
              </div>
              <div className="flex flex-col gap-[6px]">
                <span className="text-label">Done</span>
                <span>40%</span>
              </div>
            </div>
            <button className="btn-primary ml-[40px]">Start now</button>
          </div>
        </div>
      </section>

      {/* Row 3: Time Budget & Regreter */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-[40px] section">
        <div className="flex flex-col min-w-0">
          <div className="text-label hairline-bottom pb-[8px] mb-[24px]">Time budget</div>
          <div className="flex justify-between py-[12px] ruled-row min-w-0">
            <span>Capacity</span>
            <span className="font-mono tabular-nums">{availableHoursNum}h</span>
          </div>
          <div className="flex justify-between py-[12px] ruled-row border-t-0 min-w-0">
            <span>Planned</span>
            <span className="font-mono tabular-nums">{plannedHours}h</span>
          </div>
          {hasConflict && (
            <div className="flex justify-between py-[12px] ruled-row border-t-0 text-[var(--color-regret)] min-w-0">
              <span>Shortfall</span>
              <span className="font-mono tabular-nums">{conflictHoursNum.toFixed(1)}h</span>
            </div>
          )}
          <div className="h-[4px] w-full bg-[var(--color-surface)] mt-[24px] flex">
            <div className="h-full bg-[var(--color-text)]" style={{ width: `${Math.min((plannedHoursNum/availableHoursNum)*100, 100)}%` }} />
            {hasConflict && (
              <div className="h-full bg-[var(--color-regret)]" style={{ width: `${Math.min((conflictHoursNum/availableHoursNum)*100, 100)}%` }} />
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:border-l border-[var(--color-line)] md:pl-[40px] md:-ml-[20px] min-w-0">
          <div className="text-label hairline-bottom pb-[8px] mb-[24px]">Regreter</div>
          <h3 className="text-title mb-[24px]">One decision, two tomorrows.</h3>
          
          <div className="grid grid-cols-3 gap-0 ruled-row border-t border-[var(--color-line)] mb-[16px]">
            <div className="py-[12px] pr-[16px] min-w-0">
              <div className="text-[var(--color-text-2)] mb-[8px]">Workload</div>
              <div className="text-[var(--color-text-2)] truncate">Exam prep</div>
            </div>
            <div className="py-[12px] px-[16px] text-center bg-[var(--color-surface)] min-w-0">
              <div className="text-label mb-[8px]">Complete now</div>
              <div className="font-mono mb-[8px]">3.2h</div>
              <div className="font-mono">68%</div>
            </div>
            <div className="py-[12px] px-[16px] text-center border-l border-[var(--color-line)] min-w-0">
              <div className="text-label mb-[8px]">Postpone</div>
              <div className="font-mono mb-[8px] text-[var(--color-regret)]">{postponeWorkload}h</div>
              <div className="font-mono">51%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between min-w-0">
            <div className="text-[var(--color-regret)] font-display text-[28px]">+2.2h</div>
            <Link to="/regreter" className="btn-text flex items-center gap-[8px]">
              See both futures <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Row 4: Twin Pulse */}
      <section className="section">
        <div className="text-label hairline-bottom pb-[8px] mb-[24px]">Twin Pulse</div>
        <div className="flex flex-col min-w-0">
          {['ACD', 'FIT', 'NUT', 'PRD', 'FIN', 'CAR'].map((mod, i) => (
            <div key={mod} className="flex items-center py-[16px] ruled-row border-t-0 first:border-t cursor-pointer hover:bg-[var(--color-surface)] px-[8px] -mx-[8px] transition-colors min-w-0">
              <span className="font-mono w-[60px] text-[var(--color-text-3)]">{mod}</span>
              <span className="flex-1 text-[var(--color-text)] truncate">
                {['Academic', 'Health', 'Nutrition', 'Productivity', 'Finance', 'Career'][i]}
              </span>
              <span className="font-display text-[24px] w-[60px] text-right">
                {[82, 75, 90, 60, 85, 78][i]}
              </span>
              <span className="w-[100px] text-right text-[var(--color-text-2)] ml-[24px] font-mono tabular-nums text-[13px]">
                {['Stable', 'Stable', 'Strong', 'Dipping', 'Strong', 'Stable'][i]}
              </span>
              <div className="w-[40px] h-[24px] ml-[24px] flex items-end gap-[2px] shrink-0">
                {/* Tiny sparkline bars */}
                {[0.4, 0.6, 0.8, 0.5, 0.9].map((h, j) => (
                  <div key={j} className="w-[6px] bg-[var(--color-text-3)] rounded-t-[1px]" style={{ height: `${h * 100}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Row 5: Today */}
      <section className="section">
        <div className="text-label hairline-bottom pb-[8px] mb-[24px]">Today</div>
        <div className="flex flex-col min-w-0">
          {sortedTasks.map(t => (
            <div key={t.id} className="flex items-center h-[56px] ruled-row border-t-0 first:border-t group px-[8px] -mx-[8px] hover:bg-[var(--color-surface)] min-w-0">
              <span className="font-mono text-[var(--color-text-3)] w-[80px] shrink-0">
                {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex-1 truncate pr-4">{t.title}</span>
              <span className="text-[var(--color-text-2)] w-[160px] capitalize shrink-0">
                {t.category} {t.priority === 'high' ? '• High' : ''}
              </span>
              <span className="font-mono tabular-nums text-right w-[80px] shrink-0">{t.estimatedDuration}m</span>
              <button className="w-[40px] flex justify-end text-[var(--color-text-3)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Row 6: Ask Twin */}
      <section className="section mb-[64px]">
        <div className="text-label hairline-bottom pb-[8px] mb-[24px]">Ask Twin</div>
        <div className="flex border border-[var(--color-line)] rounded-[2px] focus-within:border-[var(--color-accent)] transition-colors min-w-0">
          <input type="text" placeholder="Ask your Twin anything" className="flex-1 h-[48px] border-none px-[16px] outline-none bg-transparent min-w-0" />
        </div>
        <div className="flex gap-[16px] mt-[12px] flex-wrap">
          <Link to="/ask-twin" className="btn-text text-[var(--color-text-2)]">Replan my evening</Link>
          <Link to="/ask-twin" className="btn-text text-[var(--color-text-2)]">Show exam readiness</Link>
          <Link to="/ask-twin" className="btn-text text-[var(--color-text-2)]">Why am I overloaded?</Link>
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full pt-[56px] animate-pulse">
      <div className="h-[200px] w-full bg-[var(--color-surface)] mb-[40px]" />
    </div>
  );
}
