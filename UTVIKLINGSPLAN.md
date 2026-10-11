# Glimbraid – plan mot 96 brett

Mål: 8 kapitler med 12 brett hver. Nå er alle 96 brett implementert. Test11 legger til Lysvev; brett 1–84 er uendret.

| Brett | Retning | Størrelse og lys |
|---|---|---|
| 1–12 | Nattglød: grunnregler, dobbeltspor og port | 3×3 til 5×5; to lysfarger |
| 13–24 | Skogro: lengre veier og flere koblinger | 5×5; to lysfarger |
| 25–36 | Frostlys: isbrikke, port og tre lysveier | 5×5; to lysfarger |
| 37–48 | Ravdyp: tredje farge, deretter port og frost | 5×5; tre lysfarger |
| 49–60 | Nordlysvev: samspill med tre farger, porter og frost | 5×5; tre lysfarger |
| 61–72 | Stjernedyp: gradvis innføring av større brett | 5×5 til 6×6; to farger ved overgangen, deretter tre |
| 73–84 | Solkrone: tettere samspill med kjente regler | 6×6; tre lysfarger |
| 85–96 | Lysvev: finale med tett samspill og kjente regler | 6×6; tre lysfarger |

Tre lysveier finnes allerede i enkelte brett; det er ikke det samme som tre ulike farger.
Tredje farge har eget trekantsymbol slik at farge alene aldri kreves.
Økt vanskelighetsgrad skal komme fra samspill, svinger og avhengigheter, ikke bare flere brikker.
Kapitler bør ha en innføring, opptrapping, enkelte pusterom og en finale.
Spillertester avgjør faktisk vanskelighetsgrad; antall svinger og dobbeltspor er bare konstruksjonsmål.

## Hintbank – implementert
- Tre grunnhint på hvert nytt brett, også når banken er tom.
- Grunnhint brukes før bankhint.
- Ubrukte grunnhint flyttes til banken første gang et brett fullføres.
- Gjenspilling gir ingen flere bankhint. De tre grunnhintene gjelder første gjennomføring av brettet; restart fyller dem ikke opp. Brukte bankhint tilbakeføres ikke ved restart.
- Saldo og forsøk lagres per profil og tas med i sikkerhetskopien.
- Hintmerking/rotering må ha én tydelig og konsekvent belastning; dagens totrinnsbruk beholdes.
- Rekorder krever fortsatt hjelpfrie forsøk. Øvemodus beholdes etter oppbrukte hint.
- Ingen øvre grense er avtalt. En grense skal ikke innføres uten å avklare det.
- Før første brett må spilleren få en kort forklaring på sparing og senere utfordringer.

## Språk
Norsk og engelsk er implementert og kontrolleres for like tekstnøkler.
Nye regler, hjelp, hint, personvern og feilmeldinger skal inngå i hver oversettelse.
Neste språk må avklares; svensk, dansk og finsk er naturlige kandidater, uten at nye språk er lagt til her.

## Hintbank – test4
Implementert per spiller: tre grunnhint per nytt brett, deretter sparehint.
Ubrukte grunnhint spares bare ved første fullføring. Restart av ufullført brett
fyller ikke på hint. Gjenspilling gir ikke sparehint. Øvemodus er fortsatt tilgjengelig.
Hintbank og brukte grunnhint følger sikkerhetskopien. Gamle fullføringer gir ingen etterbetaling.

## Språk for internasjonal lansering – anbefaling, ikke implementert
Behold engelsk og norsk. Første utvidelse: spansk, portugisisk (Brasil), fransk,
tysk og indonesisk. Neste vurdering: japansk, koreansk og hindi ut fra testresultater.
Engelsk er standardspråk utenfor støttede språk. Alle menyer, hjelpetekster,
hintbank, sikkerhetskopi og butikktekster må følge valgt språk. Kontroller
plassholdere, små skjermer og skrifter; morsmålslesing før publisering.
Kilder: https://support.google.com/l10n/answer/6360015?hl=en
https://sensortower.com/blog/india-mobile-game-insights-2025
https://sensortower.com/blog/state-of-japan-gaming-2025

## Figurer og kapittelpremier – test5
Seks egne figurer: Lysrev, Måneugle, Skogånd, Glødstein, Mosehare, Lysdrage.
Flere spillere kan velge samme figur; figurvelgeren viser hvem som bruker den.
Sju hodeplagg er implementert: stjernelue, bladkrans, iskrone, ravkrone, nordlysdiadem, stjernediadem og solkrone.
Premien krever alle brett i kapitlet, men hint og øvemodus er tillatt.
Opptjente plagg beregnes fra spillerens fremgang og beholdes når nytt plagg utstyres.
Tidligere kapittelfullføringer gir automatisk tilgang. Utstyrt plagg og figur følger backup.
Lysdiadem fullfører rekken av åtte egne hodeplagg.

## Ravdyp og deling – test6
48 brett totalt. Ravdyp (37–48) bruker 5x5 og tre farger: mint, rav, fiolett.
37–39 introduserer tredje farge; 40–42 legger til lysport; 43–48 kombinerer fargene med frossen brikke.
Summen av lysveienes lengde øker fra 21 til 32 ruter. Menneskelig vanskelighetsgrad må fortsatt prøvespilles.
Ny premie: ravkrone. Gamle premier og fremgang beholdes.
Kapittelkort kan åpnes fra kapittelresultatet og fra tidligere fullførte kapitler.
Kortet viser avatar, navn, kapittel, brettspenn, 12/12, totalt opptjente hodeplagg og saldo i hintbanken.
Eksport: 1080x1350 PNG. Android bruker systemdeling eller filvelger; nett bruker fildeling der det støttes, ellers nedlasting.
Ingen automatisk deling. Offentlig butikkslenke tilføyes når Glimbraid er publisert.
Videre: bygg/test 12 om gangen til 96. Norsk/engelsk holdes komplette underveis; øvrige språk etter stabilisering av tekstene.

## Grensesnitt og kontroll – test7
- Brett 1 og 2 beholdt etter brukerens ønske; alle 48 brett er uendret.
- Kapittelslutt viser figur/premie og neste kapittel først. Detaljert brettresultat ligger i en utvidbar seksjon.
- Låste hodeplagg viser nødvendig kapittel; alle fem valg i et rutenett uten horisontal skrolling.
- Hint belastes ved markering; norsk og engelsk forklarer dette uttrykkelig.
- Restart av påbegynt, ufullført forsøk krever bekreftelse. Fullførte brett kan spilles igjen direkte.
- Hintoversikten har egen rad i liggende mobilvisning. Små skjermer kan skrolle vertikalt ved behov fremfor å skjule kontroller.
- Kapittelkort merker hodeplagg og hint som samlet/nåværende status. Ingen butikkslenke før en faktisk offentlig URL finnes.
- Midlertidig takkehilsen til Øyvind på hjemskjermen. Fjern SHOW_TESTER_THANKS og testerThanks etter testperioden.
- Fortsatt nødvendig: fysisk kontroll av små skjermer, stor systemtekst, tastatur, deling/lagring og lyd; språk før lansering.

## Nordlysvev – test8
- 49–50: oppvarming med tre farger uten port eller frost.
- 51–56: lengre/koblede veier med ravstyrt port.
- 57–60: frost og port i kombinasjon med tre farger.
- Summert lengde 27–34, dobbeltspor 4–9. Ni er geometrisk øvre grense på 5×5 når endepunkter ikke deles.
- Femte premie og kort: Nordlysdiadem; norsk/engelsk følger funksjonene.
- Ingen endring av tidligere brett eller brukerdata. Gamle 48-brettsspillere åpner 49.
- Neste pulje 61–72: gradvis 6×6, uten samtidig ny farge.
- Mobilprøvespilling avgjør justeringer av vanskelighet, varighet og hintbehov.

## Stjernedyp og kapittelatmosfære – test9
72 brett totalt. Første overgang til 6×6 skjer på brett 63 med to farger. Tre farger kommer tilbake på 65, port på 67 og frost på 71. Summert lysveilengde er 27–45 og dobbeltspor 4–13. Mer detaljerte konstruksjonsmål og vurdering i PROGRESJON.md. Neste pulje 73–84 bør bruke tre farger på 6×6 og bygge videre på samspill fremfor flere farger. Prøvespilling av overgangen 60–67 og finalen må styre justeringene. Alle kapitler har nå eget landskap og lydatmosfære; fysisk lyd-/skjermkontroll gjenstår.

## Solkrone – test10
84 brett totalt, sju egne landskap/lydatmosfærer/premier. Hele 73–84 bruker 6×6 og tre farger; utfordringen økes gjennom tettere dobbeltspor, svinger og port/frost. Ingen ny regel eller farge. 79 gir et pusterom før frost. Neste 85–96 bør bygge videre på dette og gi en tydelig finale. Prøvespilling av overgang/finale må styre finjustering, siden tekniske mål ikke er en menneskelig vanskelighetsmåling.

## Test11 – hele reisen
96 brett i åtte kapitler. Lysvev / Lightweave 85–96, egen bakgrunn, original lokal lydatmosfære og Lysdiadem. Norsk og engelsk er komplette; nye språk tas etterpå. De første 84 brettene er byte-identiske i brettdata. Tre grunnhint beholdes, hintbanken har tak10 og tak15 når brett48 er fullført; økningen gir kapasitet, ingen gratis hint. Gamle banker og import tilpasses taket. Slett spiller har eksplisitt navngitt bekreftelse, Avbryt fremhevet, isolert sletting og håndtering av siste profil som tom Spiller1. Tidligere backup kan gjenopprette en slettet spiller.

## Avtalt rekkefølge – 11. oktober 2026
1. Åtte kapittelfarger på brikkene, kontroll og Google Play-oppdatering.
2. Apple-utgaven følger samme spillkjerne og visuelle endringer.
3. Deretter vurderes Steam, først med en PC-demo av kapittel 1. Fullversjon med alle 96 brett og egen PC-pakking er et forslag til videre vurdering.

Fargene endrer brikkenes overflate og hover, ikke lysstrømmenes farger, hintmarkeringer, frost eller funksjonelle rammer. Eksisterende variasjon i steinteksturen beholdes. Brett, hintbank, premier, språk, kjøp og lagrede spill skal være uendret. Ingen Steam-lansering eller pris er besluttet.
