# Übungsblatt 2 – vollständige Erklärung

Diese Datei führt die deutschen Schritt-für-Schritt-Erklärungen zu allen Aufgaben und Dateien zusammen. Die ausführlichen Teiltexte bleiben zusätzlich separat erhalten, damit vorhandene Quelltextverweise funktionieren. Die Antwortdateien sind wie die Angabe auf Englisch.

**Offen:** Aufgabe 1 benötigt das selbst absolvierte Moodle-Quiz und einen echten Screenshot der Punkte. Es wurde kein Quiz bearbeitet und nichts in Moodle abgegeben. Die Aufgaben 2–6 sind lokal implementiert und im echten Browser getestet. Der KI-Bericht ersetzt weder diesen Screenshot noch Fabios eigenes vollständiges Nachvollziehen.

Reihenfolge: Aufgaben 1/3 und gemeinsame Dateien → Aufgaben 2/5 → Aufgaben 4/6. Die Kopfzeilen in den Teiltexten nennen die jeweiligen Dateien und Zeilenblöcke.

# Erklärung zu Aufgabe 1 und 3

## Aufgabe 1: Warum hier kein Programm und kein Screenshot liegt

`ue2.1/antwort.md` grenzt den offenen Teil ab: Gefordert ist ein tatsächlich absolviertes Moodle-Quiz mit Screenshot der echten Punkte. Eine lokale Nachbildung oder eine erfundene Punktzahl wäre kein Nachweis. Es wurde nichts in Moodle beantwortet oder abgegeben. Fabio muss diesen Teil selbst durchführen. Der Link wurde aus den aktuellen Kursinhalten gelesen. Dass das Quiz dort unter Einheit 3 steht, wird im Antworttext genannt, statt den falschen Eindruck eines zweiten Quiz unter Einheit 2 zu erwecken.

## Aufgabe 3: Dateien und Start

- `Angabe/files/ex3.html` bleibt unverändert als Original erhalten.
- `ue2.3/ex3.html` ist die Kopie für die Lösung. Im Kopf wurde nur ein Verweis auf `dom.js` mit `defer` ergänzt. `defer` bedeutet: Die externe Datei wird geladen, aber erst ausgeführt, wenn das HTML fertig geparst wurde. Dadurch existieren die drei Links bereits.
- `ue2.3/dom.js` enthält die vorgegebenen Konsolenaufrufe und die beiden Zeilen aus Teilfrage 3.
- `ue2.3/dom-baum.txt` ist eine vollständige textuelle Baumdarstellung des unveränderten Originaldokuments.
- `ue2.3/dom-skizze.svg` stellt denselben Baum als Grafik dar. Öffnen im Browser ist ausreichend.
- `ue2.3/browser-ergebnis.json` speichert die tatsächlich gemessenen Konsolenmeldungen und vergleichbare Werte, keine geschätzte Ausgabe.
- `ue2.3/antwort.md` beantwortet jede der 16 Ausgabezeilen und die Wirkung von `removeAttribute` auf Englisch, wie die Angabe.

### Das DOM-Modell

DOM heißt Document Object Model. Der Browser macht aus HTML einen Baum von Objekten. Ein Element wie `<a>` ist ein Knoten. Auch Text zwischen Tags ist ein eigener Knoten; das betrifft Leerzeichen und Zeilenumbrüche. Attribute wie `href` gehören zum Element, stehen aber **nicht** in dessen `childNodes`.

Die Skizze enthält deswegen mehr als drei Links und zwei Hauptcontainer: Sie zeigt zum Beispiel die Textknoten `BeforeParent` und `AfterParent` im Body sowie den Leerraum zwischen den Tags. Die Einrückung zeigt, wer wessen Kind ist. Beim Nachzeichnen zuerst `#document`, dann Doctype und `html`, darunter `head` und `body` anlegen und anschließend die Quelltextreihenfolge abgehen. Doctype ist kein Element innerhalb von `html`.

### `dom.js` Schritt für Schritt

1. Der Kommentar kennzeichnet die KI-Unterstützung und verweist auf diese Erklärung.
2. `getElementsByTagName("a")` liefert eine live aktualisierte Sammlung aller Anchor-Elemente in Dokumentreihenfolge. `[1]` wählt das zweite. Die Zählung beginnt mit 0; das ist eine häufige Verwechslung.
3. `link.attributes["href"]` greift in die Attributsammlung. `nodeValue` liest den geschriebenen String des Attributknotens. Hier steht kein abschließender Schrägstrich.
4. `getAttributeNode("href")` beschafft denselben Attributknoten mit einer Methode statt der benannten Eigenschaft. Das Ergebnis ist gleich.
5. `link.href` ist dagegen eine URL-Eigenschaft. Der Browser löst relative URLs auf und serialisiert die Adresse. Hier ergänzt die Serialisierung den Root-Pfad `/`. Deshalb muss diese Ausgabe nicht Zeichen für Zeichen dem Attributwert entsprechen.
6. `firstChild` liefert das erste Kind, nicht automatisch das erste **Elementkind**. Hier ist es tatsächlich `<p>Text</p>`, weil im Original zwischen `<a …>` und `<p>` kein Leerzeichen steht. Würde Fabio an dieser Stelle einen Zeilenumbruch einfügen, wäre das erste Kind ein Textknoten; die folgenden Aussagen müssten entsprechend angepasst werden.
7. `attributes[0].nodeType` liefert `2`. Die Zahl bezeichnet einen Attributknoten, nicht das erste Element im Dokument.
8. `firstChild.nodeType` liefert `1`, also einen Elementknoten. Der Text `Text` darin wäre ein Kind des Paragraphen mit Typ `3`.
9. `parentNode.nodeName` ist `BODY`, weil der Link unmittelbar im Body steht. `nodeName` von HTML-Elementen ist hier großgeschrieben.
10. `lastChild` ist der abschließende Textknoten im Link. Sein `parentNode` ist derselbe Link; dessen Name ist `A`. Der Aufruf geht einen Schritt nach unten und wieder nach oben.
11. `attributes.length` zählt die Attribute des Links, hier `href` und `target`, also zwei. Es zählt weder Kinder noch die Anzahl der Links.
12. `innerHTML` serialisiert nur den Inhalt des Links inklusive Paragraphen- und Bildtag. Es enthält auch die im HTML geschriebenen Zeilenumbrüche.
13. `outerHTML` serialisiert zusätzlich den umgebenden `<a>`-Tag und dessen Attribute.
14. `innerText` orientiert sich an der Darstellung. Der Paragraph ist ein Blockelement und verursacht Umbrüche; anderer Quelltextleerraum wird zusammengezogen. Die exakte gemessene Zeichenfolge ist im Antworttext als JSON-String angegeben. Browserlayout und Bildverfügbarkeit können einzelne Abstände beeinflussen.
15. Beim **Lesen** ist `outerText` hier gleich `innerText`. Beim **Schreiben** wäre es ein anderer Eingriff: `innerText = …` ersetzt Kinder, `outerText = …` ersetzt das ganze Linkelement. Im Auftrag wird nur gelesen.
16. `textContent` fügt hingegen die Textknoten ohne Layoutberechnung aneinander. Deswegen bleiben Einrückungen erhalten. Das `alt`-Attribut eines Bildes ist kein Textkind und wird dabei nicht angehängt.
17. `console.log(link)` protokolliert das Objekt selbst. DevTools kann es als Element aufklappbar anzeigen. Der Testtransport liefert dafür die Beschreibung `JSHandle@node`; das ist kein Text, der als Linkinhalt im HTML steht. Für einen stabilen Vergleich speichert der Test zusätzlich `outerHTML`.
18. `link.nodeValue` ist `null`, weil ein Elementknoten seinen Inhalt nicht über `nodeValue` speichert. Textknoten und Attributknoten verhalten sich anders.
19. Die letzte Zuweisung wählt mit `.item(2)` den **dritten** Link. `var` darf denselben Namen erneut deklarieren; die Variable verweist danach auf ein anderes Objekt.
20. `removeAttribute("target")` entfernt nur die Zielkontext-Angabe. `href`, Bild und die beiden anderen Links ändern sich nicht. Ohne `base target` öffnet ein normaler Klick diesen Link im aktuellen Kontext. Kein Klick oder Seitenwechsel wird im Test ausgelöst.

### `tests_3.cjs`: Wie die Messung entsteht

- Die ersten `require`-Aufrufe laden Node-Standardmodule: strikte Zusicherungen, Datei-/Pfadfunktionen und URL-Konvertierung. Playwright ist ausschließlich ein Testwerkzeug; keine Abgabeseite bindet es ein.
- Playwright wird entweder aus `PLAYWRIGHT_MODULE` oder aus dem regulär installierten Paket geladen. Der Browser kann optional über `PLAYWRIGHT_CHROMIUM` gewählt werden. Es sind keine privaten Installationspfade im Test festgeschrieben.
- `main()` startet einen echten headless Chromium. `try/finally` schließt ihn auch dann, wenn ein Test fehlschlägt.
- `page.route` blockiert fremde HTTPS-Bildanfragen. Damit scheitert die DOM-Prüfung nicht an der Erreichbarkeit eines Flaggenhosters. Das lokale HTML wird dadurch nicht verändert. Diese Testbedingung steht auch in den Ergebnissen.
- Die Listener für `pageerror` und `console` sammeln JavaScriptfehler und die 16 tatsächlichen `console.log`-Meldungen.
- `page.goto` öffnet die Lösung über eine `file://`-URL. `pathToFileURL` behandelt dabei Leerzeichen und Sonderzeichen richtig.
- `page.evaluate` liest die Eigenschaften innerhalb der Browserseite. DOM-Objekte werden für die gespeicherte Liste durch ihre HTML-Darstellung ersetzt; Zahlen und `null` bleiben echte Werte.
- `assert.equal` und `assert.deepEqual` vergleichen mit den erwarteten Knotenarten, URLs, Attributen und der Zahl der Protokollaufrufe. Ein falscher Wert beendet den Lauf mit Fehlerstatus.
- Das JSON speichert echte Beobachtungen einschließlich Chromium-Version. Es enthält keine Benutzerdaten oder behauptete Quizpunkte.
- Anschließend wird **das Original** geöffnet. Eine rekursive Funktion besucht den Knoten und danach jedes Kind in Quelltextreihenfolge. Rekursion bedeutet, dieselbe Funktion für die Teilbäume aufzurufen.
- Für einen Textknoten zeigt `JSON.stringify` unsichtbare Umbrüche als `\n`. Für Elemente werden die Attribute dazugeschrieben. So bleibt der Baum nachprüfbar.
- Die Textdatei verwendet je Ebene zwei Leerzeichen. In der SVG-Grafik wird dieselbe Tiefe als horizontaler Abstand umgesetzt. Die y-Position nimmt mit jeder Zeile zu.
- Die SVG-Escapefunktion ersetzt `&`, `<` und `>`, damit HTML-Text innerhalb der Grafik nicht als SVG-Markup interpretiert wird.
- `main().catch` meldet einen Fehler und setzt Exitstatus 1. Ein grüner Lauf ist damit nicht bloß ein beliebiger Konsolentext, sondern setzt bestandene Zusicherungen voraus.

### Änderungen zum Üben

- Füge vor dem `<p>` im zweiten Link Leerraum ein und prüfe `firstChild` und `nodeType` erneut. Ersetze danach testweise `firstChild` durch `firstElementChild` und erkläre den Unterschied.
- Ändere das zweite `href` zu einer relativen Adresse und vergleiche Attributwert mit `.href`.
- Entferne testweise das dritte `target` schon im HTML. `removeAttribute` bleibt dann ohne zusätzlichen Effekt und wirft keinen Fehler.
- Formatiere das HTML anders und vergleiche `innerText` mit `textContent`. Beachte, dass nicht jeder Umbruch im Quelltext einen sichtbaren Umbruch erzeugt.

## Gemeinsame Begleitdateien

`README.md` enthält Startanweisungen und den offenen Quiz-Nachweis. `ki-bericht_blatt02.tex` ist die schlichte LaTeX-Quelle des KI-Berichts; `ki-bericht_blatt02.pdf` ist daraus gebaut. Der leere Abschnitt zur eigenen Bearbeitung darf erst nach Fabios tatsächlicher Durchsicht ausgefüllt werden. Der Bericht behauptet keine persönliche Eigenleistung. Die Original-PDF und Originalmaterialien dokumentieren, was gelöst wurde. Die großen JPGs sind übernommene Vorlagenbilder, keine neu erzeugten Aufnahmen.


---

# Übungsblatt 2 – Erklärung zu Aufgabe 2 und Aufgabe 5

Die abgaberelevanten Programme und kurzen Antworttexte stehen in `ue2.2/` und `ue2.5/`. Diese Datei erklärt sie auf Deutsch. Die Zeilennummern beziehen sich auf die mitgelieferten Quelldateien, nicht auf die Markdown-Darstellung. Es werden nur die beauftragten Aufgaben 2 und 5 behandelt.

## 1. Dateien und Start

| Datei | Zweck |
|---|---|
| `ue2.2/index.html` | Leere HTML-Seite, die das Zahlenratespiel lädt |
| `ue2.2/game.js` | Spielschleife, eine Spielrunde und Eingabeprüfung |
| `ue2.2/antwort.md` | Kurzer englischer Antworttext zu Entscheidungen und Verhalten |
| `ue2.5/ex5.html` | Byteidentische Kopie der bereitgestellten Seite |
| `ue2.5/ex5.js` | Originalcode als unverändertes Byte-Präfix plus zusätzlicher Listener |
| `ue2.5/antwort.md` | Englische Antworten auf die vier Teilfragen, inklusive gemessener Ausgabe |
| `tests_2_5.cjs` | Reproduzierbare Node- und echte Browserprüfungen beider Aufgaben |

Zum manuellen Ausprobieren die jeweilige HTML-Datei im Browser öffnen. Beim Spiel erscheinen Dialoge. Für Aufgabe 5 die Entwicklerkonsole öffnen und den Button anklicken. Ohne Entwicklerkonsole ist dort keine zusätzliche sichtbare Ausgabe zu erwarten.

Automatische Prüfung vom Repository-Hauptverzeichnis aus:

```sh
node ueb02/tests_2_5.cjs
```

Auch ein Aufruf mit dem absoluten Pfad funktioniert unabhängig vom Arbeitsverzeichnis. Der Test verwendet `__dirname`, um seine Nachbardateien zu finden. Die Produktdateien benötigen keine Bibliotheken und keinen Webserver. Nur der Testtreiber benötigt Node und Playwright.

## 2. Aufgabe 2: HTML und Spielstart

### `ue2.2/index.html`, Zeilen 1–9

- Zeile 1 aktiviert mit `<!DOCTYPE html>` den Standards-Modus des Browsers.
- Zeile 2 legt mit `lang="en"` die Sprache der Benutzertexte fest.
- Zeilen 3–7 bilden den Kopfbereich. `charset="UTF-8"` legt die Zeichenkodierung fest; der Titel erscheint im Browsertab.
- Zeile 6 lädt **eine externe** Datei: `<script src="game.js" defer></script>`. Relativ zur HTML-Datei liegt `game.js` im selben Verzeichnis.
- `defer` lässt den Browser die externe klassische Skriptdatei laden, ohne das HTML-Parsing dafür anzuhalten. Die Ausführung erfolgt nach Abschluss des Parsens und vor `DOMContentLoaded`. Das ist für diese Dialog-Aufgabe nicht zwingend nötig, erfüllt aber die gewünschte Einbettung im Kopf.
- Zeile 8 enthält `<body></body>`: Es gibt keine Überschrift, kein Formular und kein eingebettetes Skript im Body. Die gesamte Interaktion geschieht über Dialoge.

**Prüffalle:** Der HTML-Parser kann Zeilenumbrüche hinter `</body>` als Leerraum in den DOM-Body übernehmen. Deshalb prüft der Browsertest `innerHTML.trim() === ''`, nicht die Abwesenheit jedes einzelnen Leerraumzeichens. Erlaubt wird damit nur Leerraum, kein sichtbarer Inhalt und kein Element.

## 3. Aufgabe 2: Hauptprogramm in `game.js`

### Zeilen 1–3: Feste Versuchszahl, veränderbare Spielentscheidung

`const MAX_ATTEMPTS = 3` definiert die Versuchszahl einmal. Eine erneute Zuweisung an diese Bindung ist nicht erlaubt. Der Name in Großbuchstaben macht deutlich, dass dies eine feste Konfiguration ist.

`let keepPlaying = true` startet mit der Entscheidung, mindestens eine Runde zu spielen. Die Entscheidung muss nach jeder Runde auf den Rückgabewert von `confirm()` gesetzt werden können.

Die Angabe fordert sprachlich eine Konstante auch für diese Entscheidung. Das widerspricht der später verlangten Änderung nach jeder Runde: `const keepPlaying = true` mit anschließender Zuweisung würde einen `TypeError` auslösen. Deshalb ist nur das Versuchslimit `const`; die tatsächlich veränderbare Entscheidung ist `let`. Der Kommentar in Zeile 2 und der englische Antworttext legen diese bewusste Auslegung offen. Es wird kein Objekt als künstlich veränderbarer `const`-Behälter eingeführt.

### Zeilen 5–9: Mehrere Runden

`while (keepPlaying)` prüft vor jeder Runde den Wahrheitswert. Bei `true` läuft der Schleifenrumpf; bei `false` endet die Schleife.

Zeile 6 erstellt pro Runde einen neuen lokalen Wert `randomNumber`. `Math.random()` liefert einen Wert ab 0 und unter 1. Multiplizieren mit 10, Abrunden mit `Math.floor()` und anschließendes Addieren von 1 erzeugt eine ganze Zahl zwischen 1 und 10 einschließlich. Die Tests erzwingen unter anderem den Zufallswert `0` für Geheimzahl `1` und `0.9999999999999999` für Geheimzahl `10`.

`randomNumber` ist mit `const` deklariert, weil sich die Geheimzahl **innerhalb derselben Runde** nicht ändern soll. Beim nächsten Schleifendurchlauf entsteht eine neue Bindung. Die Angabe verlangt eine Variable mit diesem Namen; `const` erfüllt dies als nicht neu zuweisbare Bindung.

Zeile 7 übergibt die Geheimzahl an `playNumberGame`. Die Funktion erledigt eine vollständige Runde. Ihr Rückgabewert beschreibt Sieg oder Niederlage; das Hauptprogramm muss ihn nicht auswerten, weil beide Fälle anschließend dieselbe Wiederholungsfrage verlangen.

Zeile 8 zeigt `confirm(...)`. Im Browser liefern Bestätigen und Abbrechen hier die booleschen Werte `true` bzw. `false`. Dieser Wert wird `keepPlaying` zugewiesen. Abbrechen dieser **Wiederholungsfrage** beendet weitere Runden; Abbrechen eines Eingabe-Prompts hat dagegen die weiter unten erklärte Bedeutung.

### Zeile 11: Abschluss

Die Dankesnachricht steht **hinter** der Schleife. Deshalb erscheint sie genau einmal, nachdem die Wiederholungsfrage verneint wurde, nicht nach jeder Runde.

### Warum die Funktionen erst unterhalb des Hauptprogramms stehen dürfen

`playNumberGame` und `getUserInput` sind Funktionsdeklarationen. Diese werden bereits beim Einrichten des Skriptkontexts verfügbar gemacht, bevor die einzelnen Anweisungen ausgeführt werden. Daher kann Zeile 7 eine weiter unten deklarierte Funktion aufrufen. Das wäre bei einer erst später initialisierten `const`-Variablen mit einem Funktionsausdruck nicht ohne Weiteres möglich.

## 4. Aufgabe 2: Eine Runde mit `playNumberGame`

### Zeilen 13–18: Parameter, Verlauf und Versuche

`secretNumber` ist ein Parameter: Beim Aufruf erhält er den aktuellen Wert von `randomNumber`.

`const guesses = []` erstellt für **jeden Funktionsaufruf** ein neues Array. Dadurch beginnt jede Runde ohne alte Tipps. `const` verhindert hier die Neuzuweisung von `guesses`, nicht Änderungen am Arrayinhalt. `guesses.push(...)` ist deshalb zulässig.

Die `for`-Schleife in Zeile 16 besteht aus drei Teilen:

1. `let attempt = 1`: Der erste Versuch erhält die Nummer 1.
2. `attempt <= MAX_ATTEMPTS`: Ein Durchlauf ist nur bis zur vorgegebenen Versuchszahl erlaubt.
3. `attempt++`: Nach jedem regulär beendeten Durchlauf wird weitergezählt.

Zeile 17 fordert die Eingabe über die separate Funktion an. Ihr Rückgabewert ist entweder eine gültige Zahl oder eine Fehlermeldung als String. Zeile 18 hängt den Wert **vor jeder Fallunterscheidung** an den Verlauf an. So werden nicht nur gültige Tipps, sondern auch Fehlermeldungen gespeichert. Ungültige Eingaben überspringen das Weiterzählen nicht und verbrauchen daher ebenfalls einen Versuch.

Gespeichert werden entsprechend der Angabe die Rückgabewerte von `getUserInput`, nicht zusätzlich die unverarbeiteten Prompt-Strings. Beispielsweise wird aus `" 7 "` die Zahl `7`, aus `"oops"` der vorgegebene Fehlertext.

### Zeilen 20–24: Fehler oder Treffer

`typeof guess !== "number"` erkennt den Fehlertext, weil dieser ein String ist. `getUserInput` lässt `NaN` und Zahlen außerhalb des Bereichs nicht als Zahl zurückkommen. Das ist wichtig: In JavaScript hat sogar `NaN` den Typ `number`; ein bloßer Typcheck wäre ohne die vorgeschaltete Validierung unzureichend.

Bei einer Fehlermeldung wird genau dieser String mit `alert(guess)` angezeigt. Es wird kein Zahlenvergleich mit dem Fehlertext ausgeführt.

`guess === secretNumber` prüft bei einer Zahl die strikte Gleichheit. Ein Treffer zeigt die bisherige Versuchszahl an und gibt `true` zurück. `return` beendet die **ganze Funktion**, nicht bloß den aktuellen Schleifendurchlauf. Deshalb kommt nach einem Treffer weder ein weiterer Prompt noch eine Niederlagenmeldung.

### Zeilen 25–30: Zu großer oder zu kleiner Tipp und Verlauf

In diesem Zweig ist der Wert gültig und nicht gleich der Geheimzahl. Daher reichen die beiden verbleibenden Möglichkeiten:

```js
const direction = guess > secretNumber ? "high" : "low";
```

Der bedingte Operator `Bedingung ? WertBeiTrue : WertBeiFalse` liefert bei einem zu großen Tipp `"high"`, sonst `"low"`. Zeile 27 gibt Richtung und Anzahl der bereits verwendeten Versuche aus. Auch frühere ungültige Eingaben sind in dieser Versuchszahl enthalten.

Die Zeichenketten in Backticks sind Template-Literale. `${...}` setzt den jeweiligen Ausdruck in den Text ein. In Zeile 28 wird das Array zu Text umgewandelt; seine Einträge erscheinen kommasepariert. Der Verlauf enthält den gerade eingegebenen Tipp bereits, weil `push` vorher ausgeführt wurde. Beispielsweise prüft der Test nach einem ungültigen Tipp und der Zahl `2` genau:

```text
Previous guesses: Invalid input. Please enter a number between 1 and 10.,2
```

Das Komma hinter dem abschließenden Punkt gehört zur Arraydarstellung. Aufeinanderfolgende Fehlertexte werden ebenfalls beide gespeichert und später ausgegeben. Bei ungültiger Eingabe selbst verlangt die Angabe nur den Fehlerdialog; die Verlaufsausgabe erfolgt im Zweig für falsche numerische Tipps.

### Zeilen 32–34: Niederlage

Wenn die Schleife ohne vorherigen Treffer beendet wurde, sind alle Versuche aufgebraucht. Dann wird die Geheimzahl genannt und `false` zurückgegeben. Auch drei ungültige Eingaben führen hierher. Die Wiederholungsfrage gehört nicht in diese Funktion; sie bleibt für Sieg und Niederlage gemeinsam im Hauptprogramm.

## 5. Aufgabe 2: `getUserInput` und Grenzfälle

### Zeilen 36–39: Dialog und Umwandlung

`prompt(...)` liefert bei einer bestätigten Eingabe einen String und bei Abbrechen `null`. Die unverarbeitete Antwort steht in `input`. `Number(input)` wandelt sie in einen Zahlenwert um.

Die gesamte Eingabe und Umwandlung liegen im `try`-Block. Ein `try`-Block ist der Bereich, in dem ein geworfener Fehler vom zugehörigen `catch` behandelt wird.

### Zeilen 41–45: Bereich prüfen oder Zahl zurückgeben

Die mit `||` verbundenen Bedingungen bedeuten „mindestens eine Bedingung trifft zu“:

- `Number.isNaN(guess)`: keine gültig umgewandelte Zahl;
- `guess < 1`: unterhalb des erlaubten Bereichs;
- `guess > 10`: oberhalb des erlaubten Bereichs.

Bei einem ungültigen Wert erstellt `new Error(...)` ein Fehlerobjekt und `throw` löst es aus. Die Meldung ist **wörtlich** die geforderte englische Meldung. Danach wird `return guess` nicht ausgeführt. Wenn alle Prüfungen unauffällig bleiben, wird die Zahl zurückgegeben.

Es gibt absichtlich keine zusätzliche Ganzzahligkeitsprüfung. Die Angabe verlangt nur für die zufällig erzeugte Geheimzahl eine ganze Zahl. Für Eingaben nennt sie ausschließlich NaN und die Bereichsgrenzen. Eine Eingabe wie `4.5` ist deshalb gültig, kann aber eine ganzzahlige Geheimzahl nicht exakt treffen. Die Bruchzahl erhält den normalen Hoch-/Tief-Hinweis.

### Zeilen 46–49: Fehler als Text zurückgeben

`catch (error)` übernimmt das geworfene Objekt. `error.message` liefert dessen Text. Die Funktion zeigt den Text nicht selbst an; dafür ist `playNumberGame` zuständig. So bleiben Eingabeprüfung und Spielablauf getrennt. Der Test erzwingt außerdem einen vom Prompt geworfenen `Error`, um diesen Kontrollfluss unabhängig von der Bereichsprüfung zu prüfen.

### Tatsächlich geprüfte Eingaben

| Prompt-Rückgabe | Ergebnis | Bedeutung |
|---|---|---|
| `"1"`, `"10"` | `1`, `10` | Beide Grenzen sind erlaubt. |
| `"4.5"` | `4.5` | Bruchzahl im Bereich ist erlaubt. |
| `" 7 "` | `7` | Äußerer Leerraum stört `Number` nicht. |
| `"1e1"`, `"0xA"` | `10` | Die von `Number` unterstützten Schreibweisen werden nicht zusätzlich eingeschränkt. |
| `null` | Fehlertext | Abbrechen wird zuerst zu `0`, dann als zu klein abgelehnt. |
| `""`, nur Leerraum | Fehlertext | Auch diese Werte werden zu `0`. |
| `"hello"`, `"NaN"`, `"4,5"` | Fehlertext | Keine durch `Number` gültig umgewandelte Zahl. |
| `"Infinity"`, `"-Infinity"` | Fehlertext | Außerhalb des Zahlenbereichs. |
| `"0"`, `"-1"`, `"11"` | Fehlertext | Bereich verletzt. |
| `"0.999"`, `"10.001"` | Fehlertext | Auch knapp außerhalb ist ungültig. |

Abbrechen im Prompt ist somit **kein Spielabbruch**, sondern ein ungültiger Versuch. Ein erneuter Prompt nach einer ungültigen Eingabe gehört, falls noch Versuche übrig sind, bereits zum nächsten Versuch.

## 6. Aufgabe 5: Unverändertes HTML

### `ue2.5/ex5.html`, Zeilen 1–20

Der vorhandene CSS-Block definiert Abstände, Hintergrund, Rahmen und die Buttongröße. Der Kopf enthält Zeichensatz, Titel und das externe Skript mit `defer` in Zeile 19. So existieren die benötigten DOM-Elemente bereits, wenn `querySelector` im Skript ausgeführt wird.

Die vorhandene Position des `<style>`-Blocks vor dem expliziten `<head>` wird **nicht repariert**. Die Aufgabe verbietet Änderungen der HTML-Datei; der Browser verarbeitet die bereitgestellte Datei. Der Test vergleicht beide Dateien deshalb als Bytes und nicht bloß als inhaltlich gleiches DOM.

### Zeilen 21–26

`#outerArea` ist ein `div` mit einem darin verschachtelten Button `#button`. Diese Verschachtelung ist entscheidend: Ein aufsteigendes Klickereignis des Buttons kann den umgebenden Bereich erreichen. Ein Klick auf dessen Innenabstand ist dagegen direkt ein Klick auf das `div`.

## 7. Aufgabe 5: Ursprüngliche Listener und Vorhersage

### `ue2.5/ex5.js`, Zeilen 1–6

`document.querySelector('#button')` wählt den Button. `addEventListener('click', function (event) { ... })` registriert eine normale Funktion für Klickereignisse. Ohne dritten Parameter wird kein Capture-Listener registriert.

Zeile 2 schreibt `inner:` als Kennzeichnung. Die nächsten drei Zeilen protokollieren:

- `event.target`: das Element, von dem das Ereignis ausgeht;
- `event.currentTarget`: das Element, dessen Listener gerade bearbeitet wird;
- `this`: bei dieser als Listener verwendeten normalen Funktion dasselbe Element wie `currentTarget`.

Für den gegebenen Buttonklick sind alle drei der Button. Durch `"target: " + event.target` usw. findet eine Stringumwandlung statt. Die Konsole bekommt also Text wie `[object HTMLButtonElement]` und keinen aufklappbaren DOM-Knoten.

### Zeilen 8–13

Der zweite Listener wird auf `#outerArea` registriert. Ein Buttonklick erreicht ihn nach dem inneren Listener durch **Bubbling**, also das Aufsteigen des Ereignisses zu Vorfahren im DOM.

Hier bleibt `target` der Button. `currentTarget` und `this` sind nun jedoch das `div`, weil gerade dessen Listener läuft. Der Vergleich gilt **innerhalb des Listeneraufrufs**; `currentTarget` ist keine dauerhaft gespeicherte Angabe zum Ursprungsziel.

Die Wahl von `function` ist wesentlich. Eine Pfeilfunktion hätte ein lexikalisches, also aus der umgebenden Umgebung übernommenes `this` und bekäme es nicht auf diese Weise vom Event-System gesetzt. Die Originalfunktionen werden nicht umgeschrieben.

### Vorhergesagte und im echten Browser bestätigte Ausgabe des Originals

```text
inner:
target: [object HTMLButtonElement]
currentTarget: [object HTMLButtonElement]
this: [object HTMLButtonElement]
outer:
target: [object HTMLButtonElement]
currentTarget: [object HTMLDivElement]
this: [object HTMLDivElement]
```

Die Prüfung lädt ausdrücklich die **Originalseite** aus `Angabe/files/ex5/`, nicht eine nachträglich rekonstruierte Variante. Diese acht Zeilen wurden in Chromium genau so aufgezeichnet und mit der Erwartung verglichen. Zusätzliche reine Testlistener prüfen die tatsächlichen Element-IDs und `this === event.currentTarget`. Beim Button beträgt `eventPhase` 2 (Zielphase), beim umgebenden Bereich 3 (Bubbling).

## 8. Aufgabe 5: Ausschließlich angehängte Erweiterung

### `ue2.5/ex5.js`, Zeilen 15–18

Nach dem vollständig unveränderten Original kommt ein weiterer Button-Listener hinzu. Sein einziger Eingriff ist:

```js
event.stopPropagation();
```

Die Listener auf demselben Button werden in ihrer Registrierungsreihenfolge aufgerufen. Der ursprüngliche Listener protokolliert deshalb zuerst die Buttoninformationen. Der später hinzugefügte Listener stoppt danach das Weiterreichen des Klicks an Vorfahren. Der äußere Protokoll-Listener wird für diesen Buttonklick nicht mehr aufgerufen.

**Warum nicht die Originalzeilen ändern?** Das ist ausdrücklich verboten. Der Test verlangt daher, dass die ersten Bytes der Lösung exakt dem gesamten Originalskript entsprechen. Kommentare und neuer Code beginnen erst danach.

**Warum kein `stopImmediatePropagation()`?** Normales `stopPropagation()` verhindert die Weitergabe an andere DOM-Elemente, beendet aber nicht alle weiteren Listener auf demselben Element. Das ist hier erwünscht. Selbst ein zusätzlich nach der Erweiterung registrierter Testlistener am Button wird noch ausgeführt. `stopImmediatePropagation()` wäre ein unnötig weitergehender Eingriff.

**Warum kein `preventDefault()`?** Das verhindert eine Standardaktion, nicht das Bubbling. Für das Unterdrücken des äußeren Protokolls ist es daher nicht die passende Methode.

**Grenze der Lösung:** Sie stoppt das weitere Aufsteigen dieses Ereignisses. Schon vorher ausgeführte Capture-Listener könnte sie nicht rückgängig machen. Die vorgegebenen Listener sind jedoch keine Capture-Listener, weshalb die Ergänzung genau für die Aufgabenstellung genügt.

### Gemessene Ausgabe der erweiterten Seite

```text
inner:
target: [object HTMLButtonElement]
currentTarget: [object HTMLButtonElement]
this: [object HTMLButtonElement]
```

Ein direkter Klick auf den Innenabstand von `#outerArea` erreicht den Button nicht. Der äußere Listener funktioniert dann weiterhin und gibt `outer:` sowie dreimal `[object HTMLDivElement]` mit den entsprechenden Präfixen aus. Dies wird für Original und Erweiterung zusätzlich geprüft. Der äußere Listener wurde weder gelöscht noch deaktiviert.

## 9. Aufbau der reproduzierbaren Tests

Die Tests erzeugen keine Produktdateien und benötigen keinen Server. Node-VM und Browser spielen bewusst unterschiedliche Rollen: Die VM prüft die Spiellogik mit direkt formulierten Sollwerten, der Browser zusätzlich die echte Einbettung und Dialog-/DOM-Ereignisse.

### `tests_2_5.cjs`, Zeilen 1–23: Module, Solltexte, Testzähler

Node-eigene Module liefern Assertions, Dateizugriff, Pfade, isolierte JavaScript-Kontexte und korrekte Datei-URLs. Die Solltexte sind explizit festgelegt. `test` wartet auf eine Prüfung und zählt sie erst nach Erfolg als bestanden. Bei einer fehlgeschlagenen Assertion gibt es keinen irreführenden PASS-Eintrag für diesen Test.

### Zeilen 25–67: Deterministische VM-Umgebung

`createGame` kopiert Eingaben, Wiederholungsentscheidungen und Zufallswerte in eigene Warteschlangen. Ein von `Math` abgeleitetes Objekt übernimmt die echten Mathematikfunktionen und ersetzt nur `random`. So bleibt der Produktcode unverändert.

Die Ersatzfunktionen für `prompt`, `confirm` und `alert` protokollieren Typ, Text und Antwort in Reihenfolge. Ein unerwarteter zusätzlicher Prompt oder Zufallsaufruf ist ein Fehler. `vm.runInContext` führt die **tatsächliche Produktdatei** aus; ein Zeitlimit begrenzt fehlerhafte Endlosschleifen. `assertConsumed` prüft auch die andere Richtung: Alle geplanten Eingaben, Wiederholungsentscheidungen und Zufallswerte müssen verbraucht worden sein.

### Zeilen 69–78: Funktionen einzeln prüfen

Da `game.js` direkt beim Laden das Hauptprogramm startet, beendet `directCall` zuerst eine festgelegte erfolgreiche Start-Runde. Danach leert es nur die Testprotokolle und ruft in demselben Kontext gezielt `playNumberGame` oder `getUserInput` auf. Die Funktionsdefinitionen werden nicht aus dem Produktcode herauskopiert und nicht für Tests umgeschrieben. Der Rückgabewert wird direkt geprüft.

### Zeilen 80–194: Inhaltliche Spieltests

Diese Blöcke prüfen die HTML-/Skriptstruktur, untere und obere Zufallsgrenze, Treffer im ersten bzw. dritten Versuch, Hoch-/Tief-Hinweise, vollständige Tippverläufe, die Rückgabewerte `true`/`false`, die Geheimzahl nach einer Niederlage und das begrenzte Versuchslimit auch bei ungültigen Eingaben.

Die tabellengesteuerten Eingabetests prüfen die oben dokumentierten Grenzfälle einzeln. Weitere Tests prüfen einen geworfenen Prompt-Fehler, Bruchzahlen und mehrere Runden mit Gewinn, Verlust und erneutem Gewinn. Ein Vergleich des gesamten Alarmprotokolls verhindert, dass zusätzliche oder fehlende Meldungen unbemerkt bleiben.

### Ereignis-Solltexte und `playwrightModule`: Playwright laden

Die erwarteten Konsolenzeilen für den inneren und äußeren Listener sind als feste Listen hinterlegt. Wenn `PLAYWRIGHT_MODULE` gesetzt ist, wird genau dieses Modul geladen; sonst wird das regulär installierte Paket `playwright` aufgelöst, gegebenenfalls über `NODE_PATH`. Es sind keine privaten Installationspfade fest eingebaut. Es wird nichts heruntergeladen und keine Bibliothek in die HTML-Seiten eingebaut.

### `browserGame`: Echte Browserdialoge

`browserGame` ermittelt für ein bereits inhaltlich geprüftes Szenario das VM-Dialogprotokoll und verwendet es als Vergleich für den Browser. Das ist ein Integrationsvergleich, kein Ersatz für die unabhängigen Sollwerte in den vorherigen VM-Tests.

Vor dem Laden wird im Browser nur `Math.random` mit derselben deterministischen Sequenz belegt. Die Dialoge bleiben echte native `prompt`-/`confirm`-/`alert`-Aufrufe aus der geladenen Datei. Playwright bestätigt sie oder bricht sie passend zur vorgegebenen Sequenz ab. Fehler, fehlende Dialoge, falsche Texte und unerwartete Dialogtypen lassen den Test scheitern.

Anschließend prüft der Browser den tatsächlich geparsten Body, die einzige Skripteinbindung, ihren Dateinamen und `defer` im Kopf. Die Seite wird auch bei einem Fehler wieder geschlossen.

### `eventPage`: Echte Klickereignisse und Elementidentitäten

`eventPage` sammelt die `console.log`-Texte der geladenen Seite. Zusätzliche Beobachter im Arbeitsspeicher der Testseite speichern die tatsächlichen IDs von `target`, `currentTarget` und `this` sowie die Ereignisphase. Die Produktdateien werden dadurch nicht geändert.

Playwright klickt zuerst den echten Button. Danach werden die komplette Ausgabe und die beobachteten Identitäten geprüft. Der anschließende Klick auf Koordinate `{x: 10, y: 10}` relativ zum äußeren Bereich liegt in dessen Innenabstand und testet, dass der ursprüngliche äußere Listener weiterhin funktioniert. Die gemessenen Button-Ausgaben werden im Testbericht ausgegeben.

### `main`: Originalschutz, Browserstart, Abschluss

Vor dem Browserstart vergleicht die Suite das HTML als `Buffer` bytegenau. Für JavaScript vergleicht sie das Anfangsstück der Lösung bis zur exakten Länge des Originals mit allen Originalbytes und verlangt zusätzlich angehängte Bytes.

Chromium wird aus der Playwright-Installation gestartet. Optional wählt `CHROMIUM_EXECUTABLE` oder, mit geringerer Priorität, `PLAYWRIGHT_CHROMIUM` ein anderes Browserprogramm. Die drei Browser-Spieltests behandeln Wiederholung und Zufallsgrenzen, Abbrechen/leere Eingabe/Leerraum sowie Fehlerhistorie/Bruchzahl/Treffer im dritten Versuch. Zwei weitere Tests laden Original und Erweiterung der Ereignisaufgabe getrennt.

Ein `finally` schließt den Browser. Nur nach allen erfolgreichen Prüfungen erscheint die Gesamtsumme. Ein Fehler schreibt `FAIL` und setzt den Prozess-Exitcode auf 1. Ein fehlender Browser wird deshalb nicht stillschweigend als erfolgreicher übersprungener Test behandelt.

## 10. Tatsächlicher Teststand und offene Punkte

Der ausgeführte Befehl `node ueb02/tests_2_5.cjs` endete mit Exitcode 0. Die Ausgabe enthielt:

```text
BROWSER Chromium 148.0.7778.96 (headless, file://)
PASS browser game: replay through win, loss and win; bounds 1 and 10
PASS browser game: cancel, empty and whitespace exhaust three attempts
PASS browser game: invalid history, fraction, then third-attempt win
ORIGINAL BUTTON OUTPUT:
inner:
target: [object HTMLButtonElement]
currentTarget: [object HTMLButtonElement]
this: [object HTMLButtonElement]
outer:
target: [object HTMLButtonElement]
currentTarget: [object HTMLDivElement]
this: [object HTMLDivElement]
PASS browser events: original button bubbles to outer; direct outer click
MODIFIED BUTTON OUTPUT:
inner:
target: [object HTMLButtonElement]
currentTarget: [object HTMLButtonElement]
this: [object HTMLButtonElement]
PASS browser events: appended stopPropagation limits button output; outer still works
ALL 36 TESTS PASSED
```

Im ersten Testlauf war die Body-Prüfung zu streng, weil sie auch parserbedingten Leerraum als Inhalt wertete. Ausschließlich diese Testbedingung wurde auf einen leerraumtoleranten Vergleich korrigiert; die Seite enthält weiterhin einen leeren Body. Danach liefen sämtliche Prüfungen erfolgreich. Es gibt keine bekannten offenen Funktionsfehler in den bearbeiteten Aufgaben. Firefox, WebKit und eine sichtbare manuelle Browserbedienung wurden nicht getestet; die hier beschriebenen Messungen stammen aus echtem headless Chromium.

### KI-Nutzung und Abgabegrenze

Die Kursrichtlinie erlaubt KI-Unterstützung bis hin zur vollständigen Lösung unter der Bedingung, dass Fabio die Lösung vollständig versteht und erklären kann. Diese Programme, Tests und Texte wurden mit KI-Unterstützung erstellt. Die Erläuterungen ersetzen das eigene Nachvollziehen nicht.

Für die **gesamte Abgabe** bleibt der separate verpflichtende KI-Bericht gemäß Kursrichtlinie erforderlich. Er muss die tatsächlichen Werkzeug-/Modellangaben und den echten Promptverlauf dokumentieren; eigene Prüfungen und Änderungen darf Fabio nur dann als Eigenleistung eintragen, wenn er sie wirklich vorgenommen hat. Dieser auf Aufgabe 2 und 5 begrenzte Arbeitsauftrag erstellt keinen separaten Gesamtbericht. Es wurden keine Commits, kein Push und keine Moodle-Abgabe ausgeführt.


---

# Übungsblatt 2: Erklärung zu Aufgabe 4 und 6

Diese Datei erklärt die Lösung **Datei für Datei und nach Zeilenblöcken**. Die Zeilenangaben beziehen sich auf die ausgelieferten Quelldateien. Die unveränderten Vorlagen liegen unter `Angabe/files/`. Die Aufgabenstellung wurde aus `angabe_blatt02.pdf` gelesen und auf den gerenderten Seiten 3 und 4 kontrolliert.

## 1. Dateien, Start und Änderungsgrenzen

| Datei | Aufgabe und Änderungsstatus |
| --- | --- |
| `ue2.4/glassOrder.html` | Byteidentische Kopie der HTML-Vorlage. Nicht bearbeitet. |
| `ue2.4/calculate.js` | Neue Browserlogik für DOM-Ergänzungen, Prüfung und Preis. |
| `ue2.4/antwort.md` | Englische Kurzantwort und begründete Interpretation der Gültigkeit. |
| `ue2.6/gallery.html` | Byteidentische Kopie der Galerievorlage. |
| `ue2.6/gallery.css` | Byteidentische Kopie der ursprünglichen Gestaltung. |
| `ue2.6/gallery.js` | Original vollständig als Byte-Präfix erhalten; ausschließlich angehängte Erweiterung. |
| `ue2.6/hk.JPG`, `hk_small.JPG` | Unverändertes großes/kleines Hongkong-Bild. |
| `ue2.6/street.JPG`, `street_small.JPG` | Unverändertes großes/kleines Straßenbild. |
| `ue2.6/taichung.JPG`, `taichung_small.JPG` | Unverändertes großes/kleines Taiwan-Bild. |
| `ue2.6/antwort.md` | Englische Antwort zu Struktur, Originalcode und Erweiterung. |
| `tests_4_6.cjs` | Node-Testprogramm: Originaltreue und echte Browserausführung. Nicht Teil des Browserprodukts. |
| `erklaerung_4_6.md` | Diese deutschsprachige Erklärung. |

`ue2.4/glassOrder.html` und `ue2.6/gallery.html` können direkt im Browser geöffnet werden. Ein Webserver und zusätzliche Browserbibliotheken sind nicht erforderlich. Playwright wird ausschließlich vom separaten Testprogramm verwendet.

Die HTML-Datei auf der Festplatte und der **DOM** sind unterschiedliche Dinge: Der DOM ist die vom Browser aufgebaute, veränderbare Baumstruktur. JavaScript darf hier Elemente entfernen oder hinzufügen, ohne die HTML-Datei selbst zu verändern. Genau darauf beruhen beide Lösungen.

## 2. Aufgabe 4: `ue2.4/glassOrder.html`

### Zeilen 1–17: Kopf und Laden des Skripts

Die eingebettete CSS-Regel färbt ungültige Inputs beziehungsweise Textareas rot. `calculate.js` wird über `defer` geladen. Dadurch wird das Skript nach dem Parsen des HTML ausgeführt; die abgefragten Elemente existieren dann bereits. Ein zusätzlicher `DOMContentLoaded`-Listener ist hier nicht nötig.

### Zeilen 19–21: Überschrift, doppelter Absatz, Formular

`h1` und der direkt folgende `p` haben denselben Text. Nur der Absatz wird durch JavaScript gelöscht. Das Formular besitzt bereits eine `mailto:`-Aktion. Die Lösung verändert diese nicht und sendet in den Tests nichts ab.

### Zeilen 22–45: Kontaktfelder

Vorname, Nachname, Straße, PLZ, Ort und E-Mail sind mit `required` versehen. Platzhalter wie `John` sind **keine Werte** und erfüllen `required` nicht. `type="email"` liefert zusätzlich eine native Formatprüfung. Das optionale Telefonfeld hat `pattern="[0-9]*"`: leer ist erlaubt, eingetragene Buchstaben sind nicht erlaubt. Für PLZ und Namen wird keine zusätzliche Prüfung erfunden, die im HTML nicht steht.

### Zeilen 46–72: Glasspezifikation und Platz für den Preis

`#color` liefert einen Farbwert im Format `#rrggbb`. Die vier Radios gehören durch `name="thickness"` zu einer gemeinsamen Gruppe. Das `required` am ersten Radio verlangt eine Auswahl innerhalb dieser Gruppe; es verlangt **nicht**, dass ausschließlich 4 mm gewählt werden.

Breite und Höhe sind Zahlenfelder in cm. `min="0"`, `max="200"` und `step="1"` definieren die gültigen Werte. Deshalb ist 0 gültig, 201 außerhalb des Bereichs und 1,5 wegen der Schrittweite ungültig. Die Lösung verschärft diese Vorgaben nicht eigenmächtig auf strikt positive Zahlen.

Die `Price`-Legende ist bereits vorhanden. Der darunter vorgesehene Bereich am Ende desselben Fieldsets erhält das neue Preisinput und sein Label. Die HTML-Vorlage enthält mehrere `legend`-Elemente im selben Fieldset; auch diese vorgegebene Struktur bleibt unangetastet.

### Zeilen 74–86: Abschluss

Das dritte Fieldset enthält optionale Bemerkungen mit `maxlength="700"`. Der Submit-Input gehört zum Original und wird nicht betätigt. Die eigentliche Aufgabe ist die Berechnung und Anzeige im Browser, nicht der Versand einer Bestellung.

## 3. Aufgabe 4: `ue2.4/calculate.js`

### Zeilen 1–7: Kennzeichnung, strenger Modus und DOM-Referenzen

Der Kommentar kennzeichnet die KI-Unterstützung und verweist auf diese Erklärung. `"use strict"` verhindert unter anderem unbemerkte Zuweisungen an nicht deklarierte Variablen.

`getElementById` liefert Referenzen auf Breite, Höhe und Farbe. `widthInput.form` liefert genau das Formular, dem das Breitenfeld zugeordnet ist. Die Referenzen werden einmal gespeichert, statt dieselben Elemente bei jedem Tastendruck neu zu suchen. `const` schützt die Referenz vor Neuzuweisung; Eigenschaften des DOM-Elements bleiben veränderbar.

### Zeilen 9–15: Nur die doppelte Überschrift entfernen

`heading.nextElementSibling` überspringt Textknoten wie Zeilenumbrüche und findet das nächste **Element**. Vor `remove()` wird geprüft:

1. Gibt es dieses Element?
2. Ist es ein Absatz (`tagName === "P"`)?
3. Ist sein getrimmter Text gleich dem Überschriftentext?

`trim()` entfernt Rand-Leerzeichen. Damit wird nicht wahllos irgendein Absatz gelöscht. Die Überschrift selbst bleibt stehen.

### Zeilen 17–26: Preisinput und Label erzeugen

`createElement("input")` erzeugt zunächst ein noch nicht eingehängtes Element. Der Typ ist `text`, weil das Feld außer Zahlen ausdrücklich auch `-` anzeigen können muss. Ein `number`-Input wäre für dieses Platzhalterzeichen ungeeignet.

- `id="price"` macht das Feld eindeutig adressierbar.
- `name="price"` ist sein Formularname.
- `readOnly = true` verhindert die Bearbeitung durch die Person. Anders als `disabled` bleibt das Feld grundsätzlich Bestandteil der Formulardaten.
- `htmlFor` setzt die `for`-Zuordnung des Labels zur Input-ID.
- `textContent = "price"` setzt exakt den verlangten Labeltext.

`widthInput.closest("fieldset")` findet das umgebende Glasspezifikations-Fieldset. `append(priceInput, priceLabel)` hängt beide Knoten nach dessen bisherigen Inhalt ein, also hinter die vorhandene Preislegende. Erst hier werden die neuen Elemente sichtbar.

### Zeilen 28–36: `calculate(width, height, thickness)`

Die Funktion nimmt alle drei Maße **bereits in cm** entgegen. Sie liest nur die Farbe zusätzlich aus dem Formular. Das entspricht der verlangten Signatur mit drei Parametern, macht die Funktion aber bewusst nicht vollständig unabhängig vom DOM.

Bei `#rrggbb` steht Index 0 für `#`. `slice(1, 3)` liefert die beiden roten Hex-Zeichen; der Endindex gehört nicht mehr zum Ergebnis. `slice(3, 5)` liefert Grün und `slice(5, 7)` Blau. Gleiche zweistellige Hexwerte repräsentieren gleiche Kanalwerte. Eine Umwandlung mit `parseInt` ist für diesen Gleichheitsvergleich daher nicht notwendig. `toLowerCase()` vereinheitlicht gegebenenfalls die Schreibweise.

Der Ausdruck `red === green && green === blue` verlangt die Gleichheit aller drei Kanäle. Auch Schwarz (`#000000`) und Weiß (`#ffffff`) sind damit Graustufen. Der bedingte Operator `Bedingung ? 50 : 32` wählt den Divisor. Der Rückgabewert ist das ungerundete Produkt der drei Maße geteilt durch diesen Divisor.

### Zeilen 38–49: Gültigkeit und vorzeitige Rückkehr

`orderForm.checkValidity()` prüft die vorhandenen HTML-Constraints der zu prüfenden Formularelemente. Anders als `reportValidity()` wird damit kein Validierungs-Popup zur Benutzerführung angefordert; `invalid`-Ereignisse können trotzdem ausgelöst werden. Das schreibgeschützte berechnete Preisfeld blockiert die Prüfung nicht.

Ist die Prüfung falsch, schreibt die Funktion `-` in das Feld und beendet sich mit `return`. Dadurch wird kein alter Preis sichtbar gelassen und auch kein fehlender Zahlenwert versehentlich als Null interpretiert.

Anschließend sucht `input[name="thickness"]:checked` das ausgewählte Radio. Die zusätzliche Nullprüfung ist eine defensive Absicherung, bevor `.value` gelesen wird. Normalerweise hat die Formularprüfung eine fehlende Radioauswahl bereits erkannt.

#### Warum auch Kontaktdaten zählen

Die Angabe schreibt **„if all required inputs are given and have valid values“**. In der unveränderten Vorlage sind auch Kontaktdaten required. Daher wurde nicht nur das Geometrie-Fieldset geprüft, sondern das gesamte Formular. Ein Preis bleibt `-`, solange beispielsweise der Ort fehlt oder die E-Mail ungültig ist.

Das ist eine dokumentierte Auslegung: Für eine bloße unverbindliche Preisvorschau könnte man sich auf Maße, Stärke und Farbe beschränken. Sie wäre praktisch, würde aber das Wort **all** und die vorhandenen weiteren Pflichtfelder nicht wörtlich umsetzen. Die hier gewählte Formularprüfung berücksichtigt darüber hinaus ungültige **ausgefüllte optionale** Felder. Ein leeres Telefon ist gültig; `abc` ist wegen des Musters ungültig. Diese strengere, formularweite Konsistenz ist ausdrücklich beabsichtigt und getestet.

### Zeilen 50–55: Zahlen lesen, Einheit umrechnen, Anzeige formatieren

`valueAsNumber` liefert die Breite/Höhe als JavaScript-Zahl. Das vermeidet eine versehentliche Stringverarbeitung. Radio-Werte sind Strings; `Number(...)` wandelt die ausgewählte Stärke in eine Zahl um. Die Division durch 10 rechnet mm in cm um, **vor** dem Aufruf von `calculate`.

`Number.isFinite(price)` verhindert die Anzeige von `NaN` oder unendlichen Ergebnissen. `toFixed(2)` formatiert den Preis als String mit zwei Nachkommastellen. Die Aufgabe verlangt keine Währung; deshalb wird keine erfundene Einheit angehängt. Die Rundung ist nur eine Darstellungsentscheidung: Der Rückgabewert von `calculate` bleibt ungerundet. JavaScript verwendet Gleitkommazahlen, keine exakte Dezimal-Geldarithmetik.

### Zeilen 57–60: Ereignisse und Initialisierung

Die Handler liegen auf dem Formular. `input` und `change` steigen von den einzelnen Feldern durch **Bubbling** zum Formular auf. Das nennt man Ereignisdelegation. Dadurch aktualisieren Maße, Farbe, Radios, Kontakte und die weiteren formularrelevanten Felder den Preis.

`input` reagiert auf laufende Bearbeitung, `change` auch auf übernommene Änderungen beispielsweise einer Auswahl. Bei manchen Eingaben können beide Ereignisse auftreten; die doppelte Berechnung ist hier harmlos. Eine Zuweisung `element.value = ...` durch fremdes JavaScript erzeugt nicht automatisch ein solches Ereignis; dort müsste der Aufrufer `update()` aufrufen oder ein Ereignis auslösen.

Der letzte Aufruf `update()` initialisiert das leere Formular zuverlässig mit `-`.

### Rechenprobe im Test

Für 100 cm Breite, 50 cm Höhe und 4 mm graues Glas: Der Test prüft erst die Umrechnung auf 0,4 cm und erwartet `40.00`. Mit 12 mm und rotem Glas erwartet er `187.50`. Für direkte Aufrufe von `calculate(100, 50, 0.8)` werden `80` bei Grau und `125` bei buntem Glas geprüft. Diese Ergebnisse wurden durch das ausgeführte Node-/Browser-Testprogramm bestätigt, nicht nur beschrieben.

## 4. Aufgabe 6: `ue2.6/gallery.html`

### Zeilen 1–7: Ressourcen

Das Dokument lädt `gallery.js` verzögert sowie `gallery.css`. Die relative Auflösung der Bildpfade funktioniert beim direkten Öffnen der kopierten HTML-Datei, weil alle benötigten Dateien im selben Verzeichnis liegen.

### Zeilen 8–13: Thumbnails

Die drei kleinen Bilder stehen in `.gallery`. `src` ist die Vorschau, `data-large` ist ein benutzerdefiniertes Datenattribut mit dem großen Bildpfad, und `alt` liefert den beschreibenden Text. JavaScript liest `data-large` über `element.dataset.large`. Diese Attribute trennen Vorschau und Großansicht, ohne Dateinamen wie `_small` per Stringersetzung erraten zu müssen.

### Zeilen 14–20: Overlay

`#displayDIV` enthält das große Bild `.bigIMG` und den Beschreibungsabsatz `.desc`. Ein Kommentar markiert den Ort für dynamische Buttons. Diese werden ausschließlich durch das angehängte JavaScript erzeugt; die HTML-Datei bleibt byteidentisch.

## 5. Aufgabe 6: `ue2.6/gallery.css` und Bilder

### CSS-Zeilen 1–10

`display: none` versteckt das Overlay zu Beginn. `100vw` und `100vh` richten seine Größe nach dem Browserfenster aus. `position: absolute`, `top: 0` und `left: 0` platzieren es am Ursprung seines Positionierungsbezugs. Silberner Hintergrund und zentrierter Inhalt erzeugen die vorhandene Vollfensteransicht.

Das ist eine CSS-Vollfensterdarstellung, **nicht** die Browser-Fullscreen-API: Es wird weder `requestFullscreen()` benötigt noch die Browseroberfläche ausgeblendet.

### CSS-Zeilen 12–15

Das große Bild erhält oben 20 Pixel Abstand und eine Höhe von `calc(100% - 70px)`. Die vorgegebene Gestaltung enthält keine generelle Begrenzung seiner Breite. Ein sehr breites oder anders proportioniertes Bild könnte deshalb horizontal überstehen; die Aufgabe untersagt Änderungen dieser CSS-Datei. Die neuen Buttons werden unabhängig vom normalen Dokumentfluss positioniert, damit sie nicht unterhalb des Fensterrandes landen.

### Die sechs JPG-Dateien

Jedes Motiv hat eine kleine und eine große Datei. Alle sechs Dateien wurden mitkopiert und als Binärdaten mit dem Original verglichen. Bilddateien besitzen keine sinnvoll erklärbaren Quelltext-Zeilenblöcke. Das Testprogramm prüft zusätzlich im Browser, ob die Bilder tatsächlich geladen wurden (`complete` und `naturalWidth > 0`).

## 6. Aufgabe 6: `ue2.6/gallery.js`

### Zeilen 1–5: Unverändertes `showImg(e)`

1. `.bigIMG` wird ausgewählt und erhält `e.target.dataset.large` als `src`.
2. Der Beschreibungsabsatz erhält `e.target.alt` über `innerHTML`.
3. Das Overlay wird mit `display = "block"` angezeigt.

`target` ist das Element, auf dem der Klick ausgelöst wurde; bei den registrierten Bildklicks ist das der Thumbnail-`img`.

**Bestandsrisiko:** `innerHTML` interpretiert die Beschreibung als HTML. Für beliebige nicht vertrauenswürdige Texte wäre `textContent` die sichere Wahl. Der Originalcode darf nicht geändert werden. Die Ergänzung setzt die Beschreibung danach als Text, aber das macht den vorhergehenden `innerHTML`-Schritt nicht rückwirkend sicher. Deshalb wird keine Sicherheit für fremde, bösartige HTML-Inhalte behauptet.

### Zeilen 7–9: Unverändertes `hideImg(e)`

`currentTarget` ist das Element, dessen Listener gerade ausgeführt wird: hier `#displayDIV`. Ein Klick auf einen Nachfahren kann zwar ein anderes `target` haben, das Overlay bleibt aber `currentTarget`. Die Funktion versteckt deshalb immer das Overlay und nicht versehentlich nur das angeklickte Kind.

### Zeilen 11–15: Unveränderte Registrierung

`querySelectorAll('.gallery img')` liefert eine statische NodeList. Die Schleife registriert `showImg` auf allen beim Skriptstart vorhandenen Thumbnails. Der Overlay-Listener registriert `hideImg`. Ohne Gegenmaßnahme würde auch ein Buttonklick zu diesem Listener aufsteigen und das Fenster sofort schließen.

Die ersten **538 Bytes** der ausgelieferten Datei stimmen mit dem gesamten Original überein, einschließlich dessen CRLF-Zeilenenden. Der Test vergleicht Bytes, nicht nur optisch gleich aussehenden Code. Erst danach beginnt die Ergänzung.

### Zeilen 17–23: Geschützter Bereich und Zustand

`(() => { ... })()` ist eine sofort aufgerufene Funktion, kurz IIFE. Ihre Variablen und Hilfsfunktionen landen nicht im globalen Bereich des Originals. Das vermeidet Namenskonflikte etwa mit dessen `images`.

Die Referenzen auf Overlay, großes Bild und Beschreibung werden gespeichert. `currentImage` beginnt als `null` und wird später das **Thumbnail-DOM-Element** sein. Eine DOM-Referenz ist eindeutiger als ein Bildpfad: Zwei Thumbnails dürfen dieselbe große Bilddatei verwenden und trotzdem verschiedene Beschreibungen haben.

### Zeilen 25–32: Auswahl nach einem Thumbnailklick merken

Zu jedem vorhandenen Thumbnail wird ein zusätzlicher Listener registriert. Der Original-Listener wurde vorher auf demselben Element registriert und öffnet das Bild zuerst. Der neue Listener merkt danach `event.currentTarget`, ergänzt den Alternativtext der Großansicht und setzt die Beschreibung als Text.

Wichtig für das Wiederöffnen: Wenn man das Overlay schließt und dann ein anderes Thumbnail anklickt, wird `currentImage` neu gesetzt. Die Navigation läuft anschließend nicht von einer veralteten Auswahl weiter.

### Zeilen 34–44: `move(direction)` und Wrap-around

Die Funktion fragt bei jedem Schritt die aktuellen `.gallery img` ab und macht mit `Array.from` ein Array daraus. Dadurch kann `indexOf(currentImage)` nach dem gespeicherten Element suchen. Eine leere Liste beendet die Funktion sofort und vermeidet unter anderem eine Modulo-Rechnung durch Null.

Falls das gespeicherte Element nicht gefunden wird, liefert `indexOf` `-1`; `Math.max(0, ...)` setzt den Ausgangsindex dann auf 0. Im normalen Ablauf stammt `currentImage` aus der Liste.

`(index + direction + thumbnails.length) % thumbnails.length` berechnet den neuen Index:

- `direction = 1` geht vorwärts; nach dem letzten Index kommt 0.
- `direction = -1` geht rückwärts; vor Index 0 kommt der letzte Index.
- Das zusätzliche `+ length` vermeidet bei einem Rückwärtsschritt von 0 einen negativen Restwert in JavaScript.
- Bei genau einem Bild bleibt der einzige mögliche Index 0.

Danach werden Bildquelle, Alternativtext und Beschreibung vom neu ausgewählten Thumbnail übernommen. `display = "block"` hält die Großansicht offen. Es gibt keine fest codierte Anzahl von drei Bildern und keine fest codierten Motivnamen.

### Zeilen 46–54: Buttons und sichtbare Position

`addButton(text, direction)` kapselt die gemeinsame Erzeugung beider Controls. Es sind echte `button`-Elemente; sie sind mit der Tastatur fokussierbar. `type="button"` verhindert eine unbeabsichtigte Formularabgabe, falls das HTML gleichen Formats in einem Formular eingebettet wird.

Weil das große Originalbild fast die gesamte Fensterhöhe belegt, würden Buttons nach dem Absatz im normalen Layout unter den Fensterrand geraten können. Ihre Position wird deshalb **im JavaScript** auf absolut, 12 Pixel vom unteren Rand gesetzt. `previous` endet etwas links der Mitte, `next` beginnt etwas rechts der Mitte. Die Original-CSS-Datei wird dabei nicht bearbeitet. Diese Positionierung wurde im Browser über die Button-Bounding-Boxes geprüft.

### Zeilen 55–65: Ereignisfluss und Initialisierung

Der Klickhandler ruft zuerst `event.stopPropagation()` auf. Das verhindert die Weiterleitung des Klicks zum Overlay und damit dessen `hideImg`. Ein `preventDefault()` wäre dafür nicht der richtige Ersatz: Es betrifft Standardaktionen, nicht das Bubbling. Beim normalen Button ohne Submit-Typ muss hier außerdem keine Standardaktion verhindert werden.

Danach führt `move(direction)` die Navigation aus. `display.append(button)` hängt den Button tatsächlich ins Overlay. Die beiden abschließenden Aufrufe erzeugen `previous` mit -1 und `next` mit +1. Andere Klicks im Overlay, insbesondere auf seinen Hintergrund, erreichen weiterhin den unveränderten Schließhandler.

### Geltungsbereich „beliebiger HTML-Inhalt gleichen Formats“

Unterschiedliche Bildanzahlen, Dateinamen, Beschreibungen und zusätzliche umgebende Inhalte sind erlaubt. Erforderlich bleiben die Selektoren und Attribute des Formats: `.gallery img`, `data-large`, `alt`, `#displayDIV`, `.bigIMG`, `.desc`.

Die Lösung verdrahtet wie das Original die beim Initialisieren vorhandenen Thumbnails. Eine Anwendung, die **erst danach** neue Thumbnails einfügt, benötigte zusätzliche Ereignisdelegation oder einen MutationObserver. Das ist nicht die hier verlangte Verarbeitung beliebiger statischer HTML-Dokumente; es wird nicht als mitimplementierte Funktion ausgegeben. Die erneute Listenabfrage unterstützt insbesondere die Navigation ohne fest verdrahtete Anzahl und die Orientierung am tatsächlichen Element.

## 7. Die beiden `antwort.md`-Dateien

`ue2.4/antwort.md` beantwortet die Preisaufgabe kurz in der Sprache der Angabe, nennt die Einheiten und begründet die formularweite Validierung. `ue2.6/antwort.md` erklärt die Originalstruktur und den Originalcode vor der Beschreibung der Erweiterung. Beide nennen den ausführbaren Testbefehl und kennzeichnen die KI-Unterstützung. Die ausführliche deutsche Lernfassung steht bewusst hier statt als lange Prosa im Browsercode.

## 8. `tests_4_6.cjs`: echte Tests statt bloßer Sichtkontrolle

Vom Repository-Hauptverzeichnis aus:

```sh
node ueb02/tests_4_6.cjs
```

`PLAYWRIGHT_MODULE` wählt optional ein Modul, sonst wird das normal installierte Paket `playwright` aufgelöst. `PLAYWRIGHT_CHROMIUM` wählt optional ein Browserprogramm, sonst startet Playwright seinen installierten Chromium. Es sind keine privaten Installationspfade fest eingebaut. Der Test startet **keinen Server**, sendet kein Formular und verändert die Lösungsdateien nicht.

| Zeilenblock | Erklärung |
| --- | --- |
| 1–7 | Strenger Modus, Node-Standardmodule und Playwright-Laden über expliziten Umgebungswert oder normales `require`. |
| 8–16 | Dateiwurzeln, Fehlerliste und Testzähler. Nur ein vollständig bestandener Testblock erhöht `passed`. |
| 17–26 | Binärvergleich mit Buffer-Gleichheit, Sammeln unbehandelter Browserfehler und Hilfsprüfung des Preisfeldes. |
| 27–40 | Glass-HTML byteidentisch; Galerie-HTML, CSS und alle Bilder byteidentisch; bei JS exakt erhaltenes Original-Präfix plus zusätzlichen Code verlangen. |
| 41–57 | Tatsächlichen Chromium-Prozess starten, lokale Glass-HTML öffnen, Absatzentfernung, readonly, Label und Fieldset prüfen. |
| 58–75 | Nur Geometrie reicht nicht; fiktive Kontakte ausfüllen; alle vier Radio-Stärken und einen reinen `change`-Farbwechsel prüfen. Die Testadresse nutzt die reservierte Domain `example.invalid`. |
| 76–92 | `calculate` im Browser für alle 256 gleichen RGB-Kanalwerte und mehrere gezielt unterschiedliche Kanalkombinationen ausführen. |
| 93–106 | `form.checkValidity` vorübergehend mit einem Zähler umhüllen, `update()` ausführen und Originalmethode wiederherstellen. Damit wird der verlangte API-Aufruf tatsächlich nachgewiesen. |
| 107–122 | Fehlende Maße, min/max, Schrittfehler, ungültige E-Mail, fehlenden Ort und ungültiges optionales Telefon einzeln prüfen; nach jeder Korrektur muss der Preis wieder erscheinen. |
| 123–138 | Keine Radioauswahl, gültige Null-/Maximalwerte und eine nicht als Zahl verwendbare Eingabe prüfen; Glass-Seite schließen. |
| 140–165 | Originalgalerie öffnen, Bildquelle, Alttext, Beschreibung, Overlay und erfolgreiches Bildladen prüfen; beide Buttons müssen innerhalb des Viewports liegen. |
| 166–181 | Wrap-around in beide Richtungen, Weiterblättern, Hintergrund-Schließen und neue Thumbnailauswahl nach Wiederöffnen prüfen. |
| 182–214 | Eigenständige Dokumentvarianten mit 0, 1, 2 und 5 Bildern aufbauen. Andere Wrapper und zusätzliche Inhalte beibehalten; alle großen Bild-URLs absichtlich wiederholen. Die Beschreibungen unterscheiden die einzelnen Thumbnails, sodass eine nur auf die URL gestützte falsche Auswahl auffällt. |
| 215–221 | Unbehandelte JavaScript-Fehler ausschließen, tatsächlich bestandene Zahl ausgeben; Browser auch bei Fehlern schließen. Fehler führen zum Exitcode 1. |

Die Varianten werden zunächst auf einen lokalen `file:`-Ursprung navigiert. Ein gewöhnliches `about:blank` mit nachträglich eingesetztem HTML darf in Chromium nicht einfach lokale Dateien nachladen. Diese Besonderheit betrifft das Testgerüst, nicht die direkt geöffneten Produktseiten.

Nach einem Bildwechsel wartet der Test gezielt auf `complete && naturalWidth > 0`. Nur sofort nach dem Setzen von `src` nachzusehen wäre ein fehleranfälliger Test gegen das asynchrone Laden. Es werden keine festen Blind-Wartezeiten verwendet.

### Tatsächlich ausgeführtes Ergebnis

Der vollständige abschließende Lauf endete mit **Exitcode 0** und:

```text
BESTANDEN: 28 Testgruppen (Chromium, file://, ohne Server).
```

Dazu gehören die Originalgalerie mit drei Bildern, separate Varianten mit 0/1/2/5 Bildern und alle genannten Glasszenarien. Keine unbehandelten JavaScript-Fehler wurden festgestellt. Die Prüfung ist kein Nachweis für alle denkbaren Browser oder unendlich viele Dokumente; sie ist eine konkrete Ausführung in Chromium plus allgemeine, an der Listenlänge orientierte Implementierung.

## 9. Grenzen, KI-Transparenz und eigene Nacharbeit

- **Unverändert übernommene Risiken:** `innerHTML` im ursprünglichen `showImg`, das starre Originalbildlayout und die anfängliche Thumbnail-Verdrahtung wurden nicht versteckt umgeschrieben.
- **Nicht getestet:** Firefox, Safari, echte E-Mail-Übermittlung, nachträgliche Thumbnail-Insertion und echte Browser-Fullscreen-API. Nichts davon wird als erledigt behauptet.
- **Keine externe Abgabe:** Kein Commit, kein Push, kein Moodle-Upload. Die vorhandene `mailto:`-Aktion wurde nicht ausgelöst.
- **Anbieter/Modell:** OpenAI, `gpt-6.1-sol`, ausgeführt durch Hermes Agent. Eine darüber hinausgehende Modell-Buildnummer und ein konkreter Reasoning-Effort-Wert sind in diesem Lauf nicht offengelegt und werden nicht erfunden.
- **Verwendete Werkzeuge:** Skill-/Policy-Lesen, Dateilesen/-schreiben, gezielte Dateipatches, Terminal mit `pdftoppm`, PDF-Seitenansicht, Node und Playwright mit lokalem Chromium, lesende Git-Statusabfrage. Keine Browserbibliothek wurde in das Produkt eingebunden.
- **Tatsächlicher Auftrag:** „Implementiere und teste Übungsblatt 2 Aufgaben 4 und 6 (Glasspreis, Galerie) im bestehenden Repo. Schreibe außerdem je antwort.md und ausführliche deutsche Datei-für-Datei-/Zeilenblock-Erklärung als ueb02/erklaerung_4_6.md. Keine Commits, kein Push, keine Moodle-Abgabe.“ Dazu kamen die delegierten Vorgaben zur Byteidentität, erlaubten Dateiscope, formularweiten Gültigkeitsauslegung und echten Browserprüfung.
- **Tatsächlicher Ablauf:** Vorgaben und Kurs-KI-Erlaubnis lesen; PDF und Originaldateien prüfen; erlaubte Kopien und JavaScript erstellen; Browser-/Originaltreuetests ausführen; zwei Testgerüstprobleme (asynchrones Bildladen und lokaler Dateizugriff aus `about:blank`) korrigieren; vollständigen erfolgreichen Testlauf ausführen; Antworten und Erklärung schreiben. Eine unabhängige zweite Modellprüfung wurde in diesem Teilauftrag nicht durchgeführt.

Die Kursregel erlaubt die KI-Lösung bei vollständigem Verständnis und verlangt einen KI-Bericht **pro gesamter Abgabe**. Dieser Abschnitt dokumentiert nur den tatsächlichen Anteil zu Aufgabe 4/6 und ersetzt den Gesamtbericht nicht. Eine Behauptung bereits erbrachter menschlicher Eigenleistung wird ausdrücklich nicht gemacht. Der Abschnitt „Eigene Bearbeitung“ muss von der abgebenden Person selbst wahrheitsgemäß ausgefüllt werden.

Zum Selbstcheck sollte die Person insbesondere erklären können, warum mm durch 10 geteilt werden, warum identische RGB-Kanäle Grau ergeben, warum die leeren Kontaktdaten den Preis hier verhindern, warum `stopPropagation()` nötig ist und wie die Modulo-Formel an beiden Enden der Bilderliste funktioniert.
