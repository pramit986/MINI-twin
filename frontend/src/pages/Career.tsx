import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { CareerData } from '../types';

export default function Career() {
  const [data, setData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getCareer();
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
        <div className="text-label">Career Twin</div>
        <div className="text-label text-[var(--color-text)]">Target Role: <span className="text-[var(--color-accent)]">{data.targetRole}</span></div>
      </div>
      <h1 className="text-display mb-[56px]">Professional Trajectory</h1>

      <div className="grid lg:grid-cols-2 gap-[56px]">
        {/* Gap Analysis */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Skill Gap Analysis</h2>
          <div className="flex flex-col">
            {data.gapAnalysis.map((gap, i) => (
              <div key={i} className="py-[16px] ruled-row border-t-0 flex flex-col gap-[8px]">
                <div className="flex justify-between items-center text-[13px] font-mono">
                  <span className="text-[var(--color-text)]">{gap.area}</span>
                  <span className="text-[var(--color-text-3)]">Gap: {gap.gap}%</span>
                </div>
                {/* Progress bar line style */}
                <div className="h-[1px] w-full bg-[var(--color-line)] relative mt-[8px]">
                  <div 
                    className="absolute top-[-2px] bottom-[-2px] bg-[var(--color-text)]" 
                    style={{ left: 0, width: `${gap.current}%` }} 
                  />
                  {/* Required marker */}
                  <div 
                    className="absolute top-[-4px] bottom-[-4px] w-[1px] bg-[var(--color-accent)] z-10" 
                    style={{ left: `${gap.required}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Roadmap</h2>
          <div className="flex flex-col">
            {data.roadmap.map((stage, i) => (
              <div key={i} className="py-[16px] ruled-row border-t-0">
                <div className="flex items-center gap-[16px] mb-[12px]">
                  <div className={`w-[8px] h-[8px] ${
                    stage.status === 'completed' ? 'bg-[var(--color-text-3)]' :
                    stage.status === 'current' ? 'bg-[var(--color-accent)]' :
                    'bg-[var(--color-line)]'
                  }`} />
                  <h3 className={`font-mono text-[13px] uppercase ${stage.status === 'upcoming' ? 'text-[var(--color-text-3)]' : 'text-[var(--color-text)]'}`}>
                    {stage.stage}
                  </h3>
                </div>
                <ul className="pl-[24px] space-y-[8px]">
                  {stage.items.map((item, j) => (
                    <li key={j} className={`text-[13px] flex items-start gap-[8px] ${stage.status === 'upcoming' ? 'text-[var(--color-text-3)]' : 'text-[var(--color-text-2)]'}`}>
                      <span className="text-[var(--color-line)]">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
