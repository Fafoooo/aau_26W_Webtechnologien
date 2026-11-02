# Abschlussprüfung — Assignment 5

## Ergebnis

Alle Aufgaben 1(a–d), 2(a–c), 3(a–c), 4 und 5 sind bearbeitet. Die freiwillige Projektüberlegung steht in der README. Es wurde nichts in Moodle abgegeben. Der Code und die Dokumentation wurden durch KI erstellt; ein persönliches Nachvollziehen durch Fabio ist dadurch nicht belegt.

## Tatsächlich ausgeführter Gesamtlauf

- Befehl: `node pruefen.cjs`, mit separat installiertem Playwright/Chromium über die dokumentierten Umgebungsvariablen.
- Node.js: **v22.23.3**.
- Browser: **Chromium 148.0.7778.96**, headless.
- **15 JavaScriptdateien** mit `node --check` erfolgreich geprüft, einschließlich archivierter Vorlagen und Testdateien.
- **12 Testgruppen** für Aufgaben 1–3 bestanden.
- **32 Testgruppen** für Aufgaben 4–5 bestanden.
- Zusammen: **44 bestandene Testgruppen**, keine fehlgeschlagene Suite, Prozess-Exitcode **0**.
- Maschinenlesbare Bestätigung: `testergebnis.json`. Der Runner liest die tatsächlich ausgegebenen Suitezähler und addiert sie; er schreibt keine grünen Ergebnisse nach einem gescheiterten Unterprozess.

## Aufgaben 1–3

- Original-HTML-Kopien und Callback-Haupt-JS bytegleich erhalten. Vorhandene CRLF-Zeilenenden, Leerzeilen und Leerraum der geschützten Originale sind bewusst nicht normalisiert; entsprechende Git-Whitespace-Hinweise sind kein fachlicher Fehler und rechtfertigen keine verbotenen Änderungen.
- In der Promise-Hauptlösung ausschließlich `runTaskPromise` geändert; `delayedCalc` und `handleError` in beiden Rechnungslösungen unverändert.
- Pro Callback-/Promise-Hauptseite jeweils 24 Taskdurchläufe mit 48 geordneten Logeinträgen, beide Abschlussreihenfolgen, unabhängige überlappende A/B-Aufgaben, wiederholte Nutzung und Buttonzustände geprüft.
- Beide relevanten gewöhnlichen Funktionsbindungen unabhängig im Browser reproduziert: DOM-Listener mit dem Input als `this`, separat der gewöhnlich aufgerufene innere Callback mit `window` im nicht-strikten Originalscript. Der erste Fehler verdeckt sonst den zweiten.
- Cancel→End im separaten Experiment: Callbackseite protokolliert `started → cancelled → ended`; Promiseseite nur `started → cancelled`. Im Promiseexperiment wurden tatsächlich `reject` und der spätere wirkungslose `resolve` am selben Promise beobachtet, nicht bloß das Fehlen eines schon entfernten Handlers.
- Originalrechnung auf zehn echten Seitenladungen beobachtet: zuerst die beiden synchronen Rejections, anschließend beide tatsächlich gesehenen Timerreihenfolgen. Ergänzende kontrollierte Zufallsextreme sichern die beiden erlaubten Reihenfolgen getrennt ab.
- Beide fertigen Rechnungen zeigen exakt `5 + 3 = 8`, `8 + 7 = 15`, `15 + 14 = 29`, `29 + 23 = 52`, `52 + 25 = 77`, `rejected`. Die tatsächlichen Eingabepaare reichen bis `(77,1000)`; der abschließende `+1`-Aufruf wird richtigerweise nicht ausgeführt. Jeweils ein behandelter Alert und keine unbehandelten Seitenfehler.

## Aufgaben 4–5

Die Tests laden die echten HTML-/JS-Dateien über einen eigenen lokalen HTTP-Server; XHR und Fetch werden nicht durch erfundene Erfolgsobjekte ersetzt.

Je Variante geprüft:

- Original-JSON byteidentisch; alle Felder und Preisformate korrekt dargestellt.
- Vier Produktkarten, unabhängig funktionierende lokale Knopfzähler.
- Übergebene eigene Zielcontainer und URLs verwendet; erneutes Laden erzeugt keine Duplikate.
- Behandelte HTTP-404/500, kaputtes JSON, falsches Datenformat, ungültige Produktfelder, doppelte IDs, leerer 204-Body und Verbindungsfehler.
- Leeres Array als gültiger Leerzustand behandelt, nicht mit einem Ladefehler verwechselt.
- HTML-artiger Inhalt bleibt Text; daraus entstehen keine Bild-/Scriptknoten.
- Echter unbeantworteter HTTP-Request mit kontrolliert vorgestellter Browseruhr über die Timeoutgrenze: XHR-Timeout bzw. Fetch-Abbruch wird tatsächlich verarbeitet.
- Kaputte URL abgefangen und nach Fehlern wieder erfolgreich geladen; keine unbehandelten JS-Seitenfehler.
- Gerenderte XHR- und Fetch-Erfolgsseiten als Screenshot angesehen: Titel, Beschreibungen, Preise und Knöpfe vollständig und lesbar.

## Unabhängige Prüfung

Zwei separate KI-Prüfinstanzen erhielten die Originalangabe und fertige Artefakte mit read-only-Prüfauftrag. Beide führten die jeweilige vorhandene Browsersuite nochmals mit Exitcode 0 aus. Sie hatten keinen Auftrag, die Dateien zu ändern oder zu veröffentlichen.

- **Prüfung A, Aufgaben 1–3:** Keine fachlichen/funktionalen Blocker oder notwendigen Korrekturen. Änderungsgrenzen, Callback-Bindung, Promise-Cleanup, getrenntes Cancel/End-Experiment, Rechenfolge und deutsche Erklärung bestätigt. Optionaler Ausbau: experimentelle Promise-Datei zusätzlich durch einen eigenen erlaubte-Änderungen-Bytevergleich absichern. Die Datei wurde bei der unabhängigen Prüfung tatsächlich gelesen und ihre Änderungen geprüft.
- **Prüfung B, Aufgaben 4–5 und KI-Bericht:** Keine fachlichen/funktionalen Blocker. Native API-Nutzung, Produktstruktur gegenüber der letzten Vorlage, Fehlerbehandlung und Erklärungen bestätigt. KI-Metadaten, Vorgabe `high` statt behaupteter Messung und Offenlegung der vollständigen KI-Erstellung als ehrlich beurteilt.
- **Erledigter Dokumentationsbefund:** Der hier vorliegende Abschlussbericht fehlte noch zum Zeitpunkt von Prüfung B, obwohl README, Erklärung und KI-Bericht darauf verwiesen. Er wurde daraufhin angelegt. Die Verweise zeigen nun auf eine vorhandene Datei.

## KI-Bericht und Erklärung

- `ki-bericht_blatt05.tex` mit pdfLaTeX erfolgreich gebaut; `ki-bericht_blatt05.pdf` hat **zwei A4-Seiten**.
- Beide Seiten bildlich geprüft, keine abgeschnittenen Inhalte; finales Buildlog ohne `Overfull`-Warnungen. Ein zunächst fehlendes optionales Schriftpaket wurde entfernt und die ursprünglichen Seitenüberläufe durch ein kompaktes, lesbares Layout korrigiert.
- Tatsächliches `hermes status`: Modellkennung `gpt-6.1-sol`, Zugang `ChatGPT or Codex Subscription`; keine zusätzliche Versionsnummer und kein separat ausgewiesener Reasoning-Effort. Der Bericht erfindet diese Werte nicht.
- Der deutsche Gesamtlerntext enthält beide vollständigen geprüften Erklärungsteile. Der Zusammenbau wurde durch Inhaltsassertions abgesichert.
- Die Quelldokumente wurden auf private Installationspfade und Zugangsdatenbegriffe geprüft. Treffer auf `process.env` sind ausschließlich normale Umgebungsvariablen für externe Entwicklungswerkzeuge; keine geheimen Werte sind enthalten.

## Grenzen — keine offenen Teilaufgaben

- Tatsächliche Browserausführung nur in Chromium; nicht Firefox, Safari/WebKit oder eine persönliche GUI-Vorführung.
- Die absichtlich unbehandelten Rejections der Originalseite 3(a) und die isolierten Bindungsfehler sind untersuchte Ausgangsbeispiele, nicht verschwiegenes Fehlverhalten der fertigen Lösungen.
- Explizites programmgesteuertes `XMLHttpRequest.abort()` und Fetch-Abbruch erst während eines schon begonnenen Response-Bodys wurden nicht als separate Laufzeitfälle geprüft. Die implementierten Abbruch-/Fehlerpfade sind im Quellcode überprüft; der normale Netzwerk-Timeout mit realem Request ist getestet.
- Parallelaufrufe für denselben Produktcontainer sind nicht koordiniert; der zuletzt fertig werdende Aufruf bestimmt die Ansicht. Die eigentliche Seite führt genau einen Startup-Request aus.
- Die Produktzähler sind lokale Demonstrationen und setzen sich bei erneutem Laden zurück. Es wird keine persistente Bestellung und kein umfassender Warenkorb behauptet.
- Fabios eigenes Verständnis, Änderungen und persönliche Tests bleiben von ihm selbst durchzuführen und im leeren Abschnitt des KI-Berichts einzutragen.
