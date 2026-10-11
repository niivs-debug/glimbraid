from pathlib import Path
from PIL import Image
src=Image.open('dist/icon-1024.png').convert('RGB')
for d,n in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
 p=Path('android/app/src/main/res')/('mipmap-'+d);p.mkdir(parents=True,exist_ok=True)
 src.resize((n,n),Image.Resampling.LANCZOS).save(p/'ic_launcher.png')
 src.resize((n,n),Image.Resampling.LANCZOS).save(p/'ic_launcher_round.png')
 # Keep adaptive art within Android's safe central area.
 size=int(n*108/48);canvas=Image.new('RGB',(size,size),'#091622');art=src.resize((int(size*2/3),)*2,Image.Resampling.LANCZOS);canvas.paste(art,((size-art.width)//2,(size-art.height)//2));canvas.save(p/'ic_launcher_foreground.png')
