import assert from 'node:assert/strict';
import {exportChapterCard,drawChapterCard} from '../dist/chapter-card.mjs';
assert.throws(()=>exportChapterCard({toDataURL:()=> 'data:,'}),e=>e.code==='CARD_EXPORT');
assert.throws(()=>exportChapterCard({toDataURL:()=>{throw Error('SecurityError');}}),e=>e.code==='CARD_EXPORT');
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';assert.equal(exportChapterCard({toDataURL:()=>png}),png);
await assert.rejects(()=>drawChapterCard({lang:'nb'},{canvas:{getContext:()=>null}}),e=>e.code==='CARD_CANVAS');
console.log('PASS: invalid PNG and failed export produce a safe diagnostic code; successful export is preserved; unavailable canvas is identified.');
