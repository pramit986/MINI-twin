import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import type { NutritionData } from '../types';

const mealSchema = z.object({
  text: z.string().min(2, 'Please describe what you ate.'),
  mealType: z.enum(['Breakfast', 'Lunch', 'Snack', 'Dinner'])
});
type MealFormData = z.infer<typeof mealSchema>;

export default function Nutrition() {
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState<any[] | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: { mealType: 'Lunch' }
  });

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

  const onParseMeal = async (formData: MealFormData) => {
    setIsParsing(true);
    try {
      // Simulate calling the AI Edge Function for parse_meal
      // In reality, this would hit the Supabase edge function `ai/preview` -> `ai/run`
      const parsedResponse = await api.parseMeal(formData.text);
      setParsedItems(parsedResponse.items.map((i: any) => ({ ...i, mealType: formData.mealType })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const onConfirmMeal = async () => {
    if (!parsedItems) return;
    try {
      // Post all items
      for (const item of parsedItems) {
        await api.addMeal({
          date: new Date().toISOString().split('T')[0],
          name: item.name,
          mealType: item.mealType,
          kcal: item.kcal,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          isEstimate: item.is_estimate
        });
      }
      setShowLogModal(false);
      setParsedItems(null);
      reset();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !data) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px] relative">
      {/* Header */}
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">Nutrition Twin</div>
        <button onClick={() => setShowLogModal(true)} className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
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
                <span className="font-mono text-[13px] text-[var(--color-text)]">
                  {meal.name}
                  {meal.isEstimate && <span className="ml-2 text-[10px] bg-[var(--color-surface)] px-1 border border-[var(--color-line)]">AI Estimate</span>}
                </span>
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
          {data.meals.length === 0 && (
            <div className="py-[16px] text-[13px] font-mono text-[var(--color-text-3)] text-center">
              No meals logged today. Click + Add Meal.
            </div>
          )}
        </div>
      </div>

      {/* Log Meal Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-[#000000CC] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] border border-[var(--color-line)] bg-[var(--color-bg)] p-[32px] relative">
            <button onClick={() => { setShowLogModal(false); setParsedItems(null); }} className="absolute top-[16px] right-[16px] text-[var(--color-text-3)] hover:text-white">
              ✕
            </button>
            <h3 className="text-title mb-[24px]">Log Meal</h3>
            
            {!parsedItems ? (
              <form onSubmit={handleSubmit(onParseMeal)} className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Meal Type</label>
                  <select {...register('mealType')} className="h-[48px] bg-transparent border border-[var(--color-line)] px-4">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snack">Snack</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">What did you eat?</label>
                  <textarea 
                    {...register('text')} 
                    className="h-[100px] bg-transparent border border-[var(--color-line)] p-4 font-mono text-[13px] resize-none focus:border-[var(--color-accent)] outline-none" 
                    placeholder="e.g., 2 rotis and a bowl of dal..." 
                    autoFocus 
                  />
                  {errors.text && <span className="text-[var(--color-regret)] text-[11px] font-mono">{errors.text.message}</span>}
                </div>

                <button type="submit" disabled={isParsing} className="btn-primary w-full mt-[16px]">
                  {isParsing ? 'Twin is estimating...' : 'Parse Meal'}
                </button>
                <p className="text-[11px] text-[var(--color-text-3)] text-center mt-2">
                  Missing food database. Falling back to AI estimations.
                </p>
              </form>
            ) : (
              <div className="flex flex-col gap-[16px]">
                <div className="text-label mb-[16px]">Confirm AI Estimations</div>
                
                <div className="flex flex-col gap-[12px] max-h-[300px] overflow-y-auto pr-2">
                  {parsedItems.map((item, i) => (
                    <div key={i} className="border border-[var(--color-line)] p-[12px]">
                      <div className="flex justify-between items-start mb-[8px]">
                        <span className="font-mono text-[13px]">{item.name} <span className="text-[var(--color-text-3)]">({item.quantity} {item.unit})</span></span>
                        <span className="font-mono text-[13px]">{item.kcal} kcal</span>
                      </div>
                      <div className="flex gap-[16px] text-[11px] font-mono text-[var(--color-text-2)]">
                        <span>P: {item.protein}g</span>
                        <span>C: {item.carbs}g</span>
                        <span>F: {item.fat}g</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-[16px] mt-[16px]">
                  <button onClick={() => setParsedItems(null)} className="btn-secondary flex-1">
                    Edit Text
                  </button>
                  <button onClick={onConfirmMeal} className="btn-primary flex-1">
                    Confirm & Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
