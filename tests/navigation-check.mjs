import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,scrollTop:0,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
const scroller={scrollTop:0};let calls=0;
globalThis.scrollTo=(x,y)=>{assert.equal(x,0);assert.equal(y,0);calls++;scroller.scrollTop=y;};
globalThis.document={hidden:false,scrollingElement:scroller,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};
Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});
let stored;globalThis.localStorage={getItem:()=>stored||null,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});
await import('../dist/app.mjs?navigation');
const icon=()=>{assert.equal((root.innerHTML.match(/class="brand-icon"/g)||[]).length,1);assert(root.innerHTML.includes('src="icon-512.png"'));assert(existsSync(new URL('../dist/icon-512.png',import.meta.url)));};icon();
click({action:'levels'});scroller.scrollTop=850;click({action:'home'});assert.equal(scroller.scrollTop,0,'Returning from a long chapter list begins at home header');icon();
for(const menu of ['settings','help','about','players','scores','backup']){click({action:menu});click({action:'close'});icon();}
click({action:'levels'});scroller.scrollTop=500;click({level:'1'});assert.equal(scroller.scrollTop,0,'Starting a board starts at its header');
scroller.scrollTop=60;const before=calls;click({rotate:'0'});assert.equal(calls,before,'Rotating does not reset the viewport');assert.equal(scroller.scrollTop,60);
click({action:'pause'});click({action:'close'});assert.equal(scroller.scrollTop,60,'Pause/resume preserves the game viewport');
click({action:'home'});assert.equal(scroller.scrollTop,0);icon();assert(JSON.parse(stored).attempt,'Returning home preserves current attempt');
const css=readFileSync(new URL('../dist/style.css',import.meta.url),'utf8');assert(!/brand-icon\s*\{[^}]*display\s*:\s*none/.test(css),'No breakpoint hides the brand icon');
console.log('PASS: home/level navigation resets the document viewport; icon remains in every home render; menus, moves, pause and saved attempt are preserved. Actual browser/mobile confirmation still required.');
