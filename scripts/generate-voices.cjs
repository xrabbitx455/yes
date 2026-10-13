const fs=require('fs'),vm=require('vm'),path=require('path');
const m=require('../tools/node_modules/mespeak');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../episode.js'),'utf8'),sandbox);const E=sandbox.window.FRONTLINES;
m.loadConfig(require('../tools/node_modules/mespeak/src/mespeak_config.json'));m.loadVoice(require('../tools/node_modules/mespeak/voices/en/en-us.json'));
const root=path.join(__dirname,'../exports/voices');fs.mkdirSync(root,{recursive:true});const metadata=[];
const pitch={'MASON':32,'HAYES':49,'JACKSON':42,'REED':61,'RED LEADER':25,'COMMAND • RADIO':34,'RED COMMAND':28,'RED COMMANDER':22,'SQUAD':36};
for(const [i,cue] of E.dialogue.entries()){const [start,end,speaker,text]=cue;const speed=Math.max(155,Math.min(295,Math.ceil(text.split(/\s+/).length*60/(end-start-.15))));const filename=`line-${String(i).padStart(3,'0')}.wav`;const wav=m.speak(text,{rawdata:'buffer',pitch:pitch[speaker]??40,speed,amplitude:80,wordgap:0});fs.writeFileSync(path.join(root,filename),wav);metadata.push({start,end,speaker,text,file:filename});}
fs.writeFileSync(path.join(root,'cues.json'),JSON.stringify(metadata,null,2));console.log(`Generated ${metadata.length} synthetic dialogue cues.`);
