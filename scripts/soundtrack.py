"""Reproducible original sound design, mixed with meSpeak draft dialogue."""
import json, math, wave, pathlib
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parent.parent
SR=24000; DURATION=420; rng=np.random.default_rng(7)
mix=np.zeros((SR*DURATION,2),np.float32)
def add(at,a,volume=1,pan=0):
    a=np.asarray(a,dtype=np.float32);start=int(at*SR);length=min(len(a),len(mix)-start)
    if length<=0:return
    if a.ndim==1:a=np.column_stack([a*(1-pan*.4),a*(1+pan*.4)])
    mix[start:start+length]+=a[:length]*volume

def noise(seconds):return rng.normal(0,1,int(SR*seconds)).astype(np.float32)
def tone(frequency,seconds,volume=1):
    t=np.arange(int(seconds*SR))/SR;env=np.minimum(t*10,1)*np.minimum((seconds-t)*5,1)
    return (np.sin(2*np.pi*frequency*t)*env*volume).astype(np.float32)
def boom(at,power=1):
    t=np.arange(int(.5*SR))/SR;add(at,(noise(.5)*np.exp(-t*27)*.08+np.sin(2*np.pi*(60*t-20*t*t))*np.exp(-t*9)*.22),power)
def shot(at,kind,pan=0):
    t=np.arange(int(.23*SR))/SR;f={'M4':140,'AK':106,'M249':86}.get(kind,120)
    sound=noise(.23)*np.exp(-t*45)*.28+np.sin(2*np.pi*f*t)*np.exp(-t*19)*.20
    add(at,sound,.65,pan);add(at+.07,noise(.10)*np.exp(-np.arange(int(.1*SR))/SR*48),.02,-pan)
# Forest wind: low-pass noise plus soft gusts. No borrowed recordings.
wind=noise(DURATION);wind=np.convolve(wind,np.ones(70)/70,mode='same')
t=np.arange(len(wind))/SR;add(0,wind*(.09+.04*np.sin(t*.21)))
# Quiet cinematic pads; silence during the warning and confrontation.
for start,end,freq,vol in [(0,55,55,.022),(55,115,49,.018),(115,179,61.7,.023),(350,375,46.25,.027),(395,420,36.7,.048)]:
    n=int((end-start)*SR);tt=np.arange(n)/SR;env=np.minimum(tt/3,1)*np.minimum((end-start-tt)/3,1)
    pad=(np.sin(2*np.pi*freq*tt)+.45*np.sin(2*np.pi*freq*1.5*tt)+.2*np.sin(2*np.pi*(freq*2+.14)*tt))*.5
    add(start,pad*env,vol)
for at in np.arange(238,324,1.25):boom(float(at),.26)
# Engines and tire gravel.
for start,end,vol in [(49,53,.055),(55,95,.042),(395,415,.060)]:
    tt=np.arange(int((end-start)*SR))/SR;add(start,(np.sin(2*np.pi*43*tt)+.4*np.sin(2*np.pi*89*tt)+noise(end-start)*.19),vol)
for at in [5,8,59,63,105,111,121,127,139,147]:
    tt=np.arange(int(.38*SR))/SR;bird=np.sin(2*np.pi*(1400*tt+320*tt**2))*np.sin(np.pi*tt/.38)**2;add(at,bird,.013,.4)
for start,end in [(35,48),(98,114),(140,146),(185,199),(315,337)]:
    for at in np.arange(start,end,.52):add(float(at),noise(.08)*np.linspace(1,0,int(.08*SR)),.035)
for at in [48.4,95,290,291,294]:
    add(at,noise(.17)*np.exp(-np.arange(int(.17*SR))/SR*33),.075)
# First shot has no faction marker; the impact is the only visible cue.
shot(233.2,'M4',0);boom(233.25,.40)
for at in np.arange(238,322,1.7):
    for j in range(3):shot(float(at+j*.11),'M4',-.6)
    if at<290 or at>=297:
        for j in range(5):shot(float(at+.65+j*.085),'M249',-.4)
    if at<315:
        for j in range(3):shot(float(at+.9+j*.14),'AK',.6)
# Door, damaged gate and radio static.
boom(49,.33)
for at in [133,134]:
    tt=np.arange(SR)/SR;add(at,np.sin(2*np.pi*(260*tt+20*np.sin(tt*5)))*np.exp(-tt*4),.020)
for start,end in [(75,77),(174,179),(348,350),(375,376)]:add(start,noise(end-start),.022)
# Helicopter rotor pulse and armored vehicle rumble only in the final reveal.
tt=np.arange(20*SR)/SR;rotor=(np.sin(2*np.pi*19*tt)>0).astype(float)*(np.sin(2*np.pi*73*tt)*.04+noise(20)*.028)
add(395,rotor*np.minimum(tt/4,1))
# Fit each exact dialogue line within its scheduled cue; keep captions verbatim.
cues=json.loads((ROOT/'exports/voices/cues.json').read_text()); compressed=[]
for cue in cues:
    with wave.open(str(ROOT/'exports/voices'/cue['file']),'rb') as wav:
        width=wav.getsampwidth();channels=wav.getnchannels();rate=wav.getframerate();raw=wav.readframes(wav.getnframes())
    if width==2:data=np.frombuffer(raw,'<i2').astype(np.float32)/32768
    elif width==1:data=(np.frombuffer(raw,np.uint8).astype(np.float32)-128)/128
    else:raise ValueError('Unsupported voice PCM width')
    if channels>1:data=data.reshape(-1,channels).mean(axis=1)
    resampled=np.interp(np.arange(round(len(data)*SR/rate))*rate/SR,np.arange(len(data)),data).astype(np.float32)
    maxlen=int((cue['end']-cue['start']-.07)*SR)
    if len(resampled)>maxlen:
        compressed.append(cue['speaker']+' at '+str(cue['start']))
        resampled=np.interp(np.linspace(0,len(resampled)-1,maxlen),np.arange(len(resampled)),resampled).astype(np.float32)
    isradio='COMMAND' in cue['speaker']
    if isradio:
        # Difference filter removes bass, then adds a quiet radio carrier.
        avg=np.convolve(resampled,np.ones(19)/19,mode='same');resampled=(resampled-avg)*1.9
        resampled+=rng.normal(0,.006,len(resampled)).astype(np.float32)
    peak=max(np.max(np.abs(resampled)),.01);resampled=resampled/peak*.29
    start=int(cue['start']*SR);length=len(resampled)
    mix[start:start+length]*=.56
    add(cue['start'],resampled)
    if isradio:add(cue['start']-.08,tone(1700,.06),.032)
# Limiter and fades. Stereo 24 kHz PCM for reproducible browser/export playback.
mix=np.tanh(mix*1.4)*.78
mix[:SR]*=np.linspace(0,1,SR)[:,None];mix[-SR*2:]*=np.linspace(1,0,SR*2)[:,None]
with wave.open(str(ROOT/'exports/soundtrack.wav'),'wb') as wav:
    wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(SR);wav.writeframes((mix*32767).astype('<i2').tobytes())
(ROOT/'exports/audio-report.json').write_text(json.dumps({'duration':DURATION,'sample_rate':SR,'dialogue_cues':len(cues),'timing_adjusted_cues':compressed,'peak':float(np.max(np.abs(mix))),'voice':'meSpeak synthetic draft voices; timing-fitted for the supplied shots'},indent=2))
print('Soundtrack written: 420 seconds,',len(cues),'dialogue cues; peak',round(float(np.max(np.abs(mix))),3))
