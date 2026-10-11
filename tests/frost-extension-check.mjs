import assert from 'node:assert/strict';
import {levels,chapterFor,nextHint,evaluate} from '../dist/engine.mjs';
import {validateBackup} from '../dist/backup.mjs';
assert.equal(levels.length,96);assert.equal(chapterFor(36).end,36);
const data={version:1,lang:'nb',completed:Array.from({length:30},(_,i)=>i+1),records:{30:{time:12345,moves:42}},last:30,sound:true,ambience:false,haptics:true,showTime:true};
const backup={format:'sporlys-backup',version:1,activeProfile:'first',profiles:[{id:'first',name:'Tester',symbol:0,data}]};
const restored=validateBackup(backup,levels.length);assert.deepEqual(restored.profiles[0].data.records,data.records);assert.deepEqual(restored.profiles[0].data.completed,data.completed);
let stored=JSON.stringify({...data,profiles:backup.profiles,activeProfile:'first'});const listeners={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,addEventListener(){},close(){this.open=false},showModal(){this.open=true}};
globalThis.document={hidden:false,documentElement:{lang:'nb'},querySelector(s){return s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null},addEventListener(k,f){listeners[k]=f}};
Object.defineProperty(globalThis,'navigator',{value:{language:'nb'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(k,v)=>stored=v};globalThis.setInterval=()=>{};
await import('../dist/app.mjs?frost-extension');assert(root.innerHTML.includes('<small>Brett 31</small>'));assert(root.innerHTML.includes('6 av 12 fullført'));
listeners.click({target:{closest:()=>({dataset:{action:'start'},disabled:false})}});assert(root.innerHTML.includes('Brett 31'));assert.deepEqual(JSON.parse(stored).completed,data.completed);assert.deepEqual(JSON.parse(stored).records,data.records);
for(const l of levels.filter(l=>l.id>=31&&l.id<=36)){assert.equal(l.n,5);assert.equal(l.paths.length,3);let r=[...l.initial];for(let k=0;k<100&&!evaluate(l,r).solved;k++){const h=nextHint(l,r);assert(h);assert(h.tile!==l.frozen||evaluate(l,r).open);r[h.tile]=h.rotation;}assert(evaluate(l,r).solved);}
console.log('PASS: previous 30-level progress and backup survive; level 31 unlocks; six new frozen boards solve in legal order.');
