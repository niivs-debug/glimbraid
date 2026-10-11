import random,json
from pathlib import Path
rng=random.Random(2026100749)
n=5
neighbors=lambda i:[j for j in [i-5 if i>=5 else -1,i+1 if i%5<4 else -1,i+5 if i<20 else -1,i-1 if i%5>0 else -1] if j>=0]
edge=lambda a,b:0 if b==a-5 else 1 if b==a+1 else 2 if b==a+5 else 3
boundary=[i for i in range(25) if i//5 in [0,4] or i%5 in [0,4]]
def pathsearch(length,used,ends):
 starts=[x for x in boundary if x not in used]
 rng.shuffle(starts)
 budget=[4000]
 def dfs(path):
  budget[0]-=1
  if budget[0]<0:return None
  i=path[-1]
  if len(path)==length:return path if i in boundary and i not in used and i!=path[0] else None
  opts=neighbors(i);rng.shuffle(opts)
  for j in opts:
   if j in path or j in ends:continue
   incoming=edge(j,i)
   if incoming in used.get(j,set()) or edge(i,j) in used.get(i,set()):continue
   if len(path)>1 and edge(i,path[-2])==edge(i,j):continue
   # an existing crossing must be traversable with a distinct outgoing port
   if j in used and len(path)==length-1:continue
   found=dfs(path+[j])
   if found:return found
  return None
 for start in starts:
  found=dfs([start])
  if found:return found
 return None
result=[]
# Reject symmetry-equivalent old layouts, not just byte-identical path lists.
def signature(paths):
 def transform(i,k):
  r,c=divmod(i,5)
  if k>=4:c=4-c
  for _ in range(k%4):r,c=c,4-r
  return r*5+c
 keys=[]
 for k in range(8):
  seq=[]
  for p in paths:
   cells=[transform(i,k) for i in p['cells']]
   seq.append((p['color'],min(tuple(cells),tuple(reversed(cells)))))
  keys.append(str(sorted(seq)))
 return min(keys)
old=json.loads((Path('dist/rav-levels.mjs').read_text().split('export const ravLevels = ')[1]).rstrip(';\n'))
seen={signature(l['paths']) for l in old}

for k in range(12):
 lengths=[[10,9,8],[11,9,8],[11,10,8],[12,10,8],[12,11,8],[12,11,9],[13,11,8],[13,12,8],[12,11,9],[13,11,9],[13,12,9],[13,12,9]][k]
 for attempt in range(30000):
  used={};ends=set();paths=[]
  for length,color in zip(lengths,['mint','amber','violet']):
   cells=pathsearch(length,used,ends)
   if not cells:break
   paths.append({'cells':cells,'color':color});ends.update([cells[0],cells[-1]])
   for pos,i in enumerate(cells):
    ports=set()
    if pos:ports.add(edge(i,cells[pos-1]))
    if pos<len(cells)-1:ports.add(edge(i,cells[pos+1]))
    used.setdefault(i,set()).update(ports)
  if len(paths)!=3:continue
  gate=None
  if k>=2:
   options=[i for i in paths[0]['cells'][2:-1] if not any(i in p['cells'] for p in paths[1:])]
   if not options:continue
   gate={'tile':options[-1],'trigger':paths[1]['cells'][-1]}
  groups=sum(len(p['cells']) for p in paths);crossings=groups-len(used)
  if crossings < [4,5,6,6,7,7,8,9,8,9,9,9][k]:continue
  key=signature(paths)
  if key in seen:continue
  seen.add(key)
  # strict prior-source/endpoint and port integrity was enforced by search.
  l={'id':49+k,'n':5,'paths':paths,'kind':'threeColors','gate':gate}
  if k>=8:l['frozen']=gate['tile']
  result.append(l);print(l['id'],lengths,'crossings',crossings,'attempts',attempt);break
 else:raise RuntimeError('Could not author level '+str(k))
text='// Fixed authored layouts: warm-up, coupled paths and gates, then frost finale.\nexport const auroraLevels = '+json.dumps(result,indent=2)+';\n'
Path('dist/aurora-levels.mjs').write_text(text)
