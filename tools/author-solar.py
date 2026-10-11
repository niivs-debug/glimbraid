import random,json
from pathlib import Path
rng=random.Random(2026100773)
n=5
neighbors=lambda i:[j for j in [i-n if i>=n else -1,i+1 if i%n<n-1 else -1,i+n if i<n*(n-1) else -1,i-1 if i%n>0 else -1] if j>=0]
edge=lambda a,b:0 if b==a-n else 1 if b==a+1 else 2 if b==a+n else 3
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
  r,c=divmod(i,n)
  if k>=4:c=n-1-c
  for _ in range(k%4):r,c=c,n-1-r
  return r*n+c
 keys=[]
 for k in range(8):
  seq=[]
  for p in paths:
   cells=[transform(i,k) for i in p['cells']]
   seq.append((p['color'],min(tuple(cells),tuple(reversed(cells)))))
  keys.append(str(sorted(seq)))
 return min(keys)
seen=set()
for filename,name in [('rav','ravLevels'),('aurora','auroraLevels'),('stellar','stellarLevels')]:
 old=json.loads((Path('dist/'+filename+'-levels.mjs').read_text().split('export const '+name+' = ')[1]).rstrip(';\n'))
 for l in old:
  n=l['n'];seen.add((n,signature(l['paths'])))
for k in range(12):
 n=6
 boundary=[i for i in range(n*n) if i//n in [0,n-1] or i%n in [0,n-1]]
 lengths=[[16,13,12],[16,14,12],[17,14,12],[17,14,13],[18,14,13],[18,15,13],[17,14,13],[18,15,13],[18,15,14],[19,15,14],[19,15,14],[19,16,14]][k]
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
  if len(paths)!=len(lengths):continue
  gate=None
  if k>=2:
   options=[i for i in paths[0]['cells'][2:-1] if not any(i in p['cells'] for p in paths[1:])]
   if not options:continue
   gate={'tile':options[-1],'trigger':paths[1]['cells'][-1]}
  groups=sum(len(p['cells']) for p in paths);crossings=groups-len(used)
  if crossings < [9,10,10,11,11,12,11,12,13,13,14,14][k]:continue
  bends=sum(1 for p in paths for i in range(1,len(p['cells'])-1) if p['cells'][i]-p['cells'][i-1]!=p['cells'][i+1]-p['cells'][i])
  if bends < [25,26,26,27,27,28,26,28,29,30,30,31][k]:continue
  groups_by_cell={}
  for p in paths:
   for pos,i in enumerate(p['cells']):
    ports=[]
    if pos:ports.append(edge(i,p['cells'][pos-1]))
    if pos<len(p['cells'])-1:ports.append(edge(i,p['cells'][pos+1]))
    groups_by_cell.setdefault(i,[]).append(ports)
  misaligned=0
  for i,groups in groups_by_cell.items():
   r=(i*7+(73+k)*3+(i%3))%4
   if any(sorted(g)!=sorted((x+r)%4 for x in g) for g in groups):misaligned+=1
  if misaligned < [22,22,23,23,24,24,23,24,25,25,25,26][k]:continue
  key=(n,signature(paths))
  if key in seen:continue
  seen.add(key)
  # strict prior-source/endpoint and port integrity was enforced by search.
  l={'id':73+k,'n':n,'paths':paths,'kind':'threeColors' if len(paths)==3 else 'colors','gate':gate}
  if k>=7:l['frozen']=gate['tile']
  result.append(l);print(l['id'],lengths,'crossings',crossings,'attempts',attempt);break
 else:raise RuntimeError('Could not author level '+str(k))
text='// Fixed authored layouts: 6x6 three-colour continuation, gates, breathing room, frost finale.\nexport const solarLevels = '+json.dumps(result,indent=2)+';\n'
Path('dist/solar-levels.mjs').write_text(text)
