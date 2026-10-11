import assert from 'node:assert/strict';
import fs from 'node:fs';
import {messages,languages,translator,resolveLanguage,numberText} from '../dist/i18n.mjs';
import {validateBackup} from '../dist/backup.mjs';
import {chapters,levels} from '../dist/engine.mjs';
const keys=Object.keys(messages.en).sort(),slots=s=>[...s.matchAll(/\{([a-z]+)\}/g)].map(m=>m[1]).sort();
for(const {code} of languages){
 const dict=messages[code],t=translator(code);assert.deepEqual(Object.keys(dict).sort(),keys,code);
 for(const key of keys){assert(dict[key].trim(),`${code}:${key}`);assert.deepEqual(slots(dict[key]),slots(messages.en[key]),`${code}:${key}: placeholders`);assert(!dict[key].includes('undefined'));assert.notEqual(t(key,{n:2,a:1,b:3,total:8,name:'Ada',date:'2026'}),key);}
 for(const c of chapters){assert.notEqual(t(c.key),c.key);assert.notEqual(t('hat_'+c.id),'hat_'+c.id);}
 const d={version:1,lang:code,sound:false,ambience:false,haptics:false,showTime:true,completed:[1],records:{1:{time:1000,moves:1}},last:2};
 const backup={format:'sporlys-backup',version:1,activeProfile:'p',profiles:[{id:'p',name:'Ada',symbol:0,hat:'none',data:d}]};
 assert.equal(validateBackup(backup,levels.length).profiles[0].data.lang,code);
 backup.profiles[0].data.lang='unsupported';assert.throws(()=>validateBackup(backup,levels.length));
}
assert.equal(resolveLanguage('sv-SE'),'sv');assert.equal(resolveLanguage('nn-NO'),'nb');assert.equal(resolveLanguage('pt-PT'),'pt-BR');assert.equal(resolveLanguage('zz'),'en');assert.equal(numberText('de',1.25,2),'1,25');
for(const [tag,code] of [['tr-TR','tr'],['id-ID','id'],['ja-JP','ja'],['ko-KR','ko']])assert.equal(resolveLanguage(tag),code);
const source=fs.readFileSync('dist/app.mjs','utf8');for(const m of source.matchAll(/\bt\('([A-Za-z_]+)'\s*[,)]/g))assert(messages.en[m[1]],m[1]);
console.log(`PASS: ${languages.length} complete language catalogues, ${keys.length} keys each, placeholders, chapter names/rewards, locale detection and backup acceptance/rejection.`);
// Render and switch through every language using the actual app handlers.
const events={},changes={},root={innerHTML:'',classList:{toggle(){}}},modal={open:false,innerHTML:'',showModal(){this.open=true},close(){this.open=false},addEventListener:(k,f)=>changes[k]=f};let stored;
globalThis.document={hidden:false,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};
Object.defineProperty(globalThis,'navigator',{value:{language:'sv-SE'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});
await import('../dist/app.mjs?allLanguages');assert(root.innerHTML.includes('Spelare 1'));
for(const {code} of languages){
 const fresh={version:1,lang:'en',sound:false,ambience:false,haptics:false,showTime:true,completed:[],records:{},last:1};stored=JSON.stringify(fresh);await import(`../dist/app.mjs?fresh-${code}`);
 click({action:'settings'});changes.change({target:{id:'language',value:code}});assert.equal(document.documentElement.lang,code);assert.equal(JSON.parse(stored).lang,code);
 assert.equal((modal.innerHTML.match(/<option value=/g)||[]).length,languages.length);
 for(const action of ['help','about','players','backup']){click({action:'close'});click({action});assert(modal.innerHTML.includes(translator(code)(action)));}
 click({action:'close'});click({action:'start'});click({action:'hint'});assert(root.innerHTML.includes(translator(code)('hintMarked')));click({action:'home'});
 await import(`../dist/app.mjs?reload-${code}`);assert.equal(document.documentElement.lang,code,'Language survives reload');
}
console.log('PASS: language selection, translated settings/help/about/players/backup/hints and reload for every supported language.');
