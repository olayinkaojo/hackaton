import { useState, useEffect, useRef, useCallback } from 'react';
import { LEVELS, AVATAR_DRESS } from '../data/avatars.js';
import { LEVEL_QUESTIONS } from '../data/levels.js';
import { drawAvatar } from '../utils/drawAvatar.js';
import { drawObstacle } from '../utils/drawObstacle.js';
import { drawScene } from '../utils/drawScene.js';
import { playDing, playBuzz, playPop } from '../utils/audio.js';
import AIAssistant from '../components/AIAssistant.jsx';
import XPBurst from '../components/XPBurst.jsx';
import AchievementToast from '../components/AchievementToast.jsx';
import ConfettiBurst from '../components/ConfettiBurst.jsx';
import QuizTimer from '../components/QuizTimer.jsx';
import ShareButton from '../components/ShareButton.jsx';
import ComplianceCard from '../components/ComplianceCard.jsx';

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92; u.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const pref = voices.find(v => v.lang === 'en-NG')
    || voices.find(v => v.lang === 'en-GB')
    || voices.find(v => v.lang.startsWith('en'));
  if (pref) u.voice = pref;
  window.speechSynthesis.speak(u);
}

const formatXP = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n;

const FUN_FACTS = [
  '🇳🇬 Did you know? Nigeria has over 900 business-related laws and regulations!',
  '💰 The FIRS collected ₦12.37 trillion in taxes in 2023 — compliance matters!',
  '📊 Over 70% of Nigerian SMEs are unregistered, missing out on legal protections.',
  '⚖️ CAMA 2020 allows single-member companies — one person can own a full Ltd!',
  '🔒 The NDPA 2023 mirrors GDPR — your customers\' data is legally protected.',
  '🏭 NAFDAC can shut down any business selling unapproved products in Nigeria.',
  '💳 CBN regulations require all businesses handling ₦500k+ daily to have BVN.',
  '📝 Failing to register with CAC attracts penalties up to ₦10,000 daily!',
  '🏥 The ECA 2003 makes employers liable for workplace accidents — insure your staff.',
  '🚀 A registered Nigerian startup can access ₦75M in BOI intervention funds.',
];

export default function GameScreen({ category, subcategory, onBack }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const stateRef = useRef(null);
  const quizOpenTime = useRef(null);
  const unlockedAchievements = useRef(new Set());
  const taxCorrect = useRef(0);

  const [voiceOn, setVoiceOn] = useState(false);
  const [gs, setGs] = useState({
    level: 1,
    xp: 0,
    lives: 3,
    streak: 0,
    dressTier: 1,
    obstacleProgress: 0,
    obstaclesSolved: 0,
    avatarX: 0.12,
    phase: 'approach',
    toast: null,
    levelXP: 0,
    totalCorrect: 0,
    compliance: { registration: 10, tax: 10, employment: 10, data: 10, licences: 10 },
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

  // ── QUIZ + MODAL STATE ───────────────────────────────────────────────────────
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState({ selected: null, revealed: false });
  const [showLesson, setShowLesson] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);

  // ── GAMIFICATION STATE ───────────────────────────────────────────────────────
  const [xpBurst, setXpBurst] = useState(null);           // { amount, combo, timeBonus }
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(12);
  const [quizPhase, setQuizPhase] = useState('fact'); // 'fact' | 'question'
  const [funFact, setFunFact] = useState('');

  // Process achievement queue
  useEffect(() => {
    if (!activeAchievement && achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setActiveAchievement(next);
      setAchievementQueue(rest);
    }
  }, [activeAchievement, achievementQueue]);

  function queueAchievement(key) {
    if (unlockedAchievements.current.has(key)) return;
    unlockedAchievements.current.add(key);
    setAchievementQueue(q => [...q, key]);
  }

  // ── CANVAS DRAW LOOP ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const GY = Math.floor(H * 0.72);

    const loop = () => {
      frameRef.current += 1;
      const frame = frameRef.current;
      const s = gsRef.current;
      const levelData = LEVELS[s.level - 1] || LEVELS[0];

      ctx.clearRect(0, 0, W, H);
      drawScene(ctx, subcategory?.scene || 'market', W, H, GY, frame);

      const obstacleSolved = s.obstacleProgress >= 100;
      drawObstacle(ctx, levelData.obstacle, W, H, GY, frame, s.obstacleProgress / 100, obstacleSolved, levelData.obstacleLabel);

      const targetX = obstacleSolved ? 0.7 : 0.22;
      const avatarX = s.phase === 'approach' || s.phase === 'quiz'
        ? (s.avatarX + (targetX - s.avatarX) * 0.02)
        : obstacleSolved ? Math.min(0.85, s.avatarX + 0.004) : s.avatarX;

      gsRef.current = { ...gsRef.current, avatarX };

      drawAvatar(ctx, W * avatarX, GY - 80, 70, category?.id || 'business', subcategory?.id || 'trader', s.dressTier, frame);
      drawHUD(ctx, W, H, s, levelData, frame);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [category, subcategory]);

  function drawHUD(ctx, W, H, s, levelData, frame) {
    ctx.fillStyle = 'rgba(5,8,16,0.88)';
    ctx.fillRect(0, 0, W, 56);

    ctx.fillStyle = '#FFE566';
    ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`LV ${s.level}`, 14, 20);

    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '10px DM Sans';
    ctx.fillText(levelData.title, 14, 36);

    const xpBarW = W - 100;
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.beginPath(); ctx.roundRect(14, 44, xpBarW, 6, 3); ctx.fill();
    const xpFrac = Math.min(1, (s.xp % 300) / 300);
    const xpGrad = ctx.createLinearGradient(14, 0, 14 + xpBarW, 0);
    xpGrad.addColorStop(0, '#4ECDC4'); xpGrad.addColorStop(1, '#00c864');
    ctx.fillStyle = xpGrad;
    ctx.beginPath(); ctx.roundRect(14, 44, xpBarW * xpFrac, 6, 3); ctx.fill();

    ctx.fillStyle = '#4ECDC4'; ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'right';
    ctx.fillText(`⚡ ${formatXP(s.xp)}`, W - 14, 20);

    ctx.textAlign = 'right'; ctx.font = '14px serif';
    ctx.fillText(['❤️', '❤️❤️', '❤️❤️❤️'][s.lives - 1] || '💔', W - 14, 37);

    const barH = 8;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, H - barH, W, barH);
    const barGrad = ctx.createLinearGradient(0, 0, W, 0);
    barGrad.addColorStop(0, '#FF6B35'); barGrad.addColorStop(1, '#FFE566');
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, H - barH, W * (s.obstacleProgress / 100), barH);

    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(`${levelData.obstacleLabel} — ${Math.round(s.obstacleProgress)}%`, W / 2, H - 10);

    if (s.streak > 1) {
      const comboColor = s.streak >= 10 ? '#FF4444' : s.streak >= 5 ? '#FF6B35' : '#FFE566';
      ctx.fillStyle = comboColor; ctx.font = 'bold 13px DM Sans';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`🔥 ${s.streak}× Combo!`, W / 2, 58);
    }
  }

  // ── QUIZ TRIGGER ─────────────────────────────────────────────────────────────
  function openQuiz() {
    if (gs.phase === 'quiz' || showQuiz) return;
    playPop();
    setGsSafe({ phase: 'quiz' });
    setQuizState({ selected: null, revealed: false });
    setFunFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    setQuizPhase('fact');
    setShowQuiz(true);
    setTimerActive(false);
    quizOpenTime.current = null;

    // Show fact for 2.2s then reveal question
    setTimeout(() => {
      setQuizPhase('question');
      setTimerActive(true);
      quizOpenTime.current = Date.now();
      if (voiceOn && question) speak(question);
    }, 2200);
  }

  function handleAnswer(choiceIdx) {
    if (quizState.revealed) return;
    if (quizPhase === 'fact') return;

    const levelData = LEVEL_QUESTIONS[gs.level];
    const catKey = category?.id || 'business';
    const correct = levelData.correctIndex[catKey];
    const isCorrect = choiceIdx === correct;

    setTimerActive(false);
    const elapsedSec = quizOpenTime.current ? (Date.now() - quizOpenTime.current) / 1000 : 99;

    setQuizState({ selected: choiceIdx, revealed: true, correct: isCorrect });

    if (isCorrect) {
      playDing();

      // XP calculation with combo multiplier + speed bonus
      const combo = gs.streak + 1;
      const multiplier = combo >= 10 ? 3 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1;
      const baseXP = 80 + gs.level * 20;
      const timeBonus = elapsedSec < 3 ? 50 : elapsedSec < 5 ? 25 : 0;
      const xpGain = Math.round(baseXP * multiplier) + timeBonus;

      const newProgress = Math.min(100, gs.obstacleProgress + 34);
      const newXP = gs.xp + xpGain;
      const newDress = Math.min(13, Math.floor(newXP / 300) + 1);
      const newTotalCorrect = gs.totalCorrect + 1;
      const newLives = gs.lives;

      // Compliance category update
      const law = currentLevelQ?.law || '';
      setGsSafe(prev => {
        const comp = { ...prev.compliance };
        if (/CAMA|CAC/i.test(law))                       comp.registration = Math.min(100, comp.registration + 6);
        if (/PITA|FIRS|VAT|CITA|LIRS|Finance Act/i.test(law)) comp.tax = Math.min(100, comp.tax + 6);
        if (/PENCOM|ECA|PRA|ITF|PAYE|Labour/i.test(law)) comp.employment = Math.min(100, comp.employment + 6);
        if (/NDPA|NDPC|data|privacy/i.test(law))         comp.data = Math.min(100, comp.data + 6);
        if (/NAFDAC|CBN|SON|FCCPC|NCC|SEC/i.test(law))  comp.licences = Math.min(100, comp.licences + 6);
        return {
          ...prev,
          xp: newXP,
          streak: combo,
          dressTier: newDress,
          obstacleProgress: newProgress,
          levelXP: (prev.levelXP || 0) + xpGain,
          phase: newProgress >= 100 ? 'solved' : 'approach',
          totalCorrect: newTotalCorrect,
          compliance: comp,
        };
      });

      // XP burst animation
      setXpBurst({ amount: xpGain, combo, timeBonus });

      // Check achievements
      if (newTotalCorrect === 1) queueAchievement('first_correct');
      if (elapsedSec < 3) queueAchievement('quick_draw');
      if (combo === 3) queueAchievement('streak_3');
      if (combo === 5) queueAchievement('streak_5');
      if (combo === 10) queueAchievement('streak_10');

      // Tax master tracking
      if (currentLevelQ?.law?.match(/PITA|FIRS|VAT|CITA|PAYE|tax/i)) {
        taxCorrect.current += 1;
        if (taxCorrect.current >= 3) queueAchievement('tax_master');
      }

      // Night owl (after 10pm)
      if (new Date().getHours() >= 22) queueAchievement('night_owl');

      // Perfect level check (will check on level advance)
      setTimeout(() => {
        setShowQuiz(false);
        setShowAdvisor(false);
        if (newProgress >= 100) {
          setTimeout(() => {
            setShowConfetti(true);
            setShowLevelUp(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }, 600);
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
        if (newLives <= 0) setGsSafe({ phase: 'gameOver' });
      }, 3500);
    }
  }

  // Timer ran out — auto-wrong
  function handleTimerOut() {
    if (quizState.revealed) return;
    playBuzz();
    const levelData = LEVEL_QUESTIONS[gs.level];
    const catKey = category?.id || 'business';
    const correctIdx = levelData.correctIndex[catKey];
    setQuizState({ selected: -1, revealed: true, correct: false, timedOut: true });
    const newLives = gs.lives - 1;
    setGsSafe(prev => ({ ...prev, lives: newLives, streak: 0, phase: newLives <= 0 ? 'gameOver' : 'approach' }));
    setTimeout(() => {
      setShowQuiz(false);
      if (newLives <= 0) setGsSafe({ phase: 'gameOver' });
    }, 3000);
  }

  function advanceLevel() {
    setShowLevelUp(false);
    // Perfect level achievement: started with 3 lives, still have 3
    if (gs.lives === 3) queueAchievement('perfect_level');

    if (gs.level >= 13) {
      setGsSafe({ phase: 'victory' });
      return;
    }

    const nextLevel = gs.level + 1;
    if (nextLevel === 3) queueAchievement('level_3');
    if (nextLevel === 5) queueAchievement('level_5');
    if (nextLevel === 10) queueAchievement('level_10');

    setGsSafe(prev => ({
      ...prev,
      level: nextLevel,
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#050810,#0d0a1f)', padding: '24px', animation: 'fadeIn .5s', position: 'relative', overflow: 'hidden' }}>
        {won && <ConfettiBurst active={true} />}
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
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: 320 }}>
          <ShareButton xp={gs.xp} level={gs.level} career={category?.label} subcategory={subcategory} />
          <ComplianceCard
            xp={gs.xp} level={gs.level}
            career={category} subcategory={subcategory}
            compliance={gs.compliance}
            achievementCount={unlockedAchievements.current.size}
          />
          <button className="btn" onClick={onBack} style={{ padding: '14px', background: 'linear-gradient(135deg,#008751,#00c46b)', color: '#fff', borderRadius: 99, fontSize: 16, fontFamily: 'Fraunces, serif', boxShadow: '0 8px 26px rgba(0,135,81,.4)' }}>
            Play Again 🔄
          </button>
          {won && (
            <button className="btn" onClick={() => window.print()} style={{ padding: '14px', background: 'rgba(255,255,255,.08)', color: '#A78BFA', border: '1px solid rgba(167,139,250,.4)', borderRadius: 99, fontSize: 15, fontFamily: 'Fraunces, serif' }}>
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
      <canvas ref={canvasRef} width={430} height={380} style={{ width: '100%', height: 'auto', flexShrink: 0 }} />

      {/* Floating XP burst */}
      {xpBurst && (
        <XPBurst
          amount={xpBurst.amount}
          combo={xpBurst.combo}
          timeBonus={xpBurst.timeBonus}
          onDone={() => setXpBurst(null)}
        />
      )}

      {/* Achievement toast */}
      {activeAchievement && (
        <AchievementToast
          achievementKey={activeAchievement}
          onDone={() => setActiveAchievement(null)}
        />
      )}

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
          <button className="btn" onClick={() => { setVoiceOn(v => !v); }} title={voiceOn ? 'Mute voice' : 'Enable voice reading'}
            style={{ width: 44, height: 44, borderRadius: '50%', background: voiceOn ? 'rgba(255,229,102,.2)' : 'rgba(255,255,255,.05)', border: `1px solid ${voiceOn ? 'rgba(255,229,102,.5)' : 'rgba(255,255,255,.1)'}`, color: voiceOn ? '#FFE566' : 'rgba(255,255,255,.4)', fontSize: 18, flexShrink: 0 }}>
            {voiceOn ? '🔊' : '🔇'}
          </button>
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
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.94)', display: 'flex', flexDirection: 'column', animation: 'slideUp .3s ease', zIndex: 50 }}>

          {/* Fun Fact intro screen */}
          {quizPhase === 'fact' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, animation: 'factReveal .4s ease' }}>
              <div style={{ fontSize: 52, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>💡</div>
              <p style={{ color: '#FFE566', fontSize: 11, fontWeight: 800, letterSpacing: 3, marginBottom: 12 }}>DID YOU KNOW?</p>
              <p style={{ color: '#fff', fontSize: 17, fontFamily: 'Fraunces, serif', textAlign: 'center', lineHeight: 1.6, maxWidth: 320 }}>
                {funFact}
              </p>
              <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 24, letterSpacing: 1 }}>
                Get ready for your question...
              </p>
              {/* Loading dots */}
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ECDC4', animation: `pulse 1.2s ${i * 0.3}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Actual question */}
          {quizPhase === 'question' && (
            <>
              <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ background: 'rgba(255,107,53,.2)', color: '#FF6B35', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,107,53,.4)', letterSpacing: 1 }}>
                    LEVEL {gs.level} — {currentLevelQ.topic?.toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {gs.streak >= 3 && (
                      <span style={{ background: 'rgba(255,107,53,.15)', color: '#FF6B35', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>
                        🔥 {gs.streak}×
                      </span>
                    )}
                    <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>{'❤️'.repeat(gs.lives)}</span>
                  </div>
                </div>

                {/* Timer */}
                {!quizState.revealed && (
                  <div style={{ marginBottom: 10 }}>
                    <QuizTimer
                      active={timerActive && !quizState.revealed}
                      onTimeout={handleTimerOut}
                      onTick={t => setCurrentTime(t)}
                    />
                  </div>
                )}

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
                    let scale = '1';
                    if (quizState.revealed) {
                      if (i === correctIdx) { bg = 'rgba(0,200,100,.12)'; border = '2px solid #00c864'; col = '#00c864'; scale = i === correctIdx ? '1.02' : '1'; }
                      else if (i === quizState.selected) { bg = 'rgba(255,60,60,.12)'; border = '2px solid #ff4444'; col = '#ff8888'; }
                      else { bg = 'rgba(255,255,255,.02)'; border = '1px solid rgba(255,255,255,.05)'; col = 'rgba(255,255,255,.3)'; }
                    }
                    return (
                      <button key={i} className="btn" onClick={() => handleAnswer(i)}
                        style={{ background: bg, border, borderRadius: 14, padding: '13px 16px', textAlign: 'left', color: col, fontSize: 13, fontWeight: 600, transform: `scale(${scale})`, transition: 'all .2s' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: quizState.revealed && i === correctIdx ? '#00c864' : quizState.revealed && i === quizState.selected ? '#ff4444' : 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: quizState.revealed && i === correctIdx ? '#000' : quizState.revealed && i === quizState.selected ? '#fff' : 'rgba(255,255,255,.5)', transition: 'all .3s' }}>
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
                    {quizState.timedOut ? (
                      <p style={{ color: '#FF6B35', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                        ⏰ Time's up! Life lost
                      </p>
                    ) : (
                      <p style={{ color: quizState.correct ? '#00c864' : '#ff6666', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                        {quizState.correct ? '✅ Correct! Obstacle progress +34%' : '❌ Wrong — life lost'}
                      </p>
                    )}
                    <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>
                      {currentLevelQ.tip}
                    </p>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(78,205,196,.12)', color: '#4ECDC4', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(78,205,196,.28)' }}>
                        📚 {currentLevelQ.law}
                      </span>
                      {quizState.correct && (
                        <span style={{ background: 'rgba(167,139,250,.12)', color: '#A78BFA', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(167,139,250,.28)', animation: 'pop .4s ease' }}>
                          ⚡ +{Math.round((80 + gs.level * 20) * (gs.streak >= 10 ? 3 : gs.streak >= 5 ? 2 : gs.streak >= 3 ? 1.5 : 1))} XP
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
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
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 24, animation: 'fadeIn .4s ease', overflow: 'hidden' }}>
          <ConfettiBurst active={showConfetti} />
          <div style={{ fontSize: 70, marginBottom: 12, animation: 'bounce 1s ease-in-out infinite' }}>🎉</div>
          <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>LEVEL COMPLETE!</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 38, color: '#fff', textAlign: 'center', marginBottom: 8 }}>{levelInfo.title} ✅</h2>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 13, textAlign: 'center', marginBottom: 6, lineHeight: 1.65 }}>
            Obstacle cleared: <strong style={{ color: '#4ECDC4' }}>{levelInfo.obstacleLabel}</strong>
          </p>

          {gs.level < 13 && (
            <div style={{ background: 'rgba(255,229,102,.08)', border: '1.5px solid rgba(255,229,102,.3)', borderRadius: 16, padding: '14px 20px', marginBottom: 20, textAlign: 'center', width: '100%', maxWidth: 320 }}>
              <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>👔 AVATAR UPGRADED!</p>
              <p style={{ color: '#fff', fontSize: 14 }}>Level {gs.level + 1}: <strong style={{ color: '#FFE566' }}>{LEVELS[gs.level]?.dress}</strong></p>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 4 }}>New title: {LEVELS[gs.level]?.title} {LEVELS[gs.level]?.emoji}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={{ textAlign: 'center', background: 'rgba(78,205,196,.1)', border: '1px solid rgba(78,205,196,.2)', borderRadius: 14, padding: '12px 18px' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#4ECDC4', margin: 0, animation: 'pop .5s ease' }}>+{gs.levelXP || 0}</p>
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
          message={currentLevelQ.tip}
          isWrong={!quizState.correct}
          question={question}
          law={currentLevelQ.law}
          career={category?.label}
          subcategory={subcategory?.label}
          onClose={() => setShowAdvisor(false)}
        />
      )}
    </div>
  );
}
