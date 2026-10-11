// Review access is separate from store ownership and normal player data.
const KEY='glimbraid.review.active.v1';
const HASH="cc135cc486ff7fac60a182f91f5808549721e1358776dcb6759389672db7c6cb";
export function createReviewAccess({storage=globalThis.localStorage,crypto=globalThis.crypto}={}){
 let active=false;try{active=storage?.getItem(KEY)==='active';}catch{}
 return {get active(){return active;},get progressKey(){return active?'glimbraid.review.progress.v1':'sporlys.progress.v1';},
 async activate(code){
  if(typeof code!=='string'||!crypto?.subtle)return false;
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code.trim().toUpperCase()));
  const hash=Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
  if(hash!==HASH)return false;
  storage.setItem(KEY,'active');active=true;return true;
 },end(){storage.removeItem(KEY);active=false;}};
}
