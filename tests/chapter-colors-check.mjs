import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,scrollTop:0,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
const scroller={scrollTop:0};let calls=0;
globalThis.scrollTo=(x,y)=>{assert.equal(x,0);assert.equal(y,0);calls++;scroller.scrollTop=y;};
globalThis.document={hidden:false,scrollingElement:scroller,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};
Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});
let stored=JSON.stringify({completed:Array.from({length:96},(_,i)=>i+1)});globalThis.localStorage={getItem:()=>stored||null,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});
await import('../dist/app.mjs?navigation');
const {chapters,levels}=await import('../dist/engine.mjs');
const css=readFileSync(new URL('../dist/style.css',import.meta.url),'utf8');
const palettes=new Set();
for(const chapter of chapters){
 const rule=css.match(new RegExp('\\.board\\[data-chapter="'+chapter.id+'"\\]\\{([^}]+)\\}'));
 assert(rule,chapter.id+' palette');palettes.add(rule[1]);
 for(const level of levels.filter(l=>l.id>=chapter.start&&l.id<=chapter.end)){
  click({level:String(level.id)});
  assert(root.innerHTML.includes('data-chapter="'+chapter.id+'"'),'Level '+level.id+' has own chapter palette');
  assert.equal((root.innerHTML.match(/data-rotate=/g)||[]).length,level.n**2);
  click({action:'home'});
 }
}
assert.equal(palettes.size,8);
assert(css.includes('.board[data-chapter] .tile:hover:enabled'));
console.log('PASS: all 96 boards choose their chapter palette, all eight palettes differ, tile count and light colors retained.');
