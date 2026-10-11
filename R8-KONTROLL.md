# Glimbraid test12 – R8-kontroll

Dato: 8. oktober 2026. Pakkenavn no.bjerkholtstudio.sporlys. Versjon 0.1.0-test12 / kode 12.

R8-kodeoptimalisering og ressurskrymping er aktivert for release. AGP 8.7.3, Gradle 8.9 og minimum Android 7 beholdes. Debug-bygg er fortsatt tilgjengelig. Testsignt release krever egenskapen glimbraidTestSigning; dette er ikke produksjonssignering. Avhengighetsversjoner er samordnet mellom Android-modulene.

| Måling | test11 debug | test12 optimalisert release |
| --- | ---: | ---: |
| APK, byte | 17 403 149 | 14 646 579 |
| Ukomprimert DEX, byte | 7 385 716 | 789 904 |

DEX reduksjon: 89,3 %. APK reduksjon: 15,8 %. Sammenligningen gjelder tidligere debug-APK mot nåværende release-APK, og inkluderer derfor også forskjeller mellom byggtypene. Dette er størrelsesmålinger, ikke målinger av oppstartstid eller RAM. Play Console-poeng er ikke målt; AGP 9 er ikke oppgradert i denne endringen.

## Utførte kontroller
- Hele eksisterende regresjonssuiten er bestått, inkludert brett, hintbank, sletting av spiller, profiler, sikkerhetskopi, navigasjon og lyd.
- Android release-bygget, inkludert lintVitalRelease, er bestått.
- APK-signaturen er gyldig og samme testsertifikat som test11: SHA-256 ef2680ca70257beece62ab785e39c454e8f5f20db21c8330c1165736baee67b0.
- Versjonskode 12, versjonsnavn test12, pakkeidentitet og minimum API 24 er kontrollert direkte i APK-en. APK-en er ikke debuggable.
- Alle 54 filer under dist er byteidentiske med APK-ens assets/public. Spillbrett, språk, bilder, lyd og UI er uendret fra test11.
- Native filplugin, shareImage, saveImage, saveBackup, imageSaved og backupSaved samt FileProvider finnes i ferdig DEX. Capacitor Bridge er kontrollert under navnet fra mapping.txt.
- Native bildefilvalidering er rettet: kort fra alle åtte kapitler aksepteres. Ukjente filnavn og katalogstier avvises. Kilde og Android-kopi er identiske.
- R8 mapping/configuration/seeds/usage er vedlagt i release-validation/.

## Gjenstår på fysisk Android-enhet
Installer APK over test11 uten avinstallering. Kontroller at spillere og fremdrift bevares. Start et brett, bruk hint, bytt app og gjenoppta. Test lyd og offline oppstart. Eksporter og importer sikkerhetskopi. Lagre og del et kort, særlig fra Lysvev eller en annen av de fire siste kategoriene. Enhetstesting er ikke utført i byggemiljøet.

## Reprodusere
Kjør npm ci og npm test, sett Android SDK-sti, deretter npm run build:apk:optimized. Kontroller APK med tools/check-optimized-apk.py og --build-tools som peker på Android build-tools. Prosjektet trenger vanlige npm/Gradle-avhengigheter ved første bygg.


## Test16
Google Play Billing 9 er lagt til. Optimalisert og signert test-APK bygget med R8, DEX 1 233 364 bytes. BILLING-tillatelse, nye kjøpsbroer og alle pakkede webressurser kontrollert. Økningen fra test15 skyldes betalingsbiblioteket. Full butikk-kjøpstesting gjenstår.
