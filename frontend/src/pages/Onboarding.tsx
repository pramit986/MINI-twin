import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Student Twin.",
      subtitle: "Your student life. One living digital twin."
    },
    {
      title: "Everything Connected.",
      subtitle: "One system for academic, fitness, productivity, nutrition, finance, and career. Track less. Understand more."
    },
    {
      title: "More Than Tracking.",
      subtitle: "Track → Understand → Predict → Simulate → Act"
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full border border-[var(--color-line)] bg-[var(--color-surface)] p-[32px] min-h-[450px] flex flex-col relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {step < steps.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center"
            >
              <h1 className="text-display mb-[24px]">{steps[step].title}</h1>
              <div className="text-[13px] text-[var(--color-text-2)] font-mono leading-[1.6]">
                {steps[step].subtitle}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="mb-[24px] text-[var(--color-accent)] font-mono">
                [SYSTEM_INITIALIZED]
              </div>
              <h1 className="text-display mb-[24px]">Twin Ready.</h1>
              <p className="text-[13px] text-[var(--color-text-2)] font-mono">Your data is locked in.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-[32px] flex flex-col gap-[24px]">
          <div className="flex gap-[8px]">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-[4px] h-[4px] rounded-full transition-colors ${
                  i === step ? 'bg-[var(--color-accent)]' : 
                  i < step ? 'bg-[var(--color-text)]' : 'bg-[var(--color-line)]'
                }`}
              />
            ))}
            <div className={`w-[4px] h-[4px] rounded-full transition-colors ${step === steps.length ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-line)]'}`} />
          </div>
          
          <button
            onClick={handleNext}
            className="btn-primary w-full text-center"
          >
            {step === steps.length ? 'ENTER SYSTEM' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  );
}
