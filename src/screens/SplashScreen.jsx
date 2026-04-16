import { useState, useEffect } from 'react';

function getDailyStreak() {
  try {
    const data = JSON.parse(localStorage.getItem('complyng_streak') || '{}');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastDay === today) return data.count || 1;
    if (data.lastDay === yesterday) return data.count || 1;
    return 0;
  } catch { return 0; }
}

function saveDailyStreak() {
  try {
    const data = JSON.parse(localStorage.getItem('complyng_streak') || '{}');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let count = 1;
    if (data.lastDay === today) count = data.count;
    else if (data.lastDay === yesterday) count = (data.count || 0) + 1;
    localStorage.setItem('complyng_streak', JSON.stringify({ lastDay: today, count }));
    return count;
  } catch { return 1; }
}

function getTotalXP() {
  try { return parseInt(localStorage.getItem('complyng_total_xp') || '0', 10); } catch { return 0; }
}

export default function SplashScreen({ onStart, onLeaderboard, onRegulator }) {
  const [vis, setVis] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    setTimeout(() => setVis(true), 80);
    setStreak(saveDailyStreak());
    setTotalXP(getTotalXP());
  }, []);

  const streakColor = streak >= 7 ? '#FF4444' : streak >= 3 ? '#FF6B35' : '#FFE566';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#050810 0%,#0a1528 55%,#0d0a1f 100%)', padding: '0 24px', opacity: vis ? 1 : 0, transition: 'opacity .6s', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(78,205,196,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(78,205,196,.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#008751 33%,#fff 33% 66%,#008751 66%)' }} />

      <div style={{ textAlign: 'center', position: 'relative', animation: 'fadeIn .8s ease', width: '100%', maxWidth: 380 }}>
        <div style={{ fontSize: 80, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🇳🇬</div>
        <h1 style={{ fontFamily: 'Fraunces,serif', fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: -1, lineHeight: 1, marginBottom: 6 }}>
          Comply<span style={{ color: '#4ECDC4' }}>NG</span>
        </h1>
        <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, letterSpacing: 4, marginBottom: 6 }}>THE NIGERIAN COMPLIANCE GAME</p>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, lineHeight: 1.7, marginBottom: 14, maxWidth: 300, margin: '0 auto 14px' }}>
          Choose your career. Navigate Nigerian business laws.<br />Climb 13 levels. Become a Compliance Legend.
        </p>

        {/* Daily streak + XP banner */}
        {(streak > 0 || totalXP > 0) && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
            {streak > 0 && (
              <div style={{ background: 'rgba(255,107,53,.12)', border: `1px solid rgba(255,107,53,.3)`, borderRadius: 14, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18, animation: streak >= 3 ? 'streakFire .8s ease-in-out infinite' : 'none' }}>🔥</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: streakColor, fontSize: 16, fontWeight: 900, fontFamily: 'Fraunces, serif', lineHeight: 1 }}>{streak}</div>
                  <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 9, letterSpacing: 1 }}>DAY STREAK</div>
                </div>
              </div>
            )}
            {totalXP > 0 && (
              <div style={{ background: 'rgba(78,205,196,.1)', border: '1px solid rgba(78,205,196,.25)', borderRadius: 14, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#4ECDC4', fontSize: 16, fontWeight: 900, fontFamily: 'Fraunces, serif', lineHeight: 1 }}>{totalXP >= 1000 ? `${(totalXP / 1000).toFixed(1)}K` : totalXP}</div>
                  <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 9, letterSpacing: 1 }}>TOTAL XP</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {['📜 Real Nigerian Laws', '🎮 13 Levels', '🏆 Achievements', '🤖 AI Advisor', '⚡ Combo Bonuses'].map(t => (
            <span key={t} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.55)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button className="btn" onClick={onStart} style={{ width: 240, background: 'linear-gradient(135deg,#008751,#00c46b)', color: '#fff', fontSize: 19, padding: '17px 0', borderRadius: 99, boxShadow: '0 8px 32px rgba(0,135,81,.5)', fontFamily: 'Fraunces,serif', animation: 'bounce 2.5s ease-in-out infinite' }}>
            {streak > 0 ? `Continue Streak 🔥` : 'Play Now 🎮'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={onLeaderboard} style={{ width: 114, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', fontSize: 13, padding: '12px 0', borderRadius: 99 }}>
              Leaderboard
            </button>
            <button className="btn" onClick={onRegulator} style={{ width: 114, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: '#A78BFA', fontSize: 13, padding: '12px 0', borderRadius: 99 }}>
              B2G Data
            </button>
          </div>
        </div>

        {/* Weekly streak progress */}
        {streak > 0 && (
          <div style={{ marginTop: 20, display: 'flex', gap: 6, justifyContent: 'center' }}>
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: i < streak ? 'linear-gradient(135deg,#FF6B35,#FFE566)' : 'rgba(255,255,255,.08)', border: `1.5px solid ${i < streak ? 'rgba(255,107,53,.5)' : 'rgba(255,255,255,.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, boxShadow: i < streak ? '0 0 8px rgba(255,107,53,.4)' : 'none' }}>
                {i < streak ? '🔥' : ''}
              </div>
            ))}
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,.2)', fontSize: 10, marginTop: 24, letterSpacing: 2 }}>MICROSOFT AI SKILLS WEEK 2026 · REGTECH HACKATHON</p>
      </div>
    </div>
  );
}
