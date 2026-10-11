import assert from 'node:assert/strict';
import {initHints,basicHints,remainingHints,spendHint,bankOnCompletion} from '../dist/hint-bank.mjs';
import {validateBackup} from '../dist/backup.mjs';
const player=()=>({version:1,lang:'en',sound:true,ambience:false,haptics:true,showTime:true,completed:[],records:{},last:1});
const a=initHints(player()),b=initHints(player());
assert.equal(remainingHints(a,1),3);
assert.equal(bankOnCompletion(a,1),3);assert.equal(a.hintBalance,3);
assert.equal(bankOnCompletion(a,1),0);assert.equal(a.hintBalance,3,'Replays cannot earn bank hints');
assert.equal(b.hintBalance,0,'Separate wallets per player');
for(let used=0;used<3;used++){assert(spendHint(a,2,used));assert.equal(a.hintBalance,3,'Use level hints first');}
assert.equal(basicHints(a,2,0),0,'Restart does not refill basic hints');
const reloaded=initHints(JSON.parse(JSON.stringify(a)));assert.equal(basicHints(reloaded,2),0);
assert(spendHint(reloaded,2,0));assert.equal(reloaded.hintBalance,2);
assert.equal(bankOnCompletion(reloaded,2),0,'Spent basics cannot be banked after restart');
assert.equal(bankOnCompletion(reloaded,2),0);
assert(spendHint(b,1));assert.equal(bankOnCompletion(b,1),2);assert.equal(b.hintBalance,2);
for(let i=0;i<3;i++)assert(spendHint(b,2,i));
assert(spendHint(b,2,3));assert(spendHint(b,2,4));assert(!spendHint(b,2,5));
assert.equal(remainingHints(b,2,0),0);
const legacy=player();legacy.attempt={level:1,hintsUsed:2};initHints(legacy);assert.equal(basicHints(legacy,1),1,'Migrate interrupted legacy attempts');
const oldCompleted=player();oldCompleted.completed=[1,2];initHints(oldCompleted);assert.equal(oldCompleted.hintBalance,0,'Do not fabricate historical earnings');
const wrap=data=>({format:'sporlys-backup',version:1,activeProfile:'p',profiles:[{id:'p',name:'Player',symbol:0,data}]});
const imported=validateBackup(wrap(reloaded),36).profiles[0].data;assert.equal(imported.hintBalance,2);assert.deepEqual(imported.hintBaseUsed,{});
const unfinished=initHints(player());spendHint(unfinished,1);assert.equal(validateBackup(wrap(unfinished),36).profiles[0].data.hintBaseUsed[1],1);
const old=validateBackup(wrap(player()),36).profiles[0].data;assert(!Object.hasOwn(old,'hintBalance'),'Old backups remain accepted');
for(const data of [{...reloaded,hintBalance:-1},{...reloaded,hintBalance:1.5},{...reloaded,hintBalance:7},{...reloaded,hintBaseUsed:{37:1}},{...reloaded,hintBaseUsed:{3:4}},{...reloaded,hintBaseUsed:{1:1}},{...reloaded,hintBaseUsed:[]}])assert.throws(()=>validateBackup(wrap(data),36));
console.log('PASS: hint banking, basic-first spending, restart/reload, player isolation, legacy migration, no replay farming, backup validation.');

const cap=initHints(player());for(let id=1;id<=47;id++)bankOnCompletion(cap,id);assert.equal(cap.hintBalance,10);assert.equal(bankOnCompletion(cap,48),3);assert.equal(cap.hintBalance,13);assert.equal(bankOnCompletion(cap,49),2);assert.equal(cap.hintBalance,15);assert.equal(bankOnCompletion(cap,50),0);assert.equal(cap.hintBalance,15);const migrated=initHints({...player(),completed:[1,2,3,4],hintBalance:12});assert.equal(migrated.hintBalance,10);assert.equal(initHints({...cap,hintBalance:140}).hintBalance,15);console.log('PASS: bank ceiling 10, completion of 48 unlocks capacity15 without free hints, clamped earnings and legacy banks.');
