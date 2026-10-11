# Glimbraid 1.0.1 (21)

Førstesiden tilpasser ikon, tekstlogo og mellomrom etter faktisk tilgjengelig høyde. Testet på alle 15 språk ved 320×568, 360×640, 390×700 og 412×780 CSS-piksler. Alle språk får hele førstesiden synlig fra 360×640. På svært korte/smale skjermer og ved større skrift kan siden fremdeles skrolles; ingenting skjules.

Innstillinger har nå kodebasert gjennomgangstilgang. Den åpner alle 96 brett uten betaling og uten krav om tidligere fullføring. Testspillerdata lagres separat i glimbraid.review.progress.v1; vanlige data og kjøpstilgang inngår ikke i testtilgangen. Avslutning laster inn vanlig spilling igjen. Kjøp/gjenoppretting er deaktivert i gjennomgangsmodusen. Koden og de engelske Play Console-instruksjonene leveres i separat dokument, ikke i kildeprosjektet. Behold koden ved fremtidige oppdateringer; en hash ligger i dist/review-access.mjs.

Vanlig spilling beholder første 12 gratis brett, krav om å fullføre brettene i rekkefølge og samme engangsprodukt glimbraid_full_game. Alle nye tekster er oversatt på alle 15 språk.

Android-identitet: no.bjerkholtstudio.sporlys, versionCode 21, versionName 1.0.1, min SDK 24, target/compile SDK 36. Samme produksjonsopplastingsnøkkel som kode 20. Signeringsinstruksjoner i README-RELEASE-1.0.0.md gjelder fortsatt. Produksjonsnøkkel/passord ligger utenfor prosjektet.

Alle eksisterende regresjonskontroller og ny gjennomgangstest er kjørt. Nettlesertest kontrollerer feil kode, direkte tilgang til brett 96, videreføring etter omstart, avslutning, tilbakekomst til normal fremdrift og fravær av falsk kjøpstilgang. Rapporter ligger i release-validation-v1.0.1-code21. Test fysisk via Google Play før innsending. Det er ikke bygget en ny IPA.
