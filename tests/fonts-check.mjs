import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cardFontFamily,loadCardFont} from '../dist/fonts.mjs';
assert.equal(cardFontFamily('en'),'sans-serif');
for(const code of ['ja','ko']){
 assert(cardFontFamily(code).includes(code==='ja'?'Glimbraid JP':'Glimbraid KR'));
 const p=`dist/fonts/glimbraid-${code==='ja'?'jp':'kr'}.woff2`;
 assert.equal(fs.readFileSync(p).subarray(0,4).toString(),'wOF2');
 let requested;
 globalThis.document={fonts:{load:async(...args)=>{requested=args;return [{}];}}};
 await loadCardFont(code);assert(requested[0].startsWith('bold 60px'));assert(requested[1].length);
 document.fonts.load=async()=>[];await assert.rejects(()=>loadCardFont(code));
}
delete globalThis.document;await loadCardFont('ja');
console.log('PASS: bundled Japanese/Korean WOFF2 assets, export font selection and awaited font loading; unavailable fonts reject instead of exporting missing glyphs.');
