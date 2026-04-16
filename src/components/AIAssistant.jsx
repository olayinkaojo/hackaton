import { useEffect, useState } from 'react';
import { getComplianceAdvice, hasClaudeKey } from '../utils/claudeAPI.js';

export default function AIAssistant({ message, isWrong, onClose, question, law, career, subcategory }) {
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const themeColor = isWrong ? '#FF8888' : '#4ECDC4';
  const bgColor = isWrong ? 'rgba(255, 68, 68, 0.15)' : 'rgba(78, 205, 196, 0.15)';
  const glowColor = isWrong ? 'rgba(255,68,68,0.4)' : 'rgba(78,205,196,0.4)';

  useEffect(() => {
    setTimeout(() => setMounted(true), 10);

    async function fetchAdvice() {
      setIsTyping(true);
      setDisplayText('');

      const { text, live } = await getComplianceAdvice({
        question,
        isCorrect: !isWrong,
        law,
        tip: message,
        career,
        subcategory,
      });

      setIsLive(live);

      // Typewriter effect
      let i = 0;
      const chars = text.split('');
      const speed = live ? 22 : 14;
      const tick = () => {
        if (i < chars.length) {
          setDisplayText(chars.slice(0, i + 1).join(''));
          i++;
          setTimeout(tick, speed);
        } else {
          setIsTyping(false);
        }
      };
      tick();
    }

    fetchAdvice();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: mounted ? '80px' : '-220px',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '400px',
      background: 'rgba(8, 12, 24, 0.92)',
      backdropFilter: 'blur(16px)',
      border: `1.5px solid ${themeColor}66`,
      boxShadow: `0 8px 40px ${glowColor}, 0 0 0 1px ${themeColor}22`,
      borderRadius: '20px',
      padding: '16px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      transition: 'bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      zIndex: 100,
    }}>
      {/* Bot Avatar */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '14px',
        background: bgColor, border: `1.5px solid ${themeColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '26px', flexShrink: 0,
        animation: 'float 3s ease-in-out infinite',
        position: 'relative',
      }}>
        🤖
        {isTyping && (
          <div style={{
            position: 'absolute', bottom: -4, right: -4, width: 12, height: 12,
            borderRadius: '50%', background: themeColor,
            animation: 'pulse 1s ease-in-out infinite',
          }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ color: themeColor, fontSize: '11px', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
              CHIDI — AI ADVISOR
            </p>
            {isLive && (
              <span style={{ background: 'rgba(0,200,100,.15)', color: '#00c864', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99, border: '1px solid rgba(0,200,100,.3)', letterSpacing: 0.5 }}>
                LIVE
              </span>
            )}
          </div>
          <button onClick={() => { setMounted(false); setTimeout(onClose, 400); }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>
            ×
          </button>
        </div>

        {isTyping && !displayText ? (
          <div style={{ display: 'flex', gap: 5, padding: '6px 0' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: themeColor, animation: `pulse 1s ${i * 0.25}s ease-in-out infinite` }} />
            ))}
          </div>
        ) : (
          <p style={{ color: '#fff', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>
            {displayText}
            {isTyping && <span style={{ display: 'inline-block', width: 2, height: 14, background: themeColor, marginLeft: 2, animation: 'pulse .7s ease-in-out infinite', verticalAlign: 'middle' }} />}
          </p>
        )}
      </div>
    </div>
  );
}
