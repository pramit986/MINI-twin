import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { DashboardData } from '../types';

export default function Guardian() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // In a real app, check VITE_MINORS_ENABLED and guardian connection status
    const isGuardianEnabled = import.meta.env.VITE_MINORS_ENABLED === 'true';
    if (!isGuardianEnabled) {
      setLoading(false);
      return;
    }

    setAuthorized(true);
    api.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  if (!authorized) {
    return (
      <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px] text-center">
        <h1 className="text-display text-[var(--color-regret)] mb-[24px]">Access Denied</h1>
        <p className="text-[var(--color-text-2)] font-mono">
          Guardian view is currently flagged off or you do not have permission to view this profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label text-[var(--color-accent)]">Guardian Mode (Read Only)</div>
      </div>
      <h1 className="text-display mb-[56px]">{data?.student.name}'s Twin</h1>
      
      <div className="grid md:grid-cols-2 gap-[40px] mb-[56px]">
        <div className="border border-[var(--color-line)] p-[24px]">
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Academic Status</h2>
          <div className="flex justify-between py-[8px] ruled-row border-t-0">
            <span>Overall Risk</span>
            <span className="font-mono text-green-500">Low</span>
          </div>
          <div className="flex justify-between py-[8px] ruled-row border-t-0">
            <span>Attendance Trend</span>
            <span className="font-mono">Stable</span>
          </div>
        </div>

        <div className="border border-[var(--color-line)] p-[24px]">
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Messages (24h Delay)</h2>
          <div className="text-[13px] font-mono text-[var(--color-text-3)] text-center py-[24px]">
            No recent messages.
          </div>
        </div>
      </div>
    </div>
  );
}
