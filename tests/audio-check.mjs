import assert from 'node:assert/strict';
import {Soundscape,ambientProfiles} from '../dist/audio.mjs';
let created=0,starts=0,stops=0;
function parameter(value=0){return {value,setValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},cancelScheduledValues(){}};}
function node(){return {connect(){},disconnect(){},start(){starts++},stop(){stops++},frequency:parameter(),gain:parameter(),delayTime:parameter()};}
globalThis.AudioContext=class {constructor(){created++;this.sampleRate=1000;this.currentTime=1;this.destination={};}resume(){return Promise.resolve();}createOscillator(){return node();}createGain(){return node();}createDelay(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createBuffer(_,n){return {getChannelData:()=>new Float32Array(n)}}};
const a=new Soundscape();a.unlock(false);assert.equal(created,0);a.unlock(true);assert.equal(created,1);
assert.equal(new Set(Object.values(ambientProfiles).map(p=>JSON.stringify(p))).size,8);
for(const chapter of Object.keys(ambientProfiles)){
 const previous=a.ambientGraph,beforeStops=stops;a.ambient(true,chapter);assert.equal(a.ambientChapter,chapter);assert(a.ambientGain.gain.value>0);if(previous){assert.equal(previous.master.gain.value,0);assert.equal(stops-beforeStops,previous.sources.length);}
 const before=starts;a.ambient(true,chapter);assert.equal(starts,before,'Repeated renders do not stack loops');a.play('victory',false,chapter);assert.equal(starts,before,'Muted effects stay muted');
 for(const kind of ['rotate','beacon','gate','victory'])a.play(kind,true,chapter);
 const g=a.ambientGraph,stopBefore=stops;a.ambient(false,chapter);assert.equal(g.master.gain.value,0);assert.equal(stops-stopBefore,g.sources.length);assert.equal(a.ambientGraph,null);const after=starts;a.ambient(false);assert.equal(starts,after,'Pause/background/mute creates no sources');
}
a.unlock(true);assert.equal(created,1);a.ambient(true,'unknown');assert.equal(a.ambientChapter,'night');a.ambient(false);
console.log('PASS: eight distinct ambient profiles, same-chapter reuse, chapter transitions release every loop, mute/pause release sources, independent effects, one audio context. Physical listening still required.');

// Integration: ambience follows the visible chapter, pause/resume and home navigation.
const calls=[],ambient=Soundscape.prototype.ambient;Soundscape.prototype.ambient=function(active,chapter){calls.push({active,chapter});return ambient.call(this,active,chapter);};
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
const data={version:1,lang:'en',completed:Array.from({length:96},(_,i)=>i+1),records:{},last:96,sound:false,ambience:true,haptics:false,showTime:true,hintBalance:0,hintBaseUsed:{}};let stored=JSON.stringify({...data,profiles:[{id:'p',name:'Ada',symbol:0,hat:'weave',data}],activeProfile:'p'});
globalThis.document={hidden:false,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});await import('../dist/app.mjs?audio-chapter');assert.equal(calls.at(-1).chapter,'weave');click({action:'levels'});
for(const chapter of Object.keys(ambientProfiles)){click({chapter});assert.equal(calls.at(-1).chapter,chapter);assert(calls.at(-1).active);}
click({level:'63'});assert.equal(calls.at(-1).chapter,'stellar');click({action:'pause'});assert(!calls.at(-1).active);click({action:'close'});assert(calls.at(-1).active);
click({level:'13'});click({action:'home'});assert.equal(calls.at(-1).chapter,'forest');
console.log('PASS: chapter selection, large board, pause/resume and home select the right ambience.');
