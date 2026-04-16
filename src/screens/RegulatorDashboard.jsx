import { useState, useEffect } from 'react';
import { getRegulatorInsight, hasClaudeKey } from '../utils/claudeAPI.js';

const LAWS = [
  { label: 'CAMA 2020',         score: 78, risk: 'low',    category: 'registration' },
  { label: 'Finance Act 2023',  score: 54, risk: 'medium', category: 'tax' },
  { label: 'NDPA 2023',         score: 38, risk: 'high',   category: 'data' },
  { label: 'PITA / CITA',       score: 61, risk: 'medium', category: 'tax' },
  { label: 'PENCOM Act',        score: 47, risk: 'high',   category: 'employment' },
  { label: 'Startup Act 2022',  score: 88, risk: 'low',    category: 'registration' },
  { label: 'NAFDAC Regs',       score: 43, risk: 'high',   category: 'licences' },
  { label: 'FCCPC Act',         score: 66, risk: 'medium', category: 'licences' },
];

const CAREERS = [
  { label: 'Traders',       emoji: '🛒', players: 3240, accuracy: 58, color: '#FFE566' },
  { label: 'Tech Workers',  emoji: '💻', players: 2810, accuracy: 74, color: '#4ECDC4' },
  { label: 'Creatives',     emoji: '🎨', players: 2120, accuracy: 49, color: '#A78BFA' },
  { label: 'Agri/Food',     emoji: '🌾', players: 1950, accuracy: 52, color: '#95D44A' },
  { label: 'Professionals', emoji: '⚖️', players: 4180, accuracy: 82, color: '#FF6B35' },
];

const MISSED_Q = [
  { q: 'Penalty for late PENCOM remittance', law: 'PENCOM Act', failRate: 72, sector: 'All' },
  { q: 'Data breach notification deadline under NDPA', law: 'NDPA 2023', failRate: 68, sector: 'Tech/Creative' },
  { q: 'VAT registration threshold for services', law: 'Finance Act', failRate: 63, sector: 'Traders' },
  { q: 'CAC compliance after company name reservation', law: 'CAMA 2020', failRate: 57, sector: 'All' },
];

const RISK_COLOR = { low: '#00c864', medium: '#FFE566', high: '#FF4444' };
const RISK_BG = { low: 'rgba(0,200,100,.08)', medium: 'rgba(255,229,102,.08)', high: 'rgba(255,68,68,.08)' };

export default function RegulatorDashboard({ onBack }) {
  const [tab, setTab] = useState('overview');
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [insightTyped, setInsightTyped] = useState('');
  const [counter, setCounter] = useState(14204);

  // Animate bars in
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  // Simulated live player counter
  useEffect(() => {
    const iv = setInterval(() => setCounter(c => c + Math.floor(Math.random() * 3)), 4000);
    return () => clearInterval(iv);
  }, []);

  async function fetchInsight() {
    setLoadingInsight(true);
    setAiInsight('');
    setInsightTyped('');
    const text = await getRegulatorInsight({
      sector: 'Creative/Media professionals',
      weakestLaw: 'NDPA 2023',
      avgAccuracy: 38,
    }) || 'NDPA 2023 remains the most misunderstood regulation. NDPC should partner with ComplyNG to run targeted in-app campaigns for tech and creative sector workers, focusing on data breach notification timelines and the ₦10M penalty threshold. Mandatory annual compliance quizzes tied to CAC renewal would drive 40%+ improvement in awareness within 12 months.';

    setLoadingInsight(false);

    // Typewriter
    let i = 0;
    const chars = text.split('');
    const tick = () => {
      if (i < chars.length) {
        setInsightTyped(chars.slice(0, i + 1).join(''));
        i++;
        setTimeout(tick, 18);
      }
    };
    setAiInsight(text);
    tick();
  }

  const totalPlayers = counter;
  const avgAccuracy = Math.round(CAREERS.reduce((s, c) => s + c.accuracy, 0) / CAREERS.length);
  const highRiskLaws = LAWS.filter(l => l.risk === 'high').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#03050a', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '36px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0, background: 'linear-gradient(to bottom,#0a0d16,#03050a)', position: 'relative' }}>
        <button className="btn" onClick={onBack} style={{ position: 'absolute', top: 38, right: 18, background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18 }}>✕</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c864', boxShadow: '0 0 8px #00c864', animation: 'pulse 2s infinite' }} />
          <p style={{ color: '#FF6B35', fontSize: 10, fontWeight: 800, letterSpacing: 3, margin: 0 }}>LIVE  ·  B2G REGULATOR PORTAL</p>
        </div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: '#fff', marginBottom: 2 }}>Compliance Analytics</h2>
        <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11 }}>Real-time knowledge gaps — FIRS · CAC · NDPC · PENCOM</p>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, overflowX: 'auto' }}>
          {[['overview','📊 Overview'],['sectors','🏭 Sectors'],['gaps','⚠️ Gaps'],['ai','🤖 AI Report']].map(([k, l]) => (
            <button key={k} className="btn" onClick={() => setTab(k)} style={{ padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, background: tab === k ? 'rgba(255,107,53,.2)' : 'transparent', border: `1px solid ${tab === k ? '#FF6B35' : 'rgba(255,255,255,.1)'}`, color: tab === k ? '#FF6B35' : 'rgba(255,255,255,.5)' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, padding: '16px' }}>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Players', value: totalPlayers.toLocaleString(), color: '#4ECDC4', sub: '↑ live' },
                { label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: '#FFE566', sub: 'all sectors' },
                { label: 'High Risk Laws', value: highRiskLaws, color: '#FF4444', sub: 'need action' },
              ].map(k => (
                <div key={k.label} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                  <p style={{ color: k.color, fontSize: 22, fontWeight: 900, fontFamily: 'Fraunces, serif', margin: 0 }}>{k.value}</p>
                  <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, margin: '2px 0 0', letterSpacing: 0.5 }}>{k.label}</p>
                  <p style={{ color: k.color, fontSize: 9, margin: 0, opacity: 0.7 }}>{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Knowledge by Law */}
            <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Knowledge by Law</p>
              <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginBottom: 14 }}>Average question accuracy — lower = more education needed</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {LAWS.map(d => (
                  <div key={d.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>{d.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99, background: RISK_BG[d.risk], color: RISK_COLOR[d.risk], border: `1px solid ${RISK_COLOR[d.risk]}44` }}>{d.risk.toUpperCase()}</span>
                        <span style={{ fontSize: 12, color: RISK_COLOR[d.risk], fontWeight: 700, minWidth: 34, textAlign: 'right' }}>{d.score}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: animated ? `${d.score}%` : '0%', height: '100%', background: RISK_COLOR[d.risk], borderRadius: 99, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '📤', label: 'Export CSV', color: '#4ECDC4', action: () => alert('In production: downloads aggregated CSV for FIRS/CAC analysis') },
                { icon: '📧', label: 'Email Report', color: '#A78BFA', action: () => alert('In production: sends weekly digest to regulator inbox') },
                { icon: '📅', label: 'Schedule Quiz', color: '#FF6B35', action: () => alert('In production: pushes targeted quiz campaign to high-risk users') },
                { icon: '🗺️', label: 'State Heatmap', color: '#FFE566', action: () => alert('In production: compliance knowledge heatmap by LGA/State') },
              ].map(a => (
                <button key={a.label} className="btn" onClick={a.action} style={{ padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 8, color: a.color, fontSize: 13, fontWeight: 700, textAlign: 'left' }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── SECTORS TAB ── */}
        {tab === 'sectors' && (
          <>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginBottom: 16 }}>Compliance accuracy by career path — identify which sectors need targeted education</p>
            {CAREERS.map(c => (
              <div key={c.label} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{c.emoji}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{c.label}</p>
                      <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: 0 }}>{c.players.toLocaleString()} players</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: c.color, margin: 0, fontWeight: 900 }}>{c.accuracy}%</p>
                    <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 10, margin: 0 }}>accuracy</p>
                  </div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,.05)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: animated ? `${c.accuracy}%` : '0%', height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${c.color}cc, ${c.color})`, transition: 'width 1.4s cubic-bezier(.4,0,.2,1)' }} />
                </div>
                {c.accuracy < 60 && (
                  <div style={{ marginTop: 8, background: 'rgba(255,68,68,.08)', border: '1px solid rgba(255,68,68,.2)', borderRadius: 8, padding: '6px 10px' }}>
                    <p style={{ color: '#FF8888', fontSize: 11, margin: 0 }}>⚠️ Below 60% threshold — recommend targeted campaign</p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── GAPS TAB ── */}
        {tab === 'gaps' && (
          <>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginBottom: 16 }}>Questions with the highest failure rates — these represent critical compliance blindspots</p>
            {MISSED_Q.map((q, i) => (
              <div key={i} style={{ background: 'rgba(255,68,68,.05)', border: '1px solid rgba(255,68,68,.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#FF8888', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>FAIL RATE</span>
                  <span style={{ color: '#FF4444', fontSize: 20, fontWeight: 900, fontFamily: 'Fraunces, serif' }}>{q.failRate}%</span>
                </div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>"{q.q}"</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(78,205,196,.1)', color: '#4ECDC4', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(78,205,196,.25)' }}>📚 {q.law}</span>
                  <span style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>👥 {q.sector}</span>
                </div>
              </div>
            ))}

            <div style={{ background: 'rgba(255,229,102,.06)', border: '1px solid rgba(255,229,102,.2)', borderRadius: 14, padding: '14px 16px', marginTop: 6 }}>
              <p style={{ color: '#FFE566', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💡 Recommended Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Push PENCOM in-app reminder to all employed users','Add NDPA quiz campaign for Tech + Creative sector','Partner with FIRS to create a VAT threshold calculator feature','Include CAC post-registration checklist as Level 1 bonus'].map(t => (
                  <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#00c864', fontSize: 14, flexShrink: 0 }}>✓</span>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── AI REPORT TAB ── */}
        {tab === 'ai' && (
          <>
            <div style={{ background: 'linear-gradient(135deg,rgba(167,139,250,.08),rgba(78,205,196,.08))', border: '1px solid rgba(167,139,250,.2)', borderRadius: 16, padding: '18px', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🤖</div>
                <div>
                  <p style={{ color: '#A78BFA', fontSize: 12, fontWeight: 800, letterSpacing: 1, margin: 0 }}>CLAUDE AI — POLICY ADVISOR</p>
                  <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: 0 }}>{hasClaudeKey() ? 'Live AI analysis powered by Claude' : 'Demo mode — add VITE_ANTHROPIC_API_KEY for live AI'}</p>
                </div>
              </div>

              {aiInsight ? (
                <div>
                  <p style={{ color: '#fff', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                    {insightTyped}
                    {insightTyped.length < aiInsight.length && (
                      <span style={{ display: 'inline-block', width: 2, height: 14, background: '#A78BFA', marginLeft: 2, animation: 'pulse .7s infinite', verticalAlign: 'middle' }} />
                    )}
                  </p>
                </div>
              ) : loadingInsight ? (
                <div style={{ display: 'flex', gap: 6, padding: '8px 0' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', animation: `pulse 1.2s ${i*0.3}s infinite` }} />)}
                  <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginLeft: 4 }}>Analysing compliance data...</span>
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, margin: 0 }}>
                  Click below to generate an AI-powered policy recommendation based on current player data.
                </p>
              )}
            </div>

            <button className="btn" onClick={fetchInsight} disabled={loadingInsight} style={{ width: '100%', padding: '15px', borderRadius: 99, fontSize: 14, fontWeight: 700, background: loadingInsight ? 'rgba(167,139,250,.1)' : 'linear-gradient(135deg,#A78BFA,#7c3aed)', color: '#fff', marginBottom: 16, boxShadow: '0 6px 20px rgba(167,139,250,.3)' }}>
              {loadingInsight ? '⏳ Generating Report...' : '✨ Generate AI Policy Report'}
            </button>

            {/* Dataset summary */}
            <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '14px 16px' }}>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>DATASET SUMMARY</p>
              {[
                { l: 'Data Points', v: `${(totalPlayers * 12).toLocaleString()} questions answered` },
                { l: 'Laws Covered', v: '30+ Nigerian regulations' },
                { l: 'Career Sectors', v: '5 sectors, 20 subcategories' },
                { l: 'Accuracy Source', v: 'Anonymised, aggregated gameplay' },
                { l: 'Update Frequency', v: 'Real-time (on answer)' },
                { l: 'Privacy', v: 'NDPA-compliant, no PII stored' },
              ].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>{r.l}</span>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
