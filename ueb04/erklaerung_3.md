# Aufgabe 3 – Higher-order functions, Closures und Currying

## Ablauf zum Lernen

1. `ue4.3/index.html` öffnen, die Entwicklerkonsole daneben anzeigen und vorhersagen, was jede Zeile ausgibt.
2. `examples.js` lesen und die Beispiele einzeln verändern: etwa Verdopplung durch Addition ersetzen.
3. `productsD.html` öffnen und im Debugger in `getEventHandler` und `updateProduct` anhalten: der erste Aufruf findet beim Seitenaufbau statt, der zweite erst beim Klick.
4. `console-output.js` zuerst auf Papier verfolgen und dann mit der echten Ausgabe vergleichen.

Die Antworttexte stehen auf Englisch, wie die Angabe; diese Erklärungen sind auf Deutsch. Es gibt keine externe Bibliothek im Produkt. Playwright ist ausschließlich ein Werkzeug für die automatisierten Browsertests.

## `ue4.3/examples.js` – jede ausführbare Zeile

### Strikter Modus und höhere Funktion

- `'use strict';` aktiviert strengere Regeln. Eine versehentliche Zuweisung an einen nicht deklarierten Namen wird so zum Fehler statt zu einer unerwünschten globalen Variable.
- `function repeatTransform(transform, times, initial)` definiert eine Funktion mit drei Parametern: einer anderen Funktion, einer Wiederholungsanzahl und dem Startwert. Eine Funktion, die Funktionen annimmt oder zurückgibt, heißt **higher-order function**.
- `let result = initial;` legt eine veränderliche lokale Bindung an. Sie enthält zunächst den Startwert.
- `for (let i = 0; i < times; i += 1)` startet bei null, prüft vor jeder Runde die Grenze und erhöht den Zähler nach jeder Runde um eins. Bei null Wiederholungen wird der Körper nie betreten. Für dieses eigene Beispiel sind nichtnegative ganze Wiederholungszahlen vorgesehen.
- `result = transform(result);` ruft die übergebene Funktion mit dem bisherigen Wert auf und speichert ihren Rückgabewert. Entscheidend ist der Unterschied zwischen `transform`, dem Funktionswert, und `transform(result)`, dem tatsächlichen Aufruf.
- `return result;` liefert den letzten Wert zurück. Die schließenden Klammern beenden Schleife und Funktion; sie erzeugen selbst keine zusätzliche Berechnung.

**Idee:** Der Ablauf der Wiederholung bleibt gleich; nur die übergebene Rechenregel wird ausgetauscht. Darum ist eine Funktion als Argument nützlich. JavaScript-Funktionen sind **first-class values**: Man kann sie wie andere Werte speichern, übergeben und zurückgeben. Das ist eine Eigenschaft der Sprache, nicht automatisch jeder einzelnen Funktion.

### Closure mit Zustand

- `function createCounter(start)` ist eine Fabrik: Jeder Aufruf baut einen eigenen Zähler.
- `let value = start;` gehört zur lokalen Umgebung dieses Fabrikaufrufs. Ein zweiter Aufruf bekommt eine andere Bindung.
- `return function (step = 1)` gibt eine neue Funktion zurück. Ohne übergebenen Wert oder bei `undefined` wird der Standardwert eins verwendet; bei null dagegen nicht.
- `value += step;` liest und ändert die Bindung aus dem äußeren Aufruf. Die äußere Funktion ist inzwischen beendet, aber die innere Funktion behält Zugriff auf ihre **lexikalische Umgebung**.
- `return value;` gibt den neuen Zustand zurück. Die Funktion ist eine **Closure**: Funktionscode zusammen mit Zugriff auf die Umgebung ihrer Entstehung.
- `};` beendet den zurückgegebenen Funktionsausdruck. Die folgende geschweifte Klammer beendet die Fabrik.

**Typische Falle:** Eine Closure friert nicht die Zahl zehn ein. Sie behält Zugriff auf die veränderliche Bindung, weshalb der zweite Aufruf den bereits veränderten Stand liest. Zwei mit verschiedenen Fabrikaufrufen erzeugte Zähler teilen diesen Stand nicht.

### Currying

- `function shippingCost(base)` nimmt nur den Grundpreis entgegen.
- Das erste `return function (perItem)` liefert eine weitere Funktion zurück, die sich den Grundpreis über eine Closure merkt.
- Das zweite `return function (quantity)` liefert die letzte Funktion zurück; sie hat Zugriff auf Grundpreis und Stückpreis.
- `return base + perItem * quantity;` berechnet die Kosten erst dann, wenn alle drei Werte vorliegen. Multiplikation wird vor Addition ausgewertet.
- Die folgenden Klammern schließen die innere Funktion, die mittlere Funktion und schließlich die äußere Funktion.

Aus einer Funktion mit mehreren Argumenten wird hier eine Kette von Funktionen mit je einem Argument: **Currying**. Wenn wir `shippingCost(5)(2)` schon aufrufen und das Ergebnis unter `localRate` speichern, ist das **partielle Anwendung**. Das sind verwandte, aber nicht gleiche Begriffe.

### `runDemo()` Schritt für Schritt

- Die Funktionsdeklaration sammelt die demonstrierenden Aufrufe, damit bloßes Importieren für Tests noch keine Konsolenausgabe auslöst.
- Die erste `console.log`-Zeile übergibt `value => value * 2` als Callback und ruft `repeatTransform` mit drei Wiederholungen und Startwert fünf auf. Die geprüfte Folge lautet fünf, zehn, zwanzig, vierzig.
- Die `map`-Zeile nimmt jedes Element und liefert dessen Doppeltes in einem neuen Array. Das Originalarray wird durch `map` nicht verändert.
- Die `filter`-Zeile prüft `value % 2 === 0`. `%` ist der Restoperator; Rest null bedeutet hier gerade Zahl. Nur passende Elemente gelangen in das neue Array.
- Die `reduce`-Zeile startet den Akkumulator `sum` mit null und addiert nacheinander jedes Element. Der Rückgabewert des Callbacks wird der nächste Akkumulator.
- `const first = createCounter(10);` speichert den zurückgegebenen Funktionswert. `const` verbietet das spätere Austauschen dieser Bindung, nicht die Änderung des eingeschlossenen Zustands.
- `const second = createCounter(100);` legt einen unabhängigen Zähler an.
- `first()` erhöht den ersten Zustand mit dem Standardargument eins; die geprüfte Ausgabe ist elf.
- `first(2)` erhöht denselben Zustand um zwei; die geprüfte Ausgabe ist dreizehn.
- `second()` verändert ausschließlich den zweiten Zustand; die geprüfte Ausgabe ist einhunderteins.
- `const localRate = shippingCost(5)(2);` ruft zwei Funktionen hintereinander auf und speichert die dritte, noch nicht aufgerufene Funktion.
- Die erste Kosten-Ausgabe ruft `shippingCost(5)(2)(3)` vollständig auf. Der geprüfte Wert ist elf.
- `localRate(4)` verwendet dieselben festgelegten Tarife für eine andere Menge. Der geprüfte Wert ist dreizehn.
- Die abschließende Klammer beendet `runDemo`.

### Node und Browser ohne Bibliothek unterscheiden

- `typeof module !== 'undefined'` kann auch im Browser gefahrlos geprüft werden; ein direktes `module` ohne `typeof` würde dort eine unbekannte Variable lesen.
- `&& module.exports` wird nur ausgewertet, wenn der linke Teil wahr ist. Das ist Kurzschlussauswertung.
- `module.exports = {...}` stellt die vier Funktionen unter Node den Tests zur Verfügung. Die Objekt-Kurzschreibweise verwendet die bestehenden Funktionsnamen als Werte.
- `if (require.main === module) runDemo();` startet die Demonstration nur beim direkten Node-Aufruf dieser Datei, nicht beim Import.
- Der `else`-Zweig ruft `runDemo()` im Browser auf, wo kein CommonJS-Modul vorliegt.
- Leerzeilen strukturieren den Text; Kommentare beginnen mit `//` und haben keine Laufzeitwirkung.

**Live ändern:** In der ersten Callback-Funktion `* 2` durch `+ 2` ersetzen und die drei Zwischenstände vorhersagen. Für eine Browseränderung danach neu laden. Die Beispiele sind bewusst klein; der Wiederholungsparameter ist hier keine Eingabe aus einem Formular.

## `ue4.3/console-output.js` – die Originalaufgabe 3e

Diese Datei ist vom Codebild auf Seite 2 abgeschrieben. Sie ist kein neu erfundenes Ersatzbeispiel.

- `function myFunct(a,b,x)` definiert drei Parameter. Beim ersten und zweiten Aufruf werden nur zwei Argumente übergeben; der dritte Parameter ist daher jeweils `undefined`. Er wird in der Funktion nirgends benutzt.
- `let calc = function (i)` erzeugt bei jedem äußeren Aufruf einen eigenen Funktionswert. `i` ist der Parameter der inneren Funktion.
- `console.log(i+b)` liest `i` aus dem inneren Aufruf und `b` aus dem erhaltenen äußeren Aufruf. Der Plusoperator addiert die hier ausschließlich numerischen Werte.
- `return i+b` berechnet denselben Wert als Rückgabe. Eine Rückgabe ist nicht dasselbe wie eine Konsolenausgabe.
- Die Klammer schließt den Funktionsausdruck. Das fehlende Semikolon ist wie im Bild gültig; JavaScript ergänzt es hier durch automatische Semikolon-Einfügung.
- `if (a < 20) return calc(a)` ruft die innere Funktion sofort auf, wenn der erste Parameter kleiner als zwanzig ist. Der äußere Rückgabewert ist in diesem Fall eine Zahl.
- Im `else`-Zweig gibt `console.log(a)` zuerst den äußeren Parameter aus.
- `return calc` gibt dann die Funktion selbst zurück, ohne Klammern und ohne sie auszuführen.
- `let x = myFunct(12,8)` nimmt den ersten Zweig. `calc(12)` protokolliert zwanzig und liefert zwanzig; das globale `x` enthält danach diese Zahl.
- `let y = myFunct(21,7)` protokolliert einundzwanzig und gibt die zweite `calc`-Funktion zurück. Diese merkt sich die Bindung `b` mit Wert sieben.
- `y(14)` protokolliert einundzwanzig und liefert diesen Wert zurück; der Rückgabewert wird durch die Anweisung nicht weiter gespeichert.
- `y(9,33)` protokolliert sechzehn. Das zusätzliche Argument dreiunddreißig ersetzt nicht die äußere Bindung `b`. Die innere Funktion hat nur den benannten Parameter `i` und liest das Extraargument nicht.

Die vier expliziten Logs sind deshalb in dieser Reihenfolge `20`, `21`, `21`, `16`. Eine interaktive Entwicklerkonsole kann zusätzlich Auswertungsresultate anzeigen; das sind keine weiteren `console.log`-Aufrufe des Programms. Das innere Parameter-`x` und das äußere `let x` sind verschiedene Bindungen; es gibt keinen Zugriff vor Initialisierung.

**Live ändern:** `y(9,33)` durch `y(9,999)` ersetzen. Die letzte Ausgabe muss unverändert bleiben. Den Faktor beziehungsweise äußeren Parameter `b` nur in `myFunct(21,7)` ändern und prüfen, welche späteren Ausgaben von dieser Closure abhängen.

## `ue4.3/shopD.js` – jede Zeile und beide `this`-Ebenen

Die Basis ist die korrigierte Version von `shopB.js`; die unveränderte Vorlage liegt in `Angabe/files/shopB.js`. Die Aufgabe verlangt hier bewusst eine Methode im Konstruktor, nicht am Prototype.

### Gemeinsame Liste und Protokollierung

- Zeile 1 aktiviert strict mode.
- Zeile 3 erzeugt das gemeinsame Array `products`. Das top-level `let` eines klassischen Scripts ist eine globale lexikalische Bindung, keine automatisch erzeugte `window.products`-Eigenschaft.
- Zeilen 5–6 legen das Listenobjekt an und speichern eine Referenz auf genau dieses Array.
- Zeile 7 definiert `listProducts` als normale Methode. Bei `productList.listProducts()` wird `productList` zum Empfänger `this`.
- Zeile 8 verwendet einen Arrow-Callback im `forEach`. Der Arrow erbt das `this` der umgebenden Methode. Die Originalvorlage hatte hier eine normale Funktion und verlor diesen Empfänger.
- Zeile 9 prüft, ob das betrachtete Produkt eine positive Menge hat. Nur dann wird protokolliert.
- Zeile 10 bildet mit `(index + 1) % this.products.length` den Index des nächsten Produkts. Der Restoperator führt nach dem letzten Produkt wieder zum ersten. Bei einer leeren Liste würde der Callback gar nicht laufen.
- Zeile 11 liest dieses nächste Produkt aus dem Array.
- Zeile 12 protokolliert dessen Titel samt Semikolon. Das ist absichtlich die Semantik der Vorlage und nicht eine neue Ausgabe des aktuellen Titels.
- Zeilen 13–16 schließen Bedingung, Callback, Methode und Objekt.

### Vollständiges Rendern

- Zeile 18 deklariert `updateCart` als Koordinator für die gesamte Ansicht.
- Zeile 19 sucht die vorhandene Bestellliste über ihre ID.
- Zeile 20 entfernt ihre bisherigen Kindknoten. Sonst würden alte Positionen bei jeder Änderung dupliziert.
- Zeile 21 startet die Summe in ganzen Cent bei null.
- Zeile 22 iteriert über die aktuellen Produktobjekte.
- Zeile 23 lässt nur positive Mengen als Zeilen erscheinen.
- Zeile 24 erzeugt einen frischen Listeneintrag.
- Zeile 25 ruft `p.render()` mit `p` als Empfänger auf und setzt den resultierenden Text. `textContent` interpretiert Produktnamen nicht als HTML.
- Zeile 26 hängt die fertige Zeile an die Liste.
- Zeile 27 wandelt den Stückpreis in Cent um, rundet auf die für diese Vorlage vorgesehenen ganzen Cent und multipliziert mit der Menge. Die Gesamtsumme wird in Cent aufgebaut.
- Zeilen 28–29 schließen Bedingung und Schleife.
- Zeile 30 teilt die Summe zur Anzeige durch hundert und formatiert zwei Nachkommastellen. `toFixed` liefert eine Zeichenkette.
- Zeile 31 schreibt die Änderungsmarkierung in die Konsole.
- Zeile 32 ruft die oben definierte Listenmethode mit richtigem Empfänger auf.
- Zeile 33 beendet die Funktion.

### Produktdaten und Instanzmethoden

- Zeile 35 definiert die Konstruktorfunktion. Beim Aufruf mit `new Product(pdiv)` zeigt `this` auf die neue Instanz.
- Zeile 36 liest das Produktkennzeichen aus `dataset.prodid`. Die Schreibweise entspricht dem durch HTML normalisierten Attributnamen.
- Zeile 37 liest die Überschrift gezielt mit `querySelector('h2')`; damit hängt die Lösung nicht von Whitespace-Textknoten ab.
- Zeile 38 liest die Beschreibung.
- Zeile 39 entfernt umgebende Leerzeichen, ersetzt das Komma durch einen Dezimalpunkt und wandelt den Text in eine Zahl um. Das ist für das ungruppierte Kommaformat der Vorlage gedacht, nicht als allgemeiner internationaler Währungsparser.
- Zeile 40 initialisiert die Menge mit null.
- Zeile 42 weist der Instanz eine normale Funktion als `updateProduct` zu; das optionale Ereignisargument heißt `e` und wird für diese Logik nicht weiter gebraucht.
- Zeile 43 erhöht die Menge auf dem Empfänger um eins.
- Zeile 44 ruft den globalen Renderer auf.
- Zeile 45 beendet den Funktionsausdruck.
- Zeile 46 legt den instanzeigenen Renderer an.
- Zeile 47 erzeugt mit einem Template-String die Ausgabe aus Titel, formatiertem Stückpreis und Menge.
- Zeile 48 schließt diesen Renderer.

### Die neue Fabrik: jetzt gegenüber später unterscheiden

- Zeile 49 weist `this.getEventHandler` einen normalen Funktionswert zu. Diese Zuweisung passiert für jede neue Instanz.
- Zeile 50 gibt einen Arrow `(event) => this.updateProduct(event)` zurück. Die Methode wird zu diesem Zeitpunkt noch nicht ausgeführt. Der Arrow behält das `this` des Fabrikaufrufs.
- Zeile 51 schließt die Fabrik.
- Zeile 52 findet das `.buy`-Div. Ein Klick auf dessen ursprüngliches Input steigt durch Bubbling zu diesem Div auf.
- Zeile 53 führt `this.getEventHandler()` **jetzt** als Methode des Produkts aus. Deshalb ist das Fabrik-`this` die Produktinstanz. Der zurückgegebene Arrow wird als Callback für **später** registriert.
- Zeile 54 beendet den Konstruktor.

Beim späteren Klick übergibt der Browser das Event. Ein Arrow bekommt kein neues `this`; er verwendet weiterhin das Produkt. Der Aufruf `this.updateProduct(event)` findet die aktuelle Eigenschaft und ruft sie mit dem Produkt als Empfänger auf. Wenn Fabio die Methode später austauscht, nutzt der bestehende Arrow die neue Methode. Ein vorab gebundener Funktionswert wäre in dieser Hinsicht anders: Er hätte schon die ursprüngliche Funktion gespeichert.

**Typische Falle:** `return function (event) { this.updateProduct(event); }` übernimmt das äußere `this` nicht. Als ungebundener DOM-Listener bekommt diese normale Funktion das Div als Empfänger. Das Div hat keine Methode `updateProduct`. Eine normale Funktion könnte mit `.bind(this)` oder einer eingeschlossenen `self`-Variable funktionieren; der verlangte Arrow löst genau dieses Empfängerproblem direkt.

### Initialisierung und Leeren

- Zeile 56 startet die Schleife über alle vorhandenen Produkt-Divs.
- Zeile 57 konstruiert jedes Produkt und speichert es im gemeinsamen Array.
- Zeile 58 schließt die Schleife.
- Zeile 59 registriert einen Handler am unverändert `emptyCard` geschriebenen Element der Vorlage.
- Zeile 60 setzt sämtliche Mengen auf null. Nur die DOM-Liste zu löschen wäre falsch, weil die Daten sonst wieder auftauchen.
- Zeile 61 aktualisiert danach Ansicht und Summe.
- Zeile 62 schließt den Listener.
- Zeile 63 rendert den anfänglich leeren Warenkorb und entfernt die Beispiel-Platzhalter aus dem HTML.

## Die beiden HTML-Dateien

### `index.html`

- `<!doctype html>` wählt den Standards-Modus des Browsers.
- `<html lang="en">` markiert die Sprache der sichtbaren Aufgabentexte.
- `<head>` enthält Metadaten, UTF-8-Zeichensatz und den Titel.
- Die zwei `script`-Zeilen laden erst `examples.js`, danach `console-output.js`. `defer` verschiebt die Ausführung bis nach dem HTML-Parsen und erhält bei klassischen externen Scripts die Reihenfolge.
- `<body>` enthält eine Überschrift, den Hinweis auf die Konsole und den relativen Link zur Shopping-Demonstration. Der Link führt zur zweiten Seite und lädt keinen fremden Dienst.
- Die schließenden Tags beenden Kopf, Hauptinhalt und Dokument. Es gibt kein Framework und kein Inline-Script.

### `productsD.html`

Das Dokument wurde aus der gelieferten `productsB.html` kopiert; nur die Scriptreferenz zeigt auf `shopD.js`. Es enthält denselben CSS-Block, dieselben vier Produkt-Divs, IDs, Namen, Preise, Bestellliste und den Leer-Button. Jede Zeile dieser gemeinsamen HTML-Struktur wird bereits im Abschnitt zu den Dateien von Aufgaben 1 und 2 erklärt. Die CSS-Regeln betreffen Schrift, silbernen Produkthintergrund, Flex-Anordnung und Abstände; sie führen keine Warenkorblogik aus. Die neuen Regeln zu Closures und `this` stehen vollständig im Script.

## `tests_3.cjs` – Warum diese Prüfungen?

Der Test ist Entwicklungswerkzeug, keine Abgabe-Bibliothek. Jede ausführbare Anweisung lässt sich einem dieser Blöcke zuordnen:

- `require` lädt Nodes Assertions, Dateizugriff, Pfadbehandlung, `vm` für isolierte Script-Ausführung und `pathToFileURL` für korrekte Datei-URLs. Der weitere Import liest die eigenen Beispielfunktionen. Der Playwright-Import verwendet entweder den Paketnamen oder die explizit gesetzte Umgebungsvariable `PLAYWRIGHT_MODULE`; ein Browserpfad kann über `PLAYWRIGHT_CHROMIUM` gesetzt werden. Es wird kein persönlicher Installationspfad in die Dateien geschrieben.
- `let passed = 0` zählt nur wirklich fertig ausgeführte Tests. Der `test`-Helfer wartet den Callback ab, erhöht danach den Zähler und protokolliert `PASS`. Ein vorher geworfener Assertionfehler wird nicht als bestanden gezählt.
- Der erste Test zählt die echten Callback-Aufrufe und prüft den Endwert sowie eine Schleife mit null Durchläufen. Der Throw-Callback im Nullfall beweist, dass er nicht ausgeführt wird.
- Der zweite Test prüft die konkreten Arrays und die Summe der drei eingebauten higher-order Beispiele. `deepEqual` vergleicht die Arrayinhalte, nicht nur Referenzen.
- Der dritte Test ruft beide Zähler mehrfach auf, außerdem mit null und einem negativen Schritt. Er prüft so die erhaltenen, aber voneinander getrennten Bindungen.
- Der vierte Test prüft `.length` als Anzahl formaler Parameter an jeder Currying-Stufe, die vollständige Kostenberechnung und die Wiederverwendung einer teilweise angewendeten Funktion. Die Mengen null und vier dürfen denselben Tarif nicht verändern.
- `readFileSync` liest die echte abgegebene Datei für 3e. Der Test erstellt mit `vm.createContext` eine isolierte Umgebung und ersetzt deren `console.log` durch einen Sammler. `vm.runInContext` führt genau die gelesene Datei aus. Die Assertions prüfen die Reihenfolge der vier Zahlen, den Wert von `x`, den Typ von `y`, ein anderes Extraargument und den Grenzfall `a = 20`.
- `chromium.launch` startet einen echten Headless-Browser. Ein optionaler expliziter ausführbarer Pfad wird nur dann weitergegeben, wenn er gesetzt wurde.
- `try/finally` sorgt dafür, dass der Browser auch bei einem fehlgeschlagenen Test geschlossen wird. `newPage` erstellt eine Seite, das `pageerror`-Event sammelt unbehandelte Scriptfehler.
- Der erste Browsertest öffnet die echte `productsD.html`, prüft die Nullsumme und dass jede Instanz ihre eigene `getEventHandler`-Methode besitzt. `page.evaluate` läuft im Browser, nicht im Node-Kontext.
- Der zweite Browsertest klickt jedes der vier Inputs genau einmal und prüft alle vier Mengen, vier Warenkorbzeilen und den echten Gesamtpreis. Anschließend muss die Fehlerliste leer sein.
- Der dritte Browsertest holt einen Handler, tauscht danach die Produktmethode vorübergehend aus und ruft den Handler mit einem absichtlich falschen Empfänger auf. Die Ersatzmethode prüft das richtige Produkt-`this` und das unveränderte Eventobjekt, bevor sie die Originalmethode weiter aufruft. Anschließend wird die Methode zurückgesetzt. Der Vergleich prüft das vollständige Ergebnisobjekt und die neue Summe.
- Der vierte Browsertest erzeugt absichtlich die falsche normale Rückgabefunktion und ruft sie mit einem DOM-Div als Empfänger auf. Ein erwarteter und aufgefangener `TypeError` bestätigt die Erklärung; er ist kein unbehandelter Fehler der abgegebenen Lösung.
- Der fünfte Browsertest klickt auf Leeren und prüft sämtliche Mengen, Nullsumme und leere Zeilenliste.
- Der letzte Browsertest registriert einen Konsolenbeobachter, öffnet `index.html`, prüft die letzten vier Logs der Originalaufgabe und eine Currying-Ausgabe. Damit ist auch die Browserverzweigung ohne Node-Globale getestet.
- Nach dem Schließen des Browsers wird die Anzahl fertig bestandener Tests ausgegeben. `main().catch(...)` protokolliert echte Fehler und setzt `process.exitCode = 1`, damit ein automatischer Aufrufer Fehlschläge erkennt.

Die tatsächlich ausgeführte Prüfung meldete elf bestandene Tests. Die Zahlen in Beispielen und Antworten sind durch diese Ausführung gedeckt und nicht als ungetestete Wunschwerte eingefügt.

**Live ändern:** In `getEventHandler` den Arrow vorübergehend durch die erläuterte normale Funktion ersetzen und den Receiver im Debugger beobachten. Danach zurücksetzen und den Test erneut ausführen. Fabio soll Änderungen vor einer Abgabe selbst nachvollziehen; die automatische Lösung behauptet keine bereits geleistete persönliche Bearbeitung.
