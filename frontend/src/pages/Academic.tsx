import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator } from 'lucide-react';
import { api } from '../services/api';
import type { AcademicData, RiskPrediction, AttendanceIntelligence } from '../types';

const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20),
  credits: z.number().min(1).max(10),
  difficulty: z.number().min(1).max(5),
  importance: z.number().min(1).max(5),
});
type SubjectFormData = z.infer<typeof subjectSchema>;

export default function Academic() {
  const [data, setData] = useState<AcademicData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceIntelligence[]>([]);
  const [risk, setRisk] = useState<RiskPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { credits: 3, difficulty: 3, importance: 3 }
  });

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

  const onSubmitSubject = async (formData: SubjectFormData) => {
    try {
      await api.createSubject(formData);
      setShowAddSubject(false);
      reset();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async (subjectId: string, status: 'present' | 'absent') => {
    await api.markAttendance(subjectId, status);
    fetchData();
  };

  if (loading || !data) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px] relative">
      {/* Header */}
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">Academic Twin</div>
        <button onClick={() => setShowAddSubject(true)} className="text-[var(--color-accent)] hover:underline underline-offset-4 text-[13px] font-mono">
          + Add Subject
        </button>
      </div>
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
              <div key={sub.id} className="grid grid-cols-12 items-center py-[16px] ruled-row border-t-0 group">
                <div className="col-span-3 pr-[16px]">
                  <div className="font-mono text-[var(--color-text)]">{sub.code}</div>
                  <div className="text-[13px] text-[var(--color-text-2)] truncate max-w-full" title={sub.name}>{sub.name}</div>
                </div>
                <div className="col-span-3 pr-[16px]">
                  <div className={`font-mono ${sub.attendancePercentage < 75 ? 'text-[var(--color-regret)]' : ''}`}>
                    {Math.round(sub.attendancePercentage)}%
                  </div>
                  <div className="text-[13px] text-[var(--color-text-2)]">{sub.attendedClasses}/{sub.totalClasses} classes</div>
                  
                  {/* Hover Actions */}
                  <div className="hidden group-hover:flex gap-[8px] mt-2">
                     <button onClick={() => handleMarkAttendance(sub.id, 'present')} className="text-[10px] font-mono border border-[var(--color-line)] px-2 py-1 hover:text-[var(--color-bg)] hover:bg-[var(--color-text)]">+ Present</button>
                     <button onClick={() => handleMarkAttendance(sub.id, 'absent')} className="text-[10px] font-mono border border-[var(--color-line)] px-2 py-1 hover:text-[var(--color-regret)] hover:border-[var(--color-regret)]">+ Absent</button>
                  </div>
                </div>
                <div className="col-span-4 pr-[16px] text-[13px] text-[var(--color-text-2)]">
                  {att ? (
                    <>
                      {att.canMiss > 0 ? (
                        <span>Can safely miss {att.canMiss} classes</span>
                      ) : att.requiredFor75 > 0 ? (
                        <span className="text-[var(--color-regret)]">Must attend next {att.requiredFor75} classes</span>
                      ) : (
                        <span>Exactly at 75% limit</span>
                      )}
                    </>
                  ) : (
                    <span>No attendance recorded yet.</span>
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
          
          {data.subjects.length === 0 && (
             <div className="py-[16px] text-[13px] font-mono text-[var(--color-text-3)] text-center">
               No subjects tracked. Click + Add Subject.
             </div>
          )}
        </div>
      </div>
      
      {/* Basic CGPA What-If Modal Placeholder */}
      {showCalculator && (
        <div className="fixed inset-0 bg-[#000000CC] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] border border-[var(--color-line)] bg-[var(--color-bg)] p-[32px] relative">
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

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-[#000000CC] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] border border-[var(--color-line)] bg-[var(--color-bg)] p-[32px] relative">
            <button onClick={() => setShowAddSubject(false)} className="absolute top-[16px] right-[16px] text-[var(--color-text-3)] hover:text-white">
              ✕
            </button>
            <h3 className="text-title mb-[24px]">Add Subject</h3>
            
            <form onSubmit={handleSubmit(onSubmitSubject)} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Subject Code</label>
                <input {...register('code')} className="h-[48px]" placeholder="e.g. CS101" autoFocus />
                {errors.code && <span className="text-[var(--color-regret)] text-[11px] font-mono">{errors.code.message}</span>}
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Subject Name</label>
                <input {...register('name')} className="h-[48px]" placeholder="e.g. Data Structures" />
                {errors.name && <span className="text-[var(--color-regret)] text-[11px] font-mono">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-3 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Credits</label>
                  <input type="number" {...register('credits', { valueAsNumber: true })} className="h-[48px]" />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Difficulty</label>
                  <input type="number" {...register('difficulty', { valueAsNumber: true })} min={1} max={5} className="h-[48px]" placeholder="1-5" />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Importance</label>
                  <input type="number" {...register('importance', { valueAsNumber: true })} min={1} max={5} className="h-[48px]" placeholder="1-5" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-[16px]">
                {isSubmitting ? 'Adding...' : 'Add Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
