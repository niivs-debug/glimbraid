// Keep the puzzle together. Only secondary information yields space.
export function watchLayout(root,modal){
 if(!globalThis.ResizeObserver||!globalThis.MutationObserver)return;
 let queued=false;
 const update=()=>{queued=false;
  const home=root.querySelector('.home');
  if(home){root.classList.remove('compact-home','dense-home');const footer=home.querySelector('.home-footer');if(footer&&footer.getBoundingClientRect().bottom+parseFloat(getComputedStyle(root).paddingBottom)>innerHeight)root.classList.add('compact-home');if(footer&&footer.getBoundingClientRect().bottom+parseFloat(getComputedStyle(root).paddingBottom)>innerHeight)root.classList.add('dense-home');}
  const play=root.querySelector('.play'),instruction=play?.querySelector('.instructions');
  const large=instruction&&parseFloat(getComputedStyle(instruction).fontSize)>18;
  const portrait=innerWidth<560||innerHeight>520;
  const tile=play?.querySelector('.tile');
  const cramped=tile&&tile.getBoundingClientRect().width<44;
  play?.classList.toggle('compact-play',portrait&&(play.classList.contains('compact-play')||innerHeight<650||large||cramped||innerHeight<innerWidth+380));
  const label=modal.querySelector('.headwear-choice > span:not(.bare-head)');
  modal.classList.toggle('large-headwear',!!label&&parseFloat(getComputedStyle(label).fontSize)>18);
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
 const resize=new ResizeObserver(schedule);resize.observe(root);resize.observe(modal);
 const mutation=new MutationObserver(schedule);
 mutation.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
 mutation.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
 globalThis.addEventListener('resize',schedule);globalThis.visualViewport?.addEventListener('resize',schedule);
 schedule();
}
