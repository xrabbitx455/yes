const fs=require('fs'),path=require('path');
const {synthesize}=require('../elevenlabs.cjs');
const [snapshot,dir,cacheDir]=process.argv.slice(2),project=JSON.parse(fs.readFileSync(snapshot,'utf8'));
let mespeak;
function draftVoice(){
 if(!mespeak){mespeak=require('../../tools/node_modules/mespeak');mespeak.loadConfig(require('../../tools/node_modules/mespeak/src/mespeak_config.json'));mespeak.loadVoice(require('../../tools/node_modules/mespeak/voices/en/en-us.json'));}
 return mespeak;
}
async function main(){
 fs.mkdirSync(dir,{recursive:true});let offset=0,cues=[];
 for(const scene of project.scenes){
  for(const line of scene.dialogue){
   const start=offset+line.start,end=offset+line.end,actor=project.cast.find(c=>c.speaker===line.speaker),index=String(cues.length).padStart(4,'0');let file;
   if(actor?.voiceId){file=`voice-${index}.mp3`;const source=await synthesize(actor.voiceId,line.text,cacheDir);fs.copyFileSync(source,path.join(dir,file));}
   else{file=`voice-${index}.wav`;const words=line.text.split(/\s+/).length,pitch=actor?.equipment==='medic'?58:actor?.equipment==='radio'?49:actor?.side===-1?29:35,speed=Math.max(155,Math.min(300,Math.ceil(words*60/(end-start-.1))));fs.writeFileSync(path.join(dir,file),draftVoice().speak(line.text,{rawdata:'buffer',speed,pitch,amplitude:85}));}
   cues.push({start,end,speaker:line.speaker,text:line.text,file});
  }
  offset+=scene.duration;
 }
 fs.writeFileSync(path.join(dir,'cues.json'),JSON.stringify(cues));console.log(`Prepared ${cues.length} dialogue lines.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
