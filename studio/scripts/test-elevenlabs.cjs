const assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
process.env.ELEVENLABS_API_KEY='test-key';
const elevenlabs=require('../elevenlabs.cjs');
const original=global.fetch;let calls=0;
global.fetch=async(url,options)=>{
 calls++;assert.equal(options.headers['xi-api-key'],'test-key');
 if(url.endsWith('/v1/voices'))return new Response(JSON.stringify({voices:[{voice_id:'voice12345',name:'Test voice',category:'premade'}]}));
 if(url.includes('/v1/shared-voices?'))return new Response(JSON.stringify({voices:[{voice_id:'shared12345',public_owner_id:'owner12345',name:'Shared voice'}],has_more:false}));
 if(url.includes('/v1/voices/add/'))return new Response(JSON.stringify({voice_id:'added12345'}));
 if(url.includes('/v1/text-to-speech/'))return new Response(Buffer.alloc(200,7));
 throw Error('Unexpected ElevenLabs route: '+url);
};
(async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'toonflow-elevenlabs-'));try{
 assert.equal((await elevenlabs.voices())[0].name,'Test voice');
 assert.equal((await elevenlabs.sharedVoices('drama')).voices[0].ownerId,'owner12345');
 assert.equal((await elevenlabs.addSharedVoice('owner12345','shared12345','Shared voice')).id,'added12345');
 const first=await elevenlabs.synthesize('voice12345','Hold your fire.',dir),before=calls,second=await elevenlabs.synthesize('voice12345','Hold your fire.',dir);
 assert.equal(first,second);assert.equal(calls,before);assert.equal(fs.statSync(first).size,200);
 await assert.rejects(()=>elevenlabs.synthesize('../bad','text',dir),/Invalid ElevenLabs voice ID/);
 console.log('ElevenLabs catalog, library import, synthesis, and reusable clip cache passed');
}finally{global.fetch=original;fs.rmSync(dir,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
