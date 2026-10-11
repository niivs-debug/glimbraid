package no.bjerkholtstudio.sporlys;

import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.android.billingclient.api.*;

/** Query only INAPP purchases. A failed query never means "not purchased". */
@CapacitorPlugin(name="GlimbraidBillingState")
public class GlimbraidBillingStatePlugin extends Plugin {
 @PluginMethod public void query(PluginCall call) {
  String id=call.getString("productId");
  if(!"glimbraid_full_game".equals(id)){call.reject("Unknown product");return;}
  final BillingClient client=BillingClient.newBuilder(getContext())
   .setListener((result,purchases)->{})
   .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
   .build();
  client.startConnection(new BillingClientStateListener(){
   public void onBillingServiceDisconnected(){call.reject("Store disconnected");client.endConnection();}
   public void onBillingSetupFinished(BillingResult result){
    if(result.getResponseCode()!=BillingClient.BillingResponseCode.OK){call.reject("Store unavailable");client.endConnection();return;}
    client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),(r,purchases)->{
     if(r.getResponseCode()!=BillingClient.BillingResponseCode.OK){call.reject("Purchase query failed");client.endConnection();return;}
     boolean owned=false;
     if(purchases!=null)for(Purchase p:purchases)if(p.getProducts().contains(id)&&p.getPurchaseState()==Purchase.PurchaseState.PURCHASED&&p.isAcknowledged())owned=true;
     JSObject value=new JSObject();value.put("owned",owned);call.resolve(value);client.endConnection();
    });
   }
  });
 }
}
