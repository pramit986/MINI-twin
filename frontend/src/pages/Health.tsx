import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { calculateBMI, calculateProtein, calculateWater, isSafeGoal } from '../health/calculators';

export default function Health() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'protein' | 'water'>('bmi');
  const [loading, setLoading] = useState(true);
  
  // Health Profile State
  const [profile, setProfile] = useState<any>(null);
  
  // Local editable state
  const [weightKg, setWeightKg] = useState<number>(0);
  const [heightCm, setHeightCm] = useState<number>(0);
  const [activityLevel, setActivityLevel] = useState<string>('sedentary');
  const [goal, setGoal] = useState<string>('maintain');
  const [exerciseHours, setExerciseHours] = useState<number>(1);
  const [conditions, setConditions] = useState<string[]>(['none']);
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch user profile (for age/DOB)
    const { data: userProfile } = await supabase.from('profiles').select('dob').eq('user_id', session.user.id).single();
    
    // Fetch health profile
    const { data: healthProfile } = await supabase.from('health_profiles').select('*').eq('user_id', session.user.id).single();
    
    // Fetch latest body metrics for weight
    const { data: metrics } = await supabase.from('body_metrics')
      .select('weight_kg')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    const currentWeight = metrics?.weight_kg || healthProfile?.weight_kg || 70;
    
    setProfile({ ...userProfile, ...healthProfile });
    setWeightKg(currentWeight);
    setHeightCm(healthProfile?.height_cm || 170);
    setActivityLevel(healthProfile?.activity_level || 'sedentary');
    setGoal(healthProfile?.goal || 'maintain');
    setConditions(healthProfile?.conditions || ['none']);
    
    setLoading(false);
  };

  const getAge = () => {
    if (!profile?.dob) return 25; // Default adult
    const birthDate = new Date(profile.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveToProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const age = getAge();
      const { bmi, category } = calculateBMI(weightKg, heightCm);
      
      // Safety checks
      const safety = isSafeGoal(age, bmi, goal);
      if (!safety.safe) {
        setMessage(safety.message || 'Unsafe goal');
        setLoading(false);
        return;
      }

      await supabase.from('health_profiles').upsert({
        user_id: session.user.id,
        height_cm: heightCm,
        activity_level: activityLevel,
        goal: goal,
        conditions: conditions,
      });

      await supabase.from('body_metrics').insert({
        user_id: session.user.id,
        date: new Date().toISOString().split('T')[0],
        weight_kg: weightKg,
        bmi: bmi,
        category: category
      });
      setMessage('Saved to profile');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="animate-pulse w-full h-[200px] bg-[var(--color-surface)] mt-[56px]" />;
  }

  const age = getAge();
  const bmiResult = calculateBMI(weightKg, heightCm);
  const proteinResult = calculateProtein(weightKg, age, activityLevel, goal, conditions);
  const waterResult = calculateWater(weightKg, exerciseHours);

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      <div className="flex items-end justify-between hairline-bottom pb-[8px] mb-[40px]">
        <div className="text-label">Health Calculators</div>
      </div>
      <h1 className="text-display mb-[40px]">Know your numbers.</h1>

      {/* Tabs */}
      <div className="flex gap-[24px] hairline-bottom mb-[40px]">
        <button 
          onClick={() => setActiveTab('bmi')} 
          className={`pb-[8px] font-mono text-[13px] uppercase tracking-wider ${activeTab === 'bmi' ? 'text-[var(--color-text)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-text-3)] hover:text-[var(--color-text-2)]'}`}
        >
          BMI
        </button>
        <button 
          onClick={() => setActiveTab('protein')} 
          className={`pb-[8px] font-mono text-[13px] uppercase tracking-wider ${activeTab === 'protein' ? 'text-[var(--color-text)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-text-3)] hover:text-[var(--color-text-2)]'}`}
        >
          Protein
        </button>
        <button 
          onClick={() => setActiveTab('water')} 
          className={`pb-[8px] font-mono text-[13px] uppercase tracking-wider ${activeTab === 'water' ? 'text-[var(--color-text)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-text-3)] hover:text-[var(--color-text-2)]'}`}
        >
          Water
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-[56px]">
        {/* Controls */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-label">Weight (kg)</label>
            <input type="number" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} className="h-[48px]" />
          </div>

          {activeTab === 'bmi' && (
            <div className="flex flex-col gap-[8px]">
              <label className="text-label">Height (cm)</label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} className="h-[48px]" />
            </div>
          )}

          {activeTab === 'protein' && (
            <>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Activity Level</label>
                <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-label">Goal</label>
                <select className="h-[48px] bg-transparent border border-[var(--color-line)] px-4" value={goal} onChange={e => setGoal(e.target.value)}>
                  <option value="maintain">Maintain</option>
                  <option value="lose">Lose Weight</option>
                  <option value="gain">Gain Muscle</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'water' && (
            <div className="flex flex-col gap-[8px]">
              <label className="text-label">Planned Exercise (Hours)</label>
              <input type="number" step="0.5" value={exerciseHours} onChange={e => setExerciseHours(Number(e.target.value))} className="h-[48px]" />
            </div>
          )}

          <div className="pt-[16px] flex flex-col gap-2">
            <button className="btn-secondary w-full" onClick={handleSaveToProfile}>
              Save to my profile
            </button>
            {message && <div className="text-small text-[var(--color-regret)] text-center">{message}</div>}
          </div>
        </div>

        {/* Display Face */}
        <div className="bg-[var(--color-surface)] p-[32px] border border-[var(--color-line)] flex flex-col items-center justify-center text-center relative">
          
          <div className="absolute top-4 right-4 group">
            <span className="text-[var(--color-text-3)] cursor-help">ⓘ</span>
            <div className="hidden group-hover:block absolute right-0 top-6 w-[250px] bg-[var(--color-bg)] border border-[var(--color-line)] p-4 text-left text-small z-10 shadow-lg">
              <p className="mb-2"><strong>How is this calculated?</strong></p>
              {activeTab === 'bmi' && <p>General estimate, not medical advice. Uses standard WHO BMI formula.</p>}
              {activeTab === 'protein' && <p>General estimate, not medical advice. Uses ICMR-NIN/WHO multipliers based on activity and goal.</p>}
              {activeTab === 'water' && <p>General estimate, not medical advice. Base 33ml/kg + 500ml/hr exercise.</p>}
            </div>
          </div>

          {activeTab === 'bmi' && (
            <>
              <div className="text-label mb-2">Your BMI</div>
              <div className="text-numeral mb-2">{bmiResult.bmi}</div>
              <div className="text-body mb-8 text-[var(--color-text-2)]">{bmiResult.category}</div>
              
              <div className="w-full relative h-[4px] bg-[var(--color-line)] rounded-full mb-4">
                {/* Thin ruled scale */}
                <div 
                  className="absolute top-[-6px] bottom-[-6px] w-[2px] bg-[var(--color-accent)]" 
                  style={{ left: `${Math.min(100, Math.max(0, (bmiResult.bmi - 15) / 25 * 100))}%` }}
                />
              </div>
              <div className="w-full flex justify-between text-label text-[10px] text-[var(--color-text-3)]">
                <span>15</span>
                <span>Normal (18.5-25)</span>
                <span>40</span>
              </div>
              
              <p className="mt-8 text-small text-[var(--color-text-3)]">BMI does not measure body composition (muscle, frame).</p>
            </>
          )}

          {activeTab === 'protein' && (
            <>
              <div className="text-label mb-2">Daily Protein Target</div>
              {proteinResult.target > 0 ? (
                <>
                  <div className="text-numeral mb-2">{proteinResult.target}g</div>
                  <div className="text-body mb-8 text-[var(--color-text-2)]">
                    Range: {proteinResult.range[0]}g - {proteinResult.range[1]}g
                  </div>
                  <div className="text-small text-[var(--color-text-3)]">
                    Roughly {Math.round(proteinResult.target / 4)}g per meal across 4 meals.
                  </div>
                </>
              ) : (
                <div className="text-body text-[var(--color-regret)]">{proteinResult.message}</div>
              )}
            </>
          )}

          {activeTab === 'water' && (
            <>
              <div className="text-label mb-2">Daily Water Target</div>
              <div className="text-numeral mb-2">{waterResult.targetMl / 1000}L</div>
              <div className="text-body mb-8 text-[var(--color-text-2)]">
                That's roughly {waterResult.glasses} glasses (250ml each).
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
