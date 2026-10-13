const fs=require('fs'),path=require('path');
const [snapshot,dir]=process.argv.slice(2),project=JSON.parse(fs.readFileSync(snapshot,'utf8'));
const m=require('../../tools/node_modules/mespeak');m.loadConfig(require('../../tools/node_modules/mespeak/src/mespeak_config.json'));m.loadVoice(require('../../tools/node_modules/mespeak/voices/en/en-us.json'));
fs.mkdirSync(dir,{recursive:true});let offset=0,cues=[];
for(const scene of project.scenes){for(const line of scene.dialogue){const start=offset+line.start,end=offset+line.end;const file=`voice-${String(cues.length).padStart(4,'0')}.wav`;const words=line.text.split(/\s+/).length;const actor=project.cast.find(c=>c.speaker===line.speaker);const pitch=actor?.equipment==='medic'?58:actor?.equipment==='radio'?49:actor?.side===-1?29:35;const speed=Math.max(155,Math.min(300,Math.ceil(words*60/(end-start-.1))));const data=m.speak(line.text,{rawdata:'buffer',speed,pitch,amplitude:85});fs.writeFileSync(path.join(dir,file),data);cues.push({start,end,speaker:line.speaker,text:line.text,file});}offset+=scene.duration;}
fs.writeFileSync(path.join(dir,'cues.json'),JSON.stringify(cues));console.log(`Synthesized ${cues.length} dialogue lines.`);
