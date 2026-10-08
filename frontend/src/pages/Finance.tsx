import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { FinanceData } from '../types';

export default function Finance() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !data) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      {/* Header */}
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">Finance Twin</div>
        <button className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
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
          </div>
        </div>
      </div>
    </div>
  );
}
