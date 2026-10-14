// Remove obsolete code-based access without changing purchases or player progress.
export function retireReviewAccess(storage=globalThis.localStorage){
 try{storage?.removeItem?.('glimbraid.review.active.v1');}catch{}
}
