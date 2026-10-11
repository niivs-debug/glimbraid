package no.bjerkholtstudio.sporlys;

import android.app.Activity;
import android.content.Intent;
import android.content.ClipData;
import android.util.Base64;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name="SporlysFiles")
public class SporlysFilesPlugin extends Plugin {
 @Override protected void handleOnPause(){JSObject state=new JSObject();state.put("isActive",false);notifyListeners("nativeState",state);}
 @Override protected void handleOnResume(){JSObject state=new JSObject();state.put("isActive",true);notifyListeners("nativeState",state);}
 private byte[] imageBytes(PluginCall call) throws Exception {
  String content=call.getString("content","");String name=call.getString("name","");
  if(content.length()>8*1024*1024 || !name.matches("glimbraid-(night|forest|frost|rav|aurora|stellar|solar|weave)\\.png"))throw new IllegalArgumentException("Invalid image");
  byte[] bytes=Base64.decode(content,Base64.DEFAULT);
  if(bytes.length<8 || bytes[0]!=(byte)137 || bytes[1]!=80 || bytes[2]!=78 || bytes[3]!=71)throw new IllegalArgumentException("Invalid PNG");return bytes;
 }
 @PluginMethod public void shareImage(PluginCall call){
  try{byte[] bytes=imageBytes(call);File folder=new File(getContext().getCacheDir(),"glimbraid-cards");if(!folder.exists()&&!folder.mkdirs())throw new java.io.IOException("Cache unavailable");
   File[] old=folder.listFiles();if(old!=null)for(File f:old)if(f.lastModified()<System.currentTimeMillis()-86400000)f.delete();
   File file=new File(folder,System.currentTimeMillis()+"-"+call.getString("name"));try(FileOutputStream stream=new FileOutputStream(file)){stream.write(bytes);}
   Uri uri=FileProvider.getUriForFile(getContext(),getContext().getPackageName()+".fileprovider",file);
   Intent send=new Intent(Intent.ACTION_SEND);send.setType("image/png");send.putExtra(Intent.EXTRA_STREAM,uri);send.putExtra(Intent.EXTRA_TITLE,call.getString("title","Glimbraid"));send.setClipData(ClipData.newRawUri("Glimbraid",uri));send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
   // Keep the chooser outside the game task; recipients may reuse their own task.
   Intent chooser=Intent.createChooser(send,null);chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
   getActivity().startActivity(chooser);JSObject response=new JSObject();response.put("opened",true);call.resolve(response);
  }catch(Exception e){call.reject("Could not share image",e);}
 }
 @PluginMethod public void saveImage(PluginCall call){
  try{imageBytes(call);Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);intent.addCategory(Intent.CATEGORY_OPENABLE);intent.setType("image/png");intent.putExtra(Intent.EXTRA_TITLE,call.getString("name"));startActivityForResult(call,intent,"imageSaved");}
  catch(Exception e){call.reject("Could not save image",e);}
 }
 @ActivityCallback private void imageSaved(PluginCall call,ActivityResult result){
  if(call==null)return;JSObject response=new JSObject();
  if(result.getResultCode()!=Activity.RESULT_OK||result.getData()==null||result.getData().getData()==null){response.put("saved",false);call.resolve(response);return;}
  try(OutputStream stream=getContext().getContentResolver().openOutputStream(result.getData().getData(),"wt")){if(stream==null)throw new java.io.IOException("Destination unavailable");stream.write(imageBytes(call));stream.flush();response.put("saved",true);call.resolve(response);}
  catch(Exception e){call.reject("Could not save image",e);}
 }
 @PluginMethod public void saveBackup(PluginCall call) {
  String content=call.getString("content");
  String name=call.getString("name","glimbraid-sikkerhetskopi.json");
  if(content==null || content.getBytes(StandardCharsets.UTF_8).length>2*1024*1024){call.reject("Invalid backup size");return;}
  if(!name.matches("glimbraid-sikkerhetskopi-[0-9-]+\\.json")){call.reject("Invalid file name");return;}
  Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
  intent.addCategory(Intent.CATEGORY_OPENABLE);
  intent.setType("application/json");
  intent.putExtra(Intent.EXTRA_TITLE,name);
  startActivityForResult(call,intent,"backupSaved");
 }
 @ActivityCallback private void backupSaved(PluginCall call,ActivityResult result){
  if(call==null)return;
  if(result.getResultCode()!=Activity.RESULT_OK || result.getData()==null || result.getData().getData()==null){
   JSObject response=new JSObject();response.put("saved",false);call.resolve(response);return;
  }
  Uri uri=result.getData().getData();
  try(OutputStream stream=getContext().getContentResolver().openOutputStream(uri,"wt")){
   if(stream==null)throw new java.io.IOException("Destination unavailable");
   stream.write(call.getString("content","").getBytes(StandardCharsets.UTF_8));
   stream.flush();
   JSObject response=new JSObject();response.put("saved",true);call.resolve(response);
  }catch(Exception e){call.reject("Could not save backup",e);}
 }
}
