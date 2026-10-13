import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('native/bootstrap.js','utf8');
for(const platform of ['ios','android','web']){
 const calls=[];
 const files={saveBackup:async options=>{calls.push(options);return {saved:false};},shareImage(){},saveImage(){},addListener(){}};
 const window={Capacitor:{isNativePlatform:()=>platform!=='web',getPlatform:()=>platform,registerPlugin:name=>{assert.equal(name,'SporlysFiles');return files;}},dispatchEvent(){}};
 vm.runInNewContext(source,{window});
 if(platform==='web'){assert.equal(window.SporlysNative,undefined);continue;}
 const options={content:'{"format":"sporlys-backup"}',name:'glimbraid-sikkerhetskopi-2026-10-13.json'};
 assert.deepEqual(await window.SporlysNative.saveBackup(options),{saved:false});
 assert.equal(calls[0],options);
 if(platform==='ios')assert.deepEqual(Object.keys(window.SporlysNative),['saveBackup'],'iOS card sharing retains its existing web fallback');
 else assert.deepEqual(Object.keys(window.SporlysNative),['saveBackup','shareImage','saveImage']);
}
console.log('PASS: iOS backup routes to the native picker; Android export/share and web fallback remain unchanged.');
