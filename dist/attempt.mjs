export function validAttempt(a,levels,completed){
 if(!a)return null;const l=levels.find(l=>l.id===a.level),rotation=r=>Array.isArray(r)&&r.length===l?.tiles.length&&r.every(n=>Number.isInteger(n)&&n>=0&&n<4);
 if(!l||(l.id>1&&!completed.includes(l.id-1))||!rotation(a.rot)||!Number.isInteger(a.moves)||a.moves<0||!Number.isFinite(a.elapsed)||a.elapsed<0||!Array.isArray(a.history)||a.history.length>1000||!a.history.every(rotation)||!Number.isInteger(a.hintsUsed)||a.hintsUsed<0||a.hintsUsed>3+3*levels.length||typeof a.assisted!=='boolean'||typeof a.practice!=='boolean'||typeof a.started!=='boolean'||((a.practice||a.hintsUsed>0)&&!a.assisted))return null;
 if(a.pendingHint&&(!Number.isInteger(a.pendingHint.tile)||a.pendingHint.tile<0||a.pendingHint.tile>=l.tiles.length||a.pendingHint.rotation!==0||!a.assisted))return null;
 return structuredClone(a);
}
