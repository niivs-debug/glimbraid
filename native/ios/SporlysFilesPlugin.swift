import Capacitor
import UIKit

@objc(SporlysFilesPlugin)
public class SporlysFilesPlugin: CAPPlugin, CAPBridgedPlugin, UIDocumentPickerDelegate {
 public let identifier = "SporlysFilesPlugin"
 public let jsName = "SporlysFiles"
 public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "saveBackup", returnType: CAPPluginReturnPromise)]
 private var exportCall: CAPPluginCall?
 private var exportFolder: URL?

 @objc func saveBackup(_ call: CAPPluginCall) {
  guard let content = call.getString("content"),
        let name = call.getString("name"),
        name.range(of: "^glimbraid-sikkerhetskopi-[0-9]{4}-[0-9]{2}-[0-9]{2}\\.json$", options: .regularExpression) != nil,
        let data = content.data(using: .utf8), data.count <= 2 * 1024 * 1024,
        (try? JSONSerialization.jsonObject(with: data)) is [String: Any] else {
   call.reject("Invalid backup"); return
  }
  DispatchQueue.main.async {
   guard self.exportCall == nil else { call.reject("Export already in progress"); return }
   guard let host = self.bridge?.viewController, host.viewIfLoaded?.window != nil,
         host.presentedViewController == nil else {
    call.reject("File picker cannot be shown"); return
   }
   let folder = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
   do {
    try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
    let file = folder.appendingPathComponent(name)
    try data.write(to: file, options: .atomic)
    let picker = UIDocumentPickerViewController(forExporting: [file], asCopy: true)
    picker.delegate = self
    self.exportCall = call
    self.exportFolder = folder
    host.present(picker, animated: true)
   } catch {
    try? FileManager.default.removeItem(at: folder)
    call.reject("Could not prepare backup export")
   }
  }
 }

 public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
  finishExport(saved: !urls.isEmpty)
 }

 public func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
  finishExport(saved: false)
 }

 private func finishExport(saved: Bool) {
  guard let call = exportCall else { return }
  exportCall = nil
  if let folder = exportFolder { try? FileManager.default.removeItem(at: folder) }
  exportFolder = nil
  call.resolve(["saved": saved])
 }
}
