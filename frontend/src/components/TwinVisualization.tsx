import { motion } from 'framer-motion';

type TwinState = 'stable' | 'productive' | 'overloaded' | 'recovering';

interface TwinVisualizationProps {
  state: TwinState;
  size?: 'normal' | 'large';
  data?: any;
}

export default function TwinVisualization({ state, size = 'normal', data }: TwinVisualizationProps) {
  const isOverloaded = state === 'overloaded';
  const lines = Array.from({ length: 14 });

  const containerClass = size === 'large' ? "w-[320px] h-[320px]" : "w-[120px] h-[120px]";

  return (
    <div className={`relative flex items-center justify-center ${containerClass}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {lines.map((_, i) => {
          const isAccent = i === 7;
          const r = 10 + i * 3.2;
          const tilt = isOverloaded ? i * 0.8 : 0;
          
          return (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={isAccent ? 'var(--color-accent)' : 'var(--color-text)'}
              strokeWidth={isAccent ? 1 : 0.5}
              strokeOpacity={isAccent ? 1 : 0.15 + (i * 0.01)}
              style={{ transformOrigin: '50px 50px' }}
              animate={{
                scaleY: isOverloaded ? [1, 0.9 + i*0.005, 1] : 1,
                rotate: isOverloaded ? tilt : 0,
              }}
              transition={{
                duration: isOverloaded ? 2 : 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              }}
            />
          );
        })}
        
        {size === 'large' && data && (
          <>
            <g transform="translate(10, 15)">
              <line x1="20" y1="5" x2="40" y2="20" stroke="var(--color-line)" strokeWidth="0.5" />
              <text x="0" y="0" fill="var(--color-text-3)" className="text-label" style={{fontSize: '4px'}}>ACADEMIC 82</text>
            </g>
            <g transform="translate(70, 85)">
              <line x1="-5" y1="-5" x2="-25" y2="-20" stroke="var(--color-line)" strokeWidth="0.5" />
              <text x="0" y="0" fill="var(--color-text-3)" className="text-label" style={{fontSize: '4px'}}>WORKLOAD {data.plannedWorkload}H</text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
