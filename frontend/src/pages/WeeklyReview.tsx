import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { WeeklyReview } from '../types';

export default function WeeklyReviewPage() {
  const [data, setData] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getWeeklyReview();
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
        <div className="text-label">Weekly Review</div>
      </div>
      <h1 className="text-display mb-[24px]">Past 7 Days</h1>

      <div className="grid md:grid-cols-2 gap-[56px] mb-[56px]">
        <div>
          <h3 className="text-label hairline-bottom pb-[8px] mb-[24px]">What Went Well</h3>
          <div className="flex flex-col">
            {data.whatWentWell.map((item, i) => (
              <div key={i} className="py-[16px] ruled-row border-t-0 flex items-start gap-[8px]">
                <span className="text-[var(--color-text-3)]">—</span>
                <span className="text-[13px] text-[var(--color-text)] leading-[1.4]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-label hairline-bottom pb-[8px] mb-[24px] text-[var(--color-regret)]">What Slipped</h3>
          <div className="flex flex-col">
            {data.whatSlipped.map((item, i) => (
              <div key={i} className="py-[16px] ruled-row border-t-0 flex items-start gap-[8px]">
                <span className="text-[var(--color-regret)]">—</span>
                <span className="text-[13px] text-[var(--color-text)] leading-[1.4]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-[56px]">
        <h3 className="text-label hairline-bottom pb-[8px] mb-[24px]">Key Takeaways</h3>
        <div className="grid md:grid-cols-2 gap-[40px]">
          <div className="flex flex-col gap-[8px]">
            <p className="text-[13px] font-mono uppercase text-[var(--color-text-3)]">Biggest Improvement</p>
            <p className="text-[13px] text-[var(--color-text-2)] leading-[1.4]">{data.biggestImprovement}</p>
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[13px] font-mono uppercase text-[var(--color-regret)]">Biggest Risk</p>
            <p className="text-[13px] text-[var(--color-text-2)] leading-[1.4]">{data.biggestRisk}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] pt-[24px] border-t border-[var(--color-line)]">
        <h3 className="text-label text-[var(--color-accent)]">Next Week Focus</h3>
        <p className="text-[13px] font-mono text-[var(--color-text-2)] leading-[1.6] max-w-2xl mb-[24px]">
          {data.nextWeekFocus}
        </p>
        
        <button className="btn-primary w-fit">
          Plan Next Week
        </button>
      </div>
    </div>
  );
}
