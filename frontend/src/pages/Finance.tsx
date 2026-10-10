import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import type { FinanceData } from '../types';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().min(1, 'Amount must be positive'),
  category: z.enum(['food', 'transport', 'academic', 'entertainment', 'bills', 'other']),
  date: z.string()
});
type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function Finance() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0], category: 'food' }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getFinance();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitExpense = async (formData: ExpenseFormData) => {
    try {
      await api.addExpense(formData);
      setShowAddExpense(false);
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
        <div className="text-label">Finance Twin</div>
        <button onClick={() => setShowAddExpense(true)} className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
          + Add Expense
        </button>
      </div>
      <h1 className="text-display mb-[56px]">Monthly Budget Tracker</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[40px] mb-[56px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">₹{data.monthlyBudget.toLocaleString()}</span>
          <span className="text-label">Monthly Budget</span>
        </div>
        
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">₹{data.spent.toLocaleString()}</span>
          <span className="text-label">Spent</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className={`text-numeral ${data.remaining < data.monthlyBudget * 0.2 ? 'text-[var(--color-regret)]' : ''}`}>
            ₹{data.remaining.toLocaleString()}
          </span>
          <span className="text-label">Remaining</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className={`text-numeral ${data.projectedMonthEnd > data.monthlyBudget ? 'text-[var(--color-regret)]' : ''}`}>
            ₹{data.projectedMonthEnd.toLocaleString()}
          </span>
          <span className="text-label">Projected End</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-[56px]">
        {/* Breakdown */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Category Breakdown</h2>
          <div className="flex flex-col">
            {data.categoryBreakdown.length > 0 ? (
              data.categoryBreakdown.map((cat, i) => (
                <div key={cat.category} className="py-[16px] ruled-row border-t-0 flex flex-col gap-[8px]">
                  <div className="flex justify-between items-center text-[13px] font-mono">
                    <span className="text-[var(--color-text)] capitalize">{cat.category}</span>
                    <span className="text-[var(--color-text)]">₹{cat.amount.toLocaleString()}</span>
                  </div>
                  {/* Progress bar line style */}
                  <div className="h-[1px] w-full bg-[var(--color-line)] relative mt-[8px]">
                    <div 
                      className="absolute top-[-2px] bottom-[-2px] bg-[var(--color-text-2)]" 
                      style={{ left: 0, width: `${(cat.amount / data.monthlyBudget) * 100}%` }} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[13px] text-[var(--color-text-3)] font-mono py-[16px]">No expenses logged yet</div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Recent Expenses</h2>
          <div className="flex flex-col max-h-[400px] overflow-y-auto pr-[16px]">
            {data.expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="py-[16px] flex justify-between items-start ruled-row border-t-0">
                <div className="flex flex-col gap-[4px]">
                  <span className="font-mono text-[13px] text-[var(--color-text)]">{expense.title}</span>
                  <span className="font-mono text-[11px] text-[var(--color-text-3)] capitalize">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-mono text-[13px]">₹{expense.amount.toLocaleString()}</span>
              </div>
            ))}
            {data.expenses.length === 0 && (
              <div className="py-[16px] text-[13px] font-mono text-[var(--color-text-3)]">No recent expenses.</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-[#000000CC] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] border border-[var(--color-line)] bg-[var(--color-bg)] p-[32px] relative">
            <button onClick={() => setShowAddExpense(false)} className="absolute top-[16px] right-[16px] text-[var(--color-text-3)] hover:text-white">
              ✕
            </button>
            <h3 className="text-title mb-[24px]">Add Expense</h3>
            
            <form onSubmit={handleSubmit(onSubmitExpense)} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Title / Note</label>
                <input {...register('title')} className="h-[48px]" placeholder="e.g. Lunch at canteen" autoFocus />
                {errors.title && <span className="text-[var(--color-regret)] text-[11px] font-mono">{errors.title.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Amount (₹)</label>
                  <input type="number" {...register('amount', { valueAsNumber: true })} className="h-[48px]" />
                  {errors.amount && <span className="text-[var(--color-regret)] text-[11px] font-mono">{errors.amount.message}</span>}
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Category</label>
                  <select {...register('category')} className="h-[48px] bg-transparent border border-[var(--color-line)] px-4">
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="academic">Academic</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="bills">Bills</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Date</label>
                <input type="date" {...register('date')} className="h-[48px]" />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-[16px]">
                {isSubmitting ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
