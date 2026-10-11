// Explicit fake store for existing gameplay regression tests, never packaged
// as a native plugin and never loaded by the app's index.html.
const cache=new Map();
globalThis.GlimbraidStore={platform:'android',storage:{getItem:k=>cache.get(k),setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)},initialize:async(id,send)=>send({kind:'entitlement',owned:true})};
