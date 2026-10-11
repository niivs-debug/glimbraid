import {languages,resolveLanguage,translator} from './i18n.mjs';
const select=document.querySelector('#policy-language');
let language=resolveLanguage(navigator.language);
try{const saved=JSON.parse(localStorage.getItem('sporlys.progress.v1')||'{}');language=resolveLanguage(saved.lang||language);}catch{}
const explicit=new URLSearchParams(globalThis.location?.search||'').get('lang');if(explicit)language=resolveLanguage(explicit);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
select.innerHTML=languages.map(l=>`<option value="${l.code}" lang="${l.code}">${l.name}</option>`).join('');
function render(){
 const t=translator(language);select.value=language;document.documentElement.lang=language;document.title=t('privacy')+' · Glimbraid';document.querySelector('#back').textContent=t('backToGame');document.querySelector('#policy-label').textContent=t('language');select.setAttribute('aria-label',t('language'));
 const date=new Intl.DateTimeFormat(language,{dateStyle:'long',timeZone:'UTC'}).format(new Date('2026-10-08T12:00:00Z'));
 document.querySelector('#policy').innerHTML=`<h1>${escape(t('policyTitle'))}</h1><p>${escape(t('policyUpdated',{date}))}</p>`+['Maker','Saved','Share','Hosting','Sound','Delete','Purchases'].map(part=>`<h2>${escape(t('policy'+part+'Title'))}</h2><p>${escape(t('policy'+part))}</p>${part==='Maker'?'<p><a href="mailto:kontakt@bjerkholtstudio.no">kontakt@bjerkholtstudio.no</a></p>':''}`).join('');
}
select.addEventListener('change',()=>{language=resolveLanguage(select.value);render();});render();
