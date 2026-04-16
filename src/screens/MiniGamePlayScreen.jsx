import { useState, useEffect, useRef } from 'react';
import { MINI_GAME_QUESTIONS } from '../data/miniGames.js';

export default function MiniGamePlayScreen({ miniGame, onBack }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const frameRef = useRef(0);

  const questions = MINI_GAME_QUESTIONS[miniGame?.id] || [];
  const q = questions[roundIdx];

  // Mini-game canvas animation (simple but thematic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const drawFrame = () => {
      frameRef.current += 1;
      const f = frameRef.current;
      ctx.clearRect(0, 0, W, H);

      // Background gradient per game
      const [c1, c2, c3] = miniGame?.bgGradient || ['#0a0a1a', '#14142e', '#0a0a1a'];
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, c1); bg.addColorStop(0.5, c2); bg.addColorStop(1, c3);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = `${miniGame?.color || '#fff'}0a`; ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i * 36, 0); ctx.lineTo(i * 36, H); ctx.stroke(); }
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, i * 20); ctx.lineTo(W, i * 20); ctx.stroke(); }

      // Animated particles
      for (let i = 0; i < 18; i++) {
        const px = ((i * 79 + f * (0.5 + (i % 3) * 0.3)) % (W + 20)) - 10;
        const py = ((i * 53 + f * 0.4) % (H * 0.85));
        const alpha = Math.sin(f * 0.04 + i) * 0.4 + 0.4;
        ctx.fillStyle = `${miniGame?.color || '#4ECDC4'}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
      }

      // Mini icon orbiting
      const orbX = W / 2 + Math.cos(f * 0.04) * 40;
      const orbY = H / 2 + Math.sin(f * 0.04) * 15;
      ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(miniGame?.emoji || '🎯', orbX, orbY);

      // Round progress dots
      const dotCount = questions.length;
      const dotSpacing = 22;
      const dotsStartX = W / 2 - ((dotCount - 1) * dotSpacing) / 2;
      for (let i = 0; i < dotCount; i++) {
        const dx = dotsStartX + i * dotSpacing;
        ctx.fillStyle = i < roundIdx ? '#00c864' : i === roundIdx ? (miniGame?.color || '#4ECDC4') : 'rgba(255,255,255,.2)';
        ctx.beginPath(); ctx.arc(dx, H - 14, 5, 0, Math.PI * 2); ctx.fill();
      }

      // Score display
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px DM Sans';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(`Score: ${score}`, 14, 10);
      ctx.textAlign = 'right';
      ctx.fillText('❤️'.repeat(lives), W - 12, 10);

      rafRef.current = requestAnimationFrame(drawFrame);
    };
    rafRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [miniGame, roundIdx, score, lives, questions.length]);

  function pick(i) {
    if (revealed || done) return;
    setSelected(i);
    setRevealed(true);
    const isCorrect = i === q.ans;
    if (isCorrect) {
      setScore(s => s + 100 + streak * 20);
      setStreak(s => s + 1);
    } else {
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => setDone(true), 1800);
        return nl;
      });
      setStreak(0);
    }
  }

  function nextRound() {
    if (roundIdx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setRoundIdx(r => r + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (!miniGame || questions.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050810', padding: 24 }}>
        <p style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>Coming soon — this game is being built! 🚧</p>
        <button className="btn" onClick={onBack} style={{ padding: '13px 32px', background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: 99, fontSize: 14 }}>← Back</button>
      </div>
    );
  }

  // Done screen
  if (done) {
    const grade = score >= 700 ? 'A' : score >= 500 ? 'B' : score >= 300 ? 'C' : 'D';
    const gradeColor = { A: '#00c864', B: '#4ECDC4', C: '#FFE566', D: '#FF8C00' }[grade];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#050810,#0d0a1f)', padding: 24, animation: 'fadeIn .5s' }}>
        <div style={{ fontSize: 70, marginBottom: 14, animation: 'float 3s ease-in-out infinite' }}>{score >= 500 ? '🏆' : '💀'}</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 40, color: '#fff', marginBottom: 8, textAlign: 'center' }}>{miniGame.title}</h2>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>Complete!</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 300, marginBottom: 28 }}>
          {[
            { l: 'Grade', v: grade, c: gradeColor },
            { l: 'Score', v: score, c: miniGame.color },
            { l: 'Rounds', v: `${Math.min(roundIdx + 1, questions.length)}/${questions.length}`, c: '#4ECDC4' },
            { l: 'Lives Left', v: '❤️'.repeat(Math.max(0, lives)) || '💔', c: '#FF4444' },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '13px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, color: s.c, marginBottom: 4 }}>{s.v}</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 300 }}>
          <button className="btn" onClick={() => { setRoundIdx(0); setSelected(null); setRevealed(false); setScore(0); setLives(3); setStreak(0); setDone(false); }} style={{ flex: 1, padding: '14px', background: `linear-gradient(135deg,${miniGame.color}99,${miniGame.color})`, color: '#000', borderRadius: 99, fontSize: 14, fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            Retry 🔄
          </button>
          <button className="btn" onClick={onBack} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,.09)', color: '#fff', borderRadius: 99, fontSize: 14 }}>
            ← Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050810', overflow: 'hidden' }}>
      {/* Canvas animation */}
      <canvas ref={canvasRef} width={430} height={120} style={{ width: '100%', height: 'auto', flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: '12px 18px 12px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn" onClick={onBack} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 34, height: 34, color: '#fff', fontSize: 16, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <p style={{ color: miniGame.color, fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: 0 }}>
            {miniGame.emoji} {miniGame.title.toUpperCase()} — ROUND {roundIdx + 1}/{questions.length}
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {questions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < roundIdx ? '#00c864' : i === roundIdx ? miniGame.color : 'rgba(255,255,255,.12)', transition: 'background .3s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="scroll" style={{ flex: 1, padding: '14px 16px 24px' }}>
        {/* Topic badge */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ background: `${miniGame.color}22`, color: miniGame.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: `1px solid ${miniGame.color}44` }}>
            Round {roundIdx + 1} — {q?.topic}
          </span>
          {streak > 1 && <span style={{ background: 'rgba(255,229,102,.15)', color: '#FFE566', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>🔥 {streak} Streak</span>}
        </div>

        {/* Law citation */}
        <div style={{ background: 'rgba(78,205,196,.07)', border: '1px solid rgba(78,205,196,.18)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
          <p style={{ color: '#4ECDC4', fontSize: 11, fontWeight: 700, margin: 0 }}>📚 {q?.law}</p>
        </div>

        {/* Question */}
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '14px', marginBottom: 14 }}>
          <p style={{ color: '#fff', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{q?.q}</p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          {(q?.opts || []).map((opt, i) => {
            let bg = 'rgba(255,255,255,.05)';
            let border = '1px solid rgba(255,255,255,.1)';
            let col = '#fff';
            if (revealed) {
              if (i === q.ans) { bg = 'rgba(0,200,100,.12)'; border = '2px solid #00c864'; col = '#00c864'; }
              else if (i === selected && i !== q.ans) { bg = 'rgba(255,60,60,.12)'; border = '2px solid #ff4444'; col = '#ff8888'; }
              else { bg = 'rgba(255,255,255,.02)'; border = '1px solid rgba(255,255,255,.04)'; col = 'rgba(255,255,255,.3)'; }
            }
            return (
              <button key={i} className="btn" onClick={() => pick(i)} style={{ background: bg, border, borderRadius: 13, padding: '13px 15px', textAlign: 'left', color: col, fontSize: 13, fontWeight: 600 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: revealed && i === q.ans ? '#00c864' : revealed && i === selected ? '#ff4444' : 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: revealed && i === q.ans ? '#000' : revealed && i === selected ? '#fff' : 'rgba(255,255,255,.5)' }}>
                    {revealed && i === q.ans ? '✓' : revealed && i === selected && i !== q.ans ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <p style={{ flex: 1, margin: 0, lineHeight: 1.5 }}>{opt}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div style={{ background: selected === q.ans ? 'rgba(0,200,100,.08)' : 'rgba(255,60,60,.08)', border: `1.5px solid ${selected === q.ans ? '#00c864' : '#ff4444'}`, borderRadius: 14, padding: '14px', animation: 'pop .4s ease' }}>
            <p style={{ color: selected === q.ans ? '#00c864' : '#ff6666', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
              {selected === q.ans ? `✅ Correct! +${100 + streak * 20} pts` : '❌ Wrong — study this carefully'}
            </p>
            <p style={{ color: 'rgba(255,255,255,.82)', fontSize: 13, lineHeight: 1.65, marginBottom: 8 }}>{q.explanation}</p>
            <span style={{ background: 'rgba(78,205,196,.12)', color: '#4ECDC4', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(78,205,196,.28)' }}>
              📚 {q.law}
            </span>
          </div>
        )}
      </div>

      {/* Continue button */}
      {revealed && (
        <div style={{ padding: '10px 16px 24px', background: 'linear-gradient(to top,#050810,transparent)', flexShrink: 0 }}>
          <button className="btn" onClick={nextRound} style={{ width: '100%', padding: '15px', borderRadius: 99, fontSize: 15, fontFamily: 'Fraunces, serif', background: `linear-gradient(135deg,${miniGame.color}cc,${miniGame.color})`, color: roundIdx + 1 >= questions.length ? '#000' : '#fff', boxShadow: `0 6px 22px ${miniGame.color}44` }}>
            {roundIdx + 1 >= questions.length ? '🏁 See Results' : `Next Round ${roundIdx + 2}/${questions.length} →`}
          </button>
        </div>
      )}
    </div>
  );
}
