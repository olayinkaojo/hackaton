import { useEffect, useState } from 'react';

export default function XPBurst({ amount, combo, timeBonus, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(() => onDone?.(), 300); }, 1400);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const multiplier = combo >= 10 ? 3 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1;

  return (
    <div style={{ position: 'absolute', top: '28%', left: '50%', zIndex: 300, pointerEvents: 'none', textAlign: 'center', animation: 'xpFloat 1.4s ease forwards' }}>
      <div style={{
        fontFamily: 'Fraunces, serif', fontSize: 46, fontWeight: 900, color: '#FFE566',
        textShadow: '0 0 30px rgba(255,229,102,.9), 0 0 60px rgba(255,229,102,.4)',
        lineHeight: 1,
      }}>
        +{amount} XP
      </div>
      {timeBonus > 0 && (
        <div style={{ fontSize: 13, color: '#4ECDC4', fontWeight: 800, marginTop: 4, textShadow: '0 0 10px rgba(78,205,196,.6)' }}>
          ⚡ Speed Bonus +{timeBonus}
        </div>
      )}
      {multiplier > 1 && (
        <div style={{ fontSize: 14, color: '#FF6B35', fontWeight: 800, marginTop: 3, textShadow: '0 0 10px rgba(255,107,53,.6)' }}>
          🔥 {multiplier}× COMBO!
        </div>
      )}
    </div>
  );
}
