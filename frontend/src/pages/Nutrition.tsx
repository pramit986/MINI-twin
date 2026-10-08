import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { NutritionData } from '../types';

export default function Nutrition() {
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getNutrition();
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
        <div className="text-label">Nutrition Twin</div>
        <button className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
          + Add Meal
        </button>
      </div>
      <h1 className="text-display mb-[56px]">Fuel & Recovery</h1>

      {/* Main Macros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[40px] mb-[56px]">
        {/* Calories */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.dailyCalories}</span>
          <span className="text-label">Calories (Target: {data.calorieTarget})</span>
          <div className="h-[1px] w-full bg-[var(--color-line)] relative mt-[8px]">
            <div className="absolute top-[-2px] bottom-[-2px] bg-[var(--color-text)]" style={{ left: 0, width: `${Math.min(100, (data.dailyCalories / data.calorieTarget) * 100)}%` }} />
          </div>
        </div>

        {/* Protein */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.protein}g</span>
          <span className="text-label">Protein (Target: {data.proteinTarget}g)</span>
          <div className="h-[1px] w-full bg-[var(--color-line)] relative mt-[8px]">
            <div className="absolute top-[-2px] bottom-[-2px] bg-[var(--color-text)]" style={{ left: 0, width: `${Math.min(100, (data.protein / data.proteinTarget) * 100)}%` }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.carbs}g</span>
          <span className="text-label">Carbs (Target: {data.carbsTarget}g)</span>
          <div className="h-[1px] w-full bg-[var(--color-line)] relative mt-[8px]">
            <div className="absolute top-[-2px] bottom-[-2px] bg-[var(--color-text)]" style={{ left: 0, width: `${Math.min(100, (data.carbs / data.carbsTarget) * 100)}%` }} />
          </div>
        </div>
        
        {/* Water */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.water}L</span>
          <span className="text-label">Water (Target: {data.waterTarget}L)</span>
          <div className="h-[1px] w-full bg-[var(--color-line)] relative mt-[8px]">
            <div className="absolute top-[-2px] bottom-[-2px] bg-[var(--color-text)]" style={{ left: 0, width: `${Math.min(100, (data.water / data.waterTarget) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Meals Log */}
      <div>
        <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Today's Meals</h2>
        <div className="flex flex-col">
          {data.meals.map(meal => (
            <div key={meal.id} className="py-[16px] ruled-row border-t-0 flex justify-between items-start">
              <div className="flex flex-col gap-[4px]">
                <span className="font-mono text-[13px] text-[var(--color-text)]">{meal.name}</span>
                <span className="font-mono text-[11px] text-[var(--color-text-3)]">{meal.time}</span>
              </div>
              <div className="flex flex-col items-end gap-[4px]">
                <span className="font-mono text-[13px]">{meal.calories} kcal</span>
                <div className="flex gap-[8px] font-mono text-[11px] text-[var(--color-text-3)]">
                  <span>P:{meal.protein}</span>
                  <span>C:{meal.carbs}</span>
                  <span>F:{meal.fat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
