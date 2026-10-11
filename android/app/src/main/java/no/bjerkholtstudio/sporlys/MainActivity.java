package no.bjerkholtstudio.sporlys;
import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import androidx.core.view.WindowCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
 @Override public void onCreate(Bundle savedInstanceState){
  registerPlugin(SporlysFilesPlugin.class);
        registerPlugin(GlimbraidBillingStatePlugin.class);
  super.onCreate(savedInstanceState);
  WindowCompat.setDecorFitsSystemWindows(getWindow(),false);
  android.view.View content=findViewById(android.R.id.content);
  ViewCompat.setOnApplyWindowInsetsListener(content,(view,insets)->{
   Insets space=insets.getInsets(WindowInsetsCompat.Type.systemBars()|WindowInsetsCompat.Type.displayCutout()|WindowInsetsCompat.Type.ime());
   view.setPadding(space.left,space.top,space.right,space.bottom);return insets;
  });
  ViewCompat.requestApplyInsets(content);
  getOnBackPressedDispatcher().addCallback(this,new OnBackPressedCallback(true){
   @Override public void handleOnBackPressed(){
    getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new Event('sporlys:native-back',{cancelable:true}))",result->{
     if("true".equals(result)){
      if(getBridge().getWebView().canGoBack())getBridge().getWebView().goBack();
      else moveTaskToBack(true);
     }
    });
   }
  });
 }
}
