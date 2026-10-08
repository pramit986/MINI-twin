import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import type { SimulationScenario, SimulationResult } from '../types';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function FutureSelf() {
  const [scenario, setScenario] = useState<SimulationScenario>({
    studyHours: 2.6,
    gymDays: 3,
    sleepHours: 7,
    attendanceRate: 80,
    taskCompletionRate: 65,
    careerLearningHours: 2,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.simulate(scenario);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (key: keyof SimulationScenario, value: number) => {
    setScenario(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-[880px] mx-auto w-full pt-[56px] pb-[120px]">
      
      {/* Header */}
      <div className="text-label hairline-bottom pb-[8px] mb-[40px]">Future self</div>
      <h1 className="text-display mb-[56px]">Simulate your trajectory.</h1>
      
      <div className="flex flex-col gap-[24px] mb-[56px]">
        <SliderControl 
          label="STUDY HOURS" value={scenario.studyHours} min={0} max={8} step={0.5} suffix="h"
          onChange={(v) => handleSliderChange('studyHours', v)}
        />
        <SliderControl 
          label="GYM DAYS" value={scenario.gymDays} min={0} max={7} step={1} suffix="d"
          onChange={(v) => handleSliderChange('gymDays', v)}
        />
        <SliderControl 
          label="SLEEP" value={scenario.sleepHours} min={4} max={10} step={0.5} suffix="h"
          onChange={(v) => handleSliderChange('sleepHours', v)}
        />
        <SliderControl 
          label="TASK COMPLETION" value={scenario.taskCompletionRate} min={0} max={100} step={5} suffix="%"
          onChange={(v) => handleSliderChange('taskCompletionRate', v)}
        />
      </div>

      <button 
        onClick={fetchSimulation}
        className="btn-primary w-full md:w-auto h-[48px] px-[32px] mb-[64px]"
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run simulation'}
      </button>

      {/* Chart Area */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col border-t border-[var(--color-line)] pt-[40px]"
          >
            <div className="text-label mb-[40px]">Outcome</div>
            
            <div className="h-[300px] w-full mb-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.timeline} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="label" 
                    axisLine={{ stroke: 'var(--color-line)' }} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--color-text-2)', fontFamily: 'Geist Mono, monospace' }} 
                    dy={16} 
                  />
                  <YAxis 
                    domain={['dataMin - 0.2', 'dataMax + 0.2']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--color-text-2)', fontFamily: 'Geist Mono, monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: '2px', padding: '12px', fontFamily: 'Geist Mono, monospace' }}
                    itemStyle={{ fontSize: '14px', color: 'var(--color-text)' }}
                  />
                  <Area 
                    type="step" 
                    dataKey="academic.cgpa" 
                    stroke="var(--color-text)" 
                    strokeWidth={1} 
                    fill="transparent" 
                    name="CGPA" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col ruled-row md:border-t-0 md:border-r border-[var(--color-line)] md:pr-[24px] py-[24px] md:py-0">
                <span className="text-label mb-[12px]">Projected CGPA</span>
                <span className="font-mono text-[32px]">{result.timeline[3].academic.cgpa.toFixed(2)}</span>
              </div>
              <div className="flex flex-col ruled-row md:border-t-0 md:border-r border-[var(--color-line)] md:px-[24px] py-[24px] md:py-0">
                <span className="text-label mb-[12px]">Burnout Risk</span>
                <span className="font-mono text-[32px]">{result.timeline[3].routine.burnoutRisk}</span>
              </div>
              <div className="flex flex-col ruled-row md:border-t-0 md:pl-[24px] py-[24px] md:py-0 border-b-0">
                <span className="text-label mb-[12px]">Career Readiness</span>
                <span className="font-mono text-[32px]">{Math.round(scenario.studyHours * 10)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, suffix, onChange }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-[16px] md:gap-[40px] ruled-row border-t-0 border-b border-[var(--color-line)] pb-[24px]">
      <div className="flex justify-between md:w-[160px] shrink-0 font-mono text-[13px]">
        <span className="text-[var(--color-text-3)]">{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-[24px]">
        <div className="relative flex-1 flex items-center h-[24px]">
          <input 
            type="range" min={min} max={max} step={step} value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full appearance-none bg-transparent cursor-pointer relative z-10 slider-thumb-square slider-track-line"
            style={{
              // Use inline styles to mimic the thumb/track without complex external CSS if needed, 
              // but we rely on a global class if possible.
              WebkitAppearance: 'none'
            }}
          />
          {/* Custom Track (Visual) */}
          <div className="absolute left-0 right-0 h-[2px] bg-[var(--color-line)] pointer-events-none z-0" />
          {/* Custom Active Track (Visual) */}
          <div className="absolute left-0 h-[2px] bg-[var(--color-text)] pointer-events-none z-0" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
        </div>
        <span className="font-mono w-[60px] text-right">{value}{suffix}</span>
      </div>
    </div>
  );
}
