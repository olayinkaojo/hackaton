// src/screens/RegulatorDashboard.jsx
import { useState } from 'react';

export default function RegulatorDashboard({ onBack }) {
  // Pure CSS Bar Chart Data
  const complianceData = [
    { label: 'CAMA 2020', score: 85, color: '#4ECDC4' },
    { label: 'Finance Act', score: 62, color: '#FFE566' },
    { label: 'NDPA 2023', score: 45, color: '#FF6B35' }, // Low score!
    { label: 'PITA / CITA', score: 71, color: '#A78BFA' },
    { label: 'Startup Act', score: 92, color: '#95D44A' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#03050a', overflow: 'hidden' }}>
      <div style={{ padding: '40px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0, position: 'relative', background: '#0a0d16' }}>
        <button 
          className="btn" 
          onClick={onBack} 
          style={{ position: 'absolute', top: '45px', right: '18px', background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px' }}
        >
          ✕
        </button>
        <p style={{ color: '#FF6B35', fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>B2G / REGULATOR VIEW</p>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#fff', marginBottom: 4 }}>Compliance Analytics</h2>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>Real-time gaps in citizen knowledge</p>
      </div>

      <div className="scroll" style={{ flex: 1, padding: '16px' }}>
        
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
           <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '14px', padding: '16px' }}>
             <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '11px', margin: '0 0 4px 0' }}>Total Players</p>
             <p style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0, fontFamily: 'Fraunces, serif' }}>14,204</p>
           </div>
           <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '14px', padding: '16px' }}>
             <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '11px', margin: '0 0 4px 0' }}>Avg. Accuracy</p>
             <p style={{ color: '#4ECDC4', fontSize: '24px', fontWeight: 800, margin: 0, fontFamily: 'Fraunces, serif' }}>68%</p>
           </div>
        </div>

        {/* CSS Chart */}
        <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
           <h3 style={{ fontSize: '14px', color: '#fff', marginBottom: '4px' }}>Knowledge by Law Act</h3>
           <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Target areas where citizens need education</p>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
             {complianceData.map(d => (
               <div key={d.label}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                   <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.8)' }}>{d.label}</span>
                   <span style={{ fontSize: '12px', color: d.color, fontWeight: 700 }}>{d.score}%</span>
                 </div>
                 {/* Progress Track */}
                 <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.score}%`, height: '100%', background: d.color, borderRadius: '99px' }} />
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* AI Insight */}
        <div style={{ background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.3)', borderRadius: '16px', padding: '16px' }}>
           <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
             <span style={{ fontSize: '18px' }}>🤖</span>
             <span style={{ color: '#A78BFA', fontSize: '13px', fontWeight: 700 }}>AI Advisor Insight</span>
           </div>
           <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
             Data indicates that <strong>Creative/Media</strong> professionals have a 45% failure rate regarding the NDPA 2023. We recommend launching an in-game push notification campaign focusing on Data Privacy specifically for this cohort.
           </p>
           <button className="btn" style={{ marginTop: '12px', background: '#A78BFA', color: '#000', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
             Launch Targeted Quiz Campaign →
           </button>
        </div>

      </div>
    </div>
  );
}
