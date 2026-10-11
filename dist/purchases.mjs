export const PRODUCT_ID='glimbraid_full_game';
export const FREE_LEVELS=12;
// This cache belongs to the installation and store, never to a player/backup.
export function createPurchases({bridge,storage=bridge?.storage??globalThis.localStorage,reviewAccess}={}){
 const native=!!bridge?.platform;
 const key='glimbraid.entitlement.v1.'+(bridge?.platform||'web');
 let owned=false;try{owned=native&&JSON.parse(storage?.getItem(key)||'null')?.product===PRODUCT_ID;}catch{}
 let state={owned,price:'',available:false,busy:false,status:native?'storeLoading':'storeMobileOnly'};
 const listeners=new Set();
 const emit=patch=>{state={...state,...patch};listeners.forEach(f=>f({...state}));};
 const entitlement=value=>{try{if(value)storage?.setItem(key,JSON.stringify({product:PRODUCT_ID}));else storage?.removeItem(key);}catch{}emit({owned:value});};
 const receive=event=>{
  if(event.kind==='product')emit({price:event.price||'',available:!!event.price,status:event.price?'':'storeUnavailable'});
  if(event.kind==='entitlement'&&typeof event.owned==='boolean'){
   const buying=state.busy&&state.status==='storeBuying';entitlement(event.owned);emit({busy:!event.owned&&buying,status:event.owned?'fullGameActive':buying?'storeBuying':'storeNoPurchase'});
  }
  if(event.kind==='pending'&&!state.owned)emit({busy:false,status:'storePending'});
  if(event.kind==='error')emit({busy:false,status:event.cancelled?'storeCancelled':'storeError'});
 };
 const initialize=async()=>{if(!native)return;try{await bridge.initialize(PRODUCT_ID,receive);}catch{emit({status:'storeUnavailable',busy:false});}};
 async function run(operation){
  if(reviewAccess?.active||state.busy||!native||(operation==='buy'&&(state.owned||!state.available||state.status==='storePending')))return;
  emit({busy:true,status:operation==='buy'?'storeBuying':'storeRestoring'});
  try{await bridge[operation]();}catch(e){emit({busy:false,status:e?.cancelled?'storeCancelled':'storeError'});}
 }
 return {get state(){return {...state};},canPlay:id=>Number.isInteger(id)&&id>=1&&id<=96&&(id<=FREE_LEVELS||state.owned||reviewAccess?.active),subscribe:f=>{listeners.add(f);return()=>listeners.delete(f);},initialize,buy:()=>run('buy'),restore:()=>run('restore')};
}
