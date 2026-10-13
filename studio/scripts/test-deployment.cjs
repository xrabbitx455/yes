const fs=require('fs'),os=require('os'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const missing=spawnSync(process.execPath,['-e',"process.env.NODE_ENV='production'; delete process.env.TOONFLOW_SETUP_KEY; require('./studio/server.cjs')"],{cwd:root,encoding:'utf8',timeout:10000});
assert.equal(missing.status,1);
assert.match(missing.stderr,/TOONFLOW_SETUP_KEY/);

process.env.NODE_ENV='production';
process.env.TOONFLOW_SETUP_KEY=crypto.randomBytes(32).toString('hex');
process.env.STUDIO_DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'toonflow-deploy-test-'));
const {createServer}=require('../server.cjs');

(async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 const send=(name,setupKey)=>fetch(base+'/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email:name.toLowerCase().replace(/\s+/g,'')+'@example.test',password:crypto.randomBytes(16).toString('hex'),acceptedAgreement:true,setupKey})});
 try{
  const first=await (await fetch(base+'/api/auth/me')).json();assert.equal(first.ownerSetupRequired,true);
  assert.equal((await send('Wrong Key','incorrect')).status,403);
  assert.equal((await fetch(base+'/api/auth/me').then(r=>r.json())).ownerSetupRequired,true);
  const owner=await send('Real Owner',process.env.TOONFLOW_SETUP_KEY);assert.equal(owner.status,201);assert.equal((await owner.json()).isAdmin,true);
  assert.equal((await fetch(base+'/api/auth/me').then(r=>r.json())).ownerSetupRequired,false);
  const creator=await send('Next Creator','');assert.equal(creator.status,201);assert.equal((await creator.json()).isAdmin,false);
  console.log('Production owner signup requires the private setup key; later creators do not.');
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
