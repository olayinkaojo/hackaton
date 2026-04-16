export default function ShareButton({ xp, level, career, subcategory, style = {} }) {
  const grade = xp > 3000 ? 'A' : xp > 2000 ? 'B' : xp > 1000 ? 'C' : 'D';
  const title = `ComplyNG — Nigerian Compliance Game 🇳🇬`;
  const text = `I just scored ${xp.toLocaleString()} XP (Grade ${grade}) as a ${subcategory || career} on ComplyNG — the Nigerian business compliance game! 📚⚡\n\nThink you know Nigerian law? Beat my score! 🏆`;
  const url = 'https://complyng.vercel.app';

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (_) {}
    }
    // WhatsApp fallback
    const encoded = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  function handleWhatsApp() {
    const encoded = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  function handleCopy() {
    navigator.clipboard?.writeText(`${text}\n${url}`).then(() => {
      alert('Score copied to clipboard! Paste it anywhere.');
    });
  }

  return (
    <div style={{ display: 'flex', gap: 8, ...style }}>
      <button className="btn" onClick={handleShare} style={{
        flex: 1, padding: '13px', borderRadius: 99, fontSize: 14,
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        color: '#fff', fontWeight: 700,
        boxShadow: '0 5px 20px rgba(37,211,102,.35)',
      }}>
        📤 Share Score
      </button>
      <button className="btn" onClick={handleWhatsApp} style={{
        width: 48, height: 48, borderRadius: '50%', fontSize: 22,
        background: 'rgba(37,211,102,.15)',
        border: '1.5px solid rgba(37,211,102,.4)',
        color: '#25D366',
      }}>
        💬
      </button>
      <button className="btn" onClick={handleCopy} style={{
        width: 48, height: 48, borderRadius: '50%', fontSize: 20,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.15)',
        color: '#fff',
      }}>
        📋
      </button>
    </div>
  );
}
