import Capacitor
class GlimbraidViewController: CAPBridgeViewController {
 override func capacitorDidLoad() {
  bridge?.registerPluginInstance(GlimbraidBillingStatePlugin())
 }
}
