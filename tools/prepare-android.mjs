import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
function run(...args){const r=spawnSync(process.execPath,['node_modules/@capacitor/cli/bin/capacitor',...args],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
if(!fs.existsSync('android'))run('add','android');
run('sync','android');
const java='android/app/src/main/java/no/bjerkholtstudio/sporlys';fs.mkdirSync(java,{recursive:true});
for(const name of ['MainActivity.java','SporlysFilesPlugin.java','GlimbraidBillingStatePlugin.java'])fs.copyFileSync(`native/android/${name}`,`${java}/${name}`);
let g=fs.readFileSync('android/app/build.gradle','utf8');
const release=process.argv.includes('--release')?JSON.parse(fs.readFileSync('android-release.json','utf8')):{versionCode:18,versionName:'0.1.0-test18'};
if(!Number.isInteger(release.versionCode)||release.versionCode<1||!/^\d+\.\d+\.\d+(?:-test\d+)?$/.test(release.versionName))throw Error('Invalid Android version');
g=g.replace(/versionCode\s+\d+/, `versionCode ${release.versionCode}`).replace(/versionName\s+"[^"]+"/,`versionName "${release.versionName}"`);
if(!g.includes('sporlys-test.jks'))g=g.replace('android {',`android {
 signingConfigs {
  debug { storeFile file('../../test-signing/sporlys-test.jks'); storePassword 'android'; keyAlias 'androiddebugkey'; keyPassword 'android' }
 }
`);
fs.writeFileSync('android/app/build.gradle',g);
// Reuse the selected opaque PNG icon in all generated launcher resource sizes.
const r=spawnSync('python3',['tools/android-icons.py'],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
fs.chmodSync('android/gradlew',0o755);
