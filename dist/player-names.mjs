import {languages,translator} from './i18n.mjs';
const originalDefaults=new Set(languages.map(l=>translator(l.code)('defaultPlayer',{n:1})));
export function isDefaultName(name){return languages.some(l=>Array.from({length:6},(_,i)=>translator(l.code)('defaultPlayer',{n:i+1})).includes(name));}
export function syncDefaultNames(profiles,lang){
 for(const p of profiles)if(p.autoName===undefined&&p.id==='first'&&originalDefaults.has(p.name))p.autoName=true;
 const used=new Set(profiles.filter(p=>p.autoName!==true).map(p=>p.name.toLocaleLowerCase()));
 for(const p of profiles)if(p.autoName===true){let n=1,name;do{name=translator(lang)('defaultPlayer',{n:n++});}while(used.has(name.toLocaleLowerCase()));p.name=name;used.add(name.toLocaleLowerCase());}
}
