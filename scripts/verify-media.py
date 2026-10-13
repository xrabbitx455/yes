"""Verify delivered media properties and decode the complete stream."""
import json,pathlib,subprocess,wave
root=pathlib.Path(__file__).resolve().parent.parent
video=root/'exports/first-contact.mp4'
raw=subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)],text=True)
report=json.loads(raw);v=next(s for s in report['streams'] if s['codec_type']=='video');a=next(s for s in report['streams'] if s['codec_type']=='audio')
assert v['width']==1920 and v['height']==1080
assert v['avg_frame_rate']=='24/1'
assert int(v['nb_frames'])==10080
assert abs(float(report['format']['duration'])-420)<.05
assert v['codec_name']=='h264' and a['codec_name']=='aac'
# Decode every video and audio packet to catch corruption or truncation.
subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(video),'-map','0:v:0','-map','0:a:0','-f','null','-'],check=True)
(root/'exports/media-report.json').write_text(json.dumps(report,indent=2))
print('Verified: H.264/AAC, 1920×1080, 24 FPS, 10,080 frames, 420 seconds; full decode passed.')
