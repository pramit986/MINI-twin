import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { calculateBMI, calculateProtein, calculateWater } from '../health/calculators';

export default function Onboarding(props: { onComplete?: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    name: '',
    dob: '',
    sex_for_calc: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    life_stage: '',
    // Step 2 Academic
    institution: '',
    program: '',
    daily_study_hours: 2,
    // Step 3 Health
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    fitness_goal: '',
    diet_type: '',
    food_allergies: '',
    workout_experience: '',
    workout_days: 3,
    equipment: '',
    injuries: '',
    conditions: '',
    // Step 4 Routine
    wake_time: '07:00',
    bedtime: '23:00',
    // Step 5 Finance
    monthly_budget: '',
    // Step 6 Career
    target_role: '',
    // Step 7 Reminders
    reminder_daily: true,
  });

  const age = useMemo(() => {
    if (!formData.dob) return 20;
    const diff = Date.now() - new Date(formData.dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }, [formData.dob]);

  const healthTargets = useMemo(() => {
    if (formData.height_cm && formData.weight_kg) {
      const w = parseFloat(formData.weight_kg);
      const h = parseFloat(formData.height_cm);
      const cond = formData.conditions ? formData.conditions.split(',') : [];
      return {
        bmi: calculateBMI(w, h),
        protein: calculateProtein(w, age, formData.activity_level, formData.fitness_goal, cond),
        water: calculateWater(w, 1) // default 1 hr exercise
      };
    }
    return null;
  }, [formData.height_cm, formData.weight_kg, formData.activity_level, formData.fitness_goal, formData.conditions, age]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
      if (data) {
        setFormData((prev: any) => ({ ...prev, ...data }));
        if (data.onboarding_done) {
          if (typeof (props as any).onComplete === 'function') {
            (props as any).onComplete();
          } else {
            navigate('/');
          }
        } else if (data.onboarding_step) {
          setStep(data.onboarding_step);
        }
      } else {
        // Create initial profile
        await supabase.from('profiles').insert({ user_id: session.user.id, onboarding_step: 1 });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate, props]);

  const handleNext = async () => {
    // Validate current step
    if (step === 1 && (!formData.name || !formData.life_stage || !formData.dob)) {
      alert("Name, Date of Birth, and Life Stage are required.");
      return;
    }
    if (step === 3 && (!formData.height_cm || !formData.weight_kg)) {
      alert("Height and Weight are required.");
      return;
    }

    setLoading(true);
    // Save to DB
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const updatePayload: any = { onboarding_step: step + 1 };
      
      if (step === 1) {
        updatePayload.name = formData.name;
        updatePayload.dob = formData.dob;
        updatePayload.sex_for_calc = formData.sex_for_calc;
        updatePayload.timezone = formData.timezone;
        updatePayload.life_stage = formData.life_stage;
        await supabase.from('profiles').update(updatePayload).eq('user_id', session.user.id);
      } else if (step === 2) {
        await supabase.from('academic_profiles').upsert({
          user_id: session.user.id,
          institution: formData.institution,
          program: formData.program,
          daily_study_hours: formData.daily_study_hours
        });
        await supabase.from('profiles').update({ onboarding_step: step + 1 }).eq('user_id', session.user.id);
      } else if (step === 3) {
        await supabase.from('health_profiles').upsert({
          user_id: session.user.id,
          height_cm: formData.height_cm,
          goal: formData.fitness_goal,
          activity_level: formData.activity_level,
          diet_type: formData.diet_type,
          allergies: formData.food_allergies ? formData.food_allergies.split(',') : [],
          experience: formData.workout_experience,
          workout_days: formData.workout_days,
          equipment: formData.equipment,
          injuries: formData.injuries,
          conditions: formData.conditions ? formData.conditions.split(',') : [],
          target_protein_g: healthTargets?.protein.target,
          target_water_ml: healthTargets?.water.targetMl
        });
        await supabase.from('body_metrics').upsert({
          user_id: session.user.id,
          date: new Date().toISOString().split('T')[0],
          weight_kg: formData.weight_kg,
          bmi: healthTargets?.bmi.bmi,
          category: healthTargets?.bmi.category
        });
        await supabase.from('profiles').update({ onboarding_step: step + 1 }).eq('user_id', session.user.id);
      } else if (step === 4) {
        await supabase.from('health_profiles').upsert({
          user_id: session.user.id,
          wake_time: formData.wake_time,
          bedtime: formData.bedtime
        });
        await supabase.from('profiles').update({ onboarding_step: step + 1 }).eq('user_id', session.user.id);
      } else if (step === 5) {
        if (formData.monthly_budget) {
          const firstDayOfMonth = new Date();
          firstDayOfMonth.setDate(1);
          await supabase.from('budgets').upsert({
            user_id: session.user.id,
            month: firstDayOfMonth.toISOString().split('T')[0],
            amount: parseFloat(formData.monthly_budget)
          });
        }
        await supabase.from('profiles').update({ onboarding_step: step + 1 }).eq('user_id', session.user.id);
      } else if (step === 6) {
        if (formData.target_role) {
          await supabase.from('career_profiles').upsert({
            user_id: session.user.id,
            target_role: formData.target_role
          });
        }
        await supabase.from('profiles').update({ onboarding_step: step + 1 }).eq('user_id', session.user.id);
      } else if (step === 7) {
        await supabase.from('reminder_prefs').upsert({
          user_id: session.user.id,
          type: 'daily_brief',
          enabled: formData.reminder_daily
        });
        await supabase.from('profiles').update({ onboarding_step: step + 1 }).eq('user_id', session.user.id);
      } else if (step === 8) {
        await supabase.from('profiles').update({ onboarding_step: 8, onboarding_done: true }).eq('user_id', session.user.id);
        if (typeof (props as any).onComplete === 'function') {
          (props as any).onComplete();
        } else {
          window.location.href = '/';
        }
        return;
      }
    }
    
    setStep(s => s + 1);
    setLoading(false);
  };

  const stepsList = [
    "About you", "Academic", "Health", "Daily routine", "Finance", "Career", "Reminders", "Privacy"
  ];

  if (loading) return <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-2)] p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
      {/* Mobile progress bar */}
      <div className="md:hidden w-full h-[2px] bg-[var(--color-line)] fixed top-0 left-0">
        <div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${(step / 8) * 100}%` }} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[300px] border-r border-[var(--color-line)] flex-col p-[32px]">
        <div className="text-display text-[24px] mb-[40px]">Student Twin.</div>
        <div className="flex flex-col gap-0">
          {stepsList.map((s, i) => (
            <div key={i} className={`py-[16px] ruled-row border-t-0 flex items-center gap-[12px] ${step === i + 1 ? 'text-[var(--color-text)]' : step > i + 1 ? 'text-[var(--color-text-2)]' : 'text-[var(--color-text-3)]'}`}>
              <div className={`w-[8px] h-[8px] rounded-full ${step === i + 1 ? 'bg-[var(--color-accent)]' : step > i + 1 ? 'bg-[var(--color-text-2)]' : 'bg-[var(--color-line)]'}`} />
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col p-[32px] md:p-[64px] max-w-[600px] mt-[24px] md:mt-0">
        <h2 className="text-title mb-[8px]">Step {step}: {stepsList[step-1]}</h2>
        
        <div className="flex-1 flex flex-col gap-[24px] mt-[32px]">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Name (Required)</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-[48px]" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Date of Birth (Required)</label>
                <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="h-[48px]" />
                <span className="text-[12px] text-[var(--color-text-3)]">Used for age-appropriate health & academic models.</span>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Sex for health reference</label>
                <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={formData.sex_for_calc} onChange={e => setFormData({...formData, sex_for_calc: e.target.value})}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Timezone</label>
                <input value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} className="h-[48px]" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Life Stage (Required)</label>
                <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={formData.life_stage} onChange={e => setFormData({...formData, life_stage: e.target.value})}>
                  <option value="">Select...</option>
                  <option value="school">School</option>
                  <option value="college">College/University</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Institution / School Name</label>
                <input value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="h-[48px]" placeholder="e.g. Stanford University" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Program / Major</label>
                <input value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="h-[48px]" placeholder="e.g. B.S. Computer Science" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Daily Study Target (hours)</label>
                <input type="number" step="0.5" value={formData.daily_study_hours} onChange={e => setFormData({...formData, daily_study_hours: e.target.value})} className="h-[48px]" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex gap-[16px]">
                <div className="flex-1 flex flex-col gap-[8px]">
                  <label className="text-label">Height (cm, Required)</label>
                  <input type="number" value={formData.height_cm} onChange={e => setFormData({...formData, height_cm: e.target.value})} className="h-[48px]" />
                </div>
                <div className="flex-1 flex flex-col gap-[8px]">
                  <label className="text-label">Weight (kg, Required)</label>
                  <input type="number" value={formData.weight_kg} onChange={e => setFormData({...formData, weight_kg: e.target.value})} className="h-[48px]" />
                </div>
              </div>
              
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Activity Level</label>
                <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={formData.activity_level} onChange={e => setFormData({...formData, activity_level: e.target.value})}>
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Light (Exercise 1-3 times/week)</option>
                  <option value="moderate">Moderate (Exercise 4-5 times/week)</option>
                  <option value="active">Active (Intense exercise 6-7 times/week)</option>
                </select>
              </div>

              {age < 20 ? null : (
                <div className="flex flex-col gap-[8px]">
                  <label className="text-label">Fitness Goal</label>
                  <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={formData.fitness_goal} onChange={e => setFormData({...formData, fitness_goal: e.target.value})}>
                    <option value="">Select...</option>
                    {age >= 20 && (!healthTargets || healthTargets.bmi.bmi >= 18.5) && <option value="lose">Lose Weight</option>}
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Build Muscle / Gain</option>
                  </select>
                </div>
              )}
              
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Diet Type</label>
                <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={formData.diet_type} onChange={e => setFormData({...formData, diet_type: e.target.value})}>
                  <option value="">Select...</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              {healthTargets && (
                <div className="mt-4 p-4 border border-[var(--color-line)] bg-[var(--color-surface)] flex flex-col gap-[12px]">
                  <h4 className="text-title text-[var(--color-text)]">Your starting numbers</h4>
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <div className="text-[12px] text-[var(--color-text-2)]">BMI</div>
                      <div className="text-[18px] text-[var(--color-text)]">{healthTargets.bmi.bmi} <span className="text-[14px] text-[var(--color-text-2)]">{healthTargets.bmi.category}</span></div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[var(--color-text-2)]">Protein Target</div>
                      <div className="text-[18px] text-[var(--color-text)]">{healthTargets.protein.target > 0 ? `${healthTargets.protein.target}g / day` : 'Consult Doctor'}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[12px] text-[var(--color-text-2)]">Water Target</div>
                      <div className="text-[18px] text-[var(--color-text)]">{(healthTargets.water.targetMl / 1000).toFixed(1)}L <span className="text-[14px] text-[var(--color-text-2)]">({healthTargets.water.glasses} glasses)</span></div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-3)] mt-2">
                    Calculations based on standard formulae and your inputs. General estimate, not medical advice.
                  </div>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Typical Wake Time</label>
                <input type="time" value={formData.wake_time} onChange={e => setFormData({...formData, wake_time: e.target.value})} className="h-[48px] px-4 bg-transparent border border-[var(--color-line)] text-[var(--color-text)]" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Typical Bedtime</label>
                <input type="time" value={formData.bedtime} onChange={e => setFormData({...formData, bedtime: e.target.value})} className="h-[48px] px-4 bg-transparent border border-[var(--color-line)] text-[var(--color-text)]" />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Monthly Budget Target (Optional)</label>
                <input type="number" value={formData.monthly_budget} onChange={e => setFormData({...formData, monthly_budget: e.target.value})} className="h-[48px]" placeholder="e.g. 1000" />
                <span className="text-[12px] text-[var(--color-text-3)]">We'll set up your first monthly budget with this amount.</span>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Target Role / Dream Job (Optional)</label>
                <input value={formData.target_role} onChange={e => setFormData({...formData, target_role: e.target.value})} className="h-[48px]" placeholder="e.g. Frontend Engineer, Management Consultant" />
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <label className="flex items-center gap-[12px] cursor-pointer">
                <input type="checkbox" checked={formData.reminder_daily} onChange={e => setFormData({...formData, reminder_daily: e.target.checked})} className="w-[18px] h-[18px] bg-transparent border-[var(--color-line)] accent-[var(--color-accent)]" />
                <span className="text-[var(--color-text)]">Enable Daily Brief reminders</span>
              </label>
              <p className="text-[13px] text-[var(--color-text-2)] mt-2">
                We'll notify you with a summary of your day's tasks, goals, and recommendations.
              </p>
            </>
          )}

          {step === 8 && (
            <div className="text-[var(--color-text-2)] flex flex-col gap-[16px]">
              <h3 className="text-title text-[var(--color-text)]">Privacy & AI Consent</h3>
              <p>Your data is processed securely in the cloud via Supabase with strict Row Level Security policies.</p>
              <p>Features like <strong>Regreter</strong> and <strong>Ask Twin</strong> utilize AI to analyze your tasks and health data. You must explicitly request these features before any personal numbers or strings are sent to the AI processing layer.</p>
              <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-line)] mt-4">
                <p className="text-[13px] text-[var(--color-text)]">By clicking Finish, you agree to let Student Twin track your inputs locally and securely store them in your personal cloud database.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-[64px] flex gap-[16px] justify-end">
          {step > 1 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < 8 && <button className="btn-secondary" onClick={handleNext}>Add later</button>}
          <button className="btn-primary" onClick={handleNext}>{step === 8 ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}
