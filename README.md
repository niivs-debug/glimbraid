# Glimbraid – Google Play 1.0.0 (20)

Se README-RELEASE-1.0.0.md for produksjonsbygging, signering og intern testing. Spillinnholdet bygger på test18.

96 brett i åtte kapitler, 15 språk, lokale spillerprofiler, hintbank, premier, delingskort, sikkerhetskopi og offline spillinnhold. Første kapittel med 12 brett er gratis. Ett permanent butikkjøp åpner resten for alle lokale spillere.

## Klargjøring

- Node 22+: `npm ci`, `npm test`.
- Android: `npm run prepare:android`. Optimalisert test-APK: `npm run build:apk:optimized` (krever JDK 17 og Android SDK). AAB for butikk krever egen produksjonssignering; testnøkkelen er bare til testing.
- iOS: `npm run prepare:ios`, deretter CocoaPods/Xcode på Mac. Minste iOS 15. Ingen IPA er bygget eller fysisk kjøpstest utført her.
- Web: server `dist` over HTTP. Nettutgaven har de 12 gratis brettene, ingen betalingskasse.

Produktet `glimbraid_full_game` må opprettes og aktiveres i butikkene før faktisk kjøp/gjenoppretting kan testes. Appen bruker butikkens pris. Se PAYMENT-SETUP.md for prisforslag, tilgangsmodell og obligatorisk kjøpstestløp før lansering.

Resultatlister har både brettrekorder og kategorisummer, med alle seks lokale spillere. Se RECORDS-TEST17.md for regler og fysisk delingstest.

## Kontroll

Regresjonstester dekker alle 96 løsninger, hint, progresjon, profiler, premier, sikkerhetskopi, lyd og kjøpslogikk. Betalingstester bruker eksplisitte mocks og tester også avbrutte/ventende kjøp, offline cache, gjenoppretting og tilbakekalling. De erstatter ikke Google Play-/TestFlight-transaksjoner. Kontrollerte nettleservisninger omfatter alle språk, små skjermer og større tekst; fysisk lytting og native enhetstesting gjenstår.

Ingen Firebase Analytics eller egen betalingsserver er konfigurert. Kjøpstilgang holdes utenfor spillerdata og sikkerhetskopier. Ingen testfixture lastes av appens index.html.
