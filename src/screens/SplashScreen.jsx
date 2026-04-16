import { useState, useEffect } from 'react';
export default function SplashScreen({ onStart, onLeaderboard, onRegulator }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(160deg,#050810 0%,#0a1528 55%,#0d0a1f 100%)',padding:'0 24px',opacity:vis?1:0,transition:'opacity .6s',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(78,205,196,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(78,205,196,.04) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:5,background:'linear-gradient(90deg,#008751 33%,#fff 33% 66%,#008751 66%)'}}/>
      <div style={{textAlign:'center',position:'relative',animation:'fadeIn .8s ease'}}>
        <div style={{fontSize:80,marginBottom:12,animation:'float 3s ease-in-out infinite'}}>🇳🇬</div>
        <h1 style={{fontFamily:'Fraunces,serif',fontSize:56,fontWeight:900,color:'#fff',letterSpacing:-1,lineHeight:1,marginBottom:6}}>
          Comply<span style={{color:'#4ECDC4'}}>NG</span>
        </h1>
        <p style={{color:'#FFE566',fontSize:12,fontWeight:700,letterSpacing:4,marginBottom:6}}>THE NIGERIAN COMPLIANCE GAME</p>
        <p style={{color:'rgba(255,255,255,.5)',fontSize:13,lineHeight:1.7,marginBottom:10,maxWidth:300}}>
          Choose your career. Navigate Nigerian business laws.<br/>Climb 13 levels. Become a Compliance Legend.
        </p>
        <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:36}}>
          {['📜 Real Nigerian Laws','🎮 13 Levels','🤖 AI Advisor','🏆 5 Career Paths'].map(t=>(
            <span key={t} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.55)',fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:99}}>{t}</span>
          ))}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button className="btn" onClick={onStart} style={{width: 240, background:'linear-gradient(135deg,#008751,#00c46b)',color:'#fff',fontSize:19,padding:'17px 0',borderRadius:99,boxShadow:'0 8px 32px rgba(0,135,81,.5)',fontFamily:'Fraunces,serif',animation:'bounce 2.5s ease-in-out infinite'}}>
            Play Now 🎮
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={onLeaderboard} style={{ width: 114, background:'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color:'#fff',fontSize:13,padding:'12px 0',borderRadius:99}}>
              Leaderboard
            </button>
            <button className="btn" onClick={onRegulator} style={{ width: 114, background:'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color:'#A78BFA',fontSize:13,padding:'12px 0',borderRadius:99}}>
              B2G Data
            </button>
          </div>
        </div>
        
        <p style={{color:'rgba(255,255,255,.2)',fontSize:10,marginTop:32,letterSpacing:2}}>MICROSOFT AI SKILLS WEEK 2026 · REGTECH HACKATHON</p>
      </div>
    </div>
  );
}
