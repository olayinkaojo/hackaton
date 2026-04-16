import { AVATAR_DRESS } from '../data/avatars.js';

export function drawAvatar(ctx, x, y, size, categoryId, subcategoryId, dressTier, frame=0){
  const dress = AVATAR_DRESS[Math.max(1,Math.min(13,dressTier))] || AVATAR_DRESS[1];
  const s = size;
  const walk = Math.sin(frame*0.3)*2;
  ctx.save();
  ctx.translate(x, y+walk);

  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.28)';
  ctx.beginPath(); ctx.ellipse(s/2,s+3,s*0.33,4,0,0,Math.PI*2); ctx.fill();

  // Legs
  const leg=Math.sin(frame*0.4)*6;
  ctx.fillStyle=dress.bottom;
  ctx.fillRect(s*.28,s*.62,s*.16,s*.36);
  ctx.save(); ctx.translate(s*.56,s*.62); ctx.rotate(leg*Math.PI/180);
  ctx.fillRect(0,0,s*.16,s*.36); ctx.restore();

  // Shoes
  ctx.fillStyle=dress.shoes;
  ctx.beginPath(); ctx.roundRect(s*.22,s*.9,s*.2,s*.09,3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(s*.56,s*.9,s*.2,s*.09,3); ctx.fill();

  // Torso
  ctx.fillStyle=dress.suit||dress.top;
  ctx.beginPath(); ctx.roundRect(s*.18,s*.32,s*.64,s*.36,6); ctx.fill();
  if(dress.suit){
    ctx.fillStyle=dress.top;
    ctx.beginPath(); ctx.roundRect(s*.34,s*.34,s*.32,s*.32,3); ctx.fill();
  }

  // Arms
  const arm=Math.sin(frame*0.4)*8;
  ctx.fillStyle=dress.suit||dress.top;
  ctx.save(); ctx.translate(s*.18,s*.36); ctx.rotate((-14+arm)*Math.PI/180);
  ctx.fillRect(-s*.08,0,s*.12,s*.3); ctx.restore();
  ctx.save(); ctx.translate(s*.82,s*.36); ctx.rotate((14-arm)*Math.PI/180);
  ctx.fillRect(-s*.04,0,s*.12,s*.3); ctx.restore();

  // Hands
  ctx.fillStyle='#D4956A';
  const lhx=s*.18+Math.sin((-14+arm)*Math.PI/180)*s*.3;
  const lhy=s*.36+Math.cos((-14+arm)*Math.PI/180)*s*.3;
  ctx.beginPath(); ctx.arc(lhx,lhy,s*.065,0,Math.PI*2); ctx.fill();
  const rhx=s*.82+Math.sin((14-arm)*Math.PI/180)*s*.3;
  const rhy=s*.36+Math.cos((14-arm)*Math.PI/180)*s*.3;
  ctx.beginPath(); ctx.arc(rhx,rhy,s*.065,0,Math.PI*2); ctx.fill();

  // Neck
  ctx.fillStyle='#D4956A'; ctx.fillRect(s*.4,s*.2,s*.2,s*.14);

  // Head
  ctx.fillStyle='#D4956A';
  ctx.beginPath(); ctx.roundRect(s*.25,s*.02,s*.5,s*.26,s*.12); ctx.fill();

  // Eyes
  ctx.fillStyle='#1a1a1a';
  ctx.beginPath(); ctx.arc(s*.37,s*.12,s*.03,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*.63,s*.12,s*.03,0,Math.PI*2); ctx.fill();

  // Smile
  ctx.strokeStyle='#1a1a1a'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(s*.5,s*.15,s*.08,0.2,Math.PI-0.2); ctx.stroke();

  // Accessory
  if(dress.accessory) drawAccessory(ctx,s,dress.accessory,frame);

  // Identifier
  drawIdentifier(ctx,s,categoryId,subcategoryId);

  ctx.restore();
}

function drawAccessory(ctx,s,type,frame){
  switch(type){
    case 'tie':
    case 'pocket':
      ctx.fillStyle='#CC0000';
      ctx.beginPath(); ctx.moveTo(s*.47,s*.3); ctx.lineTo(s*.42,s*.55); ctx.lineTo(s*.5,s*.6); ctx.lineTo(s*.58,s*.55); ctx.lineTo(s*.53,s*.3); ctx.closePath(); ctx.fill();
      if(type==='pocket'){ctx.fillStyle='#FFFFFF'; ctx.fillRect(s*.21,s*.37,s*.08,s*.06);}
      break;
    case 'bag':
    case 'bagshades':
      ctx.fillStyle='#CC0000';
      ctx.beginPath(); ctx.moveTo(s*.47,s*.3); ctx.lineTo(s*.42,s*.55); ctx.lineTo(s*.5,s*.6); ctx.lineTo(s*.58,s*.55); ctx.lineTo(s*.53,s*.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#2a2a2a'; ctx.beginPath(); ctx.roundRect(s*.76,s*.45,s*.22,s*.28,3); ctx.fill();
      if(type==='bagshades'){
        ctx.fillStyle='#111';
        ctx.beginPath(); ctx.roundRect(s*.27,s*.1,s*.16,s*.07,3); ctx.fill();
        ctx.beginPath(); ctx.roundRect(s*.57,s*.1,s*.16,s*.07,3); ctx.fill();
        ctx.strokeStyle='#111'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(s*.43,s*.135); ctx.lineTo(s*.57,s*.135); ctx.stroke();
      }
      break;
    case 'briefcase':
      ctx.fillStyle='#CC0000';
      ctx.beginPath(); ctx.moveTo(s*.47,s*.3); ctx.lineTo(s*.42,s*.55); ctx.lineTo(s*.5,s*.6); ctx.lineTo(s*.58,s*.55); ctx.lineTo(s*.53,s*.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#5C3D1A'; ctx.beginPath(); ctx.roundRect(s*.76,s*.48,s*.24,s*.22,4); ctx.fill();
      ctx.fillStyle='#8B5E2A'; ctx.fillRect(s*.84,s*.42,s*.1,s*.08);
      ctx.strokeStyle='#FFD700'; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(s*.76,s*.48,s*.24,s*.22,4); ctx.stroke();
      break;
    case 'medal':
      ctx.fillStyle='#CC0000';
      ctx.beginPath(); ctx.moveTo(s*.47,s*.3); ctx.lineTo(s*.42,s*.55); ctx.lineTo(s*.5,s*.6); ctx.lineTo(s*.58,s*.55); ctx.lineTo(s*.53,s*.3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#FFD700'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(s*.38,s*.24); ctx.lineTo(s*.5,s*.44); ctx.lineTo(s*.62,s*.24); ctx.stroke();
      ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(s*.5,s*.47,s*.06,0,Math.PI*2); ctx.fill();
      break;
    case 'crown':
      ctx.fillStyle='#FFD700';
      ctx.beginPath(); ctx.moveTo(s*.22,s*.06); ctx.lineTo(s*.22,-s*.04); ctx.lineTo(s*.35,s*.02); ctx.lineTo(s*.5,-s*.08); ctx.lineTo(s*.65,s*.02); ctx.lineTo(s*.78,-s*.04); ctx.lineTo(s*.78,s*.06); ctx.closePath(); ctx.fill();
      ['#FF0000','#00FF00','#0000FF'].forEach((c,i)=>{ctx.fillStyle=c; ctx.beginPath(); ctx.arc(s*(0.35+i*0.15),s*.01,s*.025,0,Math.PI*2); ctx.fill();});
      break;
  }
}

function drawIdentifier(ctx,s,cat,sub){
  switch(`${cat}_${sub}`){
    case 'artisan_mason':
    case 'artisan_electrician':
      ctx.fillStyle=sub==='mason'?'#FFD700':'#FFFFFF';
      ctx.beginPath(); ctx.arc(s*.5,s*.06,s*.28,Math.PI,0); ctx.fill();
      ctx.fillRect(s*.22,s*.04,s*.56,s*.06);
      break;
    case 'artisan_welder':
      ctx.fillStyle='#444'; ctx.beginPath(); ctx.roundRect(s*.24,-s*.02,s*.52,s*.15,4); ctx.fill();
      ctx.fillStyle='#FF6600'; ctx.beginPath(); ctx.roundRect(s*.3,s*.02,s*.4,s*.08,3); ctx.fill();
      break;
    case 'artisan_tailor':
      ctx.strokeStyle='#FFD700'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(s*.5,s*.3,s*.15,0.5,Math.PI-0.5); ctx.stroke();
      break;
    case 'business_restaurant':
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(s*.3,-s*.06,s*.4,s*.14,s*.07); ctx.fill();
      ctx.fillRect(s*.28,s*.04,s*.44,s*.04);
      break;
    case 'professional_lawyer':
      ctx.fillStyle='#F5F5DC';
      ctx.beginPath(); ctx.arc(s*.5,s*.02,s*.26,Math.PI,0); ctx.fill();
      break;
    case 'creative_musician':
      ctx.fillStyle='#888'; ctx.beginPath(); ctx.roundRect(s*.78,s*.52,s*.08,s*.2,4); ctx.fill();
      ctx.fillStyle='#AAA'; ctx.beginPath(); ctx.arc(s*.82,s*.52,s*.07,0,Math.PI*2); ctx.fill();
      break;
    case 'creative_content':
      ctx.fillStyle='#333'; ctx.beginPath(); ctx.roundRect(s*.75,s*.44,s*.24,s*.18,3); ctx.fill();
      ctx.fillStyle='#666'; ctx.beginPath(); ctx.arc(s*.87,s*.53,s*.07,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#4ECDC4'; ctx.beginPath(); ctx.arc(s*.87,s*.53,s*.04,0,Math.PI*2); ctx.fill();
      break;
    default: break;
  }
}
