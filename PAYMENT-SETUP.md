# Glimbraid – engangskjøp (test16)

Modell: brett 1–12 gratis. Ett permanent kjøp åpner brett 13–96 og alle tilhørende premier for alle lokale spillere. Oppsummering og premie etter brett 12 vises før kjøpstilbudet. Ingen abonnementer eller kjøp av hint.

## Produkt i begge butikker

- Produkt-ID: `glimbraid_full_game` (må samsvare nøyaktig).
- Google Play: engangsprodukt, ikke forbrukbart. Apple: Non-Consumable.
- Anbefalt kundepris i Norge: **39 NOK**, inkludert avgifter. Velg nærmeste tilgjengelige prisnivå og kontroller endelig kundepris. Andre lands priser settes i butikkene.
- Appen viser butikkens lokaliserte pris; ingen fast pris er lagt inn i kjøpsknappen.
- Eksisterende pakke-ID videreføres: `no.bjerkholtstudio.sporlys`. Visningsnavnet er Glimbraid.
- Kjøp og gjenoppretting krever riktig butikkonto, tilgjengelig produkt og butikkens test-/distribusjonskanal. APK uten slik oppsett skal ikke gi betalt tilgang eller vise en oppdiktet pris.

## Kontroll før publisering

1. Opprett produktet, legg inn lokaliseringer/priser og gjør det tilgjengelig for tester.
2. Android: produksjonssigner AAB med egen opplastingsnøkkel. Test-APK er signert med prosjektets eksisterende testnøkkel og er ikke en produksjonsutgave.
3. Test kjøp, avbrytelse, ventende betaling, gjenoppretting og tilbakekalling via intern Google Play-testing. Bekreft at nye/eksisterende lokale spillere får tilgang uten endret fremdrift.
4. iOS: `npm ci`, `npm run prepare:ios`, installer CocoaPods/bygg i Xcode på Mac, signer og test via TestFlight. Minste iOS er 15. Simulator- eller kildekontroll erstatter ikke et fysisk kjøpstestløp. Ingen IPA er bygget her.
5. Kontroller offline omstart etter bekreftet kjøp og at sletting av appdata/ny installasjon krever gjenoppretting. Test refundering med tilbakekalling av tilgang, ikke bare økonomisk refusjon.
6. Oppdater butikkens kjøps-/personvernerklæringer i tråd med den faktiske distribuerte utgaven og Google/Apples betalingsbehandling.

## Tilgang og lagring

Kjøpstilgang ligger i en separat, butikkspesifikk lokal cache. Den inngår ikke i spillerprofiler eller sikkerhetskopier. Google-kjøp åpner ikke automatisk iOS-utgaven. Bekreftet lokal tilgang fungerer offline. En vellykket butikkforespørsel som viser at kjøpet ikke finnes, fjerner tilgangen; nettfeil gjør ikke det.

Android bekrefter/bekrefter mottak av ikke-forbrukbare kjøp og spør bare INAPP-kjøp om aktiv tilgang. iOS bruker verifiserte StoreKit-entitlements og ignorerer tilbakekalte kjøp. Ingen egen server eller abonnementstjeneste er innført. Dette er lokal butikkontroll, ikke serverbasert kvitteringsvalidering; endelige kjøp og refunderinger må testes i butikkene.

Google Play Billing 9 har egne transport-/serialiseringsavhengigheter. Ingen Firebase Analytics-app eller spilleranalyse er konfigurert.

Nettutgaven viser de 12 gratis brettene og informasjon om mobilkjøpet. Den har ingen nettkasse eller skjult fulltilgang. Regresjonstester bruker en eksplisitt testfixture som ikke lastes av appen.
