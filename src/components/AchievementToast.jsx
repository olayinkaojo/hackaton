import { useEffect, useState } from 'react';

const ACHIEVEMENTS = {
  first_correct:  { icon: '⚡', name: 'First Blood!',         desc: 'You answered your first question correctly' },
  quick_draw:     { icon: '🎯', name: 'Quick Draw!',           desc: 'Answered in under 3 seconds — lightning fast!' },
  streak_3:       { icon: '🔥', name: 'On Fire!',              desc: '3 correct answers in a row' },
  streak_5:       { icon: '🌋', name: 'Unstoppable!',          desc: '5 correct answers in a row' },
  streak_10:      { icon: '💥', name: 'LEGENDARY STREAK!',     desc: '10 in a row — you are a compliance beast' },
  level_3:        { icon: '📚', name: 'Law Student',           desc: 'Reached Level 3 — keep going!' },
  level_5:        { icon: '⚖️', name: 'Compliance Officer',    desc: 'Halfway there — Level 5 unlocked!' },
  level_10:       { icon: '🎓', name: 'Legal Eagle',           desc: 'Top 10 levels conquered — almost there!' },
  perfect_level:  { icon: '🌟', name: 'Perfect Level!',        desc: 'Completed a level without losing a life' },
  tax_master:     { icon: '💰', name: 'Tax Master',            desc: 'Answered 3 tax-related questions correctly' },
  night_owl:      { icon: '🦉', name: 'Night Owl',             desc: 'Studying compliance after 10 PM — dedicated!' },
};

export default function AchievementToast({ achievementKey, onDone }) {
  const [phase, setPhase] = useState('in');
  const a = ACHIEVEMENTS[achievementKey];

  useEffect(() => {
    if (!a) { onDone?.(); return; }
    const t1 = setTimeout(() => setPhase('out'), 3000);
    const t2 = setTimeout(() => onDone?.(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [achievementKey]);

  if (!a) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 100, left: 16, right: 16, zIndex: 250,
      background: 'linear-gradient(135deg, rgba(15,20,40,.97), rgba(30,15,50,.97))',
      border: '2px solid rgba(255,229,102,.55)',
      borderRadius: 22, padding: '14px 16px',
      display: 'flex', gap: 14, alignItems: 'center',
      animation: phase === 'in' ? 'achieveIn .45s cubic-bezier(.34,1.56,.64,1) forwards' : 'achieveOut .35s ease forwards',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 12px 40px rgba(255,229,102,.25), 0 0 0 1px rgba(255,229,102,.1)',
    }}>
      <div style={{ fontSize: 40, animation: 'spinPop .6s ease', flexShrink: 0 }}>{a.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#FFE566', fontSize: 10, fontWeight: 800, letterSpacing: 2.5, marginBottom: 2 }}>
          ACHIEVEMENT UNLOCKED
        </div>
        <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: 'Fraunces, serif', lineHeight: 1.2 }}>
          {a.name}
        </div>
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>
          {a.desc}
        </div>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFE566', boxShadow: '0 0 8px #FFE566', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}
