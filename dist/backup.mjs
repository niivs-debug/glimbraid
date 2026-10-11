import {isDefaultName} from './player-names.mjs';
import {supportedLanguages} from './i18n.mjs';
import {headwear,canWear} from './avatars.mjs';
import {validAttempt} from './attempt.mjs';
import {levels} from './engine.mjs';
export function validateBackup(value,maxLevel){
 if(!value||value.format!=='sporlys-backup'||value.version!==1||!Array.isArray(value.profiles)||value.profiles.length<1||value.profiles.length>6)throw Error('Invalid backup');
 const ids=new Set(),names=new Set();const profiles=value.profiles.map(p=>{
 if(!p||typeof p.id!=='string'||!p.id||p.id.length>100||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>24||names.has(p.name.trim().toLocaleLowerCase())||!Number.isInteger(p.symbol)||p.symbol<0||p.symbol>5)throw Error('Invalid player');ids.add(p.id);names.add(p.name.trim().toLocaleLowerCase());const d=p.data;
 if(!d||!supportedLanguages.includes(d.lang)||!Array.isArray(d.completed)||d.completed.some(n=>!Number.isInteger(n)||n<1||n>maxLevel)||new Set(d.completed).size!==d.completed.length||!Number.isInteger(d.last)||d.last<1||d.last>maxLevel||!d.records||typeof d.records!=='object'||Array.isArray(d.records))throw Error('Invalid progress');
 if(p.hat!==undefined&&(!headwear.includes(p.hat)||!canWear(d,p.hat)))throw Error('Invalid headwear');
 if(p.autoName!==undefined&&typeof p.autoName!=='boolean')throw Error('Invalid player name mode');
 const records={};for(const [id,r] of Object.entries(d.records)){if(!/^\d+$/.test(id)||Number(id)<1||Number(id)>maxLevel||!r||!Number.isFinite(r.time)||r.time<0||!Number.isInteger(r.moves)||r.moves<0||!d.completed.includes(Number(id)))throw Error('Invalid record');records[id]={time:r.time,moves:r.moves};}
 for(const k of ['sound','ambience','haptics','showTime'])if(typeof d[k]!=='boolean')throw Error('Invalid setting');
 const wallet={};
 if(d.hintBalance!==undefined||d.hintBaseUsed!==undefined){
 if(!Number.isInteger(d.hintBalance)||d.hintBalance<0||d.hintBalance>3*d.completed.length||!d.hintBaseUsed||typeof d.hintBaseUsed!=='object'||Array.isArray(d.hintBaseUsed))throw Error('Invalid hint bank');
 const ledger={};for(const [id,used] of Object.entries(d.hintBaseUsed)){if(!/^[1-9]\d*$/.test(id)||Number(id)>maxLevel||d.completed.includes(Number(id))||!Number.isInteger(used)||used<0||used>3)throw Error('Invalid hint usage');ledger[id]=used;}
 wallet.hintBalance=d.hintBalance;wallet.hintBaseUsed=ledger;
 }
 const attempt=validAttempt(d.attempt,levels,d.completed);if(d.attempt&&!attempt)throw Error('Invalid attempt');
 return {id:p.id,name:p.name.trim(),symbol:p.symbol,...(p.autoName!==undefined?{autoName:p.autoName&&isDefaultName(p.name.trim())}:{}),...(p.hat!==undefined?{hat:p.hat}:{}),data:{...wallet,...(attempt?{attempt}:{}),...(typeof d.lastBackup==='string'&&Number.isFinite(Date.parse(d.lastBackup))?{lastBackup:d.lastBackup}:{}),version:1,lang:d.lang,completed:[...d.completed],records,last:d.last,sound:d.sound,ambience:d.ambience,haptics:d.haptics,showTime:d.showTime}};
 });if(!ids.has(value.activeProfile))throw Error('Invalid active player');return {profiles,activeProfile:value.activeProfile};
}
