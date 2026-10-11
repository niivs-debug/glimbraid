# Glimbraid – gjeldende nett- og mobilgrunnlag (test11)

96 brett i åtte kapitler: Nattglød, Skogro, Frostlys, Ravdyp, Nordlysvev, Stjernedyp, Solkrone og Lysvev. Norsk og engelsk. Statiske ES-moduler uten server eller eksterne spillressurser. Android-APK bruker samme spillkode og Capacitor 6.2.2.

## Struktur
- dist/engine.mjs og *-levels.mjs: brett, lys, farger, porter, frost og hintforslag.
- dist/app.mjs: menyer, figurer, forsøk, hintbank, tid, rekorder og lokal fremgang.
- dist/avatars.mjs: seks figurer og åtte kapittelpremier.
- dist/chapter-card.mjs: eksplisitt PNG-deling/lagring av fullførte kapitler.
- dist/i18n.mjs: komplette norske og engelske tekstnøkler.
- dist/style.css: mobil-/nettbrettlayout, liggende visning og redusert bevegelse.
- native/: Android-filvelger, bildedeling og håndtering av tilbakeknapp/bakgrunn.

## Lagring og kompatibilitet
Lokal lagringsnøkkel sporlys.progress.v1 beholdes. Skjema 2 inneholder opptil seks lokale profiler med egne forsøk, rekorder, hintbank, innstillinger og utstyr. Forsøk lagrer brikker, angrehistorikk, tid, trekk og hint; bakgrunnstid teller ikke. JSON-sikkerhetskopi inkluderer alle profiler og valideres før eksplisitt erstatning. Ingen skysynk eller kjøpsmodul er implementert.

## Spill og belønninger
Tre grunnhint per nytt brett. Ubrukte hint spares ved første fullføring; restart refunderer ikke hint og gjenspilling gir ikke flere sparehint. Ett hint belastes ved markering, og neste trykk kan vri brikken uten ny belastning. Øvemodus gir fri hjelp når hint er brukt opp. Hint/øvemodus tillater fremgang og premier, men ikke rekorder. Premier krever alle tolv brett i kapitlet.

## Test7
Kapittelslutt fremhever figur/premie og neste kapittel. Tid, trekk og rekorder finnes under Brettresultat. Låste plagg viser kapitlet som kreves og vises i et rutenett. Restart av et påbegynt, ufullført forsøk krever bekreftelse. Midlertidig takkehilsen til Øyvind fjernes senere via SHOW_TESTER_THANKS. Alle 48 brett er uendret.

## Kontroll og videre arbeid
Kjør npm test i mobilprosjektet eller node tests/<navn>.mjs i nettprosjektet. Kontrollene dekker løsning, hint, progresjon, profil-/backupkompatibilitet og simulert meny/native-flyt; de erstatter ikke fysisk skjerm-, lyd- og delingstest. Server dist over HTTP for nettbruk. Se README.md for Android-bygg og UTVIKLINGSPLAN.md for veien mot 96 brett. iOS-prosjekt og kjøpsmodul må klargjøres og testes før butikkbygg.

## Nordlysvev – test8
Brett 49–60 kombinerer tre lysfarger på 5×5. Porter introduseres fra 51 og frost fra 57. Alle brett er faste oppsett; verktøyet tools/author-aurora.py brukes bare ved forfatting, aldri under spilling. Metrikkene varierer bevisst: summert lysveilengde 27–34 ruter og 4–9 brikker med dobbeltspor. Pusterom og innføring av frost erstatter en mekanisk økning på hvert brett. Faktisk vanskelighet må prøvespilles. Nordlysdiadem kan utstyres etter alle tolv brett, også ved hjelp/øvemodus, og følger profil/backup. Kapittelkort viser Nordlysvev og samlet spillerstatus.

## Stjernedyp – test9
61–62 bygger bro på 5×5. 63–64 introduserer 6×6 med to farger. 65–66 bruker tre farger, 67–70 legger til porter, 71–72 kombinerer frost. Alle oppsett er faste, skrevet med tools/author-stellar.py under utvikling. Tidligere 60 brett er kontrollert identiske med test8 inkludert startrotasjonene. Nytt stjernediadem, kapittelkort og komplette norske/engelske tekstnøkler. Fire nye landskap gir seks egne kapittelbakgrunner, og dist/audio.mjs har seks ulike originale, syntetiserte atmosfærer. Lyden følger synlig kapittel; pause/bakgrunn frigjør kildene. PROGRESJON.md inneholder analyse fra brettene.

## Retur til hjem – feilretting etter test9
Ved bytte mellom hjem, kapitteloversikt og spilling settes dokumentets skrollposisjon til toppen. Tidligere kunne skrollposisjonen fra en lang brettoversikt flytte hjemikonet utenfor synlig område. Vanlige oppdateringer under spilling, dialoger og pause/resume beholder posisjonen. Ikonfilen og lagret fremdrift er uendret. Testet med simulert skroll og navigasjon; fysisk nettleser-/mobilbekreftelse gjenstår.

## Solkrone – test10
73–84 fortsetter på 6×6 med tre farger. To åpningsbrett uten port/frost, port fra 75, pusterom på 79, frost fra 80. Summert veilengde 41–49, dobbeltspor 10–15, svinger 25–32. Alle oppsett er faste. Ny solkrone, egen daggrybakgrunn, varm original lydatmosfære og kapittelkort. Alle sju premier har egne lokale bilder og navn på begge språk. Kortet bevarer bildets proporsjoner ved ulike hodeplaggformater. Testene kontrollerer at alle tidligere 72 brett, fremdrift og backup videreføres. Se PROGRESJON.md.

## Test11 – hele reisen
96 brett i åtte kapitler. Lysvev / Lightweave 85–96, egen bakgrunn, original lokal lydatmosfære og Lysdiadem. Norsk og engelsk er komplette; nye språk tas etterpå. De første 84 brettene er byte-identiske i brettdata. Tre grunnhint beholdes, hintbanken har tak10 og tak15 når brett48 er fullført; økningen gir kapasitet, ingen gratis hint. Gamle banker og import tilpasses taket. Slett spiller har eksplisitt navngitt bekreftelse, Avbryt fremhevet, isolert sletting og håndtering av siste profil som tom Spiller1. Tidligere backup kan gjenopprette en slettet spiller.
