import assert from 'node:assert/strict';
import {levels,chapters,evaluate,nextHint} from '../dist/engine.mjs';
import {earnedHeadwear,canWear} from '../dist/avatars.mjs';
import {validateBackup} from '../dist/backup.mjs';
import {chapterSummary,drawChapterCard} from '../dist/chapter-card.mjs';
import {translator} from '../dist/i18n.mjs';
import {existsSync} from 'node:fs';
const fresh=levels.slice(48,60);assert.equal(levels.length,96);assert.equal(fresh.length,12);assert.equal(chapters[4].id,'aurora');assert(existsSync(new URL('../dist/characters/hat-aurora.png',import.meta.url)));
const distinct=new Set(levels.slice(0,48).map(l=>JSON.stringify(l.paths)));
for(const l of fresh){
 assert.equal(l.n,5);assert.deepEqual(l.paths.map(p=>p.color),['mint','amber','violet']);assert(!distinct.has(JSON.stringify(l.paths)));distinct.add(JSON.stringify(l.paths));
 assert(!evaluate(l,l.initial).solved);const state=evaluate(l,Array(25).fill(0));assert(state.solved);
 const endpoints=l.paths.flatMap(p=>[p.cells[0],p.cells.at(-1)]);assert.equal(new Set(endpoints).size,6);
 for(const path of l.paths)for(const cell of path.cells){const group=l.tiles[cell].groups.findIndex((_,g)=>state.lit[cell][g].has(path.color));assert(group>=0);assert.equal(state.lit[cell][group].size,1,'No colour leakage in authored solution');}
 assert.equal(!!l.gate,l.id>=51);assert.equal(l.frozen!==undefined,l.id>=57);
 if(l.gate){assert(!l.paths[1].cells.includes(l.gate.tile),'Amber never depends on the gate it opens');assert(l.paths[0].cells.includes(l.gate.tile));}
 for(let seed=0;seed<40;seed++){
  const r=l.tiles.map((_,i)=>(i*7+seed*3+(i%3))%4);
  if(l.frozen!==undefined)r[l.frozen]=1;
  for(let step=0;step<100&&!evaluate(l,r).solved;step++){
   const h=nextHint(l,r);assert(h);assert(h.tile!==l.frozen||evaluate(l,r).open,'Hint cannot rotate a locked tile');r[h.tile]=h.rotation;
  }
  assert(evaluate(l,r).solved,`Legal hint convergence on ${l.id}/${seed}`);
 }
}
assert(fresh.at(-1).paths.reduce((n,p)=>n+p.cells.length,0)>fresh[0].paths.reduce((n,p)=>n+p.cells.length,0));
const old={version:1,lang:'en',completed:Array.from({length:48},(_,i)=>i+1),records:{48:{time:5000,moves:12}},last:48,sound:false,ambience:false,haptics:false,showTime:true,hintBalance:24,hintBaseUsed:{}};
const profile={id:'p',name:'Ada',symbol:5,hat:'rav',data:old};const backup={format:'sporlys-backup',version:1,activeProfile:'p',profiles:[profile]};assert.deepEqual(validateBackup(backup,60).profiles[0],profile);assert.equal(earnedHeadwear(old).length,4);assert(!canWear(old,'aurora'));assert.throws(()=>chapterSummary(profile,old,chapters[4]));
const full=structuredClone(old);full.completed.push(...fresh.map(l=>l.id));full.last=60;assert(canWear(full,'aurora'));profile.hat='aurora';profile.data=full;assert.deepEqual(validateBackup(backup,60).profiles[0],profile);
const summary=chapterSummary(profile,full,chapters[4]);assert.equal(summary.chapterName,'Aurora weave');assert.equal(summary.hats,5);assert.equal(summary.count,12);assert.equal(summary.hints,24);
const images=[],texts=[];const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*10}),drawImage:i=>images.push(i),fillText:t=>texts.push(t)},{get:(o,k)=>k in o?o[k]:()=>{}});const canvas={getContext:()=>ctx};await drawChapterCard(summary,{canvas,loadImage:async src=>src});assert(images.includes('characters/hat-aurora.png'));assert(texts.includes('Levels 49–60'));assert(texts.includes('Aurora weave complete!'));assert(texts.includes('5'));
for(const lang of ['nb','en']){const t=translator(lang);for(const key of ['auroraChapter','auroraSeries','hat_aurora'])assert.notEqual(t(key),key);}
console.log('PASS: 12 new 5x5 layouts, three isolated colours, staged gates/frost, legal hints on 480 scrambles, old progress, five prizes, backup and Aurora card.');
// Existing 48-level completion opens 49, rather than replaying 48 or losing records.
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};let stored=JSON.stringify({...old,profiles:[{...profile,hat:'rav',data:old}],activeProfile:'p'});
globalThis.document={hidden:false,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});await import('../dist/app.mjs?aurora');assert(root.innerHTML.includes('<small>Level 49</small>'));click({action:'levels'});assert(root.innerHTML.includes('Aurora weave'));assert(root.innerHTML.includes('data-level="49"'));assert(!root.innerHTML.includes('data-action="chapterCard"'));click({action:'start'});assert(root.innerHTML.includes('Aurora weave'));assert.equal(JSON.parse(stored).hintBalance,15);assert.deepEqual(JSON.parse(stored).records,old.records);assert.equal(JSON.parse(stored).profiles[0].hat,'rav');
console.log('PASS: old 48-level player continues at 49 with records, hint bank and equipment preserved.');
