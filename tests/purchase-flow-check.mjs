import assert from 'node:assert/strict';
import {levels,evaluate,nextHint} from '../dist/engine.mjs';
import {translator} from '../dist/i18n.mjs';
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,scrollTop:0,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
const d={version:1,lang:'en',sound:false,ambience:false,haptics:false,showTime:true,completed:Array.from({length:11},(_,i)=>i+1),last:12,records:{},hintBalance:20,hintBaseUsed:{}};
let stored=JSON.stringify({...d,profiles:[{id:'p',name:'Ada',symbol:5,hat:'none',data:d}],activeProfile:'p'});
globalThis.document={hidden:false,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:s==='#playerName'?{value:'Ada'}:null,addEventListener:(k,f)=>events[k]=f};
Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});
let receive;globalThis.GlimbraidStore={platform:'android',storage:{getItem:()=>null,setItem(){},removeItem(){}},initialize:async(_,send)=>{receive=send;send({kind:'product',price:'39,00 kr'});send({kind:'entitlement',owned:false});},buy:async()=>{},restore:async()=>{receive({kind:'entitlement',owned:true});}};
await import('../dist/app.mjs?purchase-flow');await new Promise(r=>setImmediate(r));
assert(!root.innerHTML.includes('tester-thanks'));
click({action:'players'});click({action:'editPlayer'});assert(modal.innerHTML.includes('Complete Nightglow'));assert(modal.innerHTML.includes('Complete Amber depths'));
click({hat:'night'});assert.equal(JSON.parse(stored).profiles[0].hat,'none','Locked prizes cannot be equipped');click({action:'close'});
click({action:'start'});const before=JSON.parse(stored).attempt;click({action:'hint'});const marked=JSON.parse(stored).attempt;assert.equal(marked.hintsUsed,1);assert.deepEqual(marked.rot,before.rot);assert(root.innerHTML.includes('One hint used.'));
click({action:'restart'});assert(modal.innerHTML.includes('Hints you have used are not returned'));click({action:'close'});assert.deepEqual(JSON.parse(stored).attempt,marked,'Cancelling restart preserves every part of the attempt');
click({action:'hint'});assert.equal(JSON.parse(stored).attempt.hintsUsed,1,'Applying the marked hint does not charge twice');
for(let k=0;k<100&&!root.innerHTML.includes('class="play victory"');k++){
 const a=JSON.parse(stored).attempt;if(!a)break;
 if(root.innerHTML.includes('hint-selected'))click({action:'hint'});
 else {const hint=nextHint(levels[11],a.rot);assert(hint);click({action:'hint'});}
 if(modal.open&&modal.innerHTML.includes('enterPractice'))click({action:'enterPractice'});
}
assert(root.innerHTML.includes('class="play victory"'));click({action:'result'});
assert.equal(modal.className,'result-dialog chapter-result-dialog');assert(modal.innerHTML.includes('Nightglow complete!'));
assert(modal.innerHTML.indexOf('data-action="next"')<modal.innerHTML.indexOf('<details'));
assert(modal.innerHTML.includes('<details class="chapter-result-details"><summary>Level 12 result</summary>'));
assert(modal.innerHTML.includes('New headwear earned!'));assert(modal.innerHTML.includes('data-action="chapterCard"'));
click({action:'equipReward'});assert.equal(JSON.parse(stored).profiles[0].hat,'night');assert(modal.innerHTML.includes('Equipped'));
click({action:'next'});assert(modal.open);assert(modal.innerHTML.includes('39,00 kr'));assert(modal.innerHTML.includes('data-action="restorePurchases"'));assert.equal(JSON.parse(stored).completed.length,12);assert.equal(JSON.parse(stored).last,12);
const saved=JSON.parse(stored);assert(!JSON.stringify(saved).includes('glimbraid_full_game'),'Purchase entitlement never enters player backups');click({action:'restorePurchases'});await new Promise(r=>setImmediate(r));assert(!modal.open);assert(root.innerHTML.includes('Forest calm'));assert.equal(JSON.parse(stored).last,13);assert.equal(JSON.parse(stored).completed.length,12);
receive({kind:'entitlement',owned:false});assert(modal.open,'A revoked purchase pauses a paid level');assert.equal(JSON.parse(stored).last,13);click({action:'freeGame'});assert(!modal.open);assert(root.innerHTML.includes('Nightglow'));click({level:'13'});assert(modal.open);
for(const lang of ['nb','en']){const t=translator(lang);assert.notEqual(t('levelResult',{n:12}),'levelResult');assert(t('hintNote').includes(lang==='nb'?'ved første trykk':'on the first tap'));assert.notEqual(t('practiceHintMarked'),t('hintMarked'));}
console.log('PASS: free-chapter reward precedes paywall; restore opens level 13 without changing progress; revocation pauses paid play; free chapter remains accessible; purchase is separate from backup.');
