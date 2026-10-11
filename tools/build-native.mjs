import fs from 'node:fs';
const core=fs.readFileSync('node_modules/@capacitor/core/dist/capacitor.js','utf8');
fs.writeFileSync('dist/native.js',core+'\n'+fs.readFileSync('native/bootstrap.js','utf8'));

import {build} from 'esbuild';
await build({entryPoints:['native/purchases.js'],bundle:true,format:'iife',target:'es2020',outfile:'dist/billing.js',minify:true,legalComments:'eof'});
