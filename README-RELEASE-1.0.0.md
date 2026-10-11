# Glimbraid – Google Play 1.0.0 (20)

Oppdatert produksjonssignert AAB. Denne erstatter versjonskode 19, som ble avvist fordi target SDK var 35. API 36 er nå både mål- og kompileringsversjon. Samme opplastingsnøkkel beholdes. Spillinnholdet tilsvarer test18, inkludert rettelsen for kapittelkort. Dette er ikke en publisering i Google Play og ikke en IPA.

## Identitet og kontroll

- Appnavn: Glimbraid
- Pakkenavn: no.bjerkholtstudio.sporlys (beholdes ved fremtidige oppdateringer)
- Android versionName: 1.0.0, versionCode: 20
- Minste Android: 7.0 / API 24. Target SDK: 36, compile SDK: 36.
- Google Play Billing 9.0.0. R8-optimalisering, krymping og obfuskering er aktivert.
- AAB-signatur og opplastingssertifikat er kontrollert; bundletool validerer pakken.
- Alle webressurser er bytekontrollert mot dist. En APK generert fra AAB er kontrollert for signatur, spillressurser og bevarte native betalings-/fil-/delingsbroer.
- Hele regresjonspakken er bestått. Se release-validation-v1.0.0-code20 for kontrollrapporter og mapping.txt.

## Første opplasting og fysisk test

1. Opprett Glimbraid i Google Play Console, eller åpne eksisterende oppføring med samme pakkenavn.
2. Bruk Intern testing og last opp denne AAB-en. Bruk Google Play App Signing med en Google-generert app-signeringsnøkkel. Den separate opplastingsnøkkelen brukes ved fremtidige AAB-er.
3. Opprett engangsproduktet glimbraid_full_game som et permanent kjøp, ikke abonnement og ikke forbruksvare. Første 12 brett er gratis; kjøpet åpner de resterende 84 for alle lokale spillere. Norsk prisforslag: 39 kr som kundens sluttpris. Appen viser butikkens faktiske pris.
4. Legg testkontoen både til den interne testlisten og som lisens-/betalingstester. Installer fra testlenken i Google Play.
5. Test prisvisning, kjøp, avbrutt/ventende kjøp, full tilgang etter omstart, gjenoppretting, offline tilgang og tilbakekalling/refusjon. Disse transaksjonene er ikke fysisk verifisert i denne byggingen.
6. Test kapittelkort og deling til Snapchat/MMS, og kontroller at spillforsøket kan gjenopptas når du vender tilbake. Native mottakerflyt må testes på enheten.
7. Fullfør butikkoppføring/personvern/innhold og kjøpstester før produksjonsgjennomgang.

Viktig ved overgang fra test-APK: Eksporter sikkerhetskopi av spillerdata først. Test-APK-en og Play-utgaven har ulike signeringssertifikater. Hvis Android krever avinstallering av testutgaven, gjenopprett sikkerhetskopien etter installasjon fra Play. Avinstallering sletter lokale data.

## Fremtidige bygg uten Codemagic

Krav: Node 22+, JDK 17, Android SDK og Gradle-wrapperen som følger prosjektet.

1. npm ci
2. npm test
3. Øk versionCode i android-release.json for hver ny Play-opplasting; oppdater versionName ved behov.
4. Last inn de fire signeringsvariablene privat fra nøkkelsikkerhetskopien:
   GLIMBRAID_KEYSTORE_PATH (absolutt sti til JKS), GLIMBRAID_STORE_PASSWORD,
   GLIMBRAID_KEY_ALIAS, GLIMBRAID_KEY_PASSWORD.
5. npm run build:aab
6. Resultat: android/app/build/outputs/bundle/release/app-release.aab.

AAB-byggingen avvises hvis opplastingssigneringen mangler eller testnøkkelen velges. Test-APK-er lages fortsatt med npm run build:apk:optimized og egen testnøkkel. Disse er ikke butikkoppdateringer.

Produksjonsnøkkel og passord finnes kun i den separate PRIVATE nøkkelpakken. Ikke legg den i GitHub, delte prosjektmapper eller butikkoppføringen. Behold samme opplastingsnøkkel ved oppdateringer.

## iOS

Dette arkivet inneholder felles spillinnhold og eksisterende iOS-forberedelse. Det er ikke bygget eller signert en ny IPA. iOS-versjon/signering må klargjøres separat før Apple-opplasting.

## Opplastingssertifikat

SHA-256: B8:DB:81:4A:76:19:98:2E:77:E0:E4:8E:78:4D:61:22:6F:5E:46:E8:AE:0B:EC:EB:4B:FE:08:D8:FC:77:07:32

SHA-1: 5B:EE:8E:D6:23:A6:2D:1E:C4:D5:C1:DC:DE:9C:AB:E1:23:C7:A4:35

## API 36-kontroll

Krav kontrollert mot https://developer.android.com/google/play/requirements/target-sdk (10. oktober 2026). API 36 kreves for nye apper og oppdateringer fra 31. august 2026. Verifikasjonen kontrollerer targetSdkVersion i både AAB-manifest og APK generert fra pakken.

MainActivity bruker allerede WindowInsetsCompat for systemfelt, utskjæring og tastatur, samt OnBackPressedDispatcher/OnBackPressedCallback for tilbakeknappen. Ingen edge-to-edge opt-out eller eldre onBackPressed-overstyring brukes. Ingen skjermretning er låst. Fysisk enhetstest av disse flytene på Android 16 gjenstår.
