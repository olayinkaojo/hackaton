// src/screens/LeaderboardScreen.jsx
import { useState } from 'react';

const MOCK_PLAYERS = [
  { id: 1, name: 'Tunde O.', rank: 1, xp: 8450, title: 'Compliance Legend', avatar: '👑' },
  { id: 2, name: 'Chioma E.', rank: 2, xp: 8120, title: 'Compliance Legend', avatar: '💼' },
  { id: 3, name: 'Femi A.', rank: 3, xp: 7500, title: 'Champion', avatar: '💻' },
  { id: 4, name: 'Nneka M.', rank: 4, xp: 6200, title: 'Leader', avatar: '🛠️' },
  { id: 5, name: 'Ibrahim Y.', rank: 5, xp: 5900, title: 'Specialist', avatar: '📊' },
  { id: 6, name: 'YOU', rank: 6, xp: 5850, title: 'Specialist', avatar: '🎯', isUser: true },
  { id: 7, name: 'Sola K.', rank: 7, xp: 4100, title: 'Officer', avatar: '🎨' },
];

const MOCK_GUILDS = [
  { id: 1, name: 'Paystack Tigers', rank: 1, points: 45000 },
  { id: 2, name: 'Flutterwave Force', rank: 2, points: 42300 },
  { id: 3, name: 'Yaba Tech Hub', rank: 3, points: 38100 },
  { id: 4, name: 'Alaba Traders Union', rank: 4, points: 31050 },
  { id: 5, name: 'Lekki Realtors', rank: 5, points: 29000 },
];

export default function LeaderboardScreen({ onBack }) {
  const [tab, setTab] = useState('national'); // 'national' | 'guild'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,#050810,#1a1333)', overflow: 'hidden' }}>
      <div style={{ padding: '40px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0, position: 'relative' }}>
        <button 
          className="btn" 
          onClick={onBack} 
          style={{ position: 'absolute', top: '45px', right: '18px', background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px' }}
        >
          ✕
        </button>
        <p style={{ color: '#A78BFA', fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>HALL OF FAME</p>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: '#fff', marginBottom: 4 }}>National Leaderboard</h2>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Compete with professionals across Nigeria</p>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button 
            className="btn"
            onClick={() => setTab('national')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', background: tab === 'national' ? 'rgba(167,139,250,.2)' : 'transparent', border: `1px solid ${tab === 'national' ? '#A78BFA' : 'rgba(255,255,255,.1)'}`, color: tab === 'national' ? '#A78BFA' : '#fff' }}
          >
            Players
          </button>
          <button 
            className="btn"
            onClick={() => setTab('guild')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', background: tab === 'guild' ? 'rgba(78,205,196,.2)' : 'transparent', border: `1px solid ${tab === 'guild' ? '#4ECDC4' : 'rgba(255,255,255,.1)'}`, color: tab === 'guild' ? '#4ECDC4' : '#fff' }}
          >
            Companies/Guilds
          </button>
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, padding: '16px' }}>
        {tab === 'national' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_PLAYERS.map(p => (
              <div 
                key={p.id} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', 
                  background: p.isUser ? 'rgba(255,229,102,.15)' : 'rgba(255,255,255,.03)', 
                  border: `1px solid ${p.isUser ? 'rgba(255,229,102,.4)' : 'rgba(255,255,255,.05)'}`, 
                  borderRadius: '16px',
                  boxShadow: p.isUser ? '0 4px 12px rgba(255,229,102,.1)' : 'none'
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, color: p.rank <= 3 ? '#FFE566' : 'rgba(255,255,255,.4)', width: '24px', textAlign: 'center' }}>
                  {p.rank}
                </div>
                <div style={{ fontSize: '24px' }}>{p.avatar}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: p.isUser ? '#FFE566' : '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>{p.name}</p>
                  <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '11px', margin: 0 }}>{p.title}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#4ECDC4', fontSize: '14px', fontWeight: 800, margin: 0 }}>{p.xp.toLocaleString()}</p>
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '10px', margin: 0 }}>XP</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', textAlign: 'center', marginBottom: '8px' }}>Join a company to pool XP and conquer the ranks!</p>
             {MOCK_GUILDS.map(g => (
              <div 
                key={g.id} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                  background: 'rgba(78,205,196,.05)', 
                  border: '1px solid rgba(78,205,196,.15)', 
                  borderRadius: '16px' 
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, color: g.rank <= 3 ? '#4ECDC4' : 'rgba(255,255,255,.4)', width: '24px', textAlign: 'center' }}>
                  #{g.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>{g.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#4ECDC4', fontSize: '14px', fontWeight: 800, margin: 0 }}>{g.points.toLocaleString()}</p>
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '10px', margin: 0 }}>Total XP</p>
                </div>
              </div>
            ))}
            <button className="btn" style={{ marginTop: '16px', width: '100%', padding: '14px', background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: '12px' }}>
              + Create or Join Company
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
