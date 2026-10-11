export function recordResult(previous,time,moves,assisted=false){
 if(assisted)return {record:previous,improved:{time:false,moves:false,first:false}};
 const improved={time:!previous||time<previous.time,moves:!previous||moves<previous.moves,first:!previous};
 return {record:{time:Math.min(previous?.time??Infinity,time),moves:Math.min(previous?.moves??Infinity,moves)},improved};
}

// Derive category totals from existing best records; never store a second score.
export function scoreRows(players,{levelId,chapter,metric='time'}){
 if(!['time','moves'].includes(metric))throw Error('Invalid score metric');
 const ids=chapter?Array.from({length:chapter.end-chapter.start+1},(_,i)=>chapter.start+i):[levelId];
 const rows=players.map(p=>{
  const records=ids.map(id=>p.data.records?.[id]).filter(r=>r&&Number.isFinite(r.time)&&r.time>=0&&Number.isInteger(r.moves)&&r.moves>=0);
  const count=records.length,value=count===ids.length?records.reduce((n,r)=>n+r[metric],0):null;
  return {...p,count,total:ids.length,value,rank:null};
 });
 const rounded=value=>metric==='time'?Math.floor(value/10):value;
 rows.sort((a,b)=>(a.value===null)-(b.value===null)||(a.value!==null&&b.value!==null?rounded(a.value)-rounded(b.value):b.count-a.count)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
 let previous,rank=0;
 rows.forEach((p,i)=>{if(p.value===null)return;const value=rounded(p.value);if(value!==previous)rank=i+1;previous=value;p.rank=rank;});
 return rows;
}
