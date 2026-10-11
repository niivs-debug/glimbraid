import {Capacitor} from '@capacitor/core';
import {store,ProductType,Platform,PurchasePlugin,ErrorCode} from 'capacitor-plugin-cdv-purchase';
if(Capacitor.isNativePlatform()){
 const platform=Capacitor.getPlatform(),statePlugin=Capacitor.registerPlugin('GlimbraidBillingState');
 const storePlatform=platform==='ios'?Platform.APPLE_APPSTORE:Platform.GOOGLE_PLAY;
 let id,notify,initialized=false,restoreWaiting=false;
 async function query(){let timer;let result;try{result=await Promise.race([statePlugin.query({productId:id}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Store timeout')),20000);})]);}finally{clearTimeout(timer);}notify({kind:'entitlement',owned:result.owned});}
 const error=e=>notify({kind:'error',cancelled:Number(e?.code)===ErrorCode.PAYMENT_CANCELLED});
 let lastQuery;
 async function fresh(){if(lastQuery)await lastQuery.catch(()=>{});return refresh();}
 function refresh(){if(!lastQuery)lastQuery=query().finally(()=>{lastQuery=null;});return lastQuery;}
 const finishing=new Set();
 window.GlimbraidStore={platform,
  async initialize(productId,send){
   id=productId;notify=send;if(initialized)return;initialized=true;
   store.register([{id,type:ProductType.NON_CONSUMABLE,platform:storePlatform}]);
   store.when().productUpdated(product=>{if(product.id===id)notify({kind:'product',price:product.getOffer()?.pricingPhases?.[0]?.price});});
   store.when().pending(transaction=>{if(transaction.products.some(p=>p.id===id))notify({kind:'pending'});});
   store.when().approved(async transaction=>{
    if(!transaction.products.some(p=>p.id===id)||finishing.has(transaction.transactionId))return;
    finishing.add(transaction.transactionId);
    try{const e=await transaction.finish();if(e)throw e;await fresh();}catch(e){error(e);}finally{finishing.delete(transaction.transactionId);}
   });
   store.error(error);
   const errors=await store.initialize([storePlatform]);
   if(errors?.length)throw errors[0];
   const product=store.get(id,storePlatform);notify({kind:'product',price:product?.getOffer()?.pricingPhases?.[0]?.price});
   await refresh();
  },
  async buy(){const offer=store.get(id,storePlatform)?.getOffer();if(!offer)throw Error('Unavailable');const e=await offer.order();if(e)throw Object.assign(Error('Purchase failed'),{cancelled:Number(e.code)===ErrorCode.PAYMENT_CANCELLED});notify({kind:'pending'});},
  async restore(){restoreWaiting=true;try{await store.update();const e=await store.restorePurchases();if(e)throw e;await fresh();}finally{restoreWaiting=false;}}
 };
 // The native purchase APIs remain authoritative after foreground/reconnect.
 window.addEventListener('sporlys:native-state',e=>{if(e.detail?.isActive&&initialized&&!restoreWaiting)refresh().catch(error);});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&initialized&&!restoreWaiting)refresh().catch(error);});
 window.addEventListener('online',()=>{if(initialized)refresh().catch(error);});
}
