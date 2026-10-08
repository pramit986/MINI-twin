import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { RecoveryPlan } from '../types';

export default function Recovery() {
  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await api.getRecovery();
      setPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      await api.activateRecovery();
      setActivated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setActivating(false);
    }
  };

  if (loading || !plan) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  if (activated) {
    return (
      <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
        <div className="text-label hairline-bottom pb-[8px] mb-[40px] text-[var(--color-accent)]">Recovery Mode</div>
        <h1 className="text-display mb-[24px]">Plan Activated</h1>
        <p className="text-[13px] text-[var(--color-text-2)] font-mono">
          Your tasks have been rescheduled. Focus on tonight's priority list first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      {/* Header */}
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label text-[var(--color-regret)]">Recovery Mode</div>
      </div>
      <h1 className="text-display mb-[24px]">Catch Up</h1>
      <p className="text-[13px] text-[var(--color-text-2)] font-mono mb-[56px] max-w-2xl leading-[1.6]">
        {plan.message}
      </p>

      {plan.missedTasks.length === 0 ? (
        <div className="py-[16px] text-[13px] text-[var(--color-text-3)] font-mono border-t border-[var(--color-line)]">
          You don't have any missed tasks right now. Great job staying on track!
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-[56px] mb-[56px]">
            {/* Tonight */}
            <div>
              <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Tonight's Focus</h2>
              <div className="flex flex-col">
                {plan.tonight.map(task => (
                  <div key={task.id} className="py-[16px] ruled-row border-t-0 flex justify-between items-start">
                    <span className="text-[13px] font-mono text-[var(--color-text)]">{task.title}</span>
                    <span className="text-[11px] font-mono text-[var(--color-text-3)]">{task.estimatedDuration}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tomorrow */}
            <div>
              <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Tomorrow's Pipeline</h2>
              <div className="flex flex-col">
                {plan.tomorrow.map(task => (
                  <div key={task.id} className="py-[16px] ruled-row border-t-0 flex justify-between items-start">
                    <span className="text-[13px] font-mono text-[var(--color-text)]">{task.title}</span>
                    <span className="text-[11px] font-mono text-[var(--color-text-3)]">{task.estimatedDuration}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-[24px] border-t border-[var(--color-line)]">
            <div className="flex flex-col gap-[4px]">
              <span className="text-label text-[var(--color-text)]">Estimated Recovery Time</span>
              <span className="text-[13px] font-mono text-[var(--color-text-3)]">{plan.hoursRecovered} hours of focused work</span>
            </div>
            <button
              onClick={handleActivate}
              disabled={activating}
              className="btn-primary"
            >
              {activating ? 'Activating...' : 'Start Recovery Plan'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
