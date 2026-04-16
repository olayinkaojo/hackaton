import { useEffect, useRef } from 'react';

const COLORS = ['#FFE566', '#00c864', '#4ECDC4', '#FF6B35', '#A78BFA', '#fff', '#FF4444'];
const SHAPES = ['50%', '2px', '0'];

export default function ConfettiBurst({ active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    const particles = Array.from({ length: 70 }, () => {
      const el = document.createElement('div');
      const size = Math.random() * 9 + 4;
      el.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size * (Math.random() > 0.5 ? 1 : 2.5)}px;
        background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
        border-radius:${SHAPES[Math.floor(Math.random() * SHAPES.length)]};
        left:${Math.random() * 100}%;
        top:-12px;
        animation:confettiFall ${Math.random() * 1.8 + 0.8}s ease ${Math.random() * 0.6}s forwards;
        transform:rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(el);
      return el;
    });
    return () => particles.forEach(el => el.remove());
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 90 }}
    />
  );
}
