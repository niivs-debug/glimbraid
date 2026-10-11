# Glimbraid test15 – mobiltilpasning

- Hele brettet beholdes samlet på skjermen. På trange skjermer eller ved stor tekst skjules spillerlinjen og rekordlinjen, og knappene vises som de eksisterende ikonene med lokaliserte tilgjengelighetsnavn. Kort spillveiledning erstatter lang tekst; utfyllende veiledning ligger i Hjelp.
- Kompaktvisning velges også hvis faktisk brikkebredde faller under 44 CSS-piksler. Skjermbredden setter fortsatt en fysisk grense for brikkestørrelsen.
- Progresjonslys i bakgrunnen har 8 % opasitet under spill. De vanlige lysene vises i menyene.
- Hodeplaggvelgeren bruker to kolonner ved stor tekst. Lange overskrifter kan brytes innenfor dialogen.
- Øyvind-hilsenen og oversettelsene av den er fjernet fra alle 15 språk.
- Målfeltene i statuslinjen bruker SVG-former slik at de ikke vokser ut av rammen ved stor tekst. Hinttallet holdes samlet.

## Kontroller

Full automatisk funksjonssuite: bestått. Omfatter 96 brett, hint, progresjon, spilleradministrasjon, premier, sikkerhetskopi, lyd og native eksport.

Nettleserkontroll: 225 nye visninger, 15 språk, seks spillere, 320 × 568, 390 × 844 med simulert dobbel tekststørrelse og 667 × 375 liggende. Ingen JavaScript-feil, vannrett avklipping eller brett utenfor skjermflaten. Oppsett, innstillinger, spillerliste, figur-/hodeplaggvalg og spillvisning kontrollert.

6 × 6-brikker: 46,5 CSS-piksler på 320 × 568; ca. 54,7 på 390 × 844 med dobbel tekst. Hele brettet vises samtidig. Dette er nettlesermålinger; fysisk mobilkontroll er fortsatt nyttig, særlig med systemets tekstinnstillinger.

Spillregler, hintgrenser og betalingsfunksjoner er ikke endret. Ingen betalingsløsning er lagt til i denne versjonen.
