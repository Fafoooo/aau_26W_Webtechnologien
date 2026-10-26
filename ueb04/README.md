# Übungsblatt 4 – Web-Technologien

## Start

Alle Produktlösungen verwenden ausschließlich Plain JavaScript und das CSS der Vorlagen. Keine Frameworks, keine Abgabe in Moodle durch den Solver.

- **Aufgabe 1:** `ue4.1/productsA.html` öffnen. Alternative mit Arrow: `ue4.1/arrow.html`.
- **Aufgabe 2a:** `ue4.2/productsB.html` öffnen.
- **Aufgabe 2b:** `ue4.2/productsC.html` öffnen.
- **Aufgabe 3a–c/e:** `ue4.3/index.html` öffnen und Entwicklerkonsole anzeigen; alternativ `node ue4.3/examples.js` und `node ue4.3/console-output.js`.
- **Aufgabe 3d:** `ue4.3/productsD.html` öffnen.
- **Aufgabe 4:** `node ue4.4/image-video.js`.
- **Aufgabe 5:** `node ue4.5/image-video.js`.

Aufgaben 4 und 5 sind eigenständige Node-Konsolenprogramme ohne externe Abhängigkeiten. Ihre Konstruktoren/Klassen und Tests benutzen ausschließlich Standard-JavaScript beziehungsweise Nodes eingebaute Module.

## Antworten und Erklärungen

- Pro Aufgabe steht die vollständige Antwort in `ue4.N/antwort.md` (Englisch entsprechend der Angabe).
- `erklaerung_blatt04.md` vereinigt die ausführliche deutsche Erklärung aller fünf Aufgaben einschließlich Codezeilen, Ursprungsdateien, Testwerkzeugen und Live-Änderungen.
- Die drei Einzel-Erklärungstexte bleiben zum gezielten Nachlesen vorhanden.
- `angabe_blatt04.pdf` und `Angabe/files/` enthalten die unveränderten Aufgabenquellen.
- `ki-bericht_blatt04.pdf` mit LaTeX-Quelle dokumentiert den tatsächlichen KI-Einsatz. Den freien Abschnitt zur eigenen Bearbeitung muss Fabio selbst ausfüllen; er ist keine bereits geleistete Eigenleistung.

Die Angabe nennt den ersten Artikel Sony A7V, das gelieferte HTML dagegen Sony Alpha IV mit ID `sonyAIV`. Die Lösung bewahrt die Vorlage und ergänzt ausschließlich beim ersten Artikel `New Arrival!`.

## Reproduzierbare Tests

Aus diesem Blattordner:

```sh
node pruefen.cjs
```

Voraussetzung: Node und eine als `playwright` auflösbare Entwicklungsinstallation mit installiertem Chromium. Optional ermöglichen `PLAYWRIGHT_MODULE` und `PLAYWRIGHT_CHROMIUM` die Verwendung einer vorhandenen Installation. Installiere Testwerkzeuge getrennt von den Produktordnern, etwa mit `npm install --prefix <test-tools> playwright`, und installiere den Browser über die dortige Playwright-CLI. Dann kann `PLAYWRIGHT_MODULE=<test-tools>/node_modules/playwright` auf dieses Paket zeigen (den Platzhalter durch ein eigenes Verzeichnis ersetzen).

Der Runner prüft zunächst die Syntax aller JS-Dateien und führt dann die drei tatsächlichen Testsuiten aus. Er bricht bei Fehlern ab, addiert nur tatsächlich gemeldete Erfolgsergebnisse und schreibt `testergebnis.json`. Einzelaufrufe:

```sh
node tests_1_2.cjs
node tests_3.cjs
node --test tests_4_5.cjs
```

Die Browserprüfungen öffnen echte Dateien, testen auch die beiden ursprünglichen `this`-Defekte und das `var`-Gegenbeispiel und vergleichen geschützte HTML-Dateien byteweise. Exakte Unicode-Zeichen werden auf der tatsächlich geladenen C-Seite geprüft, nicht nur in injizierten Testfixtures. Zahlen, Ausgaben, Methodenidentität, Vererbung und Laufzeitänderungen werden ausgeführt und überprüft.

Die unabhängigen Prüfberichte sind `pruefbericht_1_3.md` und `pruefbericht_4_5.md`; der erste beschreibt auch einen vor dem Abschluss gefundenen und anschließend behobenen Encodingfehler. Ein weiterer Abschlussbericht bestätigt die Korrekturen.

## Gemeinsamer Test-Runner erklärt

`pruefen.cjs` benutzt ausschließlich eingebaute Node-Module. `assert` macht Fehlschläge hart sichtbar, `fs` liest Verzeichnisse und schreibt den Ergebnisnachweis, `path` baut Pfade, `spawnSync` führt die echten Unterprozesse aus.

`sourceFiles(directory)` liest Verzeichniseinträge samt Typ. Für Unterordner ruft es sich erneut auf, für Dateien behält es nur `.js` und `.cjs`; `flatMap` vereinigt alle Ergebnislisten. Der Runner wird vom Blattverzeichnis aus gestartet und scannt daher ausschließlich diesen Abgabeordner.

`execute(args)` startet denselben Node-Interpreter wie den Runner, setzt das Blattverzeichnis als Arbeitsverzeichnis und gibt die bestehende Umgebung weiter. So erreichen die optionalen Browserpfade auch die Tests. Standardausgabe und Fehlerausgabe werden unverändert weitergeleitet. Ein Startfehler wird geworfen; ein anderer Exitstatus als null lässt die Assertion scheitern. Nur bei Erfolg wird die echte Standardausgabe zurückgegeben.

Die erste Schleife prüft jede gefundene Datei mit `node --check`. Die folgende `suites`-Liste legt pro Suite den tatsächlichen Aufruf und das zu ihrer Ausgabe passende Suchmuster fest. Es werden keine Testresultate im Voraus eingesetzt. Die zweite Schleife führt die Suite aus, verlangt den Erfolgseintrag in ihrer Ausgabe, liest dessen Zahl mit `Number` und speichert den belegten Status.

`summary` sammelt Node-Version, Syntaxprüfanzahl und die ausgeführten Suiten. `reduce` addiert ihre tatsächlich gelesenen Erfolgszahlen. `failed_suites: 0` wird nur erreicht, wenn jeder Unterprozess und jedes Erfolgsmuster gültig war; bei einem vorherigen Fehler endet der Runner bereits mit Fehler. `writeFileSync` schreibt danach den vollständigen JSON-Nachweis, die letzte Logzeile nennt die berechnete Gesamtsumme. Die Ergebnisdatei ist Daten, kein weiteres Programm.

## Vor der Abgabe

Die Programme und Erklärungen selbst nachvollziehen und mindestens eine eigene Änderung ausprobieren. Der Solver bestätigt nicht, dass Fabio die Lösung bereits persönlich geprüft oder vollständig verstanden hat. Der KI-Bericht lässt dafür bewusst Platz offen.
