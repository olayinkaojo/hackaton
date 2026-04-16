import { useState, useEffect, useRef, useCallback } from 'react';
import { LEVELS, AVATAR_DRESS } from '../data/avatars.js';
import { LEVEL_QUESTIONS } from '../data/levels.js';
import { drawAvatar } from '../utils/drawAvatar.js';
import { drawObstacle } from '../utils/drawObstacle.js';
import { drawScene } from '../utils/drawScene.js';
import { playDing, playBuzz, playPop } from '../utils/audio.js';
import AIAssistant from '../components/AIAssistant.jsx';

const formatXP = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n;

export default function GameScreen({ category, subcategory, onBack }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const stateRef = useRef(null);

  const [gs, setGs] = useState({
    level: 1,
    xp: 0,
    lives: 3,
    streak: 0,
    dressTier: 1,
    obstacleProgress: 0,   // 0→100 to clear current obstacle
    obstaclesSolved: 0,
    avatarX: 0.12,         // fraction of canvas width
    phase: 'approach',     // approach | quiz | solved | levelComplete | gameOver | victory
    toast: null,
    levelXP: 0,            // xp earned this level
  });

  const gsRef = useRef(gs);
  gsRef.current = gs;

  const setGsSafe = useCallback((patch) => {
    setGs(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      gsRef.current = next;
      return next;
    });
  }, []);

  // ── QUIZ STATE ───────────────────────────────────────────────────────────────
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState({ selected: null, revealed: false });
  const [showLesson, setShowLesson] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);

  // ── CANVAS DRAW LOOP ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const GY = Math.floor(H * 0.72);  // ground Y

    const loop = () => {
      frameRef.current += 1;
      const frame = frameRef.current;
      const s = gsRef.current;
      const levelData = LEVELS[s.level - 1] || LEVELS[0];

      ctx.clearRect(0, 0, W, H);

      // Background scene
      drawScene(ctx, subcategory?.scene || 'market', W, H, GY, frame);

      // Obstacle
      const obstacleSolved = s.obstacleProgress >= 100;
      drawObstacle(ctx, levelData.obstacle, W, H, GY, frame, s.obstacleProgress / 100, obstacleSolved, levelData.obstacleLabel);

      // Avatar X position: walks toward obstacle, stops before it
      const targetX = obstacleSolved ? 0.7 : 0.22;
      const avatarX = s.phase === 'approach' || s.phase === 'quiz'
        ? (s.avatarX + (targetX - s.avatarX) * 0.02)
        : obstacleSolved ? Math.min(0.85, s.avatarX + 0.004) : s.avatarX;

      // Update avatarX in ref without triggering full re-render
      gsRef.current = { ...gsRef.current, avatarX };

      drawAvatar(
        ctx,
        W * avatarX,
        GY - 80,
        70,
        category?.id || 'business',
        subcategory?.id || 'trader',
        s.dressTier,
        frame,
      );

      // HUD
      drawHUD(ctx, W, H, s, levelData, frame);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [category, subcategory]);

  function drawHUD(ctx, W, H, s, levelData, frame) {
    // Top bar background
    ctx.fillStyle = 'rgba(5,8,16,0.88)';
    ctx.fillRect(0, 0, W, 56);

    // Level badge
    ctx.fillStyle = '#FFE566';
    ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`LV ${s.level}`, 14, 20);

    // Level title
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '10px DM Sans';
    ctx.fillText(levelData.title, 14, 36);

    // XP bar
    const xpBarW = W - 100;
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.beginPath(); ctx.roundRect(14, 44, xpBarW, 6, 3); ctx.fill();
    const xpFrac = Math.min(1, (s.xp % 300) / 300);
    const xpGrad = ctx.createLinearGradient(14, 0, 14 + xpBarW, 0);
    xpGrad.addColorStop(0, '#4ECDC4'); xpGrad.addColorStop(1, '#00c864');
    ctx.fillStyle = xpGrad;
    ctx.beginPath(); ctx.roundRect(14, 44, xpBarW * xpFrac, 6, 3); ctx.fill();

    // XP label
    ctx.fillStyle = '#4ECDC4'; ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'right';
    ctx.fillText(`⚡ ${formatXP(s.xp)}`, W - 14, 20);

    // Lives
    ctx.textAlign = 'right'; ctx.font = '14px serif';
    ctx.fillText(['❤️', '❤️❤️', '❤️❤️❤️'][s.lives - 1] || '💔', W - 14, 37);

    // Obstacle progress bar (bottom of canvas)
    const barH = 8;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, H - barH, W, barH);
    const barGrad = ctx.createLinearGradient(0, 0, W, 0);
    barGrad.addColorStop(0, '#FF6B35'); barGrad.addColorStop(1, '#FFE566');
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, H - barH, W * (s.obstacleProgress / 100), barH);

    // Obstacle progress label
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(`${levelData.obstacleLabel} — ${Math.round(s.obstacleProgress)}%`, W / 2, H - 10);

    // Streak indicator
    if (s.streak > 1) {
      ctx.fillStyle = '#FFE566'; ctx.font = 'bold 13px DM Sans';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`🔥 ${s.streak} Streak!`, W / 2, 58);
    }
  }

  // ── QUIZ TRIGGER ─────────────────────────────────────────────────────────────
  function openQuiz() {
    if (gs.phase === 'quiz' || showQuiz) return;
    playPop();
    setGsSafe({ phase: 'quiz' });
    setQuizState({ selected: null, revealed: false });
    setShowQuiz(true);
  }

  function handleAnswer(choiceIdx) {
    if (quizState.revealed) return;
    const levelData = LEVEL_QUESTIONS[gs.level];
    const catKey = category?.id || 'business';
    const correct = levelData.correctIndex[catKey];
    const isCorrect = choiceIdx === correct;

    setQuizState({ selected: choiceIdx, revealed: true, correct: isCorrect });

    if (isCorrect) {
      playDing();
      const xpGain = 80 + gs.level * 20 + gs.streak * 10;
      const newProgress = Math.min(100, gs.obstacleProgress + 34);
      const newStreak = gs.streak + 1;
      const newXP = gs.xp + xpGain;
      const newDress = Math.min(13, Math.floor(newXP / 300) + 1);

      setGsSafe(prev => ({
        ...prev,
        xp: newXP,
        streak: newStreak,
        dressTier: newDress,
        obstacleProgress: newProgress,
        levelXP: (prev.levelXP || 0) + xpGain,
        phase: newProgress >= 100 ? 'solved' : 'approach',
      }));

      setTimeout(() => {
        setShowQuiz(false);
        setShowAdvisor(false);
        if (newProgress >= 100) {
          setTimeout(() => setShowLevelUp(true), 600);
        }
      }, 2500);
    } else {
      playBuzz();
      setShowAdvisor(true);
      const newLives = gs.lives - 1;
      setGsSafe(prev => ({
        ...prev,
        lives: newLives,
        streak: 0,
        phase: newLives <= 0 ? 'gameOver' : 'approach',
      }));
      setTimeout(() => {
        setShowQuiz(false);
        setShowAdvisor(false);
        if (newLives <= 0) {
          setGsSafe({ phase: 'gameOver' });
        }
      }, 3500); // Give them time to read the AI advice
    }
  }

  function advanceLevel() {
    setShowLevelUp(false);
    if (gs.level >= 13) {
      setGsSafe({ phase: 'victory' });
      return;
    }
    setGsSafe(prev => ({
      ...prev,
      level: prev.level + 1,
      lives: Math.min(3, prev.lives + 1),
      obstacleProgress: 0,
      obstaclesSolved: prev.obstaclesSolved + 1,
      phase: 'approach',
      levelXP: 0,
      avatarX: 0.05,
    }));
  }

  // ── QUIZ DATA ────────────────────────────────────────────────────────────────
  const currentLevelQ = LEVEL_QUESTIONS[gs.level];
  const catKey = category?.id || 'business';
  const question = currentLevelQ?.questions[catKey];
  const options = currentLevelQ?.options[catKey] || [];
  const correctIdx = currentLevelQ?.correctIndex[catKey];
  const levelInfo = LEVELS[gs.level - 1] || LEVELS[0];

  // ── GAME OVER / VICTORY SCREENS ───────────────────────────────────────────────
  if (gs.phase === 'gameOver' || gs.phase === 'victory') {
    const won = gs.phase === 'victory';
    const grade = gs.xp > 3000 ? 'A' : gs.xp > 2000 ? 'B' : gs.xp > 1000 ? 'C' : 'D';
    const gradeColor = { A: '#00c864', B: '#4ECDC4', C: '#FFE566', D: '#FF8C00' }[grade];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#050810,#0d0a1f)', padding: '24px', animation: 'fadeIn .5s' }}>
        <div style={{ fontSize: 80, marginBottom: 14, animation: 'float 3s ease-in-out infinite' }}>{won ? '👑' : '💀'}</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 44, color: won ? '#FFE566' : '#FF4444', textAlign: 'center', marginBottom: 8 }}>{won ? 'LEGEND!' : 'Game Over'}</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, textAlign: 'center', marginBottom: 24, maxWidth: 300, lineHeight: 1.7 }}>
          {won ? `You conquered all 13 levels as a ${subcategory?.label}! You are a Nigerian Compliance Legend.` : `You reached Level ${gs.level} as a ${subcategory?.label}. Keep learning — compliance protects your business.`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, width: '100%', maxWidth: 340, marginBottom: 24 }}>
          {[
            { l: 'Grade', v: grade, c: gradeColor },
            { l: 'Level', v: `${gs.level}/13`, c: '#4ECDC4' },
            { l: 'XP', v: formatXP(gs.xp), c: '#A78BFA' },
            { l: 'Streak', v: gs.streak, c: '#FFE566' },
            { l: 'Obstacles', v: gs.obstaclesSolved, c: '#FF6B35' },
            { l: 'Dress', v: `T${gs.dressTier}`, c: '#95D44A' },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '11px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: s.c }}>{s.v}</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn" onClick={onBack} style={{ padding: '15px 44px', background: 'linear-gradient(135deg,#008751,#00c46b)', color: '#fff', borderRadius: 99, fontSize: 16, fontFamily: 'Fraunces, serif', boxShadow: '0 8px 26px rgba(0,135,81,.4)' }}>
            Play Again 🔄
          </button>
          {won && (
            <button className="btn" onClick={() => window.print()} style={{ padding: '15px 44px', background: 'rgba(255,255,255,.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,.4)', borderRadius: 99, fontSize: 16, fontFamily: 'Fraunces, serif' }}>
               Download Certificate 🎓
            </button>
          )}
        </div>

        {won && (
          <div id="certificate" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#000', padding: '40px', border: '10px solid #008751', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '48px', color: '#008751', marginBottom: '20px' }}>Certificate of Compliance</h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', marginBottom: '30px' }}>This certifies that</p>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', marginBottom: '30px', borderBottom: '2px solid #000', display: 'inline-block', paddingBottom: '10px', color: '#000' }}>Nigerian Professional</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', marginBottom: '40px' }}>has successfully completed all 13 levels as a {subcategory?.label} and demonstrated mastery of Nigerian Business Regulations.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '40px', fontFamily: 'DM Sans, sans-serif' }}>
              <div style={{ borderTop: '2px solid #000', paddingTop: '10px', fontWeight: 'bold' }}>ComplyNG System</div>
              <div style={{ borderTop: '2px solid #000', paddingTop: '10px', fontWeight: 'bold' }}>Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050810', position: 'relative', overflow: 'hidden' }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={430}
        height={380}
        style={{ width: '100%', height: 'auto', flexShrink: 0 }}
      />

      {/* Bottom panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px 20px', background: 'linear-gradient(to bottom,#0a0e1a,#050810)', borderTop: '1px solid rgba(255,255,255,.07)', overflow: 'hidden' }}>
        {/* Level info */}
        <div style={{ marginBottom: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <span style={{ color: '#FFE566', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>LV {gs.level} — {levelInfo.title}</span>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 2 }}>{levelInfo.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: category?.color || '#4ECDC4', fontSize: 12, fontWeight: 700 }}>{subcategory?.emoji} {subcategory?.label}</p>
              <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 10 }}>Tier {gs.dressTier} dress</p>
            </div>
          </div>
        </div>

        {/* Law citation */}
        <div style={{ background: 'rgba(78,205,196,.08)', border: '1px solid rgba(78,205,196,.2)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, flexShrink: 0 }}>
          <p style={{ color: '#4ECDC4', fontSize: 11, fontWeight: 700 }}>📚 {currentLevelQ?.law}</p>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 11, marginTop: 2, lineHeight: 1.5 }}>{currentLevelQ?.lesson?.slice(0, 100)}...</p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button className="btn" onClick={onBack} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 18, flexShrink: 0 }}>←</button>
          <button
            className="btn"
            onClick={openQuiz}
            disabled={gs.obstacleProgress >= 100}
            style={{
              flex: 1, padding: '12px', borderRadius: 99, fontSize: 15,
              fontFamily: 'Fraunces, serif',
              background: gs.obstacleProgress >= 100
                ? 'rgba(0,200,100,.15)'
                : 'linear-gradient(135deg,#FF6B35,#FFB800)',
              color: '#fff',
              boxShadow: gs.obstacleProgress < 100 ? '0 5px 20px rgba(255,107,53,.4)' : 'none',
            }}
          >
            {gs.obstacleProgress >= 100 ? '✅ Obstacle Cleared!' : `⚡ Answer to Progress (${Math.round(gs.obstacleProgress)}%)`}
          </button>
          <button className="btn" onClick={() => setShowLesson(true)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.3)', color: '#A78BFA', fontSize: 18, flexShrink: 0 }}>📖</button>
        </div>

        {gs.obstacleProgress >= 100 && (
          <button
            className="btn"
            onClick={advanceLevel}
            style={{ marginTop: 10, width: '100%', padding: '14px', borderRadius: 99, fontSize: 16, fontFamily: 'Fraunces, serif', background: 'linear-gradient(135deg,#008751,#00c46b)', color: '#fff', boxShadow: '0 6px 22px rgba(0,135,81,.4)', animation: 'bounce 1.5s ease-in-out infinite' }}
          >
            {gs.level >= 13 ? '🏆 Claim Legend Status!' : `Next Level: ${LEVELS[gs.level]?.title || 'Victory'} →`}
          </button>
        )}
      </div>

      {/* ── QUIZ MODAL ── */}
      {showQuiz && currentLevelQ && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.92)', display: 'flex', flexDirection: 'column', animation: 'slideUp .3s ease', zIndex: 50 }}>
          <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ background: 'rgba(255,107,53,.2)', color: '#FF6B35', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,107,53,.4)', letterSpacing: 1 }}>
                LEVEL {gs.level} — {currentLevelQ.topic?.toUpperCase()}
              </span>
              <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 11 }}>
                {'❤️'.repeat(gs.lives)}
              </span>
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 19, color: '#fff', lineHeight: 1.4 }}>
              {question}
            </h3>
          </div>

          <div className="scroll" style={{ flex: 1, padding: '14px 16px 30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {options.map((opt, i) => {
                let bg = 'rgba(255,255,255,.05)';
                let border = '1px solid rgba(255,255,255,.1)';
                let col = '#fff';
                if (quizState.revealed) {
                  if (i === correctIdx) { bg = 'rgba(0,200,100,.12)'; border = '2px solid #00c864'; col = '#00c864'; }
                  else if (i === quizState.selected) { bg = 'rgba(255,60,60,.12)'; border = '2px solid #ff4444'; col = '#ff8888'; }
                  else { bg = 'rgba(255,255,255,.02)'; border = '1px solid rgba(255,255,255,.05)'; col = 'rgba(255,255,255,.3)'; }
                }
                return (
                  <button key={i} className="btn" onClick={() => handleAnswer(i)} style={{ background: bg, border, borderRadius: 14, padding: '13px 16px', textAlign: 'left', color: col, fontSize: 13, fontWeight: 600 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: quizState.revealed && i === correctIdx ? '#00c864' : quizState.revealed && i === quizState.selected ? '#ff4444' : 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: quizState.revealed && i === correctIdx ? '#000' : quizState.revealed && i === quizState.selected ? '#fff' : 'rgba(255,255,255,.5)' }}>
                        {quizState.revealed && i === correctIdx ? '✓' : quizState.revealed && i === quizState.selected ? '✗' : String.fromCharCode(65 + i)}
                      </span>
                      <p style={{ flex: 1, margin: 0, lineHeight: 1.5 }}>{opt}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {quizState.revealed && (
              <div style={{ marginTop: 14, background: quizState.correct ? 'rgba(0,200,100,.1)' : 'rgba(255,60,60,.1)', border: `1.5px solid ${quizState.correct ? '#00c864' : '#ff4444'}`, borderRadius: 16, padding: '14px', animation: 'pop .4s ease' }}>
                <p style={{ color: quizState.correct ? '#00c864' : '#ff6666', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                  {quizState.correct ? '✅ Correct! Obstacle progress +34%' : '❌ Wrong — life lost'}
                </p>
                <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
                  {currentLevelQ.tip}
                </p>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(78,205,196,.12)', color: '#4ECDC4', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(78,205,196,.28)' }}>
                    📚 {currentLevelQ.law}
                  </span>
                  {quizState.correct && (
                    <span style={{ background: 'rgba(167,139,250,.12)', color: '#A78BFA', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(167,139,250,.28)' }}>
                      ⚡ +{80 + gs.level * 20 + gs.streak * 10} XP
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LESSON MODAL ── */}
      {showLesson && currentLevelQ && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.95)', display: 'flex', flexDirection: 'column', zIndex: 60, animation: 'slideUp .3s ease' }}>
          <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <p style={{ color: '#A78BFA', fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: 0 }}>LEVEL {gs.level} — LEARN</p>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#fff', margin: 0 }}>{currentLevelQ.topic}</h3>
            </div>
            <button className="btn" onClick={() => setShowLesson(false)} style={{ background: 'rgba(255,255,255,.1)', color: '#fff', width: 36, height: 36, borderRadius: '50%', fontSize: 18 }}>×</button>
          </div>
          <div className="scroll" style={{ flex: 1, padding: '16px' }}>
            <div style={{ background: 'rgba(78,205,196,.08)', border: '1px solid rgba(78,205,196,.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
              <p style={{ color: '#4ECDC4', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📚 Law Citation</p>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{currentLevelQ.law}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
              <p style={{ color: '#fff', fontSize: 14, lineHeight: 1.75 }}>{currentLevelQ.lesson}</p>
            </div>
            <div style={{ background: 'rgba(255,229,102,.08)', border: '1px solid rgba(255,229,102,.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
              <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💡 Pro Tip</p>
              <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 13, lineHeight: 1.65 }}>{currentLevelQ.tip}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '14px 16px' }}>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>YOUR QUESTION ({subcategory?.label?.toUpperCase()})</p>
              <p style={{ color: '#fff', fontSize: 13, lineHeight: 1.65 }}>{question}</p>
            </div>
          </div>
          <div style={{ padding: '12px 16px 26px', background: 'rgba(0,0,0,.4)', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <button className="btn" onClick={() => { setShowLesson(false); openQuiz(); }} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg,#FF6B35,#FFB800)', color: '#fff', borderRadius: 99, fontSize: 15, fontFamily: 'Fraunces, serif' }}>
              Ready — Take the Quiz! ⚡
            </button>
          </div>
        </div>
      )}

      {/* ── LEVEL UP MODAL ── */}
      {showLevelUp && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 24, animation: 'fadeIn .4s ease' }}>
          <div style={{ fontSize: 70, marginBottom: 12, animation: 'bounce 1s ease-in-out infinite' }}>🎉</div>
          <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>LEVEL COMPLETE!</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 38, color: '#fff', textAlign: 'center', marginBottom: 8 }}>{levelInfo.title} ✅</h2>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 13, textAlign: 'center', marginBottom: 6, lineHeight: 1.65 }}>
            Obstacle cleared: <strong style={{ color: '#4ECDC4' }}>{levelInfo.obstacleLabel}</strong>
          </p>

          {/* Dress upgrade */}
          {gs.level < 13 && (
            <div style={{ background: 'rgba(255,229,102,.08)', border: '1.5px solid rgba(255,229,102,.3)', borderRadius: 16, padding: '14px 20px', marginBottom: 20, textAlign: 'center', width: '100%', maxWidth: 320 }}>
              <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>👔 AVATAR UPGRADED!</p>
              <p style={{ color: '#fff', fontSize: 14 }}>Level {gs.level + 1}: <strong style={{ color: '#FFE566' }}>{LEVELS[gs.level]?.dress}</strong></p>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 4 }}>New title: {LEVELS[gs.level]?.title} {LEVELS[gs.level]?.emoji}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={{ textAlign: 'center', background: 'rgba(78,205,196,.1)', border: '1px solid rgba(78,205,196,.2)', borderRadius: 14, padding: '12px 18px' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#4ECDC4', margin: 0 }}>+{gs.levelXP || 0}</p>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>XP this level</p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,229,102,.1)', border: '1px solid rgba(255,229,102,.2)', borderRadius: 14, padding: '12px 18px' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#FFE566', margin: 0 }}>{gs.level}/13</p>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>Levels done</p>
            </div>
          </div>

          <button className="btn" onClick={advanceLevel} style={{ width: '100%', maxWidth: 320, padding: '16px', background: 'linear-gradient(135deg,#008751,#00c46b)', color: '#fff', borderRadius: 99, fontSize: 16, fontFamily: 'Fraunces, serif', boxShadow: '0 8px 26px rgba(0,135,81,.4)' }}>
            {gs.level >= 13 ? '🏆 Claim Legend Status!' : `Enter Level ${gs.level + 1}: ${LEVELS[gs.level]?.title || ''} →`}
          </button>
        </div>
      )}

      {/* ── AI ADVISOR MODAL ── */}
      {showAdvisor && currentLevelQ && (
        <AIAssistant 
          message={currentLevelQ.tip + (!quizState.correct ? " Let's review " + currentLevelQ.law + "." : "")}
          isWrong={!quizState.correct}
          onClose={() => setShowAdvisor(false)} 
        />
      )}
    </div>
  );
}
