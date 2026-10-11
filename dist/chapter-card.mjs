import {characters,earnedHeadwear} from './avatars.mjs';
import {translator} from './i18n.mjs';
import {cardFontFamily,loadCardFont} from './fonts.mjs';
export function chapterSummary(profile,data,chapter){
 const count=Array.from({length:chapter.end-chapter.start+1},(_,i)=>chapter.start+i).filter(id=>data.completed.includes(id)).length;
 if(count!==chapter.end-chapter.start+1)throw Error('Chapter unfinished');
 const t=translator(data.lang);return {name:profile.name,symbol:profile.symbol,hat:profile.hat||'none',lang:data.lang,chapter:chapter.id,chapterName:t(chapter.key),start:chapter.start,end:chapter.end,count,total:chapter.end-chapter.start+1,hats:earnedHeadwear(data).length,hints:data.hintBalance||0};
}
function loadImage(src,code='CARD_IMAGE'){return new Promise((resolve,reject)=>{const image=new Image(),timer=setTimeout(()=>reject(Object.assign(Error('Image unavailable'),{code})),15000);image.onload=()=>{clearTimeout(timer);resolve(image)};image.onerror=()=>{clearTimeout(timer);reject(Object.assign(Error('Image unavailable'),{code}))};image.src=src;});}
export async function drawChapterCard(s,options={}){
 try{await loadCardFont(s.lang);}catch(error){throw Object.assign(error,{code:'CARD_FONT'});}
 const font=cardFontFamily(s.lang),fitText=(text,size,width,x,y,center=true)=>fit(ctx,text,size,width,x,y,center,font);
 const canvas=options.canvas||document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d'),load=options.loadImage||loadImage;
 if(!ctx)throw Object.assign(Error('Canvas unavailable'),{code:'CARD_CANVAS'});
 const [figure,logo,hat,prize]=await Promise.all([load(`characters/${characters[s.symbol]||characters[0]}.png`,'CARD_AVATAR'),load('glimbraid-wordmark-card.png','CARD_LOGO'),s.hat==='none'?null:load(`characters/hat-${s.hat}.png`,'CARD_HAT'),load(`characters/hat-${s.chapter}.png`,'CARD_PRIZE')]);
 const t=translator(s.lang),warm=s.chapter==='rav'||s.chapter==='solar',aurora=s.chapter==='aurora',stellar=s.chapter==='stellar'||s.chapter==='weave',g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,warm?'#342a1c':aurora?'#282349':stellar?'#17294c':'#173a39');g.addColorStop(.6,'#081c2a');g.addColorStop(1,'#050f1b');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);
 const halo=ctx.createRadialGradient(540,560,30,540,560,480);halo.addColorStop(0,warm?'#bd903b40':aurora?'#98e6db40':stellar?'#8bbdff40':'#7adac636');halo.addColorStop(1,'#10202c00');ctx.fillStyle=halo;ctx.fillRect(0,200,1080,780);
 ctx.strokeStyle='#a6f2d340';ctx.lineWidth=3;ctx.strokeRect(35,35,1010,1280);ctx.drawImage(logo,180,75,720,115);
 ctx.textAlign='center';ctx.fillStyle='#edfff4';fitText(t('chapterComplete',{name:s.chapterName}),60,950,540,270);
 ctx.fillStyle='#b6cfc9';fitText(t('cardRange',{a:s.start,b:s.end}),30,930,540,323);
 ctx.drawImage(figure,300,350,480,480);
 if(hat){const left=['fox','dragon'].includes(characters[s.symbol])?.36:.2,top={spirit:.03,stone:-.02,hare:.11,dragon:.09}[characters[s.symbol]]||0;drawContained(ctx,hat,300+480*(left+.13),350+480*top,480*.34,480*.34);}
 ctx.fillStyle='#fff0d0';fitText(s.name,52,900,540,898);
 const stats=[[`${s.count}/${s.total}`,t('cardLevels')],[String(s.hats),t('cardHats')],[String(s.hints),t('cardHints')]];
 for(let i=0;i<3;i++){const x=85+i*310;ctx.fillStyle='#183c4488';ctx.fillRect(x,954,290,150);ctx.strokeStyle='#94f3ce50';ctx.strokeRect(x,954,290,150);ctx.fillStyle='#d6ffe8';fitText(stats[i][0],54,260,x+145,1024);ctx.fillStyle='#b9cec9';fitText(stats[i][1],26,265,x+145,1072);}
 drawContained(ctx,prize,82,1140,116,116);ctx.textAlign='left';ctx.fillStyle='#ffe3ac';fitText(t('hat_'+s.chapter),30,670,212,1200,false);ctx.textAlign='center';ctx.fillStyle='#aec8bf';fitText(t('tagline'),27,930,540,1255);ctx.fillStyle='#85a99c';fitText('Bjerkholt Studio',23,400,540,1295);return canvas;
}
function fit(ctx,text,size,width,x,y,center=true,font='sans-serif'){ctx.textAlign=center?'center':'left';ctx.font=`bold ${size}px ${font}`;while(size>16&&ctx.measureText(text).width>width){size--;ctx.font=`bold ${size}px ${font}`;}ctx.fillText(text,x,y);}
export function exportChapterCard(canvas){
 try{const url=canvas.toDataURL('image/png');if(!url.startsWith('data:image/png;base64,')||url.length<32)throw Error('Invalid PNG');return url;}catch(error){throw Object.assign(error,{code:'CARD_EXPORT'});}
}
export async function deliverCard(prepared,save=false){
 const bytes=Uint8Array.from(atob(prepared.dataUrl.split(',')[1]),c=>c.charCodeAt(0)),blob=new Blob([bytes],{type:'image/png'});
 const native=globalThis.SporlysNative;
 if(save&&native?.saveImage){const r=await native.saveImage({content:prepared.dataUrl.split(',')[1],name:prepared.name});return r.saved?'saved':'cancelled';}
 if(!save&&native?.shareImage){await native.shareImage({content:prepared.dataUrl.split(',')[1],name:prepared.name,title:translator(prepared.snapshot.lang)('cardAchievement',{name:prepared.snapshot.chapterName})});return 'opened';}
 if(!save&&typeof File!=='undefined'&&navigator.canShare&&navigator.share){const file=new File([blob],prepared.name,{type:'image/png'});if(navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Glimbraid'});return 'opened';}catch(e){if(e.name==='AbortError')return 'cancelled';throw e;}}}
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=prepared.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return 'saved';
}

function drawContained(ctx,image,x,y,width,height){const iw=image.naturalWidth||image.width||width,ih=image.naturalHeight||image.height||height,scale=Math.min(width/iw,height/ih);ctx.drawImage(image,x+(width-iw*scale)/2,y+(height-ih*scale)/2,iw*scale,ih*scale);}
