import {weaveLevels} from './weave-levels.mjs';
import {solarLevels} from './solar-levels.mjs';
import {stellarLevels} from './stellar-levels.mjs';
import {auroraLevels} from './aurora-levels.mjs';
import {ravLevels} from './rav-levels.mjs';
import {frostLevels} from './frost-levels.mjs';
import {forestLevels} from './forest-levels.mjs';
export const DIRS=[[-1,0],[0,1],[1,0],[0,-1]];
const edge=(a,b,n)=>b===a-n?0:b===a+1?1:b===a+n?2:3;
function make(id,n,paths,kind,gate){
 const tiles=Array.from({length:n*n},(_,i)=>({groups:[],source:null,target:null,gate:false}));
 for(const {cells,color} of paths){if(cells.length<2||new Set(cells).size!==cells.length)throw Error('Invalid authored path');cells.forEach((cell,k)=>{if(!Number.isInteger(cell)||cell<0||cell>=n*n)throw Error('Path outside board');if(k&&Math.abs(Math.floor(cell/n)-Math.floor(cells[k-1]/n))+Math.abs(cell%n-cells[k-1]%n)!==1)throw Error('Non-adjacent path cells');});cells.forEach((p,k)=>{const ports=[];if(k)ports.push(edge(p,cells[k-1],n));if(k<cells.length-1)ports.push(edge(p,cells[k+1],n));const g=tiles[p].groups.length;tiles[p].groups.push(ports);if(!k)tiles[p].source={group:g,color};if(k===cells.length-1)tiles[p].target={group:g,color};});}
 for(const tile of tiles)tile.required=tile.groups.length>0;
 for(let i=0;i<tiles.length;i++)if(!tiles[i].groups.length)tiles[i].groups=[[0,(i%3===0?1:2)]];
 if(gate)tiles[gate.tile].gate=true;
 const level={id,n,tiles,kind,gate,paths};level.initial=tiles.map((_,i)=>(i*7+id*3+(i%3))%4);if(evaluate(level,level.initial).solved)level.initial[paths[0].cells[1]]=1;return level;
}
export const levels=[
 make(1,3,[{cells:[0,1,4,5,8],color:'mint'}],'intro'),
 make(2,4,[{cells:[0,4,8,9,5,6,10,11,15],color:'mint'}],'route'),
 make(3,4,[{cells:[0,1,5,6,10,11,15],color:'mint'},{cells:[3,2,6,7],color:'mint'}],'double'),
 make(4,4,[{cells:[0,4,5,9,10,14,15],color:'mint'},{cells:[3,7,6,5,1,2],color:'mint'}],'double'),
 make(5,4,[{cells:[0,4,5,9,10,14,15],color:'mint'},{cells:[3,7,6,5,1,2],color:'amber'}],'colors'),
 make(6,4,[{cells:[0,1,5,9,10,14,15],color:'mint'},{cells:[3,7,6,10,11],color:'amber'}],'gate',{tile:9,trigger:11}),
 make(7,4,[{cells:[0,1,5,6,10,11,15],color:'mint'},{cells:[3,2,6,7],color:'amber'}],'colors'),
 make(8,5,[{cells:[0,5,10,11,6,7,12,13,18,19,24],color:'mint'},{cells:[4,3,8,7,2,1],color:'amber'}],'colors'),
 make(9,5,[{cells:[0,1,6,7,12,13,18,19,24],color:'mint'},{cells:[4,9,8,13,14],color:'amber'}],'gate',{tile:12,trigger:14}),
 make(10,5,[{cells:[0,5,6,11,12,17,18,23,24],color:'mint'},{cells:[4,9,8,13,12,7,6,1,2],color:'amber'}],'double'),
 make(11,5,[{cells:[0,5,6,11,12,17,18,23,24],color:'mint'},{cells:[4,9,8,13,12,7,6,1,2],color:'amber'}],'gate',{tile:17,trigger:2}),
 make(12,5,[{cells:[0,5,6,11,12,17,18,23,24],color:'mint'},{cells:[4,9,8,13,12,7,6,1,2],color:'amber'},{cells:[20,21,16,17,22],color:'mint'}],'gate',{tile:18,trigger:2})
];
levels.push(...forestLevels.map(l=>make(l.id,l.n,l.paths,l.kind,l.gate)));
levels.push(...frostLevels.map(l=>{const level=make(l.id,l.n,l.paths,l.kind,l.gate);level.frozen=l.gate.tile;level.initial[level.frozen]=1;return level;}));
levels.push(...ravLevels.map(l=>{const level=make(l.id,l.n,l.paths,l.kind,l.gate);if(l.frozen!==undefined){level.frozen=l.frozen;level.initial[level.frozen]=1;}return level;}));
levels.push(...auroraLevels.map(l=>{const level=make(l.id,l.n,l.paths,l.kind,l.gate);if(l.frozen!==undefined){level.frozen=l.frozen;level.initial[level.frozen]=1;}return level;}));
levels.push(...stellarLevels.map(l=>{const level=make(l.id,l.n,l.paths,l.kind,l.gate);if(l.frozen!==undefined){level.frozen=l.frozen;level.initial[level.frozen]=1;}return level;}));
levels.push(...solarLevels.map(l=>{const level=make(l.id,l.n,l.paths,l.kind,l.gate);if(l.frozen!==undefined){level.frozen=l.frozen;level.initial[level.frozen]=1;}return level;}));
levels.push(...weaveLevels.map(l=>{const level=make(l.id,l.n,l.paths,l.kind,l.gate);if(l.frozen!==undefined){level.frozen=l.frozen;level.initial[level.frozen]=1;}if(l.id>=93){let unsettled=level.tiles.filter((tile,i)=>tile.required&&!equivalent(tile,level.initial[i],0)).length;for(let i=0;i<level.tiles.length&&unsettled<l.id-66;i++)if(level.tiles[i].required&&equivalent(level.tiles[i],level.initial[i],0)){level.initial[i]=1;unsettled++;}}return level;}));
export const chapters=[{id:'night',key:'chapter',series:'prototype',start:1,end:12},{id:'forest',key:'forestChapter',series:'forestSeries',start:13,end:24},{id:'frost',key:'frostChapter',series:'frostSeries',start:25,end:36},{id:'rav',key:'ravChapter',series:'ravSeries',start:37,end:48},{id:'aurora',key:'auroraChapter',series:'auroraSeries',start:49,end:60},{id:'stellar',key:'stellarChapter',series:'stellarSeries',start:61,end:72},{id:'solar',key:'solarChapter',series:'solarSeries',start:73,end:84},{id:'weave',key:'weaveChapter',series:'weaveSeries',start:85,end:96}];
export const chapterFor = id=>chapters.find(c=>id>=c.start&&id<=c.end)||chapters[0];
levels[0].initial=Array(9).fill(0);levels[0].initial[1]=3;
export function ports(level,rot,i,g){return level.tiles[i].groups[g].map(p=>(p+rot[i])%4);}
export function evaluate(level,rot){
 let open=!level.gate, lit;
 for(let pass=0;pass<2;pass++){
 lit=level.tiles.map(t=>t.groups.map(()=>new Set()));const queue=[];
 level.tiles.forEach((t,i)=>{if(t.source){lit[i][t.source.group].add(t.source.color);queue.push([i,t.source.group,t.source.color]);}});
 for(let q=0;q<queue.length;q++){const [i,g,c]=queue[q];if(level.tiles[i].gate&&!open)continue;
 for(const p of ports(level,rot,i,g)){const [dr,dc]=DIRS[p],r=Math.floor(i/level.n)+dr,col=i%level.n+dc;if(r<0||col<0||r>=level.n||col>=level.n)continue;const j=r*level.n+col;if(level.tiles[j].gate&&!open)continue;
 level.tiles[j].groups.forEach((_,h)=>{if(ports(level,rot,j,h).includes((p+2)%4)&&!lit[j][h].has(c)){lit[j][h].add(c);queue.push([j,h,c]);}});}}
 if(level.gate&&!open){const t=level.tiles[level.gate.trigger].target;if(lit[level.gate.trigger][t.group].has(t.color)){open=true;continue;}}break;
 }
 const targets=level.tiles.flatMap((t,i)=>t.target?[{i,...t.target,lit:lit[i][t.target.group].has(t.target.color)}]:[]);
 return {lit,targets,open,solved:targets.every(t=>t.lit)};
}
export function equivalent(tile,a,b){const sig=r=>tile.groups.map(g=>g.map(p=>(p+r)%4).sort().join('')).join('|');return sig(a)===sig(b);}

// Hints only use authored light paths, never decorative filler tracks.
export function nextHint(level,rot){
 const state=evaluate(level,rot);if(state.solved)return null;
 const missing=new Set(state.targets.filter(t=>!t.lit).map(t=>t.i));
 const paths=[...level.paths].filter(p=>missing.has(p.cells.at(-1)));
 if(level.gate&&!state.open)paths.sort((a,b)=>Number(b.cells.at(-1)===level.gate.trigger)-Number(a.cells.at(-1)===level.gate.trigger));
 for(const path of paths){const tile=path.cells.find(i=>level.tiles[i].required&&!equivalent(level.tiles[i],rot[i],0));if(tile!==undefined)return {tile,rotation:0};}
 return null;
}
