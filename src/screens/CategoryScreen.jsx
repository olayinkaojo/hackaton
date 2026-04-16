import { AVATAR_CATEGORIES } from '../data/avatars.js';

export default function CategoryScreen({ onSelect, onMiniGames }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,#050810,#0d0a1f)', overflow: 'hidden' }}>
      <div style={{ padding: '50px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
        <p style={{ color: '#4ECDC4', fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>WHO ARE YOU?</p>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: '#fff', marginBottom: 4 }}>Choose Your Career</h2>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Each career faces unique Nigerian compliance obligations</p>
      </div>

      <div className="scroll" style={{ flex: 1, padding: '14px 16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {AVATAR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="btn"
              onClick={() => onSelect(cat)}
              style={{
                background: cat.bgColor,
                border: `1.5px solid ${cat.color}33`,
                borderRadius: 18, padding: '18px 14px',
                textAlign: 'center', color: '#fff',
                transition: 'all .18s',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>{cat.emoji}</div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 700, color: cat.color, marginBottom: 4 }}>{cat.label}</p>
              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, lineHeight: 1.4 }}>{cat.desc}</p>
              <div style={{ marginTop: 10, background: cat.color, borderRadius: 99, padding: '4px 10px', display: 'inline-block' }}>
                <span style={{ color: '#000', fontSize: 10, fontWeight: 800 }}>{cat.subcategories.length} PATHS</span>
              </div>
            </button>
          ))}
        </div>

        {/* Mini-games portal */}
        <button
          className="btn"
          onClick={onMiniGames}
          style={{
            width: '100%', background: 'linear-gradient(135deg,rgba(255,229,102,.1),rgba(255,120,0,.1))',
            border: '1.5px solid rgba(255,184,0,.3)', borderRadius: 18, padding: '16px',
            textAlign: 'left', color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 36, animation: 'float 2.5s ease-in-out infinite' }}>🎯</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Fraunces, serif', color: '#FFE566', fontSize: 17, fontWeight: 700, marginBottom: 3 }}>Advanced Mini-Games</p>
              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12 }}>Deep-dive: Tax, Task Force, Accounting, CRM & more</p>
            </div>
            <span style={{ color: '#FFE566', fontSize: 20 }}>→</span>
          </div>
        </button>

        {/* 13 levels teaser */}
        <div style={{ marginTop: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>13-LEVEL JOURNEY AWAITS</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['🌱 Novice','🔍 Discovery','📚 Enthusiast','👔 Junior Pro','💪 Practitioner','✅ Compliant','🧠 Aware','🏆 Business Pro','🔐 Officer','💡 Specialist','🌟 Leader','🏅 Champion','👑 LEGEND'].map((l, i) => (
              <span key={i} style={{ background: i < 3 ? 'rgba(78,205,196,.15)' : i < 8 ? 'rgba(255,229,102,.1)' : 'rgba(255,184,0,.15)', border: `1px solid ${i < 3 ? '#4ECDC444' : i < 8 ? '#FFE56633' : '#FFB80044'}`, color: i < 3 ? '#4ECDC4' : i < 8 ? '#FFE566' : '#FFB800', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
