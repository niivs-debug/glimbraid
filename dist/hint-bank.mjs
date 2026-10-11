export const bankLimit=data=>(data.completed||[]).includes(48)?15:10;
// Basic hints belong to a level, so restarting cannot refill them.
export function initHints(data){
 if(!Number.isInteger(data.hintBalance)||data.hintBalance<0)data.hintBalance=0;
 data.hintBalance=Math.min(data.hintBalance,bankLimit(data));
 if(!data.hintBaseUsed||typeof data.hintBaseUsed!=='object'||Array.isArray(data.hintBaseUsed))data.hintBaseUsed={};
 const a=data.attempt;if(a&&!data.completed.includes(a.level)&&!Object.hasOwn(data.hintBaseUsed,a.level))data.hintBaseUsed[a.level]=Math.min(3,a.hintsUsed||0);
 return data;
}
export function basicHints(data,id,hintsUsed=0){initHints(data);return Math.max(0,3-(data.completed.includes(id)?Math.min(3,hintsUsed):data.hintBaseUsed[id]||0));}
export function remainingHints(data,id,hintsUsed=0){return basicHints(data,id,hintsUsed)+data.hintBalance;}
export function spendHint(data,id,hintsUsed=0){
 if(basicHints(data,id,hintsUsed)>0){if(!data.completed.includes(id))data.hintBaseUsed[id]=(data.hintBaseUsed[id]||0)+1;return true;}
 if(data.hintBalance>0){data.hintBalance--;return true;}return false;
}
export function bankOnCompletion(data,id){
 initHints(data);if(data.completed.includes(id))return 0;
 const unused=basicHints(data,id);delete data.hintBaseUsed[id];data.completed.push(id);const earned=Math.min(unused,bankLimit(data)-data.hintBalance);data.hintBalance+=earned;return earned;
}
