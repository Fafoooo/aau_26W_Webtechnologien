# Unabhängiger Abschlussprüfbericht – Übungsblatt 4

## Ergebnis

**Die beiden Befunde aus dem ersten Prüfbericht sind behoben. Im Umfang dieser abschließenden Prüfung wurden keine offenen fachlichen oder funktionalen Defekte festgestellt.** Der Unicodefehler wurde auf der tatsächlich per `file:` geöffneten Produktseite ohne jede Textnormalisierung nachgeprüft. Die Gesamt-Erklärung enthält die vollständigen aktuellen Einzel-Erklärungen und das aktuelle README. Der gemeinsame Runner wurde wirklich ausgeführt: **15 Syntaxprüfungen und 75 bestandene Tests aus drei Testaufrufen**, Exitcode 0.

Diese Folgeprüfung ergänzt die unabhängigen Berichte [Aufgaben 1–3](pruefbericht_1_3.md) und [Aufgaben 4–5](pruefbericht_4_5.md). Die historischen Fehlerbeschreibungen im ersten Bericht bleiben als nachvollziehbarer früherer Prüfstand richtig; sie sind keine Behauptung über den hier geprüften Endstand.

## 1. Unicodekorrektur auf der echten Seite

### Quellcode und bestehender Regressionstest

- `ue4.2/productsC.js` ist vollständig ASCII. Zeile 44 setzt den Minusbutton mit `\u2212`; Zeile 66 verwendet `\u2014` im Warenkorbtext. Damit hängt die korrekte Darstellung dieser Zeichen nicht mehr von der externen Scriptdekodierung ab.
- `tests_1_2.cjs:180–190` navigiert zur echten `productsC.html` und vergleicht anschließend **alle vier vollständigen Zeilentexte**, einschließlich Titel, Stückpreis, Menge, Trennzeichen, Positionssumme und ausschließlich erstem `New Arrival!`.
- Der anschließende Test prüft in Zeile 199 den exakten `textContent` aller vier Minusbuttons. Dazwischen wird nicht auf eine injizierte Fixture gewechselt. Die zusätzlich vorhandenen Kommapreis-Fixtures ersetzen diese echte Datei-Prüfung nicht.

### Zusätzlicher unabhängiger Browserlauf

Ein separater Prüfer außerhalb des Abgabeordners startete **Chromium 148.0.7778.96**, öffnete die ausgelieferte C-Seite direkt und klickte die vier Original-Add-Inputs mit den Mengen 1, 2, 3 und 4. HTTP-/HTTPS-Anfragen waren blockiert. Es wurde weder `addScriptTag` noch eine Ersatzseite verwendet.

Beobachtung:

```text
URL-Schema: file:
document.characterSet: windows-1252
Minusbuttons: ["−","−","−","−"]
```

Das Minus besitzt tatsächlich Codepoint **U+2212**, nicht mehrere Mojibake-Zeichen. Die aus dem DOM ausgelesenen und exakt verglichenen Rohtexte waren:

```text
Sony Alpha IV 2890.00 (1) — Total: 2890.00 New Arrival!
Sony 24-105mm lens 1300.00 (2) — Total: 2600.00
Nicon DX 16-600 900.00 (3) — Total: 2700.00
Tamron 17-24mm 800.00 (4) — Total: 3200.00
```

Jede dieser Zeilen enthielt als einziges Nicht-ASCII-Zeichen genau **U+2014**. Die Assertion verglich direkt `allTextContents()` mit vollständigen Sollstrings; es gab **keine Mojibake-Ersetzung, Unicode-Normalisierung oder andere Bereinigung**.

Auch die aus ganzzahligen Referenzpreisen berechnete Gesamtsumme stimmte. Ein echter Nicon-Minus-Klick änderte dessen Zeile exakt auf `Nicon DX 16-600 900.00 (2) — Total: 1800.00`. Leeren entfernte alle Zeilen, setzte `0.00` und deaktivierte alle Minusbuttons. Keine unbehandelten JavaScript-Fehler; unabhängiger Prüfer mit Exitcode 0.

**Bewertung:** Die ursprüngliche problematische Zeichensatzsituation besteht weiterhin und ist wegen der erhaltenen Vorlage erwartbar. Gerade unter dieser Situation erscheinen die korrigierten Zeichen jetzt richtig. Der Fehler wurde also nicht durch eine andere Testdekodierung verborgen.

## 2. Gesamt-Erklärung und Dokumentationsstand

[erklaerung_blatt04.md](erklaerung_blatt04.md) wurde vollständig gelesen. Ein zusätzlicher maschineller Volltextvergleich bestätigte folgende aktuellen Quelldokumente als jeweils zusammenhängend und vollständig enthalten; lediglich abschließende Leerzeichen/Leerzeilen der Quelldokumente wurden für diesen Vergleich ignoriert:

| Quelldokument | Inhaltliche Zeilen bis zum letzten Text | Beginn in der Gesamtdatei |
| --- | ---: | ---: |
| `erklaerung_1_2.md` | 556 | 5 |
| `erklaerung_3.md` | 208 | 565 |
| `erklaerung_4_5.md` | 723 | 777 |
| `README.md` | 63 | 1506 |

Die Gesamtdatei hat **1568 Zeilen** bis zur letzten Textzeile. Sie ist kein verkürzter Ersatztext und enthält keine ältere, vor der Unicodekorrektur zusammengeführte Fassung.

Fachlicher Abgleich:

- Die Escape-Erklärung in `erklaerung_1_2.md` und in der Gesamtdatei entspricht dem tatsächlichen ASCII-Quellcode. Auch `ue4.2/antwort.md:92` erklärt beide Escapes und den fehlenden HTML-Zeichensatz zutreffend.
- Die Beschreibung der C-Regressionstests berücksichtigt nun vollständige Zeilenvergleiche und das tatsächliche Unicode-Minus auf der echten Datei-Seite.
- Die Erklärungen zu Bindungen/Closures, beiden ursprünglichen `this`-Defekten, Prototypmethoden und einzigem Instanz-Override widersprechen dem korrigierten C-Code und den gelesenen Tests nicht.
- Die Abschnitte zu Aufgaben 4 und 5 wurden erneut gegen beide Produktdateien und ihren Test gelesen. Eigene `print`-Funktionen, geteiltes `printMore`, Prototypketten, `extends`/`super`, Aufzählbarkeit, aktuelle Frameberechnung und Rücksetzung der Laufzeitänderungen werden korrekt unterschieden.
- Zusätzlich maschinell bestätigt: Für jede nichtleere Quellzeile von `ue4.4/image-video.js` (120 Zeilen), `ue4.5/image-video.js` (112 Zeilen) und `tests_4_5.cjs` (224 Zeilen) existiert in der Gesamt-Erklärung ein zugehöriger Tabelleneintrag. Keine außerhalb der Quelldateien liegenden Tabellennummern gefunden. Diese Abdeckungsprüfung ergänzt die fachliche Lektüre, ersetzt sie nicht.
- Der neue Runner wird im README und damit auch im Gesamttext passend erklärt: rekursive Dateisuche, echte Unterprozesse, Fehlerabbruch, Auswertung tatsächlich gemeldeter Erfolgszahlen und JSON-Ausgabe.

## 3. Dateiverweise und private Pfade

- Der zuvor fehlende Verweis aus `ue4.3/antwort.md:95` auf `../erklaerung_blatt04.md` hat jetzt ein vorhandenes, vollständiges Ziel.
- Sämtliche **zehn tatsächlichen lokalen HTML-Verweise** auf Scripts beziehungsweise die D-Demonstration wurden auf vorhandene Ziele geprüft; keine fehlende Zieldatei.
- Auch die in Markdown-Codeformat erwähnten konkreten Datei- und Erklärungspfade wurden geprüft. `ue4.N/antwort.md` ist erkennbar eine Schablone für die vorhandenen fünf Antwortdateien. `shopC.js` kommt ausdrücklich als abgelehnter Alternativname vor und ist kein unerfüllter Dateiverweis.
- Der separat durch den Parent anschließend erstellte KI-Bericht ist vereinbarungsgemäß nicht Gegenstand dieser Folgeprüfung. Seine angekündigte Erstellung wird hier weder als Defekt gewertet noch als bereits geprüfte Fertigstellung bestätigt.
- Vor Anlage dieses Berichts wurden **36 vorhandene Textdateien** der Typen Markdown, HTML, JavaScript, CJS und JSON nach privaten Home-/Benutzer-, Hermes-Installations- und temporären absoluten Pfaden durchsucht: **keine Treffer**. Die Browserabhängigkeiten werden über auflösbaren Paketnamen oder optionale Umgebungsvariablen gewählt.

## 4. Runner: echte Ausführung und Ergebnisdatei

Ausgeführt im Blattordner, mit den für die Testumgebung vorgegebenen Playwright- und Chromium-Umgebungsvariablen:

```sh
node pruefen.cjs
```

Tatsächliche Laufzeit: **Node.js v22.23.3**. Der Runner endete mit Exitcode **0** und meldete:

```text
Syntax: 15 JavaScript files checked
RESULT 32 tests passed (Chromium 148.0.7778.96; real headless browser; external network blocked).
ALL 11 EXERCISE-3 TESTS PASSED
# tests 32
# pass 32
# fail 0
# cancelled 0
# skipped 0
# todo 0
VERIFIED: 75 tests passed across 3 suites; no failed suites.
```

Die anschließend gelesene `testergebnis.json` enthält exakt die drei ausgeführten Aufrufe mit **32**, **11** und **32** bestandenen Tests, `syntax_checked: 15`, `total_passed: 75` und `failed_suites: 0`. Der unabhängige Prüfer verglich zusätzlich die Syntaxanzahl mit den tatsächlich vorhandenen JS-/CJS-Dateien sowie die Gesamtsumme mit den einzelnen Ergebnissen.

Der Runner wurde auch fachlich gelesen: `spawnSync` startet denselben Node-Interpreter, setzt das Blattverzeichnis als Arbeitsverzeichnis und reicht die Umgebung durch. Startfehler und von null abweichende Exitstatus werden nicht als Erfolg übernommen. Erst danach wird ein passendes Erfolgszählmuster verlangt. Der JSON-Nachweis wird nach allen erfolgreichen Prüfungen geschrieben. Die Bezeichnung „drei Suiten“ meint hier die drei gestarteten Testprogramme; die TAP-Ausgabe `# suites 0` der dritten Datei ist kein Widerspruch dazu.

## Grenzen und Änderungen

Die abschließende Prüfung belegt die genannten Korrekturen und den aktuellen erfolgreichen Gesamtlauf, nicht universelle Fehlerfreiheit oder eine Browsermatrix. Für Produktpreise und Bild-/Videomodelle gelten die in den Erklärungen ausdrücklich genannten Eingabe- und Modellgrenzen. Fabios eigene Durcharbeitung wird nicht behauptet.

**Kein Git verwendet. Keine Produkt-, Antwort-, Erklärungs- oder Testdatei verändert.** Im Blattordner wurde ausschließlich dieser Abschlussbericht neu angelegt. Der ausdrücklich verlangte Runnerlauf schrieb seinen vorgesehenen Ergebnisnachweis `testergebnis.json` erneut; der zusätzliche unabhängige Prüfer liegt ausschließlich im aktiven Profil-Scratch und gehört nicht zur Produktabgabe.
