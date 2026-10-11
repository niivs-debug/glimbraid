# Test18 – klargjøring av kapittelkort

Feil rapportert på Android ved klargjøring av første kapittelkort. Feilen kunne ikke gjenskapes i nettleseren, og årsaken på fysisk telefon er ennå ikke bekreftet.

Kortet bruker nå en PNG-versjon av den samme vektorlogoen for å fjerne SVG-dekoding fra canvas-eksporten. Menylogoen er uendret. PNG-eksport kontrolleres før deling aktiveres. Klargjøringsfeil viser en trygg feilkode: CARD_LOGO, CARD_AVATAR, CARD_HAT, CARD_PRIZE, CARD_FONT, CARD_CANVAS, CARD_DRAW eller CARD_EXPORT. Ingen spillernavn eller rå feilmeldinger legges i koden.

Ekte nettlesertest: 48 kombinasjoner av åtte kapitler og seks figurer, samt første kapittel på alle 15 språk – totalt 63 genererte og eksporterte PNG-er. Alle er under native størrelsesgrense. Fremprovosert logo-feil viste CARD_LOGO, og «Prøv igjen» klargjorde bildet og aktiverte Del/Lagre etter at ressursen ble tilgjengelig.

Regresjonstester og optimalisert Android-APK bestått. Versjonskode 18 og samme testsertifikat som test17. Rekorder, kjøpsmodell, lagrede data og Android-delingsjustering fra test17 beholdes. Test kapittelkortet på telefon før AAB. Om det fortsatt feiler, oppgi feilkoden som står på skjermen. Ingen IPA bygget.
