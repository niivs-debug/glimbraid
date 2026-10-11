import assert from 'node:assert/strict';
const state=()=>({version:1,lang:'en',completed:[1],records:{1:{time:300,moves:1}},last:2,sound:false,ambience:false,haptics:false,showTime:true,hintBalance:3,hintBaseUsed:{}});
const p=(id,name)=>({id,name,symbol:0,hat:'none',data:state()});
let stored=JSON.stringify({...state(),profiles:[p('a','<Ada>'),p('b','Bo')],activeProfile:'a'});
const events={},root={innerHTML:'',classList:{toggle(){}}},modal={innerHTML:'',open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
globalThis.document={hidden:false,documentElement:{lang:'en'},querySelector:s=>s==='#app'?root:s==='#modal'?modal:s==='.world-lights'?{innerHTML:''}:null,addEventListener:(k,f)=>events[k]=f};Object.defineProperty(globalThis,'navigator',{value:{language:'en'},configurable:true});globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>stored=v};globalThis.setInterval=()=>{};
const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});
await import('../dist/app.mjs?deletion');click({action:'players'});assert(modal.innerHTML.includes('data-delete-player="a"'));
click({deletePlayer:'a'});assert(modal.innerHTML.includes('Delete &lt;Ada&gt;?'));assert(modal.innerHTML.includes('saved hints and rewards'));assert(modal.innerHTML.includes('autofocus'));const before=stored;click({action:'cancelDeletePlayer'});assert.equal(stored,before);
// Closing or sending a confirmation outside the confirmation dialog cannot delete.
click({deletePlayer:'a'});click({action:'close'});click({action:'confirmDeletePlayer'});assert.equal(stored,before);
click({action:'players'});click({deletePlayer:'b'});click({action:'confirmDeletePlayer'});let saved=JSON.parse(stored);assert.equal(saved.profiles.length,1);assert.equal(saved.activeProfile,'a');assert.deepEqual(saved.profiles[0].data,state());assert(!modal.innerHTML.includes('data-player="b"'));
click({deletePlayer:'a'});assert(modal.innerHTML.includes('last player'));click({action:'confirmDeletePlayer'});saved=JSON.parse(stored);assert.equal(saved.profiles.length,1);assert.notEqual(saved.activeProfile,'a');assert.equal(saved.profiles[0].name,'Player 1');assert.deepEqual(saved.completed,[]);assert.deepEqual(saved.records,{});assert.equal(saved.hintBalance,0);assert(!saved.attempt);assert(!stored.includes('<Ada>'));
await import('../dist/app.mjs?deletionReload');assert(root.innerHTML.includes('Player 1'));assert(!root.innerHTML.includes('&lt;Ada&gt;'));
// Failed storage write retains the player; no partially deleted in-memory state.
click({action:'players'});click({deletePlayer:saved.activeProfile});const original=localStorage.setItem;localStorage.setItem=()=>{throw Error('quota')};click({action:'confirmDeletePlayer'});localStorage.setItem=original;assert.equal(JSON.parse(stored).profiles[0].id,saved.activeProfile);assert(modal.innerHTML.includes('Player 1'));
console.log('PASS: named deletion confirmation, cancel/close guards, inactive deletion isolation, final-player reset, reload and storage failure.');

const first=p('c','Cy'),second=p('d','Dee');first.data.attempt={level:2};stored=JSON.stringify({...first.data,profiles:[first,second],activeProfile:'c'});await import('../dist/app.mjs?activeDeletion');click({action:'players'});click({deletePlayer:'c'});click({action:'confirmDeletePlayer'});const switched=JSON.parse(stored);assert.equal(switched.activeProfile,'d');assert.equal(switched.profiles.length,1);assert.deepEqual(switched.records,second.data.records);assert(!switched.attempt);assert(modal.innerHTML.includes('data-player="d"'));console.log('PASS: deleting active player selects survivor and removes deleted attempt without changing survivor records.');
