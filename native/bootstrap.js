(() => {
 const {Capacitor}=window;
 if(!Capacitor?.isNativePlatform())return;
 const Files=Capacitor.registerPlugin('SporlysFiles');
 if(Capacitor.getPlatform()==='android'){
  window.SporlysNative={saveBackup:options=>Files.saveBackup(options),shareImage:options=>Files.shareImage(options),saveImage:options=>Files.saveImage(options)};
  Files.addListener('nativeState',({isActive})=>window.dispatchEvent(new CustomEvent('sporlys:native-state',{detail:{isActive}})));
 }
})();
