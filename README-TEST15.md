# Glimbraid test15

Oppdatert APK og prosjekt for mobiltilpasning av hele spillet med 96 brett og 15 språk. Se MOBIL-KONTROLL-test15.md for endringer og verifikasjon.

Pakkenavn: no.bjerkholtstudio.sporlys. Versjonskode 15, versjonsnavn 0.1.0-test15. APK signeres med samme testnøkkel som tidligere testutgaver, slik at den kan installeres som oppdatering. Ta gjerne sikkerhetskopi før installasjon. Ikke avinstaller for å oppdatere.

## Bygging

Krever Node 22 eller nyere, full JDK 17 og Android SDK platform 36. Installer avhengigheter med `npm ci`. Den nye package-lock.json bruker ordinære npm-avhengigheter, uten lenker til en lokal byggemappe.

Kjør `npm test`, deretter `npm run prepare:android`. Sett SDK-stien i android/local.properties eller ANDROID_HOME. Optimalisert test-APK bygges fra android med `./gradlew -PglimbraidTestSigning :app:assembleRelease`.

Testnøkkelen følger med i test-signing/sporlys-test.jks. Den er for intern testing, ikke en ferdig produksjonssignering. Betaling og kjøpsgjenoppretting er ennå ikke implementert. All spillfunksjonalitet er tilgjengelig i testutgaven.

Nettprosjektet og APK-en bruker samme app.mjs, layout.mjs, CSS, språk, brett og lokale spillressurser. Native bootstrap og Android-filtilgang er egne deler av mobilpakken.

release-validation-test15 inneholder nye tester og APK-kontroll. release-validation er eldre dokumentasjon fra test14.
