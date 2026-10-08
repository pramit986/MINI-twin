import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Task, RegreterAnalysis } from '../types';

export default function Regreter() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RegreterAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [decisionMade, setDecisionMade] = useState<string | null>(null);
  const [tone, setTone] = useState<'Gentle' | 'Balanced' | 'Direct' | 'No Mercy'>('Balanced');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await api.getTasks();
      const pending = allTasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
      setTasks(pending);
      
      const adsaTask = pending.find(t => t.title.includes('ADSA') || t.priority === 'high');
      if (adsaTask) {
        handleSelectTask(adsaTask.id);
      } else if (pending.length > 0) {
        handleSelectTask(pending[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = async (taskId: string) => {
    setSelectedTaskId(taskId);
    setLoading(true);
    setAnalysis(null);
    setDecisionMade(null);
    try {
      const res = await api.analyzeRegreter(taskId);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: 'complete' | 'postpone') => {
    if (!selectedTaskId) return;
    try {
      await api.regreterDecide(selectedTaskId, decision);
      setDecisionMade(decision);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      
      {/* Header */}
      <div className="text-label hairline-bottom pb-[8px] mb-[40px]">Regreter</div>
      <h1 className="text-display mb-[56px]">One decision. Two tomorrows.</h1>
      
      {/* Task header line */}
      <div className="flex flex-col md:flex-row md:items-center gap-[16px] md:gap-[40px] ruled-row py-[16px] mb-[56px]">
        {/* We can use the hardcoded or analysis data here. The prompt requests exact text. */}
        <select
          value={selectedTaskId || ''}
          onChange={(e) => handleSelectTask(e.target.value)}
          className="bg-transparent text-body font-bold border-none outline-none cursor-pointer p-0 appearance-none underline underline-offset-4"
          disabled={loading || !!decisionMade}
        >
          <option value="" disabled>Select a pending task...</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        <div className="flex gap-[40px] text-[var(--color-text-2)]">
          <div><span className="text-label mr-[8px]">DUE</span> Tonight</div>
          <div><span className="text-label mr-[8px]">EST</span> {analysis?.task.estimatedDuration ? (analysis.task.estimatedDuration / 60).toFixed(1) : '1.8'}h remaining</div>
          <div><span className="text-label mr-[8px]">DONE</span> 40%</div>
        </div>
      </div>

      {loading && !analysis ? (
        <div className="animate-pulse h-[200px] w-full bg-[var(--color-surface)]" />
      ) : decisionMade ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[300px] flex items-center justify-center text-title">
          {decisionMade === 'complete' ? 'Task active.' : 'Task postponed.'} Returning...
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="content">
            
            {/* Comparison Table */}
            <div className="w-full border-t border-[var(--color-line)] mb-[40px]">
              <div className="grid grid-cols-3 ruled-row h-[56px] items-center text-label">
                <div className="px-[16px]"></div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)]">Complete now</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)]">Postpone</div>
              </div>
              <div className="grid grid-cols-3 ruled-row h-[56px] items-center">
                <div className="px-[16px] text-[var(--color-text-2)]">Tomorrow's workload</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)] font-mono">{analysis?.pathA.tomorrowWorkload}h</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)] font-mono text-[var(--color-regret)]">{analysis?.pathB.tomorrowWorkload}h</div>
              </div>
              <div className="grid grid-cols-3 ruled-row h-[56px] items-center border-t-0">
                <div className="px-[16px] text-[var(--color-text-2)]">Exam readiness</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)] font-mono">{analysis?.pathA.examPreparation}%</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)] font-mono">{analysis?.pathB.examPreparation}%</div>
              </div>
              <div className="grid grid-cols-3 ruled-row h-[56px] items-center border-t-0">
                <div className="px-[16px] text-[var(--color-text-2)]">Free time tomorrow</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)] font-mono">{analysis?.pathA.freeTime}h</div>
                <div className="px-[16px] text-center border-l border-[var(--color-line)] font-mono">{analysis && analysis.pathB.freeTime < 0 ? `over capacity by ${Math.abs(analysis.pathB.freeTime).toFixed(1)}h` : `${analysis?.pathB.freeTime}h`}</div>
              </div>
            </div>

            {/* Delta */}
            <div className="flex flex-col items-center justify-center text-center mb-[56px]">
              <div className="font-display text-[40px] text-[var(--color-regret)] mb-[8px] leading-[1.1]">{analysis?.consequence}</div>
              <div className="flex items-center gap-[8px] text-[var(--color-text-2)]">
                Includes {analysis?.task.estimatedDuration ? (analysis.task.estimatedDuration / 60).toFixed(1) : '1.8'}h remaining + 20% restart overhead. <button className="btn-text h-auto p-0 underline underline-offset-4 ml-[4px]">Why?</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-[16px] mb-[40px]">
              <button onClick={() => handleDecision('complete')} className="btn-primary flex-1 h-[48px] text-[16px]">Do it now</button>
              <button onClick={() => handleDecision('postpone')} className="btn-secondary flex-1 h-[48px] text-[16px]">Postpone</button>
            </div>

            {/* Pattern & Tone */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-[24px] ruled-row py-[24px]">
              <div className="text-[var(--color-text-2)]">
                3 of your last 4 similar tasks were postponed.
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-label mr-[8px]">Tone</span>
                {['Gentle', 'Balanced', 'Direct', 'No Mercy'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTone(t as any)}
                    className={`h-[24px] px-[8px] text-[13px] rounded-[2px] transition-colors ${tone === t ? 'bg-[var(--color-surface)] text-[var(--color-text)]' : 'text-[var(--color-text-3)] hover:text-[var(--color-text-2)]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Future Self Trajectory */}
            <div className="mt-[48px]">
              <div className="text-label hairline-bottom pb-[8px] mb-[40px]">Future self trajectory</div>
              
              <div className="relative pt-[6px]">
                {/* Horizontal Timeline Line */}
                <div className="absolute top-[12px] left-0 right-0 h-px bg-[var(--color-line)] z-0" />
                
                <div className="grid grid-cols-3 gap-[24px] relative z-10">
                  <div className="flex flex-col">
                    <div className="w-[12px] h-[12px] rounded-full bg-[var(--color-bg)] border-[2px] border-[var(--color-accent)] mb-[16px]" />
                    <div className="text-label mb-[12px]">Today</div>
                    <div className="text-[13px] text-[var(--color-text-2)] leading-[1.5]">
                      Risk: Low<br/>
                      Free time: 2h
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="w-[12px] h-[12px] rounded-full bg-[var(--color-bg)] border-[2px] border-[var(--color-line)] mb-[16px]" />
                    <div className="text-label mb-[12px]">3 Days</div>
                    <div className="text-[13px] text-[var(--color-text-2)] leading-[1.5]">
                      Risk: Med<br/>
                      Free time: 1h
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="w-[12px] h-[12px] rounded-full bg-[var(--color-bg)] border-[2px] border-[var(--color-regret)] mb-[16px]" />
                    <div className="text-label mb-[12px]">7 Days</div>
                    <div className="text-[13px] text-[var(--color-text-2)] leading-[1.5]">
                      Risk: High<br/>
                      Free time: 0h
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
