import assert from 'node:assert/strict';
import {levels,chapters,evaluate,nextHint} from '../dist/engine.mjs';
import {earnedHeadwear,canWear} from '../dist/avatars.mjs';
import {validateBackup} from '../dist/backup.mjs';
const newLevels=levels.filter(l=>l.id>=37&&l.id<=48);assert.equal(levels.length,96);assert.equal(newLevels.length,12);assert.equal(chapters[3].id,'rav');
let previousLength=0;const layouts=new Set();
for(const l of newLevels){assert.equal(l.n,5);assert.deepEqual(l.paths.map(p=>p.color),['mint','amber','violet']);assert(!evaluate(l,l.initial).solved);const length=l.paths.reduce((s,p)=>s+p.cells.length,0);assert(length>previousLength,'Authored route length increases each level');previousLength=length;const key=JSON.stringify(l.paths);assert(!layouts.has(key));layouts.add(key);
 const solved=evaluate(l,Array(25).fill(0));assert(solved.solved);l.paths.forEach(p=>{for(const cell of p.cells){const group=l.tiles[cell].groups.findIndex((_,g)=>solved.lit[cell][g].has(p.color));assert(group>=0);assert.equal(solved.lit[cell][group].size,1,'Separate light colours do not leak into another path');}});
 assert.equal(!!l.gate,l.id>=40);assert.equal(l.frozen!==undefined,l.id>=43);let r=[...l.initial];for(let i=0;i<100&&!evaluate(l,r).solved;i++){const h=nextHint(l,r);assert(h);assert(h.tile!==l.frozen||evaluate(l,r).open,'Frozen tile waits for amber beacon');r[h.tile]=h.rotation;}assert(evaluate(l,r).solved);
}
const data={version:1,lang:'en',completed:Array.from({length:36},(_,i)=>i+1),records:{36:{time:5000,moves:12}},last:36,sound:true,ambience:false,haptics:true,showTime:true,hintBalance:10,hintBaseUsed:{}};
const p={id:'one',name:'Tester',symbol:5,hat:'frost',data};const old={format:'sporlys-backup',version:1,activeProfile:p.id,profiles:[p]};assert.deepEqual(validateBackup(old,48).profiles[0],p);assert.deepEqual(earnedHeadwear(data),['night','forest','frost']);assert(!canWear(data,'rav'));data.completed.push(...Array.from({length:12},(_,i)=>i+37));assert(canWear(data,'rav'));
console.log('PASS: 12 distinct 5x5 levels, increasing route length, three isolated colours, gate/freeze stages, legal hint solutions and old 36-level progress.');
