import l0 from './locales/nb.mjs';
import l1 from './locales/en.mjs';
import l2 from './locales/sv.mjs';
import l3 from './locales/da.mjs';
import l4 from './locales/fi.mjs';
import l5 from './locales/de.mjs';
import l6 from './locales/fr.mjs';
import l7 from './locales/es.mjs';
import l8 from './locales/it.mjs';
import l9 from './locales/pl.mjs';
import l10 from './locales/pt-BR.mjs';
import l11 from './locales/tr.mjs';
import l12 from './locales/id.mjs';
import l13 from './locales/ja.mjs';
import l14 from './locales/ko.mjs';
export const messages={"nb":l0,"en":l1,"sv":l2,"da":l3,"fi":l4,"de":l5,"fr":l6,"es":l7,"it":l8,"pl":l9,"pt-BR":l10,"tr":l11,"id":l12,"ja":l13,"ko":l14};
export const languages=[{"code": "nb", "name": "Norsk"}, {"code": "en", "name": "English"}, {"code": "sv", "name": "Svenska"}, {"code": "da", "name": "Dansk"}, {"code": "fi", "name": "Suomi"}, {"code": "de", "name": "Deutsch"}, {"code": "fr", "name": "Français"}, {"code": "es", "name": "Español"}, {"code": "it", "name": "Italiano"}, {"code": "pl", "name": "Polski"}, {"code": "pt-BR", "name": "Português (Brasil)"}, {"code":"tr","name":"Türkçe"}, {"code":"id","name":"Bahasa Indonesia"}, {"code":"ja","name":"日本語"}, {"code":"ko","name":"한국어"}];
export const supportedLanguages=languages.map(l=>l.code);
export function resolveLanguage(value){
 const tag=String(value||'').replaceAll('_','-').toLowerCase();
 if(/^(no|nb|nn)(-|$)/.test(tag))return 'nb';
 if(/^pt(-|$)/.test(tag))return 'pt-BR';
 return supportedLanguages.find(code=>code.toLowerCase()===tag||code===tag.split('-')[0])||'en';
}
export function translator(lang){const dict=messages[resolveLanguage(lang)];return (key,vars={})=>{let value=dict[key]??messages.en[key]??key;for(const [k,v]of Object.entries(vars))value=value.replaceAll('{'+k+'}',String(v));return value;};}
export function numberText(lang,value,digits=0){return new Intl.NumberFormat(resolveLanguage(lang),{minimumFractionDigits:digits,maximumFractionDigits:digits,useGrouping:false}).format(value);}
