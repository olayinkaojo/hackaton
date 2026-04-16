export function drawScene(ctx,scene,W,H,GY,frame){
  switch(scene){
    case 'market': return drawMarket(ctx,W,H,GY,frame);
    case 'shop': return drawShop(ctx,W,H,GY,frame);
    case 'port': return drawPort(ctx,W,H,GY,frame);
    case 'kitchen': return drawKitchen(ctx,W,H,GY,frame);
    case 'construction': return drawConstruction(ctx,W,H,GY,frame);
    case 'workshop': return drawWorkshop(ctx,W,H,GY,frame);
    case 'atelier': return drawAtelier(ctx,W,H,GY,frame);
    case 'garage': return drawGarage(ctx,W,H,GY,frame);
    case 'factory': return drawFactory(ctx,W,H,GY,frame);
    case 'techhub': case 'fintech': return drawTechHub(ctx,W,H,GY,frame);
    case 'studio': case 'stage': return drawStudio(ctx,W,H,GY,frame);
    case 'office': case 'newsroom': return drawOffice(ctx,W,H,GY,frame);
    case 'court': return drawCourt(ctx,W,H,GY,frame);
    case 'ministry': return drawMinistry(ctx,W,H,GY,frame);
    case 'bank': return drawBank(ctx,W,H,GY,frame);
    case 'site': return drawConstruction(ctx,W,H,GY,frame);
    default: return drawMarket(ctx,W,H,GY,frame);
  }
}

function sky(ctx,W,H,c1,c2,c3){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,c1);g.addColorStop(.6,c2);g.addColorStop(1,c3);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function ground(ctx,W,GY,H,c1,c2,frame){ctx.fillStyle=c1;ctx.fillRect(0,GY,W,H-GY);ctx.strokeStyle=c2;ctx.lineWidth=2.5;ctx.setLineDash([24,18]);ctx.lineDashOffset=-(frame*3)%42;ctx.beginPath();ctx.moveTo(0,GY+20);ctx.lineTo(W,GY+20);ctx.stroke();ctx.setLineDash([]);}

function drawMarket(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#FF8C00','#FFA033','#FFB800');
  ctx.fillStyle='rgba(255,255,100,.35)';ctx.beginPath();ctx.arc(W-55,50,45,0,Math.PI*2);ctx.fill();
  [[10,58,68,'#CC3300'],[74,58,78,'#009900'],[138,58,63,'#0000CC'],[208,58,73,'#990099'],[288,58,78,'#CC6600'],[372,52,63,'#006666']].forEach(([sx,sw,sh,col])=>{
    ctx.fillStyle=col;ctx.fillRect(sx,GY-sh,sw,sh);
    ctx.fillStyle='rgba(255,255,255,.65)';ctx.fillRect(sx+2,GY-sh,sw-4,9);
    ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(sx-7,GY-sh-4);ctx.lineTo(sx+sw+7,GY-sh-4);ctx.lineTo(sx+sw+1,GY-sh+7);ctx.lineTo(sx-1,GY-sh+7);ctx.closePath();ctx.fill();
  });
  ['🍅','🥕','🐟','🌾','🧅'].forEach((g,i)=>{ctx.font='13px serif';ctx.textAlign='center';ctx.fillText(g,38+i*78,GY-16);});
  ground(ctx,W,GY,H,'#8B6914','#A07820',frame);
}

function drawShop(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#1a2a4a','#2a3a5a','#3a4a6a');
  [[0,80,120,'#1a2a3a'],[85,60,100,'#2a1a3a'],[150,90,140,'#1a3a2a'],[245,70,110,'#3a2a1a'],[320,80,130,'#1a1a3a'],[405,65,95,'#2a3a1a']].forEach(([bx,bw,bh,c])=>{
    ctx.fillStyle=c;ctx.fillRect(bx,GY-bh,bw,bh);
    for(let r=0;r<Math.floor(bh/22);r++)for(let col=0;col<Math.floor(bw/14);col++)if(Math.random()>.35){ctx.fillStyle='rgba(255,240,150,.45)';ctx.fillRect(bx+5+col*14,GY-bh+7+r*22,8,10);}
  });
  ctx.fillStyle='#2a1a4a';ctx.fillRect(80,GY-155,270,155);
  ctx.fillStyle='rgba(100,200,255,.55)';ctx.fillRect(100,GY-102,230,76);
  ['📱','👗','👟','⌚'].forEach((p,i)=>{ctx.font='17px serif';ctx.textAlign='center';ctx.fillText(p,128+i*54,GY-58);});
  ctx.fillStyle='#FFE566';ctx.font='bold 18px Fraunces,serif';ctx.textAlign='center';ctx.fillText('NIJA SHOP',W/2,GY-118);
  ground(ctx,W,GY,H,'#1a1a2e','#2a2a3e',frame);
}

function drawPort(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#0d2137','#1a4a6b','#26779e');
  ctx.fillStyle='#1a5a8a';ctx.fillRect(0,GY-H*.14,W,H*.14);
  for(let i=0;i<6;i++){const wx=((frame*2+i*70)%(W+40))-40;ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(wx,GY-H*.08);ctx.quadraticCurveTo(wx+15,GY-H*.11,wx+30,GY-H*.08);ctx.stroke();}
  ctx.fillStyle='#FFD700';ctx.fillRect(W*.7,GY-H*.5,7,H*.5);ctx.fillRect(W*.5,GY-H*.5,W*.22,7);
  const cx=((frame*1.5)%(W+80))-40;
  ctx.fillStyle='#CC3300';ctx.fillRect(cx,GY-52,78,43);
  ctx.fillStyle='#fff';ctx.font='bold 8px DM Sans';ctx.textAlign='center';ctx.fillText('NIGERIA EXPORT',cx+39,GY-28);
  ground(ctx,W,GY,H,'#1a1a2e','#2a2a3e',frame);
}

function drawKitchen(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#1a0a00','#2a1400','#3a1e00');
  ctx.fillStyle='#F5F0E8';ctx.fillRect(0,GY-H*.58,W,H*.58);
  ctx.fillStyle='#E0D8C8';ctx.fillRect(0,GY-H*.33,W,H*.08);
  ctx.strokeStyle='#C8C0B0';ctx.lineWidth=.5;
  for(let r=0;r<4;r++)for(let c=0;c<10;c++)ctx.strokeRect(c*43,GY-H*.58+r*30,43,30);
  const st=Math.sin(frame*.2)*3;
  [[80,'#333'],[180,'#555'],[280,'#444']].forEach(([px,pc])=>{
    ctx.fillStyle=pc;ctx.beginPath();ctx.ellipse(px,GY-53,27,11,0,0,Math.PI*2);ctx.fill();
    ctx.fillRect(px-23,GY-78,46,27);
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;
    for(let s=0;s<3;s++){ctx.beginPath();ctx.moveTo(px-7+s*7,GY-80);ctx.quadraticCurveTo(px-3+s*7,GY-93+st,px+s*7,GY-102);ctx.stroke();}
  });
  ground(ctx,W,GY,H,'#5C3D1A','#7A5225',frame);
}

function drawConstruction(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#87CEEB','#ADD8E6','#B0C4DE');
  ctx.fillStyle='#888';ctx.fillRect(80,GY-H*.53,250,H*.53);
  ctx.strokeStyle='#666';ctx.lineWidth=3;
  for(let r=0;r<5;r++){ctx.beginPath();ctx.moveTo(70,GY-r*45-18);ctx.lineTo(340,GY-r*45-18);ctx.stroke();for(let c=0;c<7;c++){ctx.beginPath();ctx.moveTo(70+c*40,GY-r*45-18);ctx.lineTo(70+c*40,GY-(r+1)*45-18);ctx.stroke();}}
  ctx.fillStyle='#FFD700';ctx.fillRect(W*.82,GY-H*.68,6,H*.68);ctx.fillRect(W*.65,GY-H*.68,W*.19,6);
  const hx=W*.7+Math.sin(frame*.04)*18;
  ctx.strokeStyle='#888';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.72,GY-H*.68+6);ctx.lineTo(hx,GY-H*.44);ctx.stroke();
  ctx.beginPath();ctx.arc(hx,GY-H*.43,6,0,Math.PI*2);ctx.stroke();
  ground(ctx,W,GY,H,'#8B7355','#7A6344',frame);
}

function drawWorkshop(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#2a1800','#3a2200','#4a2e00');
  ctx.fillStyle='#5C3D1A';ctx.fillRect(0,GY-H*.58,W,H*.58);
  for(let i=0;i<8;i++){ctx.strokeStyle='#4a3010';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i*54,GY-H*.58);ctx.lineTo(i*54,GY);ctx.stroke();}
  ctx.fillStyle='#8B6914';ctx.fillRect(40,GY-72,280,18);
  ['🪚','🔨','📐','🪛'].forEach((t,i)=>{ctx.font='17px serif';ctx.textAlign='center';ctx.fillText(t,78+i*63,GY-52);});
  ground(ctx,W,GY,H,'#3a2800','#4a3410',frame);
}

function drawAtelier(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#1a0a2a','#2a1a3a','#3a2a4a');
  ctx.fillStyle='#F0E8F0';ctx.fillRect(0,GY-H*.58,W,H*.58);
  [[100,'#FFB6C1'],[220,'#98FB98'],[340,'#87CEEB']].forEach(([mx,mc])=>{
    ctx.fillStyle=mc;ctx.beginPath();ctx.ellipse(mx,GY-98,27,43,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#D4956A';ctx.beginPath();ctx.ellipse(mx,GY-152,13,17,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#888';ctx.fillRect(mx-2,GY-54,4,54);ctx.fillRect(mx-14,GY-54,30,6);
  });
  const fab=((frame*2)%(W+60))-30;
  ctx.strokeStyle='#FF69B4';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(fab,GY-28);ctx.lineTo(fab+58,GY-28);ctx.stroke();
  ground(ctx,W,GY,H,'#E8E0D0','#D8D0C0',frame);
}

function drawGarage(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#1a1a1a','#2a2a2a','#3a3a3a');
  ctx.fillStyle='#2a2a2a';ctx.fillRect(0,GY-H*.58,W,18);
  [80,180,300,390].forEach(lx=>{
    ctx.strokeStyle='#444';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(lx,GY-H*.58+18);ctx.lineTo(lx,GY-H*.33);ctx.stroke();
    ctx.fillStyle='rgba(255,250,200,.75)';ctx.beginPath();ctx.ellipse(lx,GY-H*.33,11,5,0,0,Math.PI*2);ctx.fill();
  });
  const cx=((frame)%(W+160))-80;
  ctx.fillStyle='#CC3300';ctx.beginPath();ctx.roundRect(cx,GY-58,118,38,8);ctx.fill();
  ctx.fillStyle='#AA2200';ctx.beginPath();ctx.roundRect(cx+18,GY-75,70,20,6);ctx.fill();
  ctx.fillStyle='rgba(100,200,255,.55)';ctx.fillRect(cx+22,GY-73,28,16);ctx.fillRect(cx+54,GY-73,28,16);
  ctx.fillStyle='#333';[18,88].forEach(wx=>{ctx.beginPath();ctx.arc(cx+wx,GY-17,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#555';ctx.beginPath();ctx.arc(cx+wx,GY-17,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#333';});
  ground(ctx,W,GY,H,'#1a1a1a','#2a2a2a',frame);
}

function drawFactory(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#0a0a0a','#1a1a1a','#2a2a2a');
  ctx.fillStyle='#555';ctx.fillRect(W*.75,GY-H*.68,28,H*.68);
  for(let i=0;i<4;i++){const py=GY-H*.68-(frame*1.5+i*20)%78,pr=8+i*4;ctx.fillStyle=`rgba(180,180,180,${.38-i*.08})`;ctx.beginPath();ctx.arc(W*.76+14,py,pr,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#444';ctx.fillRect(0,GY-H*.48,W*.73,H*.48);
  for(let r=0;r<3;r++)for(let c=0;c<6;c++){ctx.fillStyle=`rgba(255,180,0,${.38+Math.sin(frame*.05+r+c)*.18})`;ctx.fillRect(20+c*53,GY-H*.48+13+r*48,33,26);}
  ground(ctx,W,GY,H,'#1a1a1a','#2a2a2a',frame);
}

function drawTechHub(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#060614','#0d1628','#12102a');
  ctx.strokeStyle='rgba(78,205,196,.055)';ctx.lineWidth=1;
  for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(i*36,0);ctx.lineTo(i*36,H);ctx.stroke();}
  for(let i=0;i<18;i++){ctx.beginPath();ctx.moveTo(0,i*34);ctx.lineTo(W,i*34);ctx.stroke();}
  for(let i=0;i<18;i++){const px=(i*73+frame*(1+i%3))%W,py=(i*47)%(GY*.8),a=Math.sin(frame*.05+i)*.5+.5;ctx.fillStyle=`rgba(78,205,196,${a*.65})`;ctx.fillRect(px,py,2,8);}
  [[0,70,120,'rgba(26,26,60,.9)'],[75,90,150,'rgba(15,15,50,.9)'],[170,80,130,'rgba(20,20,55,.9)'],[255,100,145,'rgba(10,10,40,.9)'],[360,70,115,'rgba(25,25,65,.9)']].forEach(([bx,bw,bh,c])=>{ctx.fillStyle=c;ctx.fillRect(bx,GY-bh,bw,bh);});
  ground(ctx,W,GY,H,'#07071a','#0d0d28',frame);
}

function drawStudio(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#0a0014','#140028','#1e003c');
  [[80,255,150,0],[W/2,255,200,.5],[W-80,255,100,1]].forEach(([lx,lr,lg,ph])=>{
    const cg=ctx.createRadialGradient(lx,0,0,lx,GY*.7,95);
    const a=.14+Math.sin(frame*.05+ph*Math.PI)*.04;
    cg.addColorStop(0,`rgba(${lr},${lg},255,${a})`);cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(lx,0);ctx.lineTo(lx-68,GY*.78);ctx.lineTo(lx+68,GY*.78);ctx.closePath();ctx.fill();
  });
  ctx.fillStyle='#2a1a4a';ctx.fillRect(0,GY-18,W,18);
  ground(ctx,W,GY,H,'#1a1a2e','#2a2a3e',frame);
}

function drawOffice(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#e8eaf0','#f0f2f8','#f8f9fc');
  ctx.fillStyle='#dde0ea';ctx.fillRect(0,GY-H*.58,W,H*.58);
  ctx.fillStyle='#8B6914';ctx.fillRect(40,GY-62,W-80,14);
  ctx.fillStyle='#333';ctx.beginPath();ctx.roundRect(W/2-48,GY-138,96,68,4);ctx.fill();
  ctx.fillStyle='#4ECDC4';ctx.fillRect(W/2-42,GY-132,84,56);
  ctx.fillStyle='#555';ctx.fillRect(W/2-7,GY-68,14,8);ctx.fillRect(W/2-18,GY-60,36,4);
  [[-78,-28],[-28,2],[62,-18],[102,12]].forEach(([dx,dy])=>{
    ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(W/2+dx,GY-48+dy,33,43,2);ctx.fill();
    ctx.strokeStyle='#ddd';ctx.lineWidth=.5;ctx.strokeRect(W/2+dx,GY-48+dy,33,43);
    ctx.fillStyle='#ccc';ctx.fillRect(W/2+dx+5,GY-38+dy,20,2);ctx.fillRect(W/2+dx+5,GY-31+dy,16,2);
  });
  ground(ctx,W,GY,H,'#d0d4dd','#c0c4cc',frame);
}

function drawCourt(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#1a1400','#2a2200','#3a3000');
  ctx.fillStyle='#4a3820';ctx.fillRect(0,GY-H*.58,W,H*.58);
  ctx.fillStyle='#3a2810';ctx.fillRect(W/2-78,GY-128,156,88);
  ctx.fillStyle='#8B6914';ctx.fillRect(W/2-83,GY-133,166,9);
  ctx.font='26px serif';ctx.textAlign='center';ctx.fillText('🦅',W/2,GY-152);
  const ga=Math.sin(frame*.1)*.28;
  ctx.save();ctx.translate(W/2+28,GY-78);ctx.rotate(ga);
  ctx.fillStyle='#5C3D1A';ctx.fillRect(-4,-17,8,23);ctx.fillRect(-11,-17,22,9);
  ctx.restore();
  [50,W-50].forEach(cx=>{ctx.fillStyle='#888';ctx.fillRect(cx-11,GY-H*.53,22,H*.53);ctx.fillStyle='#999';ctx.fillRect(cx-14,GY-H*.53,28,11);ctx.fillRect(cx-14,GY-9,28,9);});
  ground(ctx,W,GY,H,'#2a1e0a','#3a2e18',frame);
}

function drawMinistry(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#004400','#006600','#008800');
  ctx.fillStyle='#F5F0E0';ctx.fillRect(50,GY-H*.63,W-100,H*.63);
  [80,155,230,305].forEach(cx=>{ctx.fillStyle='#E8E0CC';ctx.fillRect(cx,GY-H*.6,19,H*.6);});
  ctx.fillStyle='#E8E0CC';ctx.beginPath();ctx.moveTo(40,GY-H*.63);ctx.lineTo(W/2,GY-H*.82);ctx.lineTo(W-40,GY-H*.63);ctx.closePath();ctx.fill();
  ctx.fillStyle='#888';ctx.fillRect(W/2-2,GY-H*.88,3,28);
  ctx.fillStyle='#008751';ctx.fillRect(W/2+1,GY-H*.88,18,13);
  ctx.fillStyle='#fff';ctx.fillRect(W/2+7,GY-H*.88,6,13);
  ground(ctx,W,GY,H,'#1a2a0a','#2a3a18',frame);
}

function drawBank(ctx,W,H,GY,frame){
  sky(ctx,W,H,'#003366','#004488','#0055AA');
  const bg=ctx.createLinearGradient(80,0,W-80,0);bg.addColorStop(0,'#1a3a5a');bg.addColorStop(.5,'#2a4a6a');bg.addColorStop(1,'#1a3a5a');
  ctx.fillStyle=bg;ctx.fillRect(80,GY-H*.68,W-160,H*.68);
  for(let r=0;r<6;r++)for(let c=0;c<5;c++){const wx=100+c*52,wy=GY-H*.66+r*46;const gg=ctx.createLinearGradient(wx,wy,wx+36,wy+32);gg.addColorStop(0,'rgba(100,180,255,.48)');gg.addColorStop(1,'rgba(50,120,200,.28)');ctx.fillStyle=gg;ctx.fillRect(wx,wy,36,32);}
  ctx.fillStyle='#FFD700';ctx.font='bold 13px Fraunces,serif';ctx.textAlign='center';ctx.fillText('CBN APPROVED',W/2,GY-H*.7);
  ground(ctx,W,GY,H,'#1a2a3a','#2a3a4a',frame);
}
