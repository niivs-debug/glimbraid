# Glimbraid test14 – siste språkgruppe og samlet språkkontroll

## Omfang
15 språk: norsk bokmål, engelsk, svensk, dansk, finsk, tysk, fransk, spansk, italiensk, polsk, brasiliansk portugisisk, tyrkisk, indonesisk, japansk og koreansk. 241 komplette tekstnøkler per språk. Ingen manglende tekster bruker engelsk som erstatning. Menyer, spill, hjelp, innstillinger, Om, personvern, profiler, sletting, rekorder, hintbank, øvemodus, sikkerhetskopi, premier og delingskort er dekket. Midlertidig Øyvind-hilsen er beholdt og oversatt. Eksisterende egennavn endres ikke.

## Ordlyd
Siste språkgruppe bruker korte handlingsord og sammenhengende begreper. Verden/kapittel og spillbrett skilles i ordlyden; korttitler og meldinger rundt innskutte navn unngår tvetydig bøyning. Hintreglene beskriver tre grunnhint, første fullføring, banktak 10/15, kapitteloverføring, hintbelastning, restart, øvemodus og rekordvilkår. Merkenavn beholdes.

## Skrifter og offline
Japansk og koreansk har lokale WOFF2-skrifter med bevart tegnsett, kilde og SIL OFL-lisens i dist/fonts/. Alle tegn i begge tekstkatalogene er kontrollert mot skrifttabellene. Nettleseren bruker japansk streng linjebryting og koreansk ordbevaring med bryting ved plassmangel. Kapittelkort venter på skriftlasting før tekst måles og tegnes; mislykket skriftlasting gir vanlig kortfeil i stedet for et bilde med manglende tegn. Android har alle språk- og skriftfiler lokalt; ingen skrift-CDN er nødvendig. Den delte nettversjonen krever tilgang til vertsnettstedet.

## Kontroller
- Alle 15 kataloger har identiske nøkler og plassholdere, inkludert alle åtte kapitler/hodeplagg.
- Språkbytte, automatisk valg, omstart og sikkerhetskopi er testet for alle språk. Enhetsvariantene tr-TR, id-ID, ja-JP og ko-KR velger rett språk. Ukjent språk bruker engelsk.
- Hele spillregresjonssuiten består, inkludert 96 brett, fysisk lovlig hintrekkefølge, hintbank, sletting, profiler, sikkerhetskopi, lyd, navigasjon og native eksport. Ny skriftkontroll består også.
- 495 nettleservisninger: 15 språk × 3 bredder (320, 390, 768) × 11 visninger (hjem, innstillinger, hjelp, Om, backup, spillere, profilredigering, brettvalg, spill, aktivt hint, personvern). Ingen JavaScript-feil eller registrert horisontal klipping av kontroller.
- 120 ekte canvas-kapittelkort: 15 språk × 8 kapitler. Skjermbilder fra siste språkgruppe og koreansk kort er visuelt kontrollert. Resultater og representative bilder ligger i release-validation/.
- APK: versjonskode 14, 0.1.0-test14, samme pakkenavn og testsertifikat. Alle dist-filer er sammenlignet byte for byte med APK-en. Native eksport og Capacitor-bro beholdes av R8. Ukomprimert DEX: 789 904 byte.

## Bevarte funksjoner og gjenstående vurdering
Brettdata, regler, hint, premier, spillerdataformat og lyd er ikke endret i denne språkoppdateringen. R8 og testsignering er beholdt. Installer som oppdatering; ikke avinstaller eller tøm data.

Dette er ikke attestert språkvask fra eksterne morsmålsredaktører. Prøv språkbytte, store systemskrifter, spill, offline oppstart, deling og sikkerhetskopi på fysisk telefon. Neste planlagte steg er samlet gjennomgang av spill, progresjon, hint, belønninger, mobilflyt, lyd og lanseringsklarhet. APK-en er en testutgave, ikke en produksjonssignert Google Play-utgivelse.
