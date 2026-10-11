// Bundled fonts keep Japanese/Korean UI and exported images available offline.
export function cardFontFamily(lang){
 return lang==='ja'?'"Glimbraid JP", sans-serif':lang==='ko'?'"Glimbraid KR", sans-serif':'sans-serif';
}
export async function loadCardFont(lang){
 const fonts=globalThis.document?.fonts;
 if(!fonts||!['ja','ko'].includes(lang))return;
 const loaded=await fonts.load(`bold 60px ${cardFontFamily(lang)}`,lang==='ja'?'光の道':'빛의 길');
 if(!loaded.length)throw Error('Card font unavailable');
}
