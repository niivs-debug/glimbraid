# Capacitor supplies consumer rules for its JavaScript bridge and plugins.
# Explicitly preserve app-owned reflective callbacks.
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault,SourceFile,LineNumberTable
-keep @com.getcapacitor.annotation.CapacitorPlugin class no.bjerkholtstudio.sporlys.SporlysFilesPlugin {
    @com.getcapacitor.PluginMethod public <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
}

-keep @com.getcapacitor.annotation.CapacitorPlugin class no.bjerkholtstudio.sporlys.GlimbraidBillingStatePlugin { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class cc.fovea.iap.PurchasePlugin { *; }
