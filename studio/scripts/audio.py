import sys,json,pathlib,wave,subprocess
import numpy as np
project=json.loads(pathlib.Path(sys.argv[1]).read_text());out=pathlib.Path(sys.argv[2]);voices=sys.argv[3]=='true';SR=24000;duration=sum(s['duration'] for s in project['scenes']);rng=np.random.default_rng(7);n=round(duration*SR);mix=np.zeros((n,2),np.float32)
def add(at,data,volume=1,pan=0):
 data=np.asarray(data,dtype=np.float32);start=max(0,round(at*SR));length=min(len(data),n-start)
 if length<=0:return
 if data.ndim==1:data=np.column_stack([data*(1-pan*.4),data*(1+pan*.4)])
 mix[start:start+length]+=data[:length]*volume
noise=rng.normal(0,.015,n).astype(np.float32);wind=np.convolve(noise,np.ones(45)/45,mode='same');add(0,wind,2)
def shot(at,pan=0):
 t=np.arange(round(.18*SR))/SR;data=rng.normal(0,1,len(t))*np.exp(-t*43)*.17+np.sin(2*np.pi*120*t)*np.exp(-t*21)*.12;add(at,data,1,pan)
offset=0
for scene in project['scenes']:
 d=scene['duration'];t=np.arange(round(d*SR))/SR;envelope=np.minimum(t/1.5,1)*np.minimum((d-t)/1.5,1)
 add(offset,(np.sin(2*np.pi*55*t)+.4*np.sin(2*np.pi*82.5*t))*envelope,.017)
 for actor in scene['actors']:
  if any(k['pose'] in ['walk','run','crawl'] for k in actor['keyframes']):
   for at in np.arange(offset,offset+d,.6):add(float(at),rng.normal(0,1,round(.07*SR))*np.linspace(1,0,round(.07*SR)),.018)
 for vehicle in scene['vehicles']:
  if vehicle['type']=='helicopter':data=(np.sin(2*np.pi*17*t)>0)*(np.sin(2*np.pi*76*t)*.045+rng.normal(0,.02,len(t)))
  else:data=np.sin(2*np.pi*43*t)*.035+rng.normal(0,.006,len(t))
  add(offset,data*envelope)
 for effect in scene['effects']:
  if effect['type']=='gunfire':
   for at in np.arange(offset+effect['start'],offset+effect['end'],1.4):
    for j in range(3):shot(float(at+j*.105),-.4 if int(at)%2 else .4)
  elif effect['type']=='impact':shot(offset+effect['start'])
  elif effect['type']=='rain':add(offset,rng.normal(0,.009,len(t))*envelope)
 offset+=d
if len(sys.argv)>4 and sys.argv[4]:
 raw=subprocess.check_output(['ffmpeg','-v','error','-stream_loop','-1','-i',sys.argv[4],'-f','f32le','-ar',str(SR),'-ac','2','-t',str(duration),'-']);music=np.frombuffer(raw,'<f4').reshape(-1,2);add(0,music,float(project.get('musicVolume',.22)))
cues=json.loads((out/'voices/cues.json').read_text()) if voices else []
for cue in cues:
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(out/'voices'/cue['file']),'-f','f32le','-ar',str(SR),'-ac','1','-'])
 data=np.frombuffer(raw,'<f4').astype(np.float32)
 length=min(len(data),max(1,round((cue['end']-cue['start']-.03)*SR)))
 if len(data)>length:data=np.interp(np.linspace(0,len(data)-1,length),np.arange(len(data)),data).astype(np.float32)
 else:data=data[:length]
 if 'COMMAND' in cue['speaker']:
  data=(data-np.convolve(data,np.ones(17)/17,mode='same'))*1.6+ rng.normal(0,.003,length)
 data=data/max(float(np.max(np.abs(data))),.01)*.29;start=round(cue['start']*SR);mix[start:start+length]*=.55;add(cue['start'],data)
mix=np.tanh(mix*1.4)*.8;fade=min(SR,n//3);mix[:fade]*=np.linspace(0,1,fade)[:,None];mix[-fade:]*=np.linspace(1,0,fade)[:,None]
with wave.open(str(out/'soundtrack.wav'),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((mix*32767).astype('<i2').tobytes())
print(f'Created {duration:.2f}s soundtrack, {len(cues)} voice cues.')
