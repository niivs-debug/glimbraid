import assert from 'node:assert/strict';
import fs from 'node:fs';
import {retireReviewAccess} from '../dist/entitlement-migration.mjs';
import {createPurchases,PRODUCT_ID} from '../dist/purchases.mjs';
import {validAttempt} from '../dist/attempt.mjs';
import {levels} from '../dist/engine.mjs';
const cache=new Map([
 ['glimbraid.review.active.v1','active'],
 ['glimbraid.review.progress.v1','sandbox progress'],
 ['sporlys.progress.v1','normal player progress'],
 ['glimbraid.entitlement.v1.ios',JSON.stringify({product:PRODUCT_ID})]
]);
const storage={getItem:k=>cache.get(k),setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)};
retireReviewAccess(storage);
assert(!cache.has('glimbraid.review.active.v1'));
assert.equal(cache.get('glimbraid.review.progress.v1'),'sandbox progress');
assert.equal(cache.get('sporlys.progress.v1'),'normal player progress');
assert.equal(JSON.parse(cache.get('glimbraid.entitlement.v1.ios')).product,PRODUCT_ID);
assert.doesNotThrow(()=>retireReviewAccess({removeItem(){throw Error('blocked');}}));
let send,buys=0,restores=0;
const bridge={platform:'ios',initialize:async(_,cb)=>{send=cb;send({kind:'product',price:'39 kr'});send({kind:'entitlement',owned:false});},buy:async()=>{buys++;send({kind:'error',cancelled:true});},restore:async()=>{restores++;send({kind:'entitlement',owned:true});}};
// A stale API object, even if injected, is never considered an entitlement.
const p=createPurchases({bridge,storage,reviewAccess:{active:true}});
await p.initialize();assert(p.canPlay(12));assert(!p.canPlay(13));assert(!p.canPlay(96));
await p.buy();assert.equal(buys,1);assert(!p.state.owned);
await p.restore();assert.equal(restores,1);assert(p.canPlay(96));
const offline=createPurchases({bridge:{platform:'ios',initialize:async()=>{throw Error('offline');}},storage});
await offline.initialize();assert(offline.canPlay(96));
send({kind:'entitlement',owned:false});assert(!p.canPlay(13));
const a={level:13,rot:[...levels[12].initial],moves:0,elapsed:0,history:[],hintsUsed:0,assisted:false,practice:false,started:false};
assert.equal(validAttempt(a,levels,[],true),null,'Old review flag cannot bypass sequential progress');
const app=fs.readFileSync('dist/app.mjs','utf8');
assert(!/reviewAccess|reviewView|activateReview|endReview/.test(app));
assert(app.indexOf('retireReviewAccess();')<app.indexOf('const KEY='));
const retired=await import('../dist/review-access.mjs');assert.equal(Object.keys(retired).length,0);
assert(!/HASH|activate|crypto/.test(fs.readFileSync('dist/review-access.mjs','utf8')));
console.log('PASS: retired code access cannot unlock levels or block Apple purchases; migration preserves player data and real purchase cache; restore, offline access and revocation work.');
