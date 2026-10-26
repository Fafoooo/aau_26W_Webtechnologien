# Unabhängiger Prüfbericht – Blatt 4, Aufgaben 1–3

## Ergebnis

Alle fachlichen Teilaufgaben sind implementiert und beantwortet. **Ein realer Darstellungsfehler in Aufgabe 2(b)** und ein kleiner Dokumentationsmangel wurden gefunden. Kein Eingriff in Produktdateien, keine Git-Befehle.

Grundlage: Original-PDF einschließlich des Codebilds auf Seite 2, Originaldateien unter `Angabe/files`, sämtliche HTML-/JS-Dateien und `antwort.md` in `ue4.1`–`ue4.3` sowie `erklaerung_1_2.md` und `erklaerung_3.md`. Die vorhandenen Tests wurden gelesen und neu ausgeführt, nicht als alleiniger Beleg übernommen.

## Vollständigkeit und fachliche Prüfung

| Teilaufgabe | Unabhängiger Befund |
| --- | --- |
| 1(a), Originalcode | Detaillierte Erklärung vollständig; Originalzeilen stimmen. Closure erhält Zugriff auf die jeweilige `let cp`-Bindung, keine eingefrorene Wertkopie. Bei ausschließlich `var cp` teilen die Listener die letzte Bindung: alle vier Originalbuttons erhöhen Tamron, während das Array vier unterschiedliche Objekte enthält. Global-, Funktions-, Blockscope und lexikalische Suche korrekt erläutert. |
| 1(b)(a–b) | Normale anonyme Funktion und Arrow stehen direkt im jeweiligen `addEventListener`. Getrennte ausführbare Varianten; keine doppelte Registrierung. Ihr unterschiedliches `this` wird korrekt erklärt und hier nicht benötigt. |
| 1(c) | Leeren setzt Daten und Darstellung zurück; wiederholtes Leeren und erneutes Hinzufügen funktionieren. |
| 1(d) | Numerische Sortierung und tatsächliche DOM-Umordnung aufsteigend; Listener bleiben erhalten. `ue4.1/productsA.html` ist byteidentisch zum Original, einschließlich CRLF. Die zusätzliche Arrow-Seite ersetzt die geschützte Datei nicht. |
| 2(a), Erklärung/Reparatur | Beide unabhängigen `this`-Fehler richtig erkannt und behoben: DOM-Listener erhält sonst das `.buy`-Div; strikter normaler `forEach`-Callback ohne `thisArg` hat dagegen `undefined`. Erster Fehler verdeckt zunächst den zweiten. Next-product-Logging einschließlich Umlauf bleibt erhalten. |
| 2(a), Speicherfrage | Vier eigene, unterscheidbare `render`-Funktionsobjekte bei vier Instanzen; keine unbegründete Aussage über vier physisch getrennte Maschinen-/Bytecodekopien. Korrekt. |
| 2(b), Prototype-Version | Datei heißt wie gefordert `productsC.js`. Wiederverwendbare Product-Methoden liegen auf `Product.prototype`; globale Koordination und Listenmethode bleiben sachgerecht außerhalb. Der verlangte eigene Renderer des ersten Produkts ist die explizite Ausnahme. |
| 2(b)(a) | Minusbuttons per JS erzeugt; nur bei positiver Menge aktiviert. Prototypmethode `removeOneFromCart` verhindert Unterlauf. Getrennte Add-/Minusziele vermeiden den Bubbling-Fehler. Daten, Buttons und Rendering bleiben beim Leeren synchron. Sichtbares Minus hat allerdings den unten beschriebenen Encodingfehler. |
| 2(b)(b) | Gemeinsame Methode berechnet Positionssummen; Warenkorb zeigt Stückpreis, Menge, Positionssumme und korrekte Gesamtsumme, auch bei Kommapreisen und Mehrfachmengen. |
| 2(b)(c) | Nur erste Instanz erhält `New Arrival!` als Postfix; übrige teilen den Prototyprenderer. Diskrepanz **Sony A7V** im PDF gegenüber **Sony Alpha IV / `sonyAIV`** im Original ausdrücklich dokumentiert; Originaldaten werden nicht umbenannt. |
| 3(a) | Definition höherer Funktionen, eigenes ausführbares Beispiel, drei Standardbeispiele (`map`, `filter`, `reduce`) und First-class-Funktionen vollständig und korrekt. |
| 3(b) | Closure-Definition und eigenständige, zustandserhaltende Zähler korrekt; getrennte Fabrikaufrufe teilen keinen Zustand. |
| 3(c) | Ausführbare unäre Currying-Kette; Abgrenzung von partieller Anwendung korrekt. |
| 3(d) | Eigene `getEventHandler`-Methode im Konstruktor liefert Arrow; Registrierung ruft Fabrik sofort, Arrow später auf. Lexikalisches Product-`this`, unverändertes Event und späterer Methodenlookup korrekt. Auch der zweite `forEach`-Fehler ist repariert. |
| 3(e) | Mit dem Originalbild abgeglichen, einschließlich unbenutztem Parameter `x` und letztem Aufruf `y(9,33)`. Explizite Logs exakt **20, 21, 21, 16**. Rückgabe von Zahl bzw. Funktion, getrennte `x`-Bindungen und ignoriertes Extraargument korrekt erklärt. |

Produktcode verwendet ausschließlich Plain JavaScript; Playwright ist nur Testwerkzeug. Die Originalzeilentabellen in den Antworten und in `erklaerung_1_2.md` sowie sämtliche angegebenen `shopD.js`-Zeilen in `erklaerung_3.md` passen zum gelesenen Stand; keine veralteten Zeilenbereiche festgestellt.

## Tatsächlich ausgeführte Prüfungen

- `tests_1_2.cjs`: **32 bestanden**, Exitcode 0, Chromium **148.0.7778.96**.
- `tests_3.cjs`: **11 bestanden**, Exitcode 0.
- Zusätzlich eigener, nicht aus den vorhandenen Tests übernommener Prüfer im aktiven Scratch-Verzeichnis: Referenzpreise und Titel aus dem Original-HTML; je **80 deterministische Mischaktionen** auf A, Arrow-A, B, C und D, insgesamt **400**. Nach jedem Schritt Vergleich von Mengen, Warenkorbzeilen und integerbasierter Referenzsumme, bei C zusätzlich aller Minuszustände. Keine unbehandelten JS-Fehler.
- Original-`let`/`var` zusätzlich mit allen vier Buttons experimentell verglichen. Aufgabe 3e gegen eigene Abschrift des Originalbilds ausgeführt; HOF, unabhängige Closures und Currying mit anderen Eingaben geprüft. Bytevergleich auch für D gegen Original B mit alleiniger Scriptnamensänderung.
- Zusätzlich tatsächlich registrierten D-DOM-Listener nach Austausch von `updateProduct` angeklickt: neue Methode erhält richtiges Product-`this` und echtes Click-Event.
- **Wichtig:** Der erste unabhängige Volltextvergleich scheiterte an C beim unten beschriebenen Mojibake. Erst für die anschließende Prüfung der restlichen Logik wurde ausschließlich dieses bereits dokumentierte Trennzeichen normalisiert. Die 400 erfolgreichen Modellaktionen sind deshalb kein Nachweis fehlerfreier Rohtexte in C.

## Konkrete Befunde

### 1. Darstellungsfehler: Unicode-Literale werden auf der echten C-Seite falsch dekodiert

**Stellen:** `ue4.2/productsC.js:44` (Minuszeichen) und `:66` (Gedankenstrich), im Zusammenhang mit `ue4.2/productsC.html:2–14` ohne Zeichensatzangabe.

Beim direkten Öffnen der gelieferten Datei meldet Chromium `document.characterSet === "windows-1252"`. Das externe UTF-8-Script wird entsprechend dekodiert:

- Minusbutton: tatsächlicher `textContent` **`âˆ’`** statt **`−`**.
- Warenkorb nach Nicon-Add: **`Nicon DX 16-600 900.00 (1) â€” Total: 900.00`** statt des in `erklaerung_1_2.md:348,396` beschriebenen Texts.

Die Mengenlogik funktioniert, aber die ausgelieferte Oberfläche enthält sichtbare Zeichenfehler. Die vorhandenen Tests übersehen dies: Minus-Text wird nicht geprüft, Zeilensummen nur per Teilstring; injizierte `addScriptTag`-Fixtures umgehen die externe Scriptdekodierung.

**Korrekturvorschlag für den Parent, nicht umgesetzt:** Unicode im JS als ASCII-Escapes `\u2212` und `\u2014` schreiben. Das bewahrt die HTML-Byte-/Fixturevorgaben. Anschließend auf der tatsächlichen `productsC.html` exakte Button- und Zeilentexte testen.

### 2. Dokumentationsverweis ohne vorhandene Zieldatei

**Stelle:** `ue4.3/antwort.md:95` verweist zusätzlich auf `../erklaerung_blatt04.md`; diese Datei existierte beim Prüfstand nicht. Der ebenfalls genannte Einzeltext `../erklaerung_3.md` existiert. Vor Abschluss Gesamtdatei erzeugen oder Verweis entfernen.

## Grenzen

Funktionale Prüfung in einer realen Chromium-Version, keine Browsermatrix. Preisformat wie in der Aufgabe: ungruppierte Dezimalkommapreise mit höchstens zwei Nachkommastellen. Aufgaben 4 und 5 nicht Gegenstand dieses Berichts.
