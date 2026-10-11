import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {levels,chapters,evaluate,nextHint} from '../dist/engine.mjs';
import {earnedHeadwear,canWear} from '../dist/avatars.mjs';
import {validateBackup} from '../dist/backup.mjs';
import {chapterSummary,drawChapterCard} from '../dist/chapter-card.mjs';
import {translator} from '../dist/i18n.mjs';
import {existsSync} from 'node:fs';
assert.equal(createHash('sha256').update(JSON.stringify(levels.slice(0,84))).digest('hex'),'acebc5486312667af0b5260c8bace46df9d61d3e59e1a4917799c88d3958f9d0','Prior 84 levels stay identical');
const fresh=levels.slice(84,96);assert.equal(levels.length,96);assert.equal(fresh.length,12);assert.equal(chapters[7].id,'weave');assert(existsSync(new URL('../dist/characters/hat-weave.png',import.meta.url)));
const distinct=new Set(levels.slice(0,84).map(l=>JSON.stringify(l.paths)));
for(const l of fresh){
 assert.equal(l.n,6);assert.deepEqual(l.paths.map(p=>p.color),['mint','amber','violet']);assert(!distinct.has(JSON.stringify(l.paths)));distinct.add(JSON.stringify(l.paths));
 assert(!evaluate(l,l.initial).solved);const state=evaluate(l,Array(l.n*l.n).fill(0));assert(state.solved);
 const endpoints=l.paths.flatMap(p=>[p.cells[0],p.cells.at(-1)]);assert.equal(new Set(endpoints).size,l.paths.length*2);
 for(const path of l.paths)for(const cell of path.cells){const group=l.tiles[cell].groups.findIndex((_,g)=>state.lit[cell][g].has(path.color));assert(group>=0);assert.equal(state.lit[cell][group].size,1,'No colour leakage in authored solution');}
 assert.equal(!!l.gate,l.id>=85);assert.equal(l.frozen!==undefined,l.id>=87&&l.id!==91);
 if(l.gate){assert(!l.paths[1].cells.includes(l.gate.tile),'Amber never depends on the gate it opens');assert(l.paths[0].cells.includes(l.gate.tile));}
 for(let seed=0;seed<40;seed++){
  let random=(seed+1)*2654435761;const r=l.tiles.map(()=>{random^=random<<13;random^=random>>>17;random^=random<<5;return (random>>>0)%4;});
  if(l.frozen!==undefined)r[l.frozen]=1;
  for(let step=0;step<100&&!evaluate(l,r).solved;step++){
   const h=nextHint(l,r);assert(h);assert(h.tile!==l.frozen||evaluate(l,r).open,'Hint cannot rotate a locked tile');r[h.tile]=h.rotation;
  }
  assert(evaluate(l,r).solved,`Legal hint convergence on ${l.id}/${seed}`);
 }
}
assert(fresh.at(-1).paths.reduce((n,p)=>n+p.cells.length,0)>fresh[0].paths.reduce((n,p)=>n+p.cells.length,0));
const old={version:1,lang:'en',completed:Array.from({length:84},(_,i)=>i+1),records:{84:{time:5000,moves:12}},last:84,sound:false,ambience:false,haptics:false,showTime:true,hintBalance:24,hintBaseUsed:{}};
const profile={id:'p',name:'Ada',symbol:5,hat:'solar',data:old};const backup={format:'sporlys-backup',version:1,activeProfile:'p',profiles:[profile]};assert.deepEqual(validateBackup(backup,96).profiles[0],profile);assert.equal(earnedHeadwear(old).length,7);assert(!canWear(old,'weave'));assert.throws(()=>chapterSummary(profile,old,chapters[7]));
const full=structuredClone(old);full.completed.push(...fresh.map(l=>l.id));full.last=96;assert(canWear(full,'weave'));profile.hat='weave';profile.data=full;assert.deepEqual(validateBackup(backup,96).profiles[0],profile);
const summary=chapterSummary(profile,full,chapters[7]);assert.equal(summary.chapterName,'Lightweave');assert.equal(summary.hats,8);assert.equal(summary.count,12);assert.equal(summary.hints,24);
const images=[],texts=[];const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*10}),drawImage:i=>images.push(i),fillText:t=>texts.push(t)},{get:(o,k)=>k in o?o[k]:()=>{}});const canvas={getContext:()=>ctx};await drawChapterCard(summary,{canvas,loadImage:async src=>src});assert(images.includes('characters/hat-weave.png'));assert(texts.includes('Levels 85–96'));assert(texts.includes('Lightweave complete!'));assert(texts.includes('8'));
for(const lang of ['nb','en']){const t=translator(lang);for(const key of ['weaveChapter','weaveSeries','hat_weave'])assert.notEqual(t(key),key);}
console.log('PASS: 12 new 6x6 layouts, three isolated colours, staged gates/frost, legal hints on 480 scrambles, old progress, eight prizes, backup and Lightweave card.');
// Existing 72-level completion opens 73, rather than replaying 72 or losing records.
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};let stored=JSON.stringify({...old,profiles:[{...profile,hat:'solar',data:old}],activeProfile:'p'});
globalThis.document={hidden:false,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});await import('../dist/app.mjs?aurora');assert(root.innerHTML.includes('<small>Level 85</small>'));click({action:'levels'});assert(root.innerHTML.includes('Lightweave'));assert(root.innerHTML.includes('data-level="85"'));assert(!root.innerHTML.includes('data-action="chapterCard"'));click({action:'start'});assert(root.innerHTML.includes('Lightweave'));assert.equal(JSON.parse(stored).hintBalance,15);assert.deepEqual(JSON.parse(stored).records,old.records);assert.equal(JSON.parse(stored).profiles[0].hat,'solar');
console.log('PASS: old 84-level player continues at 85 with records, hint bank and equipment preserved.');

assert.equal((root.innerHTML.match(/data-rotate=/g)||[]).length,36);
// Every completed chapter has a distinct equipped prize and a localized name.
const {headwear}=await import('../dist/avatars.mjs');assert.deepEqual(headwear,['none',...chapters.map(c=>c.id)]);
const all={completed:levels.map(l=>l.id)};assert.equal(earnedHeadwear(all).length,8);
for(const c of chapters){assert(existsSync(new URL('../dist/characters/hat-'+c.id+'.png',import.meta.url)));for(const lang of ['nb','en'])assert.notEqual(translator(lang)('hat_'+c.id),'hat_'+c.id);}
console.log('PASS: eight chapter prizes have their own local asset and name in both languages.');
