import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Student } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getStudent().then(setStudent).catch(console.error);
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset prototype data?')) {
      localStorage.removeItem('studentTwin_onboarded');
      window.location.href = '/';
    }
  };

  if (!student) return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">System Preferences</div>
      </div>
      <h1 className="text-display mb-[56px]">Settings</h1>

      <div className="flex flex-col gap-[56px]">
        {/* Profile */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Profile Configuration</h2>
          <div className="flex flex-col">
            <div className="py-[16px] ruled-row border-t-0 flex items-center justify-between">
              <span className="text-[13px] font-mono text-[var(--color-text-3)] uppercase w-[200px]">Name</span>
              <span className="text-[13px] font-mono text-[var(--color-text)] flex-1">{student.name}</span>
            </div>
            <div className="py-[16px] ruled-row border-t-0 flex items-center justify-between">
              <span className="text-[13px] font-mono text-[var(--color-text-3)] uppercase w-[200px]">Degree</span>
              <span className="text-[13px] font-mono text-[var(--color-text)] flex-1">{student.degree}</span>
            </div>
            <div className="py-[16px] ruled-row border-t-0 flex items-center justify-between">
              <span className="text-[13px] font-mono text-[var(--color-text-3)] uppercase w-[200px]">Target CGPA</span>
              <span className="text-[13px] font-mono text-[var(--color-text)] flex-1">{student.targetCgpa}</span>
            </div>
            <div className="py-[16px] ruled-row border-t-0 flex items-center justify-between">
              <span className="text-[13px] font-mono text-[var(--color-text-3)] uppercase w-[200px]">Career Target</span>
              <span className="text-[13px] font-mono text-[var(--color-text)] flex-1">{student.careerTarget}</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px]">Preferences</h2>
          <div className="flex flex-col">
            <div className="py-[16px] ruled-row border-t-0 flex items-center justify-between">
              <div className="flex flex-col gap-[4px] w-[200px]">
                <span className="text-[13px] font-mono text-[var(--color-text-3)] uppercase">Intensity</span>
                <span className="text-[11px] font-mono text-[var(--color-text-2)]">Regreter aggression</span>
              </div>
              <div className="flex-1">
                <select 
                  value={student.interventionIntensity}
                  disabled
                  className="bg-transparent text-[13px] font-mono text-[var(--color-text)] border border-[var(--color-line)] p-[8px] focus:outline-none focus:border-[var(--color-accent)] opacity-50"
                >
                  <option value="gentle">Gentle</option>
                  <option value="balanced">Balanced</option>
                  <option value="direct">Direct</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h2 className="text-label hairline-bottom pb-[8px] mb-[24px] text-[var(--color-regret)]">Privacy & Data</h2>
          <div className="flex flex-col gap-[24px]">
            <p className="text-[13px] text-[var(--color-text-2)] font-mono leading-[1.6]">
              Student data belongs to the student. AI recommendations are advisory. Sensitive information should be handled carefully.
            </p>
            <button 
              onClick={handleReset}
              className="text-[13px] font-mono text-[var(--color-regret)] hover:underline underline-offset-4 self-start"
            >
              [RESET_PROTOTYPE_DATA]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
