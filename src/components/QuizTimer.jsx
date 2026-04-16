import { useEffect, useRef, useState } from 'react';

export default function QuizTimer({ active, onTimeout, onTick }) {
  const [time, setTime] = useState(12);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) { setTime(12); return; }
    setTime(12);
    intervalRef.current = setInterval(() => {
      setTime(t => {
        const next = t - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(intervalRef.current);
          onTimeout?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const pct = time / 12;
  const urgent = time <= 3;
  const color = pct > 0.5 ? '#00c864' : pct > 0.25 ? '#FFE566' : '#FF4444';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,.1)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          width: `${pct * 100}%`, height: '100%', background: color, borderRadius: 99,
          transition: 'width 1s linear, background .3s',
        }} />
      </div>
      <span style={{
        color, fontSize: 14, fontWeight: 900, minWidth: 28, textAlign: 'right',
        fontFamily: 'Fraunces, serif',
        animation: urgent ? 'timerPulse .6s ease-in-out infinite' : 'none',
        textShadow: urgent ? `0 0 12px ${color}` : 'none',
      }}>
        {time}s
      </span>
    </div>
  );
}
