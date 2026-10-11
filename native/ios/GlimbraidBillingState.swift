import Capacitor
import StoreKit

@objc(GlimbraidBillingStatePlugin)
public class GlimbraidBillingStatePlugin: CAPPlugin, CAPBridgedPlugin {
 public let identifier = "GlimbraidBillingStatePlugin"
 public let jsName = "GlimbraidBillingState"
 public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "query", returnType: CAPPluginReturnPromise)]
 @objc func query(_ call: CAPPluginCall) {
  guard call.getString("productId") == "glimbraid_full_game" else { call.reject("Unknown product"); return }
  guard #available(iOS 15.0, *) else { call.reject("iOS 15 or later required"); return }
  Task {
   var owned = false
   var unverified = false
   for await result in Transaction.currentEntitlements {
    if case .verified(let transaction) = result,
       transaction.productID == "glimbraid_full_game", transaction.revocationDate == nil {
     owned = true
    }
    if case .unverified(let transaction, _) = result, transaction.productID == "glimbraid_full_game" { unverified = true }
   }
   if unverified && !owned { call.reject("Could not verify purchase"); return }
   call.resolve(["owned": owned])
  }
 }
}
