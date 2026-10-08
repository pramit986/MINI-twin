import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { api } from '../services/api';
import type { AcademicData, RiskPrediction, AttendanceIntelligence } from '../types';

export default function Academic() {
  const [data, setData] = useState<AcademicData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceIntelligence[]>([]);
  const [risk, setRisk] = useState<RiskPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [academicRes, attendanceRes, riskRes] = await Promise.all([
        api.getAcademic(),
        api.getAttendance(),
        api.getRisk()
      ]);
      setData(academicRes);
      setAttendance(attendanceRes);
      setRisk(riskRes);
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
      <div className="text-label hairline-bottom pb-[8px] mb-[40px]">Academic Twin</div>
      <h1 className="text-display mb-[56px]">Semester {data.semester} Overview</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[40px] mb-[56px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.cgpa.toFixed(2)}</span>
          <span className="text-label">Current CGPA (Target: {data.targetCgpa.toFixed(1)})</span>
        </div>
        
        <div className="flex flex-col gap-[6px]">
          <span className={`text-numeral ${data.overallAttendance < 75 ? 'text-[var(--color-regret)]' : ''}`}>
            {data.overallAttendance}%
          </span>
          <span className="text-label">Attendance (Req: {data.targetAttendance}%)</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.assignmentCompletion}%</span>
          <span className="text-label">Assignments Done</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          <span className="text-numeral">{data.studyHoursToday}h</span>
          <span className="text-label">Study Today (Avg: {data.averageStudyHours}h)</span>
        </div>
      </div>

      {/* Risk Assessment */}
      {risk && (
        <div className="mb-[56px]">
          <div className="text-label hairline-bottom pb-[8px] mb-[24px]">Risk Assessment</div>
          <div className="ruled-row py-[24px] border-t-0">
            <h3 className={`text-title mb-[16px] uppercase ${
              risk.level === 'high' ? 'text-[var(--color-regret)]' : ''
            }`}>
              {risk.level} Academic Risk
            </h3>
            
            <div className="grid md:grid-cols-2 gap-[40px]">
              <div>
                <p className="text-label mb-[12px]">Factors</p>
                <ul className="space-y-[8px] text-[var(--color-text-2)]">
                  {risk.factors.map((f, i) => (
                    <li key={i} className="flex items-start gap-[8px]">
                      <span>—</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-label mb-[12px]">Recommendations</p>
                <ul className="space-y-[8px] text-[var(--color-text-2)]">
                  {risk.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-[8px]">
                      <span className="text-[var(--color-accent)]">—</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Intelligence Table */}
      <div>
        <div className="flex justify-between items-end text-label hairline-bottom pb-[8px] mb-[24px]">
          <span>Subject Intelligence</span>
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-[var(--color-accent)] hover:underline underline-offset-4 flex items-center gap-[8px]"
          >
            <Calculator size={14} />
            CGPA What-If
          </button>
        </div>
        
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 text-label text-[var(--color-text-3)] pb-[12px] ruled-row border-t-0">
            <div className="col-span-3">Subject</div>
            <div className="col-span-3">Attendance</div>
            <div className="col-span-4">Intelligence</div>
            <div className="col-span-2 text-right">Risk</div>
          </div>

          {/* Table Body */}
          {data.subjects.map(sub => {
            const att = attendance.find(a => a.code === sub.code);
            return (
              <div key={sub.id} className="grid grid-cols-12 items-center py-[16px] ruled-row border-t-0">
                <div className="col-span-3 pr-[16px]">
                  <div className="font-mono text-[var(--color-text)]">{sub.code}</div>
                  <div className="text-[13px] text-[var(--color-text-2)] truncate max-w-full" title={sub.name}>{sub.name}</div>
                </div>
                <div className="col-span-3 pr-[16px]">
                  <div className={`font-mono ${sub.attendancePercentage < 75 ? 'text-[var(--color-regret)]' : ''}`}>
                    {sub.attendancePercentage}%
                  </div>
                  <div className="text-[13px] text-[var(--color-text-2)]">{sub.attendedClasses}/{sub.totalClasses} classes</div>
                </div>
                <div className="col-span-4 pr-[16px] text-[13px] text-[var(--color-text-2)]">
                  {att && (
                    <>
                      {att.canMiss > 0 ? (
                        <span>Can safely miss {att.canMiss} classes</span>
                      ) : att.requiredFor75 > 0 ? (
                        <span className="text-[var(--color-regret)]">Must attend next {att.requiredFor75} classes</span>
                      ) : (
                        <span>Exactly at 75% limit</span>
                      )}
                    </>
                  )}
                </div>
                <div className="col-span-2 text-right uppercase text-[13px] font-mono">
                  <span className={sub.risk === 'high' ? 'text-[var(--color-regret)]' : 'text-[var(--color-text-3)]'}>
                    {sub.risk}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Basic CGPA What-If Modal Placeholder */}
      {showCalculator && (
        <div className="fixed inset-0 bg-[var(--color-bg)]/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] border border-[var(--color-line)] bg-[var(--color-surface)] p-[32px] relative">
            <button onClick={() => setShowCalculator(false)} className="absolute top-[16px] right-[16px] text-[var(--color-text-3)] hover:text-white">
              ✕
            </button>
            <h3 className="text-title mb-[8px] flex items-center gap-[8px]">
              CGPA What-If
            </h3>
            <p className="text-[var(--color-text-2)] mb-[32px]">
              Enter expected grades to see projected CGPA impact.
            </p>
            
            <div className="space-y-[16px] mb-[32px]">
              {data.subjects.map(sub => (
                <div key={sub.id} className="flex items-center justify-between ruled-row border-t-0 pb-[8px]">
                  <span className="font-mono text-[13px]">{sub.code}</span>
                  <select className="bg-transparent text-[var(--color-text)] border border-[var(--color-line)] p-[4px] focus:border-[var(--color-accent)] outline-none font-mono text-[13px]">
                    <option value="O">O (10)</option>
                    <option value="A+">A+ (9)</option>
                    <option value="A">A (8)</option>
                    <option value="B+">B+ (7)</option>
                    <option value="B">B (6)</option>
                    <option value="C">C (5)</option>
                  </select>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowCalculator(false)}
              className="btn-primary w-full"
            >
              Calculate Projection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
