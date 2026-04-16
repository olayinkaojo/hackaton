export default function ComplianceCard({ xp, level, career, subcategory, compliance, achievementCount }) {
  function downloadCard() {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 900, 520);
    bg.addColorStop(0, '#050810');
    bg.addColorStop(1, '#0d0a1f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 900, 520);

    // Subtle grid
    ctx.strokeStyle = 'rgba(78,205,196,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 900; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 520); ctx.stroke(); }
    for (let y = 0; y < 520; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(900, y); ctx.stroke(); }

    // Nigerian flag top bar
    ctx.fillStyle = '#008751'; ctx.fillRect(0, 0, 300, 8);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(300, 0, 300, 8);
    ctx.fillStyle = '#008751'; ctx.fillRect(600, 0, 300, 8);

    // ComplyNG wordmark
    ctx.font = '900 52px Georgia, serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('Comply', 44, 88);
    ctx.fillStyle = '#4ECDC4';
    ctx.fillText('NG', 200, 88);

    ctx.font = '700 13px Arial, sans-serif';
    ctx.fillStyle = '#FFE566';
    ctx.letterSpacing = '4px';
    ctx.fillText('COMPLIANCE CHAMPION CARD', 44, 112);

    // Divider
    const div = ctx.createLinearGradient(44, 0, 500, 0);
    div.addColorStop(0, '#4ECDC4'); div.addColorStop(1, 'transparent');
    ctx.strokeStyle = div; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(44, 124); ctx.lineTo(500, 124); ctx.stroke();

    // Career label
    ctx.font = '700 28px Georgia, serif';
    ctx.fillStyle = '#fff';
    ctx.fillText((subcategory?.emoji || '🎯') + '  ' + (subcategory?.label || career?.label || 'Professional'), 44, 170);

    // XP / Level / Grade on right
    const grade = xp > 3000 ? 'A' : xp > 2000 ? 'B' : xp > 1000 ? 'C' : 'D';
    const gradeColor = { A: '#00c864', B: '#4ECDC4', C: '#FFE566', D: '#FF8C00' }[grade];

    ctx.textAlign = 'right';
    ctx.font = '900 72px Georgia, serif';
    ctx.fillStyle = gradeColor;
    ctx.fillText(grade, 860, 108);
    ctx.font = '700 14px Arial';
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.fillText('GRADE', 860, 128);

    ctx.font = '900 40px Georgia, serif';
    ctx.fillStyle = '#FFE566';
    ctx.fillText(xp >= 1000 ? `${(xp / 1000).toFixed(1)}K XP` : `${xp} XP`, 860, 178);

    ctx.font = '700 14px Arial';
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.fillText(`LEVEL ${level} / 13`, 860, 198);

    // Compliance bars
    const CATS = [
      { key: 'registration', label: 'Registration', color: '#4ECDC4' },
      { key: 'tax',          label: 'Tax',          color: '#FFE566' },
      { key: 'employment',   label: 'Employment',   color: '#FF6B35' },
      { key: 'data',         label: 'Data Privacy', color: '#A78BFA' },
      { key: 'licences',     label: 'Licences',     color: '#95D44A' },
    ];

    ctx.font = '700 13px Arial';
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.textAlign = 'left';
    ctx.fillText('COMPLIANCE SCORES', 44, 230);

    CATS.forEach(({ key, label, color }, i) => {
      const val = compliance?.[key] ?? Math.min(100, 20 + xp / 60 + Math.random() * 15 | 0);
      const y = 250 + i * 44;
      const barX = 180, barW = 520;

      ctx.font = '600 13px Arial';
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.fillText(label, 44, y + 10);

      ctx.fillStyle = 'rgba(255,255,255,.07)';
      ctx.beginPath(); ctx.roundRect(barX, y - 2, barW, 16, 8); ctx.fill();

      const fill = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      fill.addColorStop(0, color + 'dd'); fill.addColorStop(1, color + '66');
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.roundRect(barX, y - 2, barW * (val / 100), 16, 8); ctx.fill();

      ctx.font = '700 12px Arial';
      ctx.fillStyle = color;
      ctx.textAlign = 'right';
      ctx.fillText(`${val}%`, 860, y + 10);
      ctx.textAlign = 'left';
    });

    // Achievements badge
    ctx.font = '700 13px Arial';
    ctx.fillStyle = 'rgba(255,229,102,.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`🏆 ${achievementCount || 0} Achievements Unlocked`, 44, 492);

    // Watermark
    ctx.font = '600 11px Arial';
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.textAlign = 'center';
    ctx.fillText('complyng.app  ·  Microsoft AI Skills Week 2026  ·  #RegTechNigeria', 450, 510);

    const link = document.createElement('a');
    link.download = 'complyng-champion-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <button className="btn" onClick={downloadCard} style={{
      width: '100%', padding: '14px', borderRadius: 99, fontSize: 14, fontWeight: 700,
      background: 'linear-gradient(135deg, rgba(78,205,196,.15), rgba(167,139,250,.15))',
      color: '#4ECDC4', border: '1.5px solid rgba(78,205,196,.4)',
      boxShadow: '0 4px 16px rgba(78,205,196,.15)',
    }}>
      📊 Download Compliance Card
    </button>
  );
}
