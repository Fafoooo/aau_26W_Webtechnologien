# Unabhängiger Abschlussprüfbericht – Assignment 03

## Ergebnis

**Im geprüften Umfang sind alle vier Lösungen funktional sauber und erfüllen die Originalanforderungen. Keine kritischen, hohen oder mittleren Befunde; ein geringer Dokumentationsbefund.** Die unabhängige Browserprüfung endete mit **18 bestandenen Prüfgruppen**, Exitcode **0**, ohne unbehandelte JavaScript-Seitenfehler in Chromium **148.0.7778.96**.

Es wurden keine Lösungs-, Vorlagen-, Erklärungs- oder vorhandenen Testdateien verändert. Die einzige neu geschriebene Repositorydatei ist dieser Bericht. Kein Commit, Push oder Upload.

## Prüfgrundlage und Unabhängigkeit

- Die vollständige vierseitige `angabe_blatt03.pdf` wurde gelesen und mit den Implementierungen abgeglichen, einschließlich Plain-JavaScript-/CSS-Vorgabe, Dateierhalt, Versuchslimit, Überschriftenvorrang, Timerabschaltung und mauspositionsbasierter Puzzle-Zuordnung.
- Alle Zeilen der Produktquellen wurden gelesen: `ue3.1/index.html`, `style.css`, `game.js`; `ue3.2/editable.html`, `editable.js`; `ue3.3/gallery.html`, `gallery.css`, `gallery.js`; `ue3.4/puzzle.html`, `puzzle.js`.
- Gegenprüfung mit den Originalen unter `Angabe/files/editable/` und `Angabe/files/puzzle/` sowie der ausdrücklich vorgegebenen Galerie aus `../ueb02/ue2.6/`. Geschützte Dateien und Bilder wurden zusätzlich binär verglichen.
- Beide vollständigen Erklärungen, die vier `antwort.md` und beide vorhandenen Testdateien wurden auf Konsistenz mit dem tatsächlich vorhandenen Code gelesen. Die ausführbaren Produktblöcke einschließlich des geerbten Galeriecodes sind nachvollziehbar und mit zutreffenden Zeilenbereichen erklärt; Ausnahme siehe D01.
- Für die Laufzeitprüfung wurde ein **neues, separates Scratch-Skript** geschrieben. Es importiert oder startet weder `tests_1_2.cjs` noch `tests_3_4.cjs`. Die vom übergeordneten Lauf berichteten Erfolge dieser beiden Dateien werden hier **nicht** als unabhängige eigene Prüfung ausgegeben.

## Befunde nach Schweregrad

### D01 – Gering: statische Erfassung der Puzzle-Quellbilder unzutreffend erklärt

**Fundstelle:** `erklaerung_3_4.md:171`, letzter Satz: „Ziele und Quellbilder werden beim Laden erfasst, nicht automatisch bei späteren Änderungen neu registriert.“

**Tatsächlicher Code:** Nur die Ziele werden als feste Sammlung erfasst (`ue3.4/puzzle.js:5`). Quellbilder werden bei jedem Klick über den Dokumentlistener und `event.target.closest("#puzzleSource img")` ermittelt (`ue3.4/puzzle.js:75–79`); eine anfängliche Registrierung einzelner Quellbilder gibt es nicht. Die Erklärung der Event Delegation unter `erklaerung_3_4.md:236` beschreibt diesen Mechanismus ansonsten richtig.

**Unabhängig reproduziert:** Nach vollständiger Initialisierung des echten Puzzles wurde ein zusätzliches Bild in `#puzzleSource` eingefügt. Es ließ sich ohne erneute Initialisierung anklicken, bewegen und auf das passende Ziel setzen; das Original wurde aus der Quelle entfernt und der Hintergrund korrekt gesetzt. Prüfgruppe 17 bestand.

**Auswirkung:** Kein Funktionsmangel und keine Verletzung der Aufgabenstellung. Die Lernhilfe schreibt den Quellbildern aber eine Einschränkung zu, die der Implementierung nicht entspricht.

**Empfehlung, nicht umgesetzt:** Den Satz auf die beim Laden erfassten **Ziele** beschränken und ergänzen, dass Quellbilder durch Event Delegation auch nachträglich innerhalb von `#puzzleSource` erkannt werden.

## Anforderungsabgleich mit konkreten Codepositionen

### Aufgabe 3.1 – Number-Guessing Game II

- HTML-Komponenten, eingebundene Dateien, zunächst verborgene Eingabe und deaktivierter Check: `ue3.1/index.html:4–21`. Verdana/2em/15px, Absatzzentrierung/10px, mittiges Fieldset, hellblauer Fokus sowie blaue/grüne/rote Buttons: `ue3.1/style.css:6–37`. Sichtbarkeit, berechnete Styles und Zentrierung wurden im Browser geprüft.
- Start, Zufallsbereich 1–10, Eingabeattribute und dynamischer Exit: `ue3.1/game.js:49–83`. Die gültige Vorbelegung 1 löst die widersprüchliche Formulierung „sofort aktiviert“/„nur gültige Eingabe“ schlüssig; die Auslegung ist in `ue3.1/antwort.md:15–18` offengelegt.
- Gültigkeitsprüfung und Schutz auch im Handler: `game.js:20–26,85–88`. Ungültige Eingaben zählen nicht. Beide Hinweissrichtungen und die Historie falscher Tipps stimmen.
- Genau drei Versuche, kein vierter, aber Sieg beim dritten korrekten Tipp: `game.js:89–103`. Die Originalformulierungen „maximum of 3“ und „exceeds 3“ werden zugunsten der ausdrücklichen Obergrenze ausgelegt und dokumentiert.
- Zwei dynamische Divs zwischen Fieldset und Buttons: `game.js:65–73`. Exit entfernt die temporären Elemente und setzt den Zustand zurück: `game.js:29–47`.

**Ergebnis:** Keine funktionale Abweichung gefunden.

### Aufgabe 3.2 – Editable HTML

- `ue3.2/editable.html:8` ist die einzige HTML-Ergänzung; nach binärem Entfernen dieser Scriptzeile entspricht die Datei exakt dem Original, einschließlich CRLF. Alle drei JPG-Dateien sind bytegleich.
- Generiertes Formular unmittelbar nach der letzten Section, zunächst deaktivierter Submit: `ue3.2/editable.js:7–31,82–87`. Die Auswahl lädt bei jeder ursprünglichen Section die direkte Überschrift und das vollständige `innerHTML`: `editable.js:34–35,53–63`.
- Erst HTML ersetzen, anschließend die direkte h1 gegebenenfalls neu erzeugen und mit dem Input überschreiben: `editable.js:66–79`. Konflikt, gelöschte direkte h1, nur noch verschachtelte h1 und vollständig leerer Inhalt wurden geprüft. Der Texteingabewert gewinnt auch bei `&` und `<B>` als wörtlichem Text.
- Aktualisierte Optionsbeschriftungen und Auswahl bleiben korrekt: `editable.js:38–50,78–79`. Andere Sections werden nicht verändert; Placeholder deaktiviert Submit und der Handler verhindert Änderungen ohne Auswahl.

**Ergebnis:** Keine funktionale Abweichung gefunden. Die offen erklärte Verwendung von vertrauenswürdigem HTML ist keine behauptete Sanitization und keine zusätzliche Sicherheitsgarantie.

### Aufgabe 3.3 – Galerie

- HTML, CSS und alle sechs Bilder sind bytegleich zu Übung 2.6. Der vollständige bisherige JS-Inhalt ist ein exaktes Byte-Präfix von `ue3.3/gallery.js:1–65`; die neue Erweiterung steht in `gallery.js:67–148`.
- Auswahl nach Elementidentität statt URL, zyklische Navigation ohne feste Bildzahl: `gallery.js:23–43`. Separat geprüft mit 0, 1 und 7 Vorschaubildern, anderen Wrappern und wiederholten Großbild-URLs in absoluter/relativer Schreibweise.
- Dauerfeld mit Standardwert 3 und echte Intervallsteuerung: `gallery.js:97–104,109–126`. Der erste Wechsel erfolgt nach einem vollständigen Intervall. Liveänderungen löschen das alte Intervall und beginnen das neue vollständig; ungültige Werte stoppen die Wiedergabe.
- Pause, Exit, alter Hintergrund-/Großbild-Schließweg und `pagehide` führen zur Timerbereinigung: `gallery.js:109–113,129–147`. Die unabhängigen Tests beobachteten aktive Timerkennungen und tatsächlich ausgeführte Callbacks, nicht nur Bildwechsel. Manuelle Navigation erhält das laufende Intervall; Bedienklicks schließen das Overlay nicht versehentlich.
- Der historische Erklärungslink in `gallery.js:17` gehört zum unveränderten Vorgänger. Das ist in `erklaerung_3_4.md:78` und `ue3.3/antwort.md:35` ausdrücklich gekennzeichnet, daher kein Dokumentationsbefund.

**Ergebnis:** Keine funktionale Abweichung innerhalb des statischen Vorlagenformats gefunden.

### Aufgabe 3.4 – Puzzle

- Original-HTML bis auf `ue3.4/puzzle.html:33` und alle vier Original-JPGs binär erhalten.
- Click–move–click statt HTML5-Drag-and-drop, versetzte Mausvorschau und Escape: `ue3.4/puzzle.js:21–48,74–79,96–98`.
- Treffer über die tatsächlichen Klickkoordinaten, nicht die Vorschau: `puzzle.js:81–86`. Ein eigener Grenztest klickte **außerhalb** eines Ziels, während die versetzte Vorschau hineinragte: keine Platzierung. Ein weiterer Klick lag **innerhalb** am unteren rechten Zielrand, während die Vorschau außerhalb lag: richtige Platzierung.
- Platzierung als Hintergrund, Entfernen aus der Quelle und Rückgabe genau desselben zuvor gesetzten Originalelements: `puzzle.js:64–71`. Die Elementidentität wurde ausdrücklich geprüft.
- Alle `div[data-result]` im Dokument statt fester Raster-IDs/-Koordinaten: `puzzle.js:5,50–60,82–84`. Unabhängig mit **sechs** anders positionierten Zielen ohne die ursprünglichen Ziel-IDs/-Klassen, Kind-Spans, anderen Größen und doppelten Bild-URLs geprüft. Der Sieg erschien erst nach dem sechsten richtigen Ziel.
- Ein vollständig falsch belegtes Originalpuzzle erzeugte trotz leerer Quelle keinen Sieg. Wiederaufnahme eines gesetzten Stücks entfernt den bisherigen Sieg; Austausch, Rückgabe und erneute Auswahl funktionieren (`puzzle.js:87–93`).

**Ergebnis:** Keine funktionale Abweichung gefunden; lediglich D01 in der Erklärung.

## Tatsächlich ausgeführte unabhängige Checks

Das Scratch-Skript `a03_independent_review.cjs` und die Ergebnisdatei `a03_independent_result.json` liegen außerhalb des Repositorys im aktiven Scratch-Verzeichnis. Aufruf in der verwendeten Umgebung:

```sh
node "$TMPDIR/a03_independent_review.cjs"
```

Es wurden echte lokale HTML-/JS-Dateien mit ihren Bilddateien in headless Chromium geöffnet. Zusätzliche Testdokumente wurden ausschließlich im Browser aufgebaut und luden das unveränderte Produkt-JavaScript. Kein DOM-Mock, keine erfundenen Laufzeitergebnisse.

| Gruppe | Eigenständig geprüfter Inhalt | Ergebnis |
|---|---|---|
| 1 | Binärer Vorlagenerhalt, Bilder, Galerie-Vorgängerpräfix | bestanden |
| 2 | Spiel-Anfangsansicht, CSS, Start, Div-Reihenfolge, Farben und Zentrierung | bestanden |
| 3 | Ungültige Eingaben, beide Hinweise, drei Fehler, keine vierte Chance | bestanden |
| 4 | Reset, Ziel 10/Treffer im dritten Versuch, Ziel 1/Soforttreffer | bestanden |
| 5 | Editorformular und exaktes Laden jeder Section | bestanden |
| 6 | h1-Konflikt/Entfernung/Verschachtelung/Leerwert, Select, Nachbarsections | bestanden |
| 7 | Galerie-Standarddauer, 2999/3000-ms-Grenze, Umläufe, echte Pause | bestanden |
| 8 | Laufende Dauer kürzer/länger, ungültige Werte, manuelle Navigation | bestanden |
| 9 | Exit, Hintergrund, Großbild, `pagehide`, keine weiteren Timer-Callbacks | bestanden |
| 10–12 | Separate Galeriedokumente mit 0, 1 und 7 Bildern | jeweils bestanden |
| 13 | Puzzle-Grenzfall: Mausposition gegen überlappende/außerhalb liegende Vorschau | bestanden |
| 14 | Rücktauschidentität, korrekter Gesamtsieg, Wiederaufnahme, Escape, erneute Fehlbelegung | bestanden |
| 15 | Sechs freie Ziele, Kindklick, doppelte URLs, Sieg erst bei Vollständigkeit | bestanden |
| 16 | Originalpuzzle vollständig falsch und Quelle leer: kein falscher Sieg | bestanden |
| 17 | Nachträglich eingefügtes Quellbild zur Überprüfung von D01 | bestanden |
| 18 | Fehlerkanal sämtlicher unabhängig geöffneter Seiten | keine unbehandelten JS-Fehler |

Abschlussausgabe des finalen vollständigen Laufs:

```text
RESULT: 18 independent check groups passed; no page errors; Chromium 148.0.7778.96
```

Ein früherer Lauf brach an einer zu strikten Koordinatenassertion des neuen Review-Skripts ab: Ein Layoutrechteck hatte einen Bruchpixelwert, das Mausereignis ganzzahlige Koordinaten. Die Assertion wurde mit einer Toleranz unter einem Pixel korrigiert; der Produktcode wurde nicht geändert. Danach wurde der vollständige Test einschließlich der zusätzlichen D01-Gegenprüfung erneut erfolgreich ausgeführt.

## Grenzen und bereits offen dokumentierte Eigenschaften

- Nur Chromium, keine Aussage über andere Browserfamilien, echte Touchgeräte, Screenreader oder beliebig kleine Fenster. Keine unabhängige Screenshot-Sichtprüfung vorgenommen; UI-Merkmale wurden über Sichtbarkeit, berechnete Styles, Geometrie und echte Bedienklicks geprüft.
- Galeriezeit wurde deterministisch mit Playwrights Browseruhr vorgerückt; `setInterval`/`clearInterval` liefen dabei im Browser und wurden zusätzlich beobachtet. Das prüft Timerlogik, nicht Echtzeitpräzision oder Hintergrundtab-Drosselung. `pagehide` wurde ausdrücklich als synthetisches Ereignis ausgelöst, nicht durch eine echte Browser-Zurücknavigation.
- Externe HTTP(S)-Ressourcen wurden für reproduzierbare Offlineprüfungen blockiert. Das externe Logo und alte Linkziele wurden nicht auf Erreichbarkeit geprüft. Der fehlende relative Link `erat.html` ist unverändert aus der Vorlage übernommen und bereits unter `ue3.2/antwort.md:22` erklärt.
- Das Eingeben aktiven HTMLs im Editor und die geerbte `innerHTML`-Beschriftung der Galerie sind keine Sicherheitsbereinigung. Diese Vertrauensgrenzen sind in den Antworten/Lernhilfen offen beschrieben; ein Security-Audit für fremde Inhalte war nicht Gegenstand der Aufgabenstellung.
- Ziele des Puzzles und die initiale Galerieverkabelung werden beim Laden erfasst. Eine vollständige dynamische Anwendung ist nicht verlangt. Quellbilder des Puzzles werden dagegen delegiert behandelt, siehe D01.
- Persönliches Verständnis, Eigenleistungsanteile, der separate KI-Bericht und eine spätere Abgabe wurden nicht geprüft oder stellvertretend bestätigt.

**Abschlussurteil des unabhängigen Reviews:** Funktional und bezüglich der überprüften Originalrestriktionen bestanden; keine Codekorrektur aus diesem Review erforderlich. Zum Zeitpunkt dieses Reviews blieb ausschließlich die geringfügige Präzisierung der Lernhilfe aus D01 offen.

## Nachtrag des übergeordneten Bearbeitungslaufs

D01 wurde nach dem unabhängigen Review berichtigt: Die Lernhilfe unterscheidet nun ausdrücklich die beim Laden erfassten Ziele von den delegiert erkannten, auch später hinzugefügten Quellbildern. Außerdem wurden private Testinstallationspfade aus der Lernhilfe entfernt, ohne die dokumentierten Umgebungsvariablen oder Produktdateien zu ändern. Diese redaktionellen Korrekturen stammen vom übergeordneten Bearbeitungslauf, nicht vom unabhängigen Reviewer.
