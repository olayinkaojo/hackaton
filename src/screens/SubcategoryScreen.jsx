export default function SubcategoryScreen({ category, onSelect, onBack }) {
  if (!category) return null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,#050810,#0d0a1f)', overflow: 'hidden' }}>
      <div style={{ padding: '50px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn" onClick={onBack} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 18, flexShrink: 0 }}>←</button>
        <div>
          <p style={{ color: category.color, fontSize: 11, fontWeight: 700, letterSpacing: 3, margin: 0 }}>{category.emoji} {category.label.toUpperCase()}</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#fff', margin: 0 }}>Choose Your Specialty</h2>
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, padding: '14px 16px 30px' }}>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginBottom: 14 }}>Your avatar and questions will be tailored to your trade</p>
        {category.subcategories.map(sub => (
          <button
            key={sub.id}
            className="btn"
            onClick={() => onSelect(sub)}
            style={{
              width: '100%', marginBottom: 10, textAlign: 'left',
              background: 'rgba(255,255,255,.04)',
              border: `1px solid ${category.color}22`,
              borderRadius: 16, padding: '14px 16px',
              transition: 'all .18s',
              color: '#fff',
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: category.bgColor, border: `2px solid ${category.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                {sub.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: '#fff', fontWeight: 700, margin: '0 0 2px' }}>{sub.label}</p>
                <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, margin: '0 0 6px' }}>{sub.desc}</p>
                <span style={{ background: `${category.color}18`, border: `1px solid ${category.color}33`, color: category.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                  🎭 {sub.identifier}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 20 }}>→</span>
            </div>
          </button>
        ))}

        <div style={{ marginTop: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '12px 14px' }}>
          <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💡 Your avatar evolves with you</p>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, lineHeight: 1.6 }}>
            Level 1 → Singlet &amp; shorts · Level 4 → Shirt &amp; tie<br />
            Level 8 → Full suit · Level 13 → 👑 Chairman outfit
          </p>
        </div>
      </div>
    </div>
  );
}
