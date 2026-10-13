const fs=require('fs'),path=require('path'),crypto=require('crypto');

const VOICE_ID=/^[a-zA-Z0-9_-]{8,80}$/;
const MODEL='eleven_multilingual_v2';
function key(){return process.env.ELEVENLABS_API_KEY||'';}
function requireKey(){if(!key())throw Error('ElevenLabs is not connected. Set ELEVENLABS_API_KEY on the ToonFlow server.');}
async function request(route,options={}){
 requireKey();
 const response=await fetch('https://api.elevenlabs.io'+route,{...options,headers:{'xi-api-key':key(),...(options.body?{'Content-Type':'application/json'}:{}),...options.headers},signal:AbortSignal.timeout(30000)});
 if(!response.ok){let message=`ElevenLabs request failed (${response.status}).`;try{const data=await response.json();message=data.detail?.message||data.detail||message;}catch{}throw Error(String(message).slice(0,300));}
 return response;
}
async function voices(){const response=await request('/v1/voices');const data=await response.json();return (data.voices||[]).map(v=>({id:v.voice_id,name:v.name,category:v.category||'Voice',description:v.description||'',labels:v.labels||{},previewUrl:v.preview_url||null})).filter(v=>VOICE_ID.test(v.id));}
async function sharedVoices(search='',page=0){
 if(typeof search!=='string'||search.length>100||!Number.isInteger(page)||page<0||page>100)throw Error('Invalid voice search.');
 const params=new URLSearchParams({page_size:'50',page:String(page)});if(search.trim())params.set('search',search.trim());
 const data=await (await request('/v1/shared-voices?'+params)).json();
 return {voices:(data.voices||[]).map(v=>({id:v.voice_id,ownerId:v.public_owner_id,name:v.name,category:v.category||'Community',labels:v.labels||{},previewUrl:v.preview_url||null})).filter(v=>VOICE_ID.test(v.id)&&VOICE_ID.test(v.ownerId)),hasMore:!!data.has_more};
}
async function addSharedVoice(ownerId,voiceId,name){
 if(!VOICE_ID.test(ownerId)||!VOICE_ID.test(voiceId)||typeof name!=='string'||!name.trim()||name.length>100)throw Error('Invalid community voice.');
 const data=await (await request(`/v1/voices/add/${encodeURIComponent(ownerId)}/${encodeURIComponent(voiceId)}`,{method:'POST',body:JSON.stringify({new_name:name.trim()})})).json();
 return {id:data.voice_id};
}
async function synthesize(voiceId,text,cacheDir){
 requireKey();if(!VOICE_ID.test(voiceId))throw Error('Invalid ElevenLabs voice ID.');if(typeof text!=='string'||!text.trim()||text.length>2000)throw Error('Voice text must be 1–2,000 characters.');
 fs.mkdirSync(cacheDir,{recursive:true});const hash=crypto.createHash('sha256').update(JSON.stringify([MODEL,voiceId,text])).digest('hex');const filename=path.join(cacheDir,hash+'.mp3');if(fs.existsSync(filename)&&fs.statSync(filename).size>100)return filename;
 const response=await request(`/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,{method:'POST',body:JSON.stringify({text,model_id:MODEL,voice_settings:{stability:.55,similarity_boost:.75}})});
 const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length<100||bytes.length>15*1024*1024)throw Error('ElevenLabs returned an invalid audio clip.');const temp=filename+'.tmp-'+crypto.randomUUID();fs.writeFileSync(temp,bytes);fs.renameSync(temp,filename);return filename;
}
module.exports={voices,sharedVoices,addSharedVoice,synthesize,VOICE_ID};
