# Unabhängiger Prüfbericht – Blatt 4, Aufgaben 4 und 5

**Ergebnis:** Im geprüften Umfang keine konkreten fachlichen oder funktionalen Fehler gefunden. Aufgaben 4a–f und 5 sind abgedeckt; englische Antworten und deutsche Zeilenerklärung stimmen mit dem ausgeführten Code überein. Die Bewertung beruht auf eigener Herleitung, vollständiger Quellenlektüre und zusätzlichen Prüfungen, nicht allein auf den vorhandenen Tests.

## Quellen und Zeilenprüfung

- Maßgeblich: `angabe_blatt04.pdf`, Seite 3, Aufgaben 4a–f und 5; zusätzlich Seitenbild mit der PDF abgeglichen. Die Vorgabe „plain JavaScript“, ohne zusätzliche Bibliotheken/Frameworks, steht auf Seite 1.
- Vollständig geprüft: `ue4.4/image-video.js` (Z. 1–120), `ue4.5/image-video.js` (Z. 1–112), beide `antwort.md`, `erklaerung_4_5.md` und `tests_4_5.cjs` (Z. 1–224).
- Die deutschen Tabellen wurden zeilenweise mit dem tatsächlichen Code verglichen. Zusätzlich maschinell bestätigt: Jede nichtleere Zeile beider Produktdateien und des Tests besitzt einen Erklärtabelleneintrag; keine veralteten Zeilenverweise in diesen Tabellen. Die englischen Antworten sind fachlich verständlich und beantworten die jeweiligen Teilfragen ausdrücklich.

## Abdeckung und fachliche Befunde

| Anforderung | Befund |
| --- | --- |
| 4a: Datenobjekt, `computeSize`, gespeicherte Werte, Ausgabe | Erfüllt, Prototypfassung Z. 3–12 und 85–89. Zitiertes Datenliteral plus nachträgliche Funktionszuweisung vermeidet den Fehler, Funktionen für gültiges JSON zu halten. |
| 4b: Konstruktor berechnet sofort, eigene `print`-Funktion, Schleife, mehrere Bilder | Erfüllt, Z. 15–26 und 90–99. `for...in` liest Namen und tatsächliche Werte; keine feste Feldliste. |
| 4c: geteiltes `printMore`, vollständige Printausgabe und Orientierung | Erfüllt, Z. 29–35. Delegiert an die aktuelle `this.print`-Funktion. Breiten-/Höhenvergleich entspricht bei positiven Abmessungen dem Seitenverhältnis; `square` ist ein sinnvoller Zusatzfall. |
| 4d: Unterschied und echte Laufzeitzuweisung | Erfüllt, Z. 55–83 und englische Antwort Abschnitt (d). Eigene `print`-Funktionen sind verschieden, `printMore` wird geteilt. Instanzersetzung, Prototypersetzung, Überschattung, `delete` und Wiederherstellung werden tatsächlich ausgeführt. |
| 4e: Video initialisiert Image, erbt Methoden, `totalFrames`, mehrere Beispiele | Erfüllt, Z. 38–52 und 100–110. `Image.call(this, ...)` initialisiert dasselbe Video; erst `Object.create(Image.prototype)` stellt die Methodenvererbung her. `constructor` ist korrekt, nicht aufzählbar wiederhergestellt. |
| 4f: `video.printMore()` | Erfüllt: Aufruf und Ausgabe für alle drei Videos; Empfänger bleibt das Video, einschließlich `duration` und `framerate`. |
| 5: entsprechende Klassenfunktionalität | Erfüllt, Klassenfassung Z. 4–43 und 76–106. `extends`, `super` vor Zugriff auf `this`, geteilte Klassenmethoden und geerbter Aufruf sind korrekt. Das bewusst eigene `print` im Konstruktor bewahrt den Unterschied aus 4b/d; dies ist begründet dokumentiert. |

**Identitäten und Aufzählbarkeit:** Beide Instanzketten sind `video → Video.prototype → Image.prototype → Object.prototype → null`. Videos erfüllen beide `instanceof`-Prüfungen. Anders als die manuelle Konstruktorfassung vererbt `extends` zusätzlich auf Konstruktorseite (`Object.getPrototypeOf(Video) === Image`). Klassensyntax beseitigt Prototypen nicht. Durch Zuweisung angelegte Prototypmethoden aus Aufgabe 4 sind aufzählbar; normale Klassenmethoden aus Aufgabe 5 nicht. Deshalb unterscheiden sich die gedruckten Methodeneinträge, nicht die Daten. Das wird in beiden englischen Antworten und der deutschen Erklärung richtig erläutert. Eine Neuzuweisung der vorhandenen Klassenmethodenproperty erhält deren Aufzählbarkeitsflag.

**Rechnung:** Unabhängig mit ganzzahliger `BigInt`-Bitrechnung und anschließender Byteumrechnung nachgeprüft: `pixels = width × height`, `rawsize = pixels × bitdepth / 8`. Beispiele: 640 × 480 × 24 Bit ergeben 307200 Pixel und 921600 Bytes; 1920 × 1080 × 24 Bit ergeben 2073600 Pixel und 6220800 Bytes; 720 × 1280 × 24 Bit ergeben 921600 Pixel und 2764800 Bytes. Auch die übrigen Tabellenwerte stimmen. Die Videos liefern 300, 60 und 0 Frames aus Dauer × Framerate. `rawsize` bleibt die Größe eines Frames, nicht des Gesamtvideos.

## Tatsächlich ausgeführte Prüfung

Arbeitsverzeichnis für die Produktbefehle: Blattordner `ueb04`; Laufzeit: **Node.js v22.23.3**.

```sh
node ue4.4/image-video.js
node ue4.5/image-video.js
node --test tests_4_5.cjs
```

- Beide Programme erfolgreich ausgeführt; die gemeinsame Shellausführung endete mit Status 0. Tatsächliche Ausgabe enthält die obigen Zahlen, alle drei Orientierungen sowie die individuellen und gemeinsamen Ersatzmethoden. Aufgabe 4 druckt zusätzlich die aufzählbaren Prototypmethoden; Aufgabe 5 erwartungsgemäß nicht.
- Vorhandene Tests erneut ausgeführt: **32 bestanden, 0 fehlgeschlagen, 0 abgebrochen, 0 übersprungen**. Die Assertions und ihre Grenzen wurden selbst gelesen; die echten CLI-Ausgaben werden auch durch gestartete Kindprozesse geprüft.
- Ergänzend separates Prüfskript im aktiven Scratch-Verzeichnis ausgeführt: **12 unabhängige Prüfblöcke bestanden**, Exitstatus 0. Geprüft wurden weitere Dimensionen/Farbtiefen mit `BigInt`-Sollrechnung, explizit vorgegebene vollständige Property-/Wert-Ausgabe statt einer zweiten `for...in`-Sollschleife, Ausschluss versteckter/Symbolproperties, Funktionsidentitäten, vollständige Prototypketten, Konstruktorvererbung, Vorrang eigener Methoden, unveränderte Deskriptorflags und exakte Wiederherstellung nach der Demo. Hinzu kamen Zahlenabgleich und Erklärtabellenabdeckung.

## Grenzen / offene Punkte

Keine Korrektur innerhalb der Aufgaben 4 und 5 erforderlich. Die dokumentierten Modellgrenzen sind vertretbar: gültige numerische Eingaben, unkomprimierte Pixeldaten ohne Header/Padding/Kompression, keine zusätzliche Rundung. Bruchbytes und nichtintegrale Frameprodukte sind mathematische Ergebnisse dieses Modells, keine reale Speicherallokation beziehungsweise diskrete Videoquantisierung. Die Angabe verlangt hier keine solche Erweiterung. Der Demonstrationshelfer ist ausdrücklich nur für frische, verschiedene Instanzen ohne eigene `printMore`-Property ausgelegt.

Kein Browserlauf erforderlich oder als durchgeführt behauptet; geprüft wurden die geforderten Konsolenprogramme. Der separat erwähnte KI-Bericht auf Blattebene gehört nicht zum geprüften Umfang. Im Blattordner wurde ausschließlich dieser Prüfbericht neu angelegt; Produkt-, Antwort-, Erklärungs- und Testdateien blieben unverändert. Kein Git verwendet.
