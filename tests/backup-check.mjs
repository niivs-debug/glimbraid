import assert from 'node:assert/strict';
import {validateBackup} from '../dist/backup.mjs';
const data={version:1,lang:'nb',completed:[1,2],records:{1:{time:1234,moves:2}},last:3,sound:true,ambience:false,haptics:true,showTime:true};
const backup={format:'sporlys-backup',version:1,activeProfile:'one',profiles:[{id:'one',name:'Svein',symbol:3,data}]};
assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(backup)),36).profiles[0].data,data);
for(const mutate of [b=>b.format='other',b=>b.version=2,b=>b.activeProfile='missing',b=>b.profiles[0].symbol=7,b=>b.profiles[0].data.completed.push(37),b=>b.profiles[0].data.records[1].time=-1,b=>b.profiles[0].data.records[1].moves=1.5,b=>b.profiles.push(structuredClone(b.profiles[0])),b=>b.profiles[0].data.sound='yes']){const b=structuredClone(backup);mutate(b);assert.throws(()=>validateBackup(b,36));}
console.log('PASS: backup roundtrip, format/version, profile identity, limits, records and setting validation.');
