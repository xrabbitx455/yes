(() => {
'use strict';
const E=window.FRONTLINES, canvas=document.querySelector('#stage'),ctx=canvas.getContext('2d');
canvas.width=E.width;canvas.height=E.height;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*clamp(t);
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
const cast=Object.fromEntries(E.cast.map(c=>[c.id,c]));
const shots=E.shots, dialogue=E.dialogue;
const events=[{t:233.2,kind:'unknown',x:488,y:482}];
// Short bursts, pauses and one reload replace endless automatic fire.
for(let t=238;t<322;t+=1.7){
 for(let j=0;j<3;j++)events.push({t:t+j*.11,kind:'shot',id:'mason',x:470,y:440});
 if(t<290||t>=297)for(let j=0;j<5;j++)events.push({t:t+.65+j*.085,kind:'shot',id:'jackson',x:360,y:440});
 if(t<315)for(let j=0;j<3;j++)events.push({t:t+.9+j*.14,kind:'shot',id:'redlead',x:855,y:440});
}
events.push({t:277,kind:'hit',id:'hayes'},{t:269,kind:'hit',id:'redtwo'},{t:290,kind:'reload',id:'jackson'});
window.FRONTLINES_EVENTS=events.sort((a,b)=>a.t-b.t);
let currentTime=0,playing=false,previous=null;
const audio=document.querySelector('#soundtrack');
const timeline=document.querySelector('#timeline'),play=document.querySelector('#play');
let audioEnabled=false;
function path(points,color,width=4){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function label(s,x,y,size=16,color='#ebeee8',align='left',weight=600){ctx.fillStyle=color;ctx.font=`${weight} ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(s,x,y);}
function limb(a,b,l1,l2,bend,color,width){const dx=b[0]-a[0],dy=b[1]-a[1],r=Math.min(Math.hypot(dx,dy),l1+l2-.01),ang=Math.atan2(dy,dx),off=Math.acos(clamp((l1*l1+r*r-l2*l2)/(2*l1*Math.max(r,.01)),-1,1));const joint=[a[0]+Math.cos(ang+off*bend)*l1,a[1]+Math.sin(ang+off*bend)*l1];path([a,joint,b],color,width);}
function weapon(kind,x,y,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);const metal='#171e24',edge='#596366';
 rect(-12,-7,43,12,metal);rect(30,-5,32,5,metal);path([[62,-3],[77,-3]],metal,4);rect(-29,-5,19,9,metal);rect(14,5,7,15,metal);path([[0,2],[-4,15]],metal,5);rect(18,-12,12,5,metal);
 path([[-8,-7],[28,-7]],edge,1.5);
 if(kind==='M249'||kind==='LMG'){rect(9,6,24,17,'#323c35');path([[48,0],[42,17]],metal,3);path([[48,0],[57,17]],metal,3);rect(5,-16,21,4,metal);}
 if(kind==='AK')path([[20,4],[24,14],[18,24]],metal,7);
 ctx.restore();}
function soldier(id,x,ground,t,pose='idle',scale=1,face=null){const c=cast[id],d=face??c.side;ctx.save();ctx.translate(x,ground);ctx.scale(d*scale,scale);
 const gait=Math.sin(t*(pose==='run'?12:7)+x*.01);const crouched=['crouch','kneel','radio','assist','reload'].includes(pose);
 let hipY=crouched?-36:-67;
 if(pose==='walk'||pose==='run')hipY+=Math.abs(gait)*3;
 if(pose==='fallen'){ctx.translate(0,-16);const fallTime=id==='hayes'?277:269;ctx.rotate(-Math.PI/2*smooth((t-fallTime)/.65));hipY=-35;}
 if(pose==='crawl'){ctx.translate(0,-17);ctx.rotate(-1.05);hipY=-40;}
 if(pose==='hit'){ctx.translate(-smooth((t-277)/.4)*9,0);ctx.rotate(-.12);}
 ctx.translate(0,hipY);
 circle(0,0,5,c.color);
 const moving=pose==='walk'||pose==='run';
 const fy=-hipY;
 limb([-4,0],[-24+(moving?gait*22:0),fy],41,41,-1,c.color,7);
 limb([4,0],[25-(moving?gait*22:0),fy],41,41,1,c.color,7);
 path([[-31+(moving?gait*22:0),fy],[-17+(moving?gait*22:0),fy]],'#20282d',8);
 path([[18-(moving?gait*22:0),fy],[32-(moving?gait*22:0),fy]],'#20282d',8);
 path([[0,0],[0,-76]],c.color,8);
 rect(-16,-68,32,44,'#293740');path([[-14,-63],[14,-63]],'#647579',2);rect(-10,-23,20,8,'#293740');
 if(c.pack){rect(-27,-70,12,44,'#202e37');if(c.pack==='radio')path([[-26,-70],[-30,-117]],'#222b2f',3);else{rect(-29,-55,14,4,'#d8ddcf');rect(-24,-60,4,14,'#d8ddcf');}}
 const breath=Math.sin(t*2+x)*.7;
 ctx.strokeStyle=c.color;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,-104+breath,21,0,Math.PI*2);ctx.stroke();
 polygon([[-23,-108],[-18,-127],[15,-129],[23,-108]],'#263741');path([[-24,-108],[25,-108]],'#4c5d62',4);circle(10,-103+breath,2,'#e9f2f5');
 let w1=[19,-43],w2=[48,-48],angle=0;
 if(['walk','run','idle'].includes(pose)){w1=[20,-32];w2=[45,-35];angle=.21;}
 if(pose==='radio'){w1=[9,-101];w2=[34,-19];rect(8,-112,10,23,'#111b22');path([[14,-112],[14,-126]],'#111b22',3);}
 if(pose==='signal'){w1=[-16,-125];w2=[40,-31];}
 if(pose==='reload'){w1=[20,-24];w2=[24,-16];angle=.45;}
 if(pose==='assist'){w1=[44,-7];w2=[49,-12];}
 if(['fallen','crawl'].includes(pose)){w1=[23,-23];w2=[49,-34];angle=.6;}
 const firing=events.find(e=>e.kind==='shot'&&e.id===id&&t>=e.t&&t<e.t+.075)&&['aim','kneel','crouch'].includes(pose);
 if(firing){w1[0]-=3;w2[0]-=3;}
 limb([-8,-67],w1,33,33,-1,c.color,6);limb([8,-67],w2,33,33,1,c.color,6);
 if(!['radio','assist','signal'].includes(pose)){weapon(c.weapon,25-(firing?3:0),w2[1],angle);}
 if(firing){const mx=101,my=w2[1]-3;polygon([[mx,my],[mx+24,my-11],[mx+16,my],[mx+28,my+9]],'#ffd185');path([[mx+34,my],[mx+104,my]],'#dfba81',1.5);}
 if(id==='hayes'&&t>=277){rect(12,-68,13,8,'#e2e5d3');path([[14,-66],[22,-65]],'#a8b2aa',1);}
 ctx.restore();}
function pine(x,y,s,color){rect(x-3*s,y-65*s,6*s,65*s,'#303936');for(let j=0;j<3;j++)polygon([[x,y-(190-j*40)*s],[x-(47+j*5)*s,y-(75-j*27)*s],[x+(47+j*5)*s,y-(75-j*27)*s]],color);}
function sky(t){const g=ctx.createLinearGradient(0,45,0,600);g.addColorStop(0,'#263640');g.addColorStop(.58,'#8a938a');g.addColorStop(1,'#bfaa84');ctx.fillStyle=g;ctx.fillRect(0,0,1280,720);circle(1060,240,41,'#c4b58c');
 for(let layer=0;layer<3;layer++){polygon([[0,330+layer*60],[220,245+layer*70],[420,300+layer*55],[690,210+layer*80],[950,320+layer*50],[1280,260+layer*70],[1280,720],[0,720]],['#647472','#4b615c','#384f47'][layer]);}
 for(let i=0;i<25;i++)pine(i*57-30,505, .65+(i%3)*.15,'#2c443b');rect(0,500,1280,220,'#4b5548');
 polygon([[570,500],[690,500],[1010,720],[180,720]],'#827d67');
}
function fog(t){ctx.save();ctx.globalAlpha=.07;for(let i=0;i<8;i++){ctx.fillStyle='#e0dfcc';ctx.beginPath();ctx.ellipse(((i*210+t*8)%1700)-200,510+i%3*24,230,21,0,0,Math.PI*2);ctx.fill();}ctx.restore();}
function flag(x,y,t,damaged=false){path([[x,y],[x,y-164]],'#858f86',4);const wave=Math.sin(t*3)*7;polygon([[x,y-160],[x+90,y-153+wave],[x+(damaged?64:90),y-129+wave],[x+80,y-115+wave],[x,y-125]],'#356e9c');path([[x+20,y-157],[x+20,y-126]],'#83b5d4',2);}
function sandbags(x,y,w=170){for(let row=0;row<3;row++)for(let i=0;i<Math.ceil(w/40);i++){const xx=x+i*40+(row%2?13:0);ctx.fillStyle=['#756f53','#817959','#6b664e'][row];ctx.beginPath();ctx.roundRect(xx,y-row*15,40,18,7);ctx.fill();}}
function barrier(x,y,w=145){polygon([[x,y],[x+10,y-46],[x+w-10,y-46],[x+w,y],[x+w,y+11],[x,y+11]],'#7a8279');rect(x+10,y-42,w-20,9,'#969b8e');for(let i=0;i<4;i++)path([[x+22+i*27,y-20],[x+34+i*27,y-10]],'#666c63',2);}
function supplies(x,y){rect(x,y-23,50,23,'#3b4539');path([[x+10,y-22],[x+10,y]],'#69725e',2);rect(x+56,y-18,36,18,'#625c44');}
function tower(x,y){path([[x-32,y],[x-20,y-196],[x+41,y-196],[x+60,y]],'#525e56',9);path([[x-26,y-40],[x+50,y-138],[x-20,y-150],[x+50,y-35]],'#737b6a',4);rect(x-45,y-240,108,58,'#55645a');rect(x-30,y-229,75,33,'#202e2c');polygon([[x-59,y-240],[x+7,y-265],[x+76,y-240]],'#333e37');path([[x+55,y-190],[x+68,y]],'#758071',3);}
function checkpoint(t,damage=t>=250){sky(t);tower(165,514);rect(259,390,208,132,'#687061');rect(280,424,41,98,'#28352f');rect(350,412,82,48,'#273b35');polygon([[245,393],[270,370],[450,370],[483,393]],'#414f46');label('ECHO-7',362,402,13,'#c2c5ae');
 path([[688,415],[688,549]],'#8a9180',6);path([[688,426],[789,452],[785,547],[688,520],[688,426]],'#8a9180',4);for(let i=0;i<6;i++)path([[688,434+i*15],[785,459+i*14]],'#657267',1);
 flag(510,518,t,true);sandbags(800,532,150);barrier(374,553);barrier(198,573,135);supplies(900,545);
 if(damage){path([[443,439],[416,456],[436,477]],'#39413b',3);for(let i=0;i<8;i++){const age=(t*.4+i*.17)%1;ctx.fillStyle=`rgba(33,39,37,${.19*(1-age)})`;ctx.beginPath();ctx.ellipse(403+Math.sin(i)*20+age*45,380-age*170,25+age*30,20+age*25,0,0,Math.PI*2);ctx.fill();}}
}
function humvee(x,y,t,s=1,door=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(-135,-24,274,24,'#1e2a29');polygon([[-145,-35],[-137,-82],[-70,-91],[-48,-131],[73,-131],[101,-88],[142,-65],[142,-22],[-145,-22]],'#55634d');polygon([[-42,-124],[7,-124],[7,-88],[-62,-88]],'#223940');polygon([[17,-124],[65,-124],[86,-88],[17,-88]],'#223940');rect(-130,-74,64,35,'#46553f');rect(13,-82,76,53,'#4a5944');path([[10,-126],[10,-24]],'#253a2d',3);rect(65,-72,10,4,'#222d2b');rect(118,-55,20,9,'#c4c2a1');rect(-138,-55,6,10,'#ae7257');
 for(const wx of [-88,87]){circle(wx,-18,29,'#182122');circle(wx,-18,15,'#4d5c54');for(let i=0;i<5;i++){const a=t*2+i*1.256;path([[wx,-18],[wx+12*Math.cos(a),-18+12*Math.sin(a)]],'#26332f',2);}}
 if(door>0){polygon([[18,-83],[18+door*71,-92],[18+door*75,-26],[18,-29]],'#607052');path([[20,-80],[20+door*69,-88]],'#839176',2);}
 ctx.restore();}
function armored(kind,x,y,t,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const red='#8d514c';
 if(kind==='tank'){polygon([[-110,-30],[-88,-60],[93,-60],[117,-27],[104,0],[-99,0]],'#3b403a');for(let i=0;i<7;i++){circle(-82+i*27,-18,13,'#1f2725');circle(-82+i*27,-18,7,'#596052');}rect(-94,-65,187,22,'#62674f');polygon([[-48,-65],[-35,-106],[40,-106],[58,-65]],'#757458');path([[34,-94],[144,-94]],'#4f5744',12);rect(-20,-101,30,10,red);}
 if(kind==='apc'){polygon([[-98,-60],[-74,-101],[69,-101],[101,-54],[101,-17],[-98,-17]],'#636f50');for(let i=0;i<4;i++){circle(-72+i*49,-16,20,'#202824');circle(-72+i*49,-16,10,'#59674c');}rect(-37,-112,50,17,'#737859');path([[2,-110],[49,-112]],'#3e4c37',5);rect(30,-90,37,8,red);}
 if(kind==='truck'){rect(-123,-115,154,82,'#586347');polygon([[35,-33],[35,-111],[90,-111],[121,-78],[121,-33]],'#727c57');rect(50,-103,37,35,'#2a3c38');rect(-124,-34,246,15,'#323f32');for(const wx of [-91,-38,88]){circle(wx,-13,21,'#202823');circle(wx,-13,10,'#5a684c');}rect(40,-61,34,9,red);for(let i=0;i<4;i++){circle(-107+i*32,-92,7,'#e07365');rect(-113+i*32,-87,13,26,'#33413a');}}
 ctx.restore();}
function helicopter(x,y,t,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);polygon([[-72,0],[-54,-25],[19,-26],[45,-11],[45,7],[-40,18],[-75,3]],'#4a5b49');polygon([[-47,-21],[-12,-23],[7,-3],[-51,-2]],'#233e43');path([[21,-1],[119,-20]],'#4a5b49',10);polygon([[104,-18],[108,-48],[123,-45],[124,-17]],'#4a5b49');path([[-21,-23],[-21,-39]],'#2c3b30',5);path([[-118+Math.sin(t*40)*20,-41],[88-Math.sin(t*40)*20,-41]],'#232e2b',3);path([[-39,18],[-36,30],[29,30],[30,14]],'#26392d',4);rect(14,-13,18,6,'#bf6d60');ctx.restore();}
function radioDesk(t){rect(0,0,1280,720,'#27332f');rect(72,124,1134,431,'#455046');for(let i=0;i<7;i++)path([[80+i*190,140],[80+i*190,543]],'#536152',2);rect(0,503,1280,102,'#5a5a46');rect(536,303,249,194,'#202d2a');rect(563,333,188,72,'#17211f');path([[577,352],[612,372],[640,340],[700,382],[729,350]],'#35433b',3);circle(572,444,17,'#48554a');circle(741,444,17,'#48554a');rect(616,432,80,25,'#101b18');label('NO POWER',656,450,12,'#566255','center');path([[560,301],[547,163]],'#1e2927',6);path([[800,470],[899,460],[920,502]],'#222c29',5);rect(790,424,42,61,'#28352f');label('CHECKPOINT RADIO / DAMAGED',640,214,18,'#c1c7b7','center');
 soldier('reed',397,591,t,'crouch',1.35);soldier('hayes',900,591,t,'radio',1.35,-1);}
function casings(t){rect(0,0,1280,720,'#625f4e');for(let i=0;i<30;i++){const x=100+(i*173)%1090,y=190+(i*61)%350;ctx.save();ctx.translate(x,y);ctx.rotate(i*.87);rect(-15,-5,30,10,'#aa9866');rect(-15,-6,4,12,'#c6b077');path([[-10,-3],[10,-3]],'#d0ba81',1);ctx.restore();}label('SPENT CASINGS',64,132,18,'#c6c4b4');ctx.save();ctx.translate(1010,300);ctx.rotate(.18);weapon('M4',0,0);ctx.restore();}
function interiorVehicle(t){rect(0,0,1280,720,'#16231f');rect(83,95,1114,342,'#819086');for(let i=0;i<12;i++)pine(((i*140-t*34)%1600+1600)%1600-160,437,1,'#334f3e');rect(0,418,1280,225,'#24352f');path([[640,93],[640,423]],'#283e33',18);rect(38,82,1205,17,'#334a3b');circle(320,510,59,'#131e1a');ctx.strokeStyle='#66745e';ctx.lineWidth=10;ctx.beginPath();ctx.arc(320,510,58,0,Math.PI*2);ctx.stroke();rect(700,445,210,53,'#162620');label('ECHO ONE',805,478,16,'#778d6f','center');soldier('mason',430,604,t,'idle',1.8);soldier('hayes',917,615,t,'radio',1.8,-1);}
function briefing(t){rect(0,0,1280,720,'#25332d');rect(0,99,1280,459,'#3c4b3e');for(let i=0;i<8;i++)path([[i*190,100],[i*190,558]],'#485746',2);rect(510,159,569,315,'#788168');for(let i=0;i<14;i++)path([[535+i*37,169],[535+i*37,463]],'#67765c',1);for(let i=0;i<8;i++)path([[521,184+i*36],[1070,184+i*36]],'#67765c',1);path([[620,440],[715,378],[760,277],[970,201]],'#cfbc8a',6);path([[550,245],[1040,335]],'#c78c78',3);circle(760,277,9,'#355f91');label('ECHO-7',779,273,17,'#1f3432');label('NORTHERN BOUNDARY',846,376,14,'#293d30');rect(0,559,1280,90,'#27332a');
 soldier('mason',490,573,t,'signal',1.5);soldier('hayes',230,592,t,'idle',1.35);soldier('jackson',127,596,t,'idle',1.35);soldier('reed',347,599,t,'idle',1.35);}
function base(t,people=true,vehicle=true){sky(t);rect(633,351,350,181,'#5d6b57');polygon([[605,353],[644,312],[970,312],[1009,353]],'#39483b');rect(771,398,71,134,'#283c2e');rect(665,380,76,53,'#233c35');label('OPERATIONS',808,380,18,'#bdc4aa','center');flag(1116,546,t);sandbags(61,541,166);if(vehicle)humvee(415,566,t,.95);
 if(people)E.cast.slice(0,4).forEach((c,i)=>soldier(c.id,730+i*74,573,t,'idle',.8));}
function combatEffects(t){for(const e of events){const age=t-e.t;if(age<0||age>.65)continue;// The first impact has no incoming tracer: its source remains unknown.

 if(e.kind==='unknown'||e.kind==='shot'){const x=e.kind==='unknown'?488:e.id==='redlead'?460:855,y=e.kind==='unknown'?482:494+Math.sin(e.t)*24;
 for(let i=0;i<7;i++){const dx=Math.sin(e.t*13+i)*35,dy=-Math.abs(Math.cos(i*2))*50;circle(x+dx*age,y+dy*age+age*age*120,2*(1-age),'#b0a284');}
 ctx.fillStyle=`rgba(176,163,131,${.22*(1-age)})`;ctx.beginPath();ctx.ellipse(x+age*13,y-age*20,age*40,age*22,0,0,Math.PI*2);ctx.fill();
 if(e.kind==='shot'){ctx.fillStyle=`rgba(172,174,160,${.12*(1-age)})`;ctx.beginPath();ctx.ellipse(e.x+age*40,e.y-age*17,8+age*20,3+age*13,0,0,Math.PI*2);ctx.fill();const ex=e.x-20+age*30,ey=e.y-age*75+age*age*150;ctx.save();ctx.translate(ex,ey);ctx.rotate(age*20);rect(-3,-1,6,2,'#c1a66a');ctx.restore();}}
 }}
function battle(t,view){checkpoint(t);
 const withdrawal=t>=315,progress=smooth((t-315)/22),redsVisible=t<344;
 const injured=t>=277;
 if(redsVisible){soldier('redlead',lerp(942,1260,progress),543,t,view==='redwounded'?'radio':withdrawal?'assist':'kneel',.86);soldier('redtwo',lerp(1020,1320,progress),555,t,t>=269?(withdrawal?'crawl':'fallen'):'aim',.8);soldier('redthree',lerp(1134,1400,progress),539,t,withdrawal?'walk':'crouch',.8);}
 soldier('mason',447,563,t,['withdrawal','restored'].includes(view)&&t>=336?'radio':'kneel',.9);
 soldier('jackson',320,558,t,t>=290&&t<297?'reload':t>=323?'kneel':'aim',.94);
 soldier('hayes',205,579,t,injured?'fallen':t<277?'radio':'hit',.87);
 soldier('reed',injured?lerp(143,267,(t-277)/5):143,580,t,injured?(t<282?'crawl':'assist'):'crouch',.9);
 barrier(374,577,146);barrier(175,597,149);sandbags(905,571,149);
 if(t>=275&&t<323)combatEffects(t);fog(t);
}
function world(shot,t){const u=t-shot.start,v=shot.view;
 if(v==='base')base(t);
 else if(v==='briefing')briefing(t);
 else if(v==='departure'){base(t,false,false);humvee(447,590,t,1.25,u<13?.85:Math.max(0,1-(u-13)));if(u<13)E.cast.slice(0,4).forEach((c,i)=>soldier(c.id,lerp(780+i*61,490+i*9,u/13),588,t,'walk',.9));}
 else if(v==='drive'){sky(t);for(let i=0;i<10;i++)pine(((i*190-t*38)%2100+2100)%2100-260,610,1.6,'#203c30');humvee(640,596+Math.sin(t*19)*1.3,t,1.4);}
 else if(v==='vehicle')interiorVehicle(t);
 else if(v==='dismount'){sky(t);humvee(290,570,t,1.1,u<7?.8:0);E.cast.slice(0,4).forEach((c,i)=>soldier(c.id,lerp(365+i*23,1320+i*99,(u-i)/19),592,t,c.id==='mason'&&u>9&&u<14?'signal':'walk',1));}
 else if(v==='checkpoint'){checkpoint(t,false);fog(t);}
 else if(v==='investigate'){if(u<11)radioDesk(t);else if(u>19)casings(t);else {checkpoint(t,false);soldier('jackson',885,571,t,'crouch');soldier('mason',lerp(470,731,(u-11)/8),569,t,'walk');}}
 else if(v==='warning'){checkpoint(t,false);soldier('hayes',519,580,t,'radio',1.35);soldier('reed',730,565,t,'signal',1.1);soldier('mason',884,556,t,'idle',1.1);fog(t);}
 else if(v==='arrival'){checkpoint(t,false);E.cast.slice(4).forEach((c,i)=>soldier(c.id,lerp(1290+i*100,940+i*92,u/17),531+i%2*10,t,u<12?'walk':'aim',.74));soldier('mason',420,582,t,u<10?'signal':'aim',1.05);soldier('jackson',265,582,t,'aim');fog(t);}
 else if(v==='standoff'||v==='trigger'){checkpoint(t,false);E.cast.forEach((c,i)=>soldier(c.id,i<4?[442,219,328,119][i]:[948,1054,1160][i-4],i%2?575:552,t,v==='trigger'&&t>=235?(t<238?'run':'crouch'):'aim',i<4?.9:.85));if(t>=233.2)combatEffects(t);fog(t);}
 else if(['combat','medic','redwounded','withdrawal','aftermath','restored'].includes(v))battle(t,v);
 else if(v==='convoy'){sky(t);polygon([[0,414],[1280,260],[1280,575],[0,714]],'#6d6d55');const zoom=lerp(1.2,.75,u/20);ctx.save();ctx.translate(640,414);ctx.scale(zoom,zoom);ctx.translate(-640,-414);for(let row=0;row<2;row++)for(let i=0;i<6;i++){const x=((i*263+row*93-u*25)%1660+1660)%1660-230,y=410+row*178-x*.09;armored(['tank','apc','truck'][i%3],x,y,t,.8+row*.12);}helicopter(lerp(950,430,u/20),180+Math.sin(t)*3,t,.8);ctx.restore();fog(t);}
 else if(v==='end'){rect(0,0,1280,720,'#0b1116');label('RED vs. BLUE',640,250,32,'#e3e6df','center');label('FRONTLINES',640,318,67,'#e3e6df','center');label('END OF EPISODE 1 — FIRST CONTACT',640,390,19,'#b1b8ac','center');label('NEXT: AMBUSH',640,455,17,'#ab8d72','center');}
}
function camera(shot,t){const u=t-shot.start,v=shot.view;let zoom=1,x=640,y=350;
 if(v==='briefing'){zoom=1.02+u*.002;x=620;}
 if(v==='warning'){zoom=1.06+u*.0015;x=619;}
 if(v==='standoff'){if(u<8){zoom=1.32;x=407;}else if(u<17){zoom=1.3;x=970;}else{zoom=1.08;x=640;}}
 if(v==='trigger'&&u<3){zoom=1.4;x=570;}
 if(v==='combat'){zoom=1.07;}
 if(v==='medic'){zoom=1.64;x=284;y=475;}
 if(v==='redwounded'){zoom=1.62;x=1022;y=461;}
 if(v==='aftermath'){zoom=1.1;}
 if(v==='restored'){zoom=1.4;x=418;y=443;}
 x=clamp(x,640/zoom,1280-640/zoom);ctx.translate(640,350);ctx.scale(zoom,zoom);ctx.translate(-x,-y);
 if(t>233.2&&t<324){ctx.translate(Math.sin(t*53)*1.3,Math.cos(t*41)*.9);}
}
function wrap(s,maxWidth){const words=s.split(' '),lines=[];let line='';for(const w of words){const next=line?line+' '+w:w;if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=w;}else line=next;}if(line)lines.push(line);return lines;}
function subtitles(t){const cue=dialogue.find(c=>t>=c[0]&&t<c[1]);if(!cue)return;const color=cue[2].startsWith('RED')?'#f28b80':cue[2].includes('COMMAND')?'#d9c99a':'#8bbbf1';label(cue[2],640,628,12,color,'center');ctx.font='500 21px system-ui';const lines=wrap(cue[3],1110);lines.forEach((s,i)=>label(s,640,655+i*26,21,'#eef0e9','center',500));}
function render(t,updateUI=true){t=clamp(t,0,E.duration);const shot=shots.find(s=>t>=s.start&&t<s.end)||shots[shots.length-1];ctx.setTransform(1.5,0,0,1.5,0,0);ctx.globalAlpha=1;rect(0,0,1280,720,'#0b1116');ctx.save();ctx.beginPath();ctx.rect(0,70,1280,535);ctx.clip();camera(shot,t);world(shot,t);ctx.restore();
 // A light grade and stable letterboxing tie locations together.
 rect(0,70,1280,535,'#1d302d12');rect(0,0,1280,70,'#0b1116');rect(0,605,1280,115,'#0b1116');
 if(t>3&&t<11){label('RED vs. BLUE: FRONTLINES',640,245,36,'#f0eee4','center');label('SEASON 1 / EPISODE 1: FIRST CONTACT',640,284,16,'#ced0bc','center');}
 if(t<4){rect(0,0,1280,720,`rgba(0,0,0,${1-smooth((t-1)/3)})`);}
 if(t>52&&t<55)rect(0,0,1280,720,`rgba(0,0,0,${smooth((t-52)/2)})`);
 if(t>=415){/* End card has its own titles. */}else if(t-shot.start<4){ctx.globalAlpha=1-clamp((t-shot.start-2)/2);label(shot.label,46,110,13,'#e0dfc9');ctx.globalAlpha=1;}
 subtitles(t);
 if(updateUI){timeline.value=t;document.querySelector('#time').textContent=`${stamp(t)} / 07:00`;document.querySelector('#shot-name').textContent=shot.name;}
 return {shot:shot.name,view:shot.view,cue:dialogue.find(c=>t>=c[0]&&t<c[1])||null};}
function stamp(t){return `${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;}
function setPlaying(value){playing=value;play.textContent=playing?'Pause':currentTime>=E.duration?'Replay':'Play';if(audioEnabled){if(playing){audio.currentTime=currentTime;audio.play().catch(()=>{document.querySelector('#audio-status').textContent='Audio unavailable — build soundtrack first';});}else audio.pause();}}
function frame(now){if(previous!==null&&playing){currentTime=Math.min(E.duration,currentTime+(now-previous)/1000);if(currentTime===E.duration)setPlaying(false);}previous=now;render(currentTime);requestAnimationFrame(frame);}
play.onclick=()=>{if(currentTime>=E.duration)currentTime=0;setPlaying(!playing);};
document.querySelector('#restart').onclick=()=>{currentTime=0;setPlaying(true);render(0);};
timeline.max=E.duration;timeline.oninput=()=>{currentTime=+timeline.value;setPlaying(false);audio.currentTime=currentTime;render(currentTime);};
document.querySelector('#sound').onclick=()=>{audioEnabled=!audioEnabled;document.querySelector('#sound').textContent=audioEnabled?'Sound on':'Sound off';audio.muted=!audioEnabled;setPlaying(playing);};
const chapters=document.querySelector('#chapters');shots.filter((s,i)=>[0,3,6,9,12,16,18].includes(i)).forEach(s=>{const b=document.createElement('button');b.textContent=`${stamp(s.start)} · ${s.name}`;b.onclick=()=>{currentTime=s.start;setPlaying(false);render(currentTime);};chapters.appendChild(b);});
window.renderFrame=t=>{currentTime=clamp(t,0,E.duration);setPlaying(false);return render(currentTime);};
window.renderExportFrame=t=>render(t,false);
window.getFramePng=()=>canvas.toDataURL('image/png').split(',')[1];
window.animationReady=true;render(0);requestAnimationFrame(frame);
})();
