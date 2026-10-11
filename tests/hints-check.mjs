import assert from 'node:assert/strict';
import {levels,nextHint,evaluate} from '../dist/engine.mjs';
let suggestions=0;
for(const level of levels){
 // Only irrelevant tracks differ: the board is solved and must not offer any hint.
 const fillerOnly=level.tiles.map(t=>t.required?0:1);assert(evaluate(level,fillerOnly).solved);assert.equal(nextHint(level,fillerOnly),null);
 // A partially solved or scrambled board may only select authored route tiles.
 for(let seed=0;seed<40;seed++){
 let rot=level.tiles.map((t,i)=>(i*7+seed*3+(i%3))%4),steps=0;
 while(!evaluate(level,rot).solved&&steps++<level.tiles.length+1){const hint=nextHint(level,rot);assert(hint,`No hint on unfinished level ${level.id}`);assert(level.tiles[hint.tile].required,`Filler selected on level ${level.id}`);assert(level.paths.some(p=>p.cells.includes(hint.tile)));rot[hint.tile]=hint.rotation;suggestions++;}
 assert(evaluate(level,rot).solved,`Hints must converge on level ${level.id}`);
 }
}
console.log(`PASS: ${suggestions} relevant suggestions across all ${levels.length} levels; filler tracks never selected, solved layouts never changed, hints converge.`);
