import numpy as np,wave,subprocess,os
out=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'public','music');os.makedirs(out,exist_ok=True)
sr=22050
for song in range(5):
 beat=[.66,.72,.62,.76,.68][song];bars=24;duration=bars*4*beat+4;a=np.zeros(int(sr*duration))
 progressions=[[48,55,57,53],[50,57,59,55],[53,48,50,46],[45,53,48,55],[48,52,53,55]]
 pattern=[0,2,1,2,0,1,2,1]
 def note(start,midi,length,amp):
  t=np.arange(int(sr*length))/sr;f=440*2**((midi-69)/12);env=(1-np.exp(-t*80))*np.exp(-t*2.1/length)*np.minimum(1,(length-t)*4)
  sig=(np.sin(2*np.pi*f*t)*np.exp(-t*.5)+.28*np.sin(2*np.pi*f*2*t)*np.exp(-t*2)+.08*np.sin(2*np.pi*f*3*t)*np.exp(-t*3))*env*amp
  pos=int(start*sr);end=min(len(a),pos+len(sig));a[pos:end]+=sig[:end-pos]
 for bar in range(bars):
  root=progressions[song][bar%4];chord=[root+12,root+16-(1 if root%12 in [2,9,4] else 0),root+19]
  note(bar*4*beat,root,4*beat,.18)
  for k in range(8):note((bar*4+k*.5)*beat,chord[pattern[(k+song)%8]],2.3,.1)
  if bar%2==0:
   for k in range(4): note((bar*4+k+.15)*beat,chord[(bar+k+song)%3]+12,2,.085)
 for delay,gain in [(.18,.12),(.37,.08),(.61,.04)]:
  n=int(sr*delay);a[n:]+=a[:-n].copy()*gain
 a[:sr*2]*=np.linspace(0,1,sr*2);a[-sr*4:]*=np.linspace(1,0,sr*4);a=a/max(abs(a))*.62
 path='/tmp/wedding-song.wav'
 with wave.open(path,'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((a*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-loglevel','error','-i',path,'-b:a','96k',out+'/'+str(song+1)+'.mp3'],check=True)
 print('Track',song+1,'ready',round(duration),flush=True)
