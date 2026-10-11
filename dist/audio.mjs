// Original synthesized chapter ambience; no recordings, subscriptions or network.
// Noise describes water/wind textures; quiet tonal layers create each world's character.
export const ambientProfiles={
 night:{cutoff:420,noise:.023,rate:.08,depth:110,notes:[110,165],tone:.003,pitch:1},
 forest:{cutoff:850,noise:.017,rate:.13,depth:240,notes:[130.81,196],tone:.0025,pitch:.85},
 frost:{cutoff:1800,noise:.010,rate:.055,depth:400,notes:[523.25,783.99],tone:.0016,pitch:1.25},
 rav:{cutoff:220,noise:.027,rate:.035,depth:60,notes:[82.41,123.47],tone:.004,pitch:.75},
 aurora:{cutoff:650,noise:.013,rate:.065,depth:180,notes:[174.61,261.63,349.23],tone:.0027,pitch:1.1},
 weave:{cutoff:480,noise:.009,rate:.038,depth:105,notes:[174.61,261.63,349.23],tone:.0026,pitch:1.07},
 solar:{cutoff:360,noise:.012,rate:.052,depth:85,notes:[164.81,220,329.63],tone:.0028,pitch:1.03},
 stellar:{cutoff:1200,noise:.007,rate:.045,depth:260,notes:[261.63,392,523.25],tone:.002,pitch:1.18}
};
export class Soundscape{
 constructor(){this.context=null;this.ambientGain=null;this.enabled=false;this.ambientGraph=null;this.ambientChapter=null;}
 unlock(enabled){this.enabled=enabled;if(!enabled)return;try{const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)return;this.context??=new C();void this.context.resume().catch(()=>{});}catch{}}
 tone(frequency,at,duration=.35,volume=.025,type='sine'){
 const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(frequency,at);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(volume,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(c.destination);
 // A quiet delayed reflection softens the dry synthesized notes.
 const delay=c.createDelay(.5),echo=c.createGain();delay.delayTime.value=.12;echo.gain.value=.15;g.connect(delay);delay.connect(echo);echo.connect(c.destination);o.start(at);o.stop(at+duration+.03);o.onended=()=>{setTimeout(()=>{o.disconnect();g.disconnect();delay.disconnect();echo.disconnect();},200);};
 }
 play(kind,enabled,chapter='night'){if(!enabled||!this.context)return;try{const c=this.context,at=c.currentTime;const pitch=(ambientProfiles[chapter]||ambientProfiles.night).pitch;if(kind==='rotate'){
 const buffer=c.createBuffer(1,Math.floor(c.sampleRate*.055),c.sampleRate),a=buffer.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.exp(-i/(a.length*.15));const source=c.createBufferSource(),filter=c.createBiquadFilter(),g=c.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=1300;g.gain.value=.08;source.connect(filter);filter.connect(g);g.connect(c.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();g.disconnect();};this.tone(165*pitch,at,.075,.012,'triangle');
 }else if(kind==='beacon'){this.tone(587*pitch,at,.45,.025);this.tone(880*pitch,at+.05,.5,.009);}else if(kind==='gate'){this.tone(220*pitch,at,.12,.015,'triangle');this.tone(660*pitch,at+.09,.5,.025);}else if(kind==='victory'){[392,494,587,784].forEach((f,i)=>this.tone(f*pitch,at+.12+i*.16,.85,.027));}}catch{}}
 ambient(active,chapter='night'){
  if(!this.context)return;
  try{
   const c=this.context,key=ambientProfiles[chapter]?chapter:'night';
   if(!active){if(this.ambientGraph)this.releaseAmbient(this.ambientGraph);this.ambientGraph=null;this.ambientChapter=null;return;}
   if(this.ambientGraph&&this.ambientChapter===key)return;
   if(this.ambientGraph)this.releaseAmbient(this.ambientGraph);
   const p=ambientProfiles[key],nodes=[],sources=[],master=c.createGain();nodes.push(master);master.gain.setValueAtTime(0,c.currentTime);master.connect(c.destination);
   const buffer=c.createBuffer(1,Math.floor(c.sampleRate*7),c.sampleRate),a=buffer.getChannelData(0);
   // Fade the seam so the repeating texture has no click.
   for(let i=0;i<a.length;i++){const seam=Math.min(1,i/(c.sampleRate*.03),(a.length-1-i)/(c.sampleRate*.03));a[i]=(Math.random()*2-1)*seam;}
   const wind=c.createBufferSource(),filter=c.createBiquadFilter(),noiseGain=c.createGain();wind.buffer=buffer;wind.loop=true;filter.type='lowpass';filter.frequency.value=p.cutoff;noiseGain.gain.value=p.noise;wind.connect(filter);filter.connect(noiseGain);noiseGain.connect(master);nodes.push(wind,filter,noiseGain);sources.push(wind);
   const breeze=c.createOscillator(),depth=c.createGain();breeze.frequency.value=p.rate;depth.gain.value=p.depth;breeze.connect(depth);depth.connect(filter.frequency);nodes.push(breeze,depth);sources.push(breeze);
   p.notes.forEach((frequency,i)=>{
    const voice=c.createOscillator(),gain=c.createGain(),sway=c.createOscillator(),amount=c.createGain();voice.type='sine';voice.frequency.value=frequency;gain.gain.value=p.tone;sway.frequency.value=p.rate*(.55+i*.27);amount.gain.value=p.tone*.55;voice.connect(gain);gain.connect(master);sway.connect(amount);amount.connect(gain.gain);nodes.push(voice,gain,sway,amount);sources.push(voice,sway);
   });
   sources.forEach(source=>source.start());master.gain.linearRampToValueAtTime(1,c.currentTime+.65);
   this.ambientGraph={master,nodes,sources};this.ambientGain=master;this.ambientChapter=key;
  }catch{}
 }
 releaseAmbient(graph){
  const c=this.context,g=graph.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(0,c.currentTime+.45);
  // Release every oscillator and buffer on mute/change; no invisible accumulating loops.
  for(const source of graph.sources)try{source.stop(c.currentTime+.5);}catch{}
  const cleanup=setTimeout(()=>{for(const node of graph.nodes)try{node.disconnect();}catch{}},600);cleanup?.unref?.();
 }
}
