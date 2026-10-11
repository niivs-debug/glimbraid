import {chapters} from './engine.mjs';
export const characters=['fox','owl','spirit','stone','hare','dragon'];
export const headwear=['none','night','forest','frost','rav','aurora','stellar','solar','weave'];
export function earnedHeadwear(data){return chapters.filter(c=>headwear.includes(c.id)&&Array.from({length:c.end-c.start+1},(_,i)=>c.start+i).every(id=>data.completed.includes(id))).map(c=>c.id);}
export function canWear(data,hat){return hat==='none'||earnedHeadwear(data).includes(hat);}
export function avatarHTML(profile,hat=profile.hat||'none'){
 const character=characters[profile.symbol]||characters[0];
 return `<span class="game-avatar character-${character}" aria-hidden="true"><img class="character-art" src="characters/${character}.png" alt="" draggable="false">${hat!=='none'&&headwear.includes(hat)?`<img class="character-hat hat-${hat}" src="characters/hat-${hat}.png" alt="" draggable="false">`:''}</span>`;
}
