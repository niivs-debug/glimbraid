import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
execFileSync('npx',['cap','sync','ios'],{stdio:'inherit'});
for(const name of ['GlimbraidBillingState','GlimbraidViewController','SporlysFilesPlugin'])await copyFile(`native/ios/${name}.swift`,`ios/App/App/${name}.swift`);
const project='ios/App/App.xcodeproj/project.pbxproj';let s=await readFile(project,'utf8');
for(const [i,name] of ['GlimbraidBillingState','GlimbraidViewController','SporlysFilesPlugin'].entries()){
 const ref=`A0160000000000000000000${i}`,build=`B0160000000000000000000${i}`;
 if(!s.includes(ref)){
  s=s.replace('/* End PBXBuildFile section */',`${build} /* ${name}.swift in Sources */ = {isa = PBXBuildFile; fileRef = ${ref}; };\n/* End PBXBuildFile section */`);
  s=s.replace('/* End PBXFileReference section */',`${ref} /* ${name}.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ${name}.swift; sourceTree = "<group>"; };\n/* End PBXFileReference section */`);
  s=s.replace('504EC3071FED79650016851F /* AppDelegate.swift */,',`504EC3071FED79650016851F /* AppDelegate.swift */,\n${ref} /* ${name}.swift */,`);
  s=s.replace('504EC3081FED79650016851F /* AppDelegate.swift in Sources */,',`504EC3081FED79650016851F /* AppDelegate.swift in Sources */,\n${build} /* ${name}.swift in Sources */,`);
 }
}
s=s.replace(/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g,'PRODUCT_BUNDLE_IDENTIFIER = no.bjerkholtstudio.sporlys;').replace(/MARKETING_VERSION = [^;]+;/g,'MARKETING_VERSION = 0.1.0;').replace(/CURRENT_PROJECT_VERSION = [^;]+;/g,'CURRENT_PROJECT_VERSION = 18;').replace(/IPHONEOS_DEPLOYMENT_TARGET = [^;]+;/g,'IPHONEOS_DEPLOYMENT_TARGET = 15.0;');await writeFile(project,s);
const storyboard='ios/App/App/Base.lproj/Main.storyboard';await writeFile(storyboard,(await readFile(storyboard,'utf8')).replace('customClass="CAPBridgeViewController" customModule="Capacitor"','customClass="GlimbraidViewController" customModule="App"'));
const podfile='ios/App/Podfile';await writeFile(podfile,(await readFile(podfile,'utf8')).replace(/platform :ios, '[^']+'/,'platform :ios, \'15.0\''));
console.log('iOS purchase bridge prepared. Xcode build and device/store testing remain required.');
