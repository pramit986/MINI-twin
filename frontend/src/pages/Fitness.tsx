import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { FitnessData } from '../types';

export default function Fitness() {
  const [data, setData] = useState<FitnessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getFitness();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      {/* Header */}
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">Fitness Twin</div>
        <button className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
          + Log Workout
        </button>
      </div>
      <h1 className="text-display mb-[56px]">Physical Capacity</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[40px] mb-[56px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.consistency}%</span>
          <span className="text-label">Consistency</span>
        </div>
        
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.weeklyWorkouts}</span>
          <span className="text-label">Weekly (Target: {data.weeklyTarget})</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.workoutStreak}</span>
          <span className="text-label">Current Streak (days)</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{Math.round(data.trainingVolume / 1000)}k</span>
          <span className="text-label">Volume (kg)</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-[56px]">
        {/* Recent Workouts */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Recent Log</h2>
          <div className="flex flex-col">
            {data.recentWorkouts.map((workout) => (
              <div key={workout.id} className="py-[16px] ruled-row border-t-0 flex flex-col gap-[8px]">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-mono text-[var(--color-text)] uppercase">{workout.type}</span>
                  <span className="text-[13px] font-mono text-[var(--color-text-3)]">{workout.duration}m</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-[var(--color-text-2)] line-clamp-1 w-[200px] truncate">
                    {workout.exercises.map(e => e.name).join(', ')}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--color-text-3)]">
                    {new Date(workout.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRs */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Personal Records</h2>
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-label text-[var(--color-text-3)] pb-[12px] ruled-row border-t-0">
              <div className="col-span-6">Exercise</div>
              <div className="col-span-3 text-right">Weight</div>
              <div className="col-span-3 text-right">Date</div>
            </div>

            {/* Table Body */}
            {data.personalRecords.map((pr, i) => (
              <div key={i} className="grid grid-cols-12 items-center py-[16px] ruled-row border-t-0 font-mono text-[13px]">
                <div className="col-span-6 text-[var(--color-text)]">
                  {pr.exercise}
                </div>
                <div className="col-span-3 text-right text-[var(--color-text)]">
                  {pr.weight}kg
                </div>
                <div className="col-span-3 text-right text-[var(--color-text-3)]">
                  {new Date(pr.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
