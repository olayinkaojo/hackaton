import { MINI_GAMES } from '../data/miniGames.js';

export default function MiniGamesScreen({ onSelect, onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,#050810,#0d0a1f)', overflow: 'hidden' }}>
      <div style={{ padding: '50px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn" onClick={onBack} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 18, flexShrink: 0 }}>←</button>
        <div>
          <p style={{ color: '#FFE566', fontSize: 11, fontWeight: 700, letterSpacing: 3, margin: 0 }}>ADVANCED GAMES</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: '#fff', margin: 0 }}>Mini-Game Hub 🎯</h2>
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, padding: '14px 16px 30px' }}>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 16 }}>
          In-depth games on specific compliance areas. Warning: these go deep.
        </p>
        {MINI_GAMES.map(mg => (
          <button
            key={mg.id}
            className="btn"
            onClick={() => onSelect(mg)}
            style={{
              width: '100%', marginBottom: 12, textAlign: 'left',
              background: `linear-gradient(135deg,${mg.bgGradient[0]},${mg.bgGradient[1]})`,
              border: `1.5px solid ${mg.color}33`, borderRadius: 18,
              padding: '16px', color: '#fff',
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ fontSize: 40, flexShrink: 0, animation: 'float 3s ease-in-out infinite' }}>{mg.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: 17, color: mg.color, fontWeight: 700, margin: 0 }}>{mg.title}</p>
                  <span style={{ background: `${mg.color}22`, color: mg.color, fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99, border: `1px solid ${mg.color}44` }}>
                    {mg.difficulty.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginBottom: 6, lineHeight: 1.4 }}>{mg.subtitle}</p>
                <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, lineHeight: 1.5 }}>{mg.desc}</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <span style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                    {mg.levels} rounds
                  </span>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 20 }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
