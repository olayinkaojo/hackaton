export function drawObstacle(ctx,type,W,H,GY,frame,progress,solved,label){
  switch(type){
    case 'valley':   return drawValley(ctx,W,H,GY,frame,progress,solved,label);
    case 'hill':     return drawHill(ctx,W,H,GY,frame,progress,solved,label);
    case 'descent':  return drawDescent(ctx,W,H,GY,frame,progress,solved,label);
    case 'spear':    return drawSpear(ctx,W,H,GY,frame,progress,solved,label);
    case 'river':    return drawRiver(ctx,W,H,GY,frame,progress,solved,label);
    case 'predator': return drawPredator(ctx,W,H,GY,frame,progress,solved,label);
    case 'ladder':   return drawLadder(ctx,W,H,GY,frame,progress,solved,label);
    case 'swing':    return drawSwing(ctx,W,H,GY,frame,progress,solved,label);
    default:         return drawValley(ctx,W,H,GY,frame,progress,solved,label);
  }
}

function drawValley(ctx,W,H,GY,frame,progress,solved,label){
  const midX=W/2, vW=W*.5, vD=H*.32;
  const g=ctx.createLinearGradient(0,GY-vD,0,GY);
  g.addColorStop(0,'#1a0a00'); g.addColorStop(1,'#0a0500');
  ctx.fillStyle=g; ctx.beginPath();
  ctx.moveTo(midX-vW/2,GY); ctx.quadraticCurveTo(midX,GY+vD*.75,midX+vW/2,GY);
  ctx.lineTo(midX+vW/2,H); ctx.lineTo(midX-vW/2,H); ctx.closePath(); ctx.fill();
  if(solved){
    const bp=Math.min(1,frame%80/80);
    ctx.fillStyle='#8B4513'; ctx.fillRect(midX-vW/2,GY-7,vW*bp,7);
    for(let i=0;i<Math.floor(bp*9);i++){ctx.fillStyle='#A0522D'; ctx.fillRect(midX-vW/2+i*(vW/9)+2,GY-6,vW/9-4,5);}
    ctx.font='18px serif'; ctx.textAlign='center'; ctx.fillText('📜',midX,GY-28-Math.sin(frame*.1)*6);
  } else {
    const dp=Math.sin(frame*.15)*.3+.7;
    ctx.fillStyle=`rgba(255,50,0,${dp})`; ctx.beginPath(); ctx.arc(midX,GY+vD*.5,13,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 11px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('!',midX,GY+vD*.5);
  }
  ctx.fillStyle='#FFE566'; ctx.font='bold 12px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(label,midX,GY-vD-8);
}

function drawHill(ctx,W,H,GY,frame,progress,solved,label){
  const hH=H*.42, midX=W*.6;
  const hg=ctx.createLinearGradient(W*.1,GY-hH,W*.9,GY);
  hg.addColorStop(0,solved?'#1a4a1a':'#2a3a1a'); hg.addColorStop(1,solved?'#2a6a2a':'#3a5a1a');
  ctx.fillStyle=hg; ctx.beginPath();
  ctx.moveTo(W*.05,GY); ctx.quadraticCurveTo(midX,GY-hH,W*.95,GY); ctx.closePath(); ctx.fill();
  [[W*.3,GY-hH*.4],[W*.5,GY-hH*.7],[W*.7,GY-hH*.35]].forEach(([rx,ry])=>{
    ctx.fillStyle='#555'; ctx.beginPath(); ctx.ellipse(rx,ry,12,8,.3,0,Math.PI*2); ctx.fill();
  });
  const fp=Math.sin(frame*.2)*5;
  ctx.fillStyle='#008751'; ctx.fillRect(midX-2,GY-hH-28,3,28);
  ctx.fillStyle=solved?'#FFE566':'#FF4444';
  ctx.beginPath(); ctx.moveTo(midX+1,GY-hH-28); ctx.lineTo(midX+18,GY-hH-20+fp); ctx.lineTo(midX+1,GY-hH-12); ctx.closePath(); ctx.fill();
  if(solved){ctx.font='16px serif'; ctx.textAlign='center'; ctx.fillText('🔖',midX+20,GY-hH-38+Math.sin(frame*.1)*4);}
  ctx.fillStyle='#FFE566'; ctx.font='bold 12px DM Sans'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText(label,12,10);
}

function drawDescent(ctx,W,H,GY,frame,progress,solved,label){
  ctx.fillStyle='#1a1500'; ctx.beginPath();
  ctx.moveTo(0,GY-H*.5); ctx.lineTo(W*.4,GY-H*.5); ctx.lineTo(W*.4,GY-H*.15); ctx.lineTo(W*.7,GY); ctx.lineTo(0,GY); ctx.closePath(); ctx.fill();
  ctx.strokeStyle=solved?'#00c864':'#FF8C00'; ctx.lineWidth=4; ctx.setLineDash([10,5]);
  ctx.beginPath(); ctx.moveTo(W*.4,GY-H*.35); ctx.quadraticCurveTo(W*.55,GY-H*.1,W*.75,GY-5); ctx.stroke();
  ctx.setLineDash([]);
  if(!solved){
    const ao=(frame*2)%40;
    ctx.fillStyle='#FF8C00';
    [0,1,2].forEach(i=>{const t=(i/2+ao/40)%1; ctx.font='13px serif'; ctx.textAlign='center'; ctx.fillText('↘',W*.4+t*W*.35,GY-H*.35+t*H*.35);});
  }
  ctx.fillStyle='#FFE566'; ctx.font='bold 17px Fraunces,serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('7.5%',W*.55,GY-H*.28);
  ctx.font='bold 12px DM Sans'; ctx.textBaseline='top'; ctx.fillText(label,W/2,10);
}

function drawSpear(ctx,W,H,GY,frame,progress,solved,label){
  const tx=W*.82, ty=GY-H*.34;
  [[40,'#111'],[30,'#FF4444'],[20,'#FFF'],[10,'#FFD700']].forEach(([r,c])=>{ctx.fillStyle=c; ctx.beginPath(); ctx.arc(tx,ty,r,0,Math.PI*2); ctx.fill();});
  ctx.fillStyle='#FFD700'; ctx.font='bold 10px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('PAYE',tx,ty);
  if(solved){
    ctx.save(); ctx.translate(tx,ty); ctx.rotate(-0.3+Math.PI/2);
    ctx.fillStyle='#8B4513'; ctx.fillRect(-3,-48,6,48);
    ctx.fillStyle='#C0C0C0'; ctx.beginPath(); ctx.moveTo(-3,-48); ctx.lineTo(0,-60); ctx.lineTo(3,-48); ctx.closePath(); ctx.fill();
    ctx.restore(); ctx.font='14px serif'; ctx.fillText('✅',tx,ty-68);
  } else {
    const sp=((frame*3)%W)/W;
    const sx=W*.1+sp*W*.7, sy=GY-H*.1-Math.sin(sp*Math.PI)*H*.38;
    ctx.save(); ctx.translate(sx,sy); ctx.rotate(-0.3);
    ctx.fillStyle='#8B4513'; ctx.fillRect(-3,-38,6,38);
    ctx.fillStyle='#C0C0C0'; ctx.beginPath(); ctx.moveTo(-4,-38); ctx.lineTo(0,-52); ctx.lineTo(4,-38); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle='#FFE566'; ctx.font='bold 12px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText(label,W/2,10);
}

function drawRiver(ctx,W,H,GY,frame,progress,solved,label){
  const rT=GY-H*.06, rH=H*.12;
  const rg=ctx.createLinearGradient(0,rT,0,rT+rH);
  rg.addColorStop(0,'#1a6a9a'); rg.addColorStop(1,'#0a3a6a');
  ctx.fillStyle=rg; ctx.fillRect(0,rT,W,rH);
  ctx.strokeStyle='rgba(255,255,255,.38)'; ctx.lineWidth=2;
  for(let i=0;i<5;i++){
    const wx=((frame*2+i*80)%(W+40))-40;
    ctx.beginPath(); ctx.moveTo(wx,rT+rH*.3); ctx.quadraticCurveTo(wx+15,rT+rH*.15,wx+30,rT+rH*.3); ctx.stroke();
  }
  if(solved){
    [0.2,0.38,0.56,0.74,0.9].forEach((t,i)=>{
      if(frame>i*8){
        ctx.fillStyle='#888'; ctx.beginPath(); ctx.ellipse(W*t,rT+rH/2,22,10,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#aaa'; ctx.beginPath(); ctx.ellipse(W*t-4,rT+rH/2-3,18,7,0,0,Math.PI*2); ctx.fill();
      }
    });
    ctx.font='15px serif'; ctx.textAlign='center'; ctx.fillText('🏦',W*.5,rT-18+Math.sin(frame*.1)*4);
  } else {
    const cx=((frame*1.5)%(W+60))-30;
    ctx.fillStyle='#2d6a2d'; ctx.beginPath(); ctx.ellipse(cx,rT+rH*.5,24,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1a4a1a'; ctx.beginPath(); ctx.moveTo(cx+20,rT+rH*.5-4); ctx.lineTo(cx+34,rT+rH*.5-2); ctx.lineTo(cx+20,rT+rH*.5+4); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle='#FFE566'; ctx.font='bold 12px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText(label,W/2,10);
}

function drawPredator(ctx,W,H,GY,frame,progress,solved,label){
  const ro=solved?-(frame*2)%(W*1.5):0;
  [[0.9,0],[0.78,1],[0.66,2]].forEach(([xr,i])=>{
    const ax=W*xr+ro-i*10; if(ax<-30||ax>W+30) return;
    const la=Math.sin(frame*.5+i*1.2)*8;
    ctx.fillStyle=['#003366','#004400','#330000'][i];
    ctx.beginPath(); ctx.roundRect(ax-12,GY-54,24,34,4); ctx.fill();
    ctx.fillStyle='#D4956A'; ctx.beginPath(); ctx.arc(ax,GY-60,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFD700'; ctx.font='bold 8px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(['FIRS','LGA','NAFDAC'][i],ax,GY-40);
    ctx.fillStyle='#1a1a2e'; ctx.fillRect(ax-8,GY-20,7,20+la); ctx.fillRect(ax+1,GY-20,7,20-la);
  });
  for(let i=0;i<4;i++){
    const da=0.3-i*.06; if(da<=0) return;
    ctx.fillStyle=`rgba(200,180,150,${da})`;
    ctx.beginPath(); ctx.arc(W*.7+i*20+ro,GY-5,8+i*3,0,Math.PI*2); ctx.fill();
  }
  ctx.fillStyle=solved?'#00c864':'#FF4444'; ctx.font='bold 13px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='top';
  ctx.fillText(solved?'🏃 YOU OUTRAN THEM! ✅':'⚠️ '+label,W/2,10);
}

function drawLadder(ctx,W,H,GY,frame,progress,solved,label){
  const cH=H*.6, cX=W*.55;
  ctx.fillStyle='#1a0a0a'; ctx.beginPath();
  ctx.moveTo(cX,GY); ctx.lineTo(cX,GY-cH); ctx.lineTo(W,GY-cH); ctx.lineTo(W,GY); ctx.closePath(); ctx.fill();
  const rungs=solved?Math.min(8,Math.floor(frame/8)):0;
  if(rungs>0){
    ctx.strokeStyle='#8B4513'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.moveTo(cX-4,GY); ctx.lineTo(cX-4,GY-rungs*22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cX+20,GY); ctx.lineTo(cX+20,GY-rungs*22); ctx.stroke();
    ctx.lineWidth=4;
    for(let r=0;r<rungs;r++){ctx.beginPath(); ctx.moveTo(cX-4,GY-r*22-14); ctx.lineTo(cX+20,GY-r*22-14); ctx.stroke();}
  }
  ctx.font='22px serif'; ctx.textAlign='center';
  ctx.fillText(solved?'🔓':'🔒',cX+8,GY-cH+10+Math.sin(frame*.1)*3);
  ctx.fillStyle='#A78BFA'; ctx.font='bold 12px DM Sans'; ctx.textBaseline='top'; ctx.fillText(label,W/2,10);
}

function drawSwing(ctx,W,H,GY,frame,progress,solved,label){
  const vX=W*.5, vH=H*.44;
  const vg=ctx.createLinearGradient(vX-W*.3,GY,vX,GY-vH);
  vg.addColorStop(0,'#2a0a00'); vg.addColorStop(1,'#5a1500');
  ctx.fillStyle=vg; ctx.beginPath();
  ctx.moveTo(vX-W*.35,GY); ctx.lineTo(vX-W*.08,GY-vH); ctx.lineTo(vX+W*.08,GY-vH); ctx.lineTo(vX+W*.35,GY); ctx.closePath(); ctx.fill();
  const la=Math.sin(frame*.1)*.3+.6;
  ctx.fillStyle=`rgba(255,100,0,${la})`; ctx.beginPath(); ctx.ellipse(vX,GY-vH,W*.1,H*.04,0,0,Math.PI*2); ctx.fill();
  for(let i=0;i<3;i++){
    const dy=GY-vH+10+((frame*1.5+i*20)%60);
    ctx.fillStyle='#FF4400'; ctx.beginPath(); ctx.ellipse(vX+(i-1)*14,dy,5,8,0,0,Math.PI*2); ctx.fill();
  }
  const aX=W*.15, aY=GY-H*.54;
  ctx.fillStyle='#666'; ctx.beginPath(); ctx.arc(aX,aY,12,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#888'; ctx.beginPath(); ctx.arc(aX,aY,8,0,Math.PI*2); ctx.fill();
  const sa=solved?Math.sin(frame*.06)*.8:Math.sin(frame*.04)*.28;
  const rL=H*.36;
  const seX=aX+Math.sin(sa)*rL, seY=aY+Math.cos(sa)*rL;
  ctx.strokeStyle='#8B4513'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(aX,aY); ctx.lineTo(seX,seY); ctx.stroke();
  ctx.fillStyle='#5C3D1A'; ctx.beginPath(); ctx.roundRect(seX-13,seY,26,8,3); ctx.fill();
  ctx.fillStyle='#FFE566'; ctx.font='bold 10px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('CBN',vX,GY-vH-18);
  if(solved){ctx.font='14px serif'; ctx.fillText('✅',seX,seY-18);}
  ctx.fillStyle='#FF6B35'; ctx.font='bold 12px DM Sans'; ctx.textBaseline='top'; ctx.fillText(label,W/2,10);
}
