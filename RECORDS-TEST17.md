# Test17 – brett- og kategorirekorder

Resultatlisten har valget Brett/Kategori og to uavhengige rangeringer: tid og trekk. Kategori summerer beste tid og laveste antall trekk på de 12 brettene. Rekordene kan komme fra forskjellige forsøk, og en kategori trenger ikke spilles sammenhengende. Forbedring av ett brett forbedrer totalsummen.

Alle opptil seks lokale spillere vises med avatar og navn. Aktiv spiller markeres ut fra profil-ID. Spillere uten brettrekord står nederst med «Ingen rekord ennå». Kategorier med færre enn 12 gyldige rekorder vises uten plassering med antall brett med rekord. Hint- og øvemodus oppretter fortsatt ikke rekorder. Like viste resultater får samme plassering.

Summene beregnes direkte fra eksisterende lagrede brettrekorder, uten nytt lagringsformat. Profiler, kjøp, hintbank og sikkerhetskopier beholdes.

Android-deling: delingsvelger åpnes i en egen oppgave, og mottakerappen bes bruke sin egen oppgave. Tillatelse til å lese PNG beholdes. Dette er en kodejustering, ikke en bekreftet Snapchat/MMS-rettelse. På fysisk Android må det testes å dele, avslutte mottakerappen fra nylige apper, gå tilbake til Glimbraid og kontrollere både fremdrift og visning. Test også vanlig tilbakeknapp og avbrutt deling. iOS-delingsoppførsel er ikke endret eller fysisk testet.

Test-APK bygger videre på test16, bruker samme testsertifikat og versjonskode 17. Før produksjons-AAB må butikkprodukt og produksjonssignering klargjøres, og faktiske kjøp testes. Se PAYMENT-SETUP.md. iOS-kilde har samme delte rekordlogikk; ingen IPA er bygget her.
