// src/components/AIAssistant.jsx
import { useEffect, useState } from 'react';

export default function AIAssistant({ message, isWrong, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to allow the slide-in animation
    setTimeout(() => setMounted(true), 10);
  }, []);

  const themeColor = isWrong ? '#FF8888' : '#4ECDC4';
  const bgColor = isWrong ? 'rgba(255, 68, 68, 0.15)' : 'rgba(78, 205, 196, 0.15)';
  const glowColor = isWrong ? 'rgba(255,68,68,0.4)' : 'rgba(78,205,196,0.4)';

  return (
    <div 
      style={{
        position: 'fixed',
        left: '50%',
        bottom: mounted ? '80px' : '-200px',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        border: `1.5px solid ${themeColor}66`,
        boxShadow: `0 8px 32px ${glowColor}`,
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        transition: 'bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 100,
      }}
    >
      {/* Bot Avatar */}
      <div 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: bgColor,
          border: `1px solid ${themeColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0,
          animation: 'float 3s ease-in-out infinite'
        }}
      >
        🤖
      </div>

      {/* Message */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <p style={{ color: themeColor, fontSize: '12px', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
            CLAUDE COMPLIANCE BOT
          </p>
          <button 
            onClick={() => {
              setMounted(false);
              setTimeout(onClose, 400); 
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'rgba(255,255,255,0.5)', 
              fontSize: '18px', 
              cursor: 'pointer',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
        <p style={{ color: '#fff', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
          {message}
        </p>
      </div>
    </div>
  );
}
