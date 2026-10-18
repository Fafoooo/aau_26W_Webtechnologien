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
