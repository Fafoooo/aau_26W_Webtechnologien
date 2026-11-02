# Aufgaben 4 und 5 — jede Datei verstehen

## 4.0 Überblick: Welche Datei tut was?

In `ue5.4/` und `ue5.5/` liegen je fünf Dateien. Die Lösung benötigt keine Bibliothek und keinen Buildschritt.

- `products.html` ist die im Browser geöffnete Seite.
- `products.css` legt nur das Aussehen fest, nicht den Netzwerkablauf.
- `products.json` enthält exakt die gelieferten Produktdaten. Ein JSON-Dokument ist Datenbestand, kein JavaScript-Programm.
- `products.js` lädt die Daten, prüft sie und erstellt die sichtbaren Elemente.
- `antwort.md` beantwortet die Aufgabe auf Englisch und nennt die Grenzen. Sie wird nicht vom Browser ausgeführt.

Aufgaben 4 und 5 unterscheiden sich nur beim Laden. Die Prüffunktion und der Renderer sind bewusst identisch kopiert. Dadurch lässt sich jeder Ordner allein verwenden, ohne auf die andere Lösung zu verweisen.

### Ausführen

Im Blattordner einen Server starten:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Danach `http://127.0.0.1:8080/ue5.4/products.html` oder `http://127.0.0.1:8080/ue5.5/products.html` öffnen. Der Server läuft im Vordergrund; mit Strg+C beendet man ihn. Er ist nur an die lokale Loopback-Adresse gebunden. Für die Aufgabe ist kein Zugriff auf einen fremden Server und keine Anmeldung nötig.

**Warum kein Doppelklick?** Der Doppelklick öffnet gewöhnlich eine `file:`-Adresse. Die Aufgabe verlangt ausdrücklich einen Webserver. Browser behandeln lokale Dateien und HTTP-Ursprünge unterschiedlich; Fetch/XHR sollen hier einen normalen HTTP-Status, einen Body und Fehlerfälle verarbeiten können.

## 4.1 `products.html` — von oben nach unten, in beiden Ordnern gleich

1. `<!doctype html>` aktiviert den aktuellen HTML-Standardmodus.
2. `<html lang="en">` kennzeichnet die Sprache der Benutzeroberfläche; die Angabe ist englisch.
3. `<head>` enthält Informationen über die Seite, nicht ihre sichtbaren Produktkarten.
4. `<meta charset="utf-8">` legt die Zeichencodierung fest. Ohne eine ausdrückliche Codierung könnte ein Browser Sonderzeichen anders deuten.
5. Die `viewport`-Zeile passt den sichtbaren Layoutbereich an die Gerätebreite an.
6. `<title>` bestimmt den Text im Browsertab.
7. `<link rel="stylesheet" href="products.css">` lädt die CSS-Datei aus demselben Ordner.
8. `<script src="products.js" defer>` lädt JavaScript. `defer` wartet mit der Ausführung, bis der HTML-Baum aufgebaut ist. Deshalb existiert der weiter unten angelegte Produktcontainer beim ersten `getElementById`.
9. `</head>` beendet den Kopf.
10. `<body>` beginnt den sichtbaren Inhalt.
11. `<h1>` zeigt die Seitenüberschrift.
12. `<div id="productContainer" aria-live="polite">` ist das Ziel für alle Karten, Lade- und Fehlermeldungen. `aria-live` ermöglicht es Hilfstechnologien, Änderungen anzukündigen, ohne sofort zu unterbrechen.
13. Die Schluss-Tags beenden Body und Dokument. Sie enthalten keine Programmlogik.

Die Original-HTML bleibt in `Angabe/files/ex4/` erhalten. Hier wurden UTF-8, Viewport und CSS ergänzt; die Beschränkung „nur eine Funktion ändern“ gilt für Aufgabe 2, nicht für diese beiden Netzwerkaufgaben.

## 4.2 `products.css` — jede Regel

- `body { font-family: Arial, sans-serif; }` wählt zuerst Arial und bei fehlender Schrift eine serifenlose Alternative.
- `.product` macht die Karte silberfarben wie im vorherigen Blatt. `padding` schafft Innenabstand, `margin-bottom` trennt Karten voneinander.
- `.product > div` wählt nur den direkten Zeilencontainer unter der Karte. `display: flex` ordnet Beschreibung, Preis und Kaufbereich nebeneinander an. `gap` schafft Abstand; `flex-wrap: wrap` erlaubt bei engem Platz einen Zeilenumbruch.
- `.product h2` setzt die Größe der Produktüberschrift auf 20 Pixel.
- `.desc { flex: 8; }` gibt der Beschreibung einen größeren Anteil am verfügbaren Platz.
- `.price { flex: 2; text-align: right; }` gibt dem Preis weniger Platz und richtet ihn rechts aus.
- `.buy { flex: 1; ... }` macht den Kaufbereich schmaler und rechtsbündig. `white-space: nowrap` hält Knopf und Zähler zusammen.
- `.error` setzt eine dunkle rote Farbe. Der Fehler ist zusätzlich Text mit `role="alert"`; er wird nicht nur durch Farbe vermittelt.

Die Flex-Werte sind relative Gewichte, keine Pixelbreiten. Auf sehr kleinen Geräten kann ein Bereich wegen seiner Mindestbreite umbrechen; das ist hier beabsichtigt.

## 4.3 `products.json` — jedes Feld verstehen

Die äußeren eckigen Klammern bilden ein Array. Jedes geschweifte Klammerpaar ist ein Produktobjekt. Zwischen Objekten stehen Kommas. JSON verlangt doppelte Anführungszeichen um Feldnamen und Zeichenketten; Kommentare und ein letztes überflüssiges Komma wären ungültig.

- `id` identifiziert das Produkt. Der Code überträgt es nach `data-prodid`. Es wird nicht als HTML interpretiert und nicht zu einer Codeanweisung gemacht.
- `title` erscheint im `h2`.
- `desc` erscheint im Element mit Klasse `desc`.
- `price` ist eine Zahl, keine Zeichenkette. Die Nachkommastellen entstehen erst beim Anzeigen.

Die gelieferten vier Objekte bleiben einschließlich Namen, Schreibweisen, Beschreibungen und Zahlen unverändert. Der Test liest die Ausgangsdatei und vergleicht die ganze Datei byteweise mit beiden Kopien. Der Lösungsprozess korrigiert keine vermuteten Tippfehler in der Angabe.

## 4.4 Anfang von `products.js`

Diese Zeilen stehen in beiden Implementierungen:

```js
'use strict';
const container = document.getElementById('productContainer');
const productURL = 'products.json';
initialize(productURL, container);
```

- `use strict` aktiviert strengere JavaScript-Regeln, etwa gegen das unabsichtliche Erzeugen globaler Variablen.
- `const container` merkt sich die Referenz auf den bereits vorhandenen DOM-Knoten. `const` verhindert nur das erneute Zuweisen der Variablen, nicht Änderungen am Element.
- `productURL` ist bewusst relativ. Es gibt keine fest verdrahtete absolute Adresse mit dem im Original vorgeschlagenen Port. Der Browser löst den Namen relativ zur HTML-Seite auf.
- `initialize` startet den einen Ladeablauf. Eine Funktionsdeklaration kann schon aufgerufen werden, obwohl ihre Definition weiter unten im Script steht.
- Der Rückgabewert wird hier nicht benutzt. Für Tests ist er nützlich: Er erlaubt, wirklich auf den vollständigen Ablauf zu warten. Erwartete Netzwerk-, HTTP- und Datenfehler werden intern behandelt.

## 4.5 Aufgabe 4: `initialize` mit XMLHttpRequest

### Ein Aufruf, ein neuer Request

```js
function initialize(jsonURL, domElement) {
    domElement.textContent = 'Loading products...';
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
```

Die beiden Parameter stammen vom Aufrufer. Die Funktion benutzt sie tatsächlich; sie ist nicht heimlich nur auf den globalen Container zugeschnitten. Der Ladetext entfernt ältere Inhalte. `new Promise` dient als Fertigmeldung für den Aufrufer. Sein Executor läuft sofort. `new XMLHttpRequest()` erstellt ein neues natives Requestobjekt. Es wird hier **kein Fetch** benutzt.

```js
const fail = error => {
    showError(domElement, error);
    resolve(null);
};
```

Die lokale Fehlerfunktion vermeidet mehrfach kopierten Fehlercode. Sie ersetzt das Ziel durch eine Meldung und meldet dem Aufrufer `null`. Das Promise wird bei erwarteten Betriebsfehlern also erfüllt, nicht abgelehnt. Das ist eine bewusst dokumentierte Schnittstelle: Array bedeutet Erfolg, `null` bedeutet behandelter Fehler. Ein leeres Array bleibt vom Fehler unterscheidbar.

### HTTP-Antwort verarbeiten

```js
request.addEventListener('load', () => {
    try {
        if (request.status < 200 || request.status >= 300) {
            throw new Error('HTTP ' + request.status);
        }
        const products = validateProducts(JSON.parse(request.responseText));
        renderProducts(products, domElement);
        resolve(products);
    } catch (error) {
        fail(error);
    }
});
```

- `load` heißt: Der HTTP-Austausch ist abgeschlossen. Es heißt nicht, dass der Server erfolgreich geantwortet hat.
- `try` umfasst Statusprüfung, JSON-Parsing, Datenprüfung und Darstellung.
- Der Status muss im erfolgreichen 2xx-Bereich liegen. Das `||` bedeutet „oder“: Zu kleine **oder** zu große Werte sind Fehler.
- `throw new Error(...)` bricht den Erfolgsweg ab und übergibt die Fehlermeldung an `catch`.
- `responseText` ist zunächst Text. `JSON.parse` macht daraus JavaScript-Daten. Ungültiger JSON-Text wirft eine Exception.
- Der Rückgabewert von `JSON.parse` wird an `validateProducts` übergeben. Erst wenn die **gesamte** Liste geprüft ist, wird `products` gespeichert und anschließend gezeichnet.
- `renderProducts` schreibt in das als Parameter übergebene Element.
- `resolve(products)` meldet den Erfolg. Erst danach können wartende Promise-Reaktionen weiterlaufen.
- `catch (error)` fängt auch Syntax- und Validierungsfehler ab und delegiert sie an `fail`.

**Falle:** Ein leerer HTTP-204-Body ist zwar ein erfolgreicher HTTP-Status, aber kein JSON-Array. Das Parsen schlägt fehl und zeigt korrekt einen Datenfehler.

### Unterschiedliche Fehlerereignisse

```js
request.addEventListener('error', () => fail(new Error('Network error.')));
request.addEventListener('timeout', () => fail(new Error('Request timed out.')));
request.addEventListener('abort', () => fail(new Error('Request aborted.')));
```

`error` steht hier für einen Transportfehler, etwa eine abgebrochene Verbindung. `timeout` bedeutet, dass die konfigurierte Wartezeit überschritten wurde. `abort` ist ein ausdrücklicher Abbruch. Jeder Handler baut eine verständliche Error-Instanz und ruft dieselbe Fehlerbehandlung auf. Ein HTTP-404 gehört **nicht** zum ersten Handler, sondern wird im `load`-Handler erkannt.

### Request einrichten und versenden

```js
try {
    request.open('GET', jsonURL, true);
    request.timeout = 10000;
    request.send();
} catch (error) {
    fail(error);
}
```

- `open` setzt Methode, Adresse und mit `true` den asynchronen Modus. Eine kaputte URL kann hier schon eine Exception verursachen.
- `timeout = 10000` setzt die Wartezeit in Millisekunden. Ein dauerhaft wartender Server blockiert damit die Bedienoberfläche nicht endlos.
- `send()` schickt den GET ohne Requestbody ab und kehrt zurück, während das Netzwerk weiterarbeitet.
- Das äußere `catch` ist von dem im `load`-Handler getrennt: Es fängt synchrone Einrichtungs-/Sendefehler ab, der andere Block spätere Antwortfehler.
- Die folgenden schließenden Klammern beenden `try/catch`, Promise-Executor und Funktion. Keine zusätzliche Ausführung wird dadurch ausgelöst.

## 5.1 Aufgabe 5: `initialize` mit Fetch

Die folgenden Hilfsfunktionen sind mit Aufgabe 4 identisch; nur diese Ladefunktion wird ausgetauscht.

```js
async function initialize(jsonURL, domElement) {
    domElement.textContent = 'Loading products...';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
```

`async` bewirkt, dass die Funktion ein Promise zurückgibt. Der Ladetext hat dieselbe Bedeutung wie zuvor. Ein `AbortController` kann das Requestsignal auf „abgebrochen“ setzen. Der Timer ruft nach Ablauf `abort()` auf. Controller und Timer gehören ausschließlich zu diesem Aufruf.

```js
try {
    const response = await fetch(jsonURL, { signal: controller.signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const products = validateProducts(await response.json());
    renderProducts(products, domElement);
    return products;
```

1. `fetch` startet den nativen Request und bekommt das Abbruchsignal. Der Standard ist GET.
2. `await` pausiert nur diese asynchrone Funktion, nicht den Browser und nicht andere Tasks.
3. Nach dem ersten `await` liegen die Response-Metadaten vor; der Body muss noch nicht vollständig gelesen sein.
4. `response.ok` ist nur bei 2xx wahr. Fetch lehnt sein Promise bei 404/500 nicht von selbst ab. Deshalb ist die Prüfung erforderlich.
5. `response.json()` liest und parst den Body asynchron. Das zweite `await` wartet darauf. Auch ein Fehler erst beim Bodylesen landet im `catch`.
6. `validateProducts` erhält die bereits geparsten Daten. Der Renderer bekommt nur geprüfte Daten.
7. `return products` erfüllt das von `async` erzeugte Promise mit dem Array.

```js
} catch (error) {
    const reason = error.name === 'AbortError'
        ? new Error('Request timed out.') : error;
    showError(domElement, reason);
    return null;
} finally {
    clearTimeout(timeout);
}
```

- `catch` verarbeitet Fehler aus Fetch, Bodylesen, JSON-Parsing, Validierung und Darstellung.
- Der bedingte Ausdruck `Bedingung ? WertWennWahr : WertWennFalsch` übersetzt einen `AbortError` in die Timeout-Meldung. Der Controller wird in dieser Anwendung ausschließlich vom Timeout ausgelöst.
- Andere Error-Objekte bleiben erhalten. So geht etwa „HTTP 404“ nicht in einem allgemeinen Netzwerktext verloren.
- `showError` zeigt den Fehler im tatsächlich übergebenen Element.
- `return null` entspricht dem dokumentierten Fehlerwert der XHR-Variante.
- `finally` wird auch dann ausgeführt, wenn der Erfolgs- oder Fehlerzweig schon `return` verwendet. `clearTimeout` entfernt den nicht mehr benötigten Timer. Ein erfolgreicher Request soll später nicht unnötig noch abgebrochen werden.
- Der Timeout bleibt bis zum Abschluss der Bodyverarbeitung aktiv, nicht nur bis die Header ankommen.

**Live-Änderung:** Will man eine andere Timeoutdauer, muss man in der passenden Variante den tatsächlichen Zahlenwert ändern, nicht nur den Meldungstext. Ein anderer JSON-Dateiname gehört in `productURL` oder in das Argument von `initialize`.

## 5.2 Gemeinsame Prüffunktion `validateProducts`

```js
if (!Array.isArray(products)) throw new Error('Expected an array of products.');
const ids = new Set();
for (const product of products) {
```

Ein Objekt wie `{ "products": [] }` ist nicht das verlangte Array. `Array.isArray` prüft genau das. Ein `Set` merkt sich schon benutzte IDs, damit keine doppelt vorkommen. `for...of` verarbeitet jedes Produktobjekt nacheinander.

Die lange `if`-Bedingung besteht aus einzelnen mit `||` verbundenen Gründen für Ungültigkeit:

- `!product`: lehnt insbesondere `null` ab, bevor auf Eigenschaften zugegriffen wird.
- `typeof product !== 'object'`: verhindert primitive Werte wie Zahlen oder Text als Produkt.
- `typeof product.id !== 'string'`: verlangt eine Zeichenkette für die ID.
- `product.id.trim() === ''`: lehnt eine nur aus Leerraum bestehende ID ab. `trim` wird wegen der Kurzschlussauswertung erst aufgerufen, wenn die ID wirklich Text ist.
- `typeof product.title !== 'string'` und dieselbe Prüfung für `desc`: verlangen Text für die beiden sichtbaren Felder.
- `typeof product.price !== 'number'`: lehnt etwa die Zeichenkette `"12.5"` ab, statt sie stillschweigend umzudeuten.
- `!Number.isFinite(product.price)`: lehnt nicht-endliche Werte ab. Bei gültigem JSON sind solche Zahlen meist nicht als normale Literale schreibbar; eine extrem große Zahl oder ein direkter Funktionsaufruf kann die Prüfung trotzdem relevant machen.
- `product.price < 0`: erlaubt keine negativen Preise.
- `ids.has(product.id)`: erkennt einen schon zuvor verarbeiteten Schlüssel.

Wenn einer dieser Gründe zutrifft, beendet `throw` die Prüfung. Nach erfolgreicher Prüfung ergänzt `ids.add(product.id)` den Schlüssel. Erst nach Ende der Schleife gibt `return products` das unveränderte gesamte Array zurück. Es wird keine teilweise gültige Liste stillschweigend übernommen.

## 5.3 Gemeinsamer Renderer `renderProducts`

### Ein Fragment statt vieler sichtbarer Zwischenzustände

`document.createDocumentFragment()` erzeugt einen noch nicht sichtbaren Sammelknoten. `for (const product of products)` beginnt für jedes Produkt einen eigenen Block. `const card = document.createElement('div')` erstellt die äußere Karte. `className = 'product'` macht sie für CSS und Tests auffindbar. `card.dataset.prodid = product.id` schreibt das Datenattribut; es wird nicht als CSS-Selektor zusammengesetzt.

### Überschrift, Beschreibung und Preis

- `createElement('h2')` erstellt die Produktüberschrift; `heading.textContent = product.title` setzt nur Text.
- `createElement('div')` für `row` bildet die Zeile unter der Überschrift.
- Ein weiteres `div` bekommt `className = 'desc'` und den Beschreibungstext.
- Der Preis erhält die Klasse `price`. `toFixed(2)` formatiert zwei Nachkommastellen und liefert Text. `.replace('.', ',')` tauscht dessen Dezimalpunkt gegen das zur Vorlage passende Komma aus. Die gespeicherte Zahl wird dadurch nicht geändert.

Die Anzeige ist kein allgemeines Währungs- oder Abrechnungssystem. Für diese Produktdaten ist die Formatierung passend; ein größeres Projekt sollte Währung und Locale ausdrücklich festlegen.

### Kaufknopf und eigener Zähler

- `buy` ist das `div` mit Klasse `buy`.
- `button` wird als `input` angelegt; `type = 'button'` verhindert ein versehentliches Formular-Submit.
- `value = 'add to cart'` beschriftet das Input. Ein Input benutzt dafür nicht seinen Textinhalt.
- `setAttribute('aria-label', ...)` nennt zusätzlich das konkrete Produkt für Screenreader.
- `quantity` ist ein `output` mit Klasse `quantity` und eigener Live-Region.
- `let count = 0` legt den veränderlichen Zustand für genau diese Karte an. Weil `let` im Schleifenblock steht, hat jede Iteration eine eigene Bindung.
- `quantity.textContent = ' (0)'` zeigt den Ausgangszustand.
- Der `click`-Callback erhöht mit `count += 1` um eins und schreibt anschließend den neuen Text. Seine Closure hält die zu dieser Karte gehörenden Variablen auch nach Ende von `renderProducts` am Leben.

Die Knöpfe führen weder eine Bestellung noch einen HTTP-POST aus. Der Zähler ist eine kleine lokale Funktionsdemonstration. Er ersetzt keinen Warenkorb mit Preisen und Gesamtsumme; das verlangt dieses Blatt nicht. Bei neuem Laden werden neue Karten und damit neue Zähler angelegt.

### Den Baum zusammensetzen

```js
buy.append(button, quantity);
row.append(description, price, buy);
card.append(heading, row);
fragment.appendChild(card);
```

Die erste Zeile setzt Knopf und Ausgabe in den Kaufbereich. Die zweite verbindet die drei Spalten in der Produktzeile. Die dritte hängt Überschrift und Zeile in die Karte. Die vierte sammelt die fertige Karte im Fragment. `append` kann mehrere Knoten auf einmal annehmen; `appendChild` hier genau einen.

Nach der Schleife ersetzt `domElement.replaceChildren(fragment)` den vorherigen Inhalt durch alle neuen Karten. Ein zweiter Aufruf hängt nicht noch eine zweite Liste an. Das Fragment gibt dabei seine Kindknoten an das Zielelement ab. Wenn `products.length === 0`, setzt die letzte Zeile stattdessen den Leerzustand `No products available.`. Ein leeres Array ist nicht derselbe Fall wie ein fehlgeschlagener Request.

**Sicherheit und typische Falle:** `textContent` interpretiert kein HTML. Ein Produkt mit einem Titel wie `<img src=x ...>` erzeugt keinen Bildknoten und kein Ereignis. `innerHTML` mit unkontrolliertem Dateninhalt wäre hier unnötig gefährlich.

## 5.4 Gemeinsame Fehleranzeige `showError`

1. Ein neues `p`-Element wird erstellt.
2. Die Klasse `error` verbindet es mit der Fehlerfarbe in CSS.
3. `role="alert"` kennzeichnet den Text als wichtige Meldung für Hilfstechnologien.
4. `message.textContent` verbindet die feste Erklärung mit `error.message`, weiterhin als Text statt HTML.
5. `domElement.replaceChildren(message)` entfernt einen Ladetext bzw. veraltete Karten und zeigt nur die Meldung.

Die Funktionen erwarten einen gültigen DOM-Container als Argument, wie in der gelieferten HTML. Das ist ihre Voraussetzung, kein allgemein beliebiges Eingabeformat. Mehrere gleichzeitige Ladevorgänge für dasselbe Ziel werden nicht verwaltet: Der zuletzt fertig werdende Vorgang bestimmt den Inhalt. Für den einzelnen Startup-Aufruf wird keine zusätzliche Versions-/Abbruchverwaltung benötigt.

## 6. Entwicklungsdatei `test_4_5.cjs`

Diese Datei gehört **nicht** in die Script-Tags der Produktseite. Playwright ist nur ein extern installiertes Browser-Testwerkzeug. Der abgegebene Produktcode bleibt Plain JavaScript.

Die Datei lässt sich in folgende direkt aufeinanderfolgende Abschnitte lesen:

1. `require` lädt ausschließlich im Test Node-Module für Assertions, Dateien, Pfade und HTTP sowie extern Playwright. Die Umgebungsvariable `PLAYWRIGHT_MODULE` erlaubt eine separate Installation; ohne sie gilt die normale Modulauflösung.
2. `original` liest die echte gelieferte JSON-Datei. `expected` parst sie für Feldvergleiche. Die erwarteten Produktzahlen werden nicht im Test neu erfunden.
3. `mode` wählt den gewünschten Serverfall. `waiting` signalisiert, wann ein Timeout-Test wirklich beim Server angekommen ist. `passed` zählt nur fertig bestandene Testgruppen. `sockets` merkt sich Verbindungen für garantiertes Aufräumen.
4. `http.createServer` legt einen echten Server an. Produktanfragen erhalten je nach Modus die Originaldaten, fehlerhafte Daten, einen HTTP-Fehler, eine bewusst zerstörte Verbindung oder absichtlich keine Antwort. Das sind ausdrücklich **Testdaten/Fehlersimulationen**, keine behaupteten Moodle-Antworten.
5. Andere Anfragen werden aus dem Blattordner bedient. Die Pfadprüfung verhindert einen Ausbruch aus diesem Wurzelordner. Die Content-Type-Zuordnung teilt dem Browser mit, ob er HTML, CSS oder JavaScript liest. `Cache-Control: no-store` verhindert, dass ein früherer Erfolgsfall spätere Fehlerfälle verdeckt.
6. Der Connection-Listener merkt sich jeden Socket und entfernt ihn beim Schließen. Dadurch kann der absichtlich wartende Timeoutfall am Ende sauber beendet werden.
7. Die kleine Hilfsfunktion `test` wartet auf ihre Prüfung. Erst danach erhöht sie den Zähler und gibt `PASS` aus. Ein Assertionfehler überspringt dieses Erhöhen und bricht den Lauf ab.
8. `main` startet den Server auf `127.0.0.1` und Port `0`. Port 0 lässt das Betriebssystem einen freien Port vergeben; die tatsächliche Adresse wird danach ausgelesen. Der Browser wird headless gestartet; ein optionaler ausführbarer Browserpfad kommt aus der Umgebung, nicht aus einem privaten fest eingebauten Pfad.
9. Die äußere Schleife prüft beide Ordner getrennt. Jede Variante erhält eine neue Browserseite. `pageerror` sammelt unbehandelte JS-Fehler; HTTP-404 in einer erwarteten Fehlerprüfung ist nicht selbst ein solcher JS-Fehler.
10. Der Bytevergleich prüft die Originaltreue der Daten. Der Erfolgstest öffnet die echte HTTP-Seite, wartet auf alle Karten, liest deren tatsächlich sichtbare Felder aus und vergleicht die Darstellung. Anschließend werden echte Knöpfe geklickt und ihre voneinander unabhängigen Zähler geprüft. Optional entsteht ein Screenshot außerhalb der Abgabe.
11. Der Argument-/Reloadtest erstellt ein zweites Zielelement, lädt mit eigener URL hinein und prüft, dass weder dort Duplikate entstehen noch der ursprüngliche Container überschrieben wird.
12. Die Fehlerschleife lässt denselben realen HTTP-Server acht unterschiedliche Probleme liefern. Jeder Aufruf muss `null` zurückgeben, alte Karten entfernen und eine Meldung zeigen. Für 404 und 500 wird zusätzlich der genaue Status im Text geprüft.
13. Der Leerlistentest erwartet `[]` und den Leerzustand. Der Textsicherheitstest liefert absichtlich HTML-artigen Inhalt und prüft, dass keine `img`-/`script`-Elemente daraus entstanden sind.
14. Für den Timeout wird die Browseruhr kontrolliert. Erst nachdem der Server den realen, unbeantworteten Request gesehen hat, wird die Zeit über die konfigurierte Grenze vorgerückt. Danach muss die echte API ihren Timeout-/Abortpfad auslösen. Es wird kein erfundenes erfolgreiches API-Ergebnis eingesetzt.
15. Der Test der kaputten URL prüft Einrichtungsfehler. Der abschließende Erfolgsrequest zeigt, dass die Seite nach Fehlern weiter nutzbar bleibt. Die Liste unbehandelter JS-Fehler muss leer sein.
16. Nach jeder Variante wird ihre Seite geschlossen. Im `finally` werden Browser, offene Sockets und Server aufgeräumt, auch bei einem Fehler. Der abschließende `catch` schreibt echte Exceptions und setzt einen von null verschiedenen Prozess-Exitcode.

Die eingebauten Fehlerfälle sind Prüfmittel und kein Teil der Produktdateien. Sie werden nur von der Testdatei erzeugt. Ein normaler Produktseitenaufruf lädt ausschließlich die mitgelieferte JSON-Datei.

## 7. Weitere Blattdateien

- `angabe_blatt05.pdf` ist die unveränderte Aufgabenstellung. `Angabe/files/` archiviert alle Originalvorlagen; dort sind keine ergänzten Lösungen versteckt.
- `README.md` erklärt Einstieg, URLs, Teilaufgaben und Testbefehle. Der Abschnitt „Project preparations“ greift die freiwillige Überlegung am Blattende auf, ohne eine konkrete Projektentscheidung von Fabio zu behaupten.
- `erklaerung_blatt05.md` bündelt den Erklärungstext zu **allen** Aufgaben. Die Detaildateien bleiben als überprüfbare Quellen erhalten.
- `test_1_3.cjs` sowie dessen Bericht werden im ersten Erklärungsteil beschrieben; `test_4_5.cjs` steht oben. Beide sind Entwicklungswerkzeuge, nicht Bestandteil einer im Browser geladenen Bibliothek.
- `pruefen.cjs` prüft zuerst mit `node --check` alle JavaScriptdateien. Danach führt es die zwei Testsuiten als echte Unterprozesse aus, verlangt ihre Erfolgsmeldungen und schreibt `testergebnis.json` nur bei vollständigem Erfolg neu. Der Gesamtwert wird aus den tatsächlich ausgelesenen Suitezählungen addiert. Ein Fehler führt zu einer Exception und einem erfolglosen Prozess, nicht zu einem erfundenen grünen Bericht.
- `testergebnis.json` und `pruefbericht_abschluss.md` dokumentieren ausgeführte Tests und deren Grenzen; sie sind kein Beleg für eine menschliche Eigenleistung.
- `ki-bericht_blatt05.tex` ist die LaTeX-Quelle zur KI-Nutzung. Präambel und Pakete setzen Schrift, Sprache, Seitenränder und klickbare Referenzen; Abschnitte enthalten echte Metadaten, Ablauf und Prompts. Die leeren Linien bei „Eigene Bearbeitung“ sind absichtlich von Fabio auszufüllen. `ki-bericht_blatt05.pdf` entsteht durch `pdflatex` daraus und enthält dieselben Aussagen, keine zusätzliche fachliche Lösung.

## 8. Ideen zum Ändern und mündlichen Erklären

- **Neues Feld anzeigen:** Zuerst das JSON-Feld und seine Validierung festlegen, dann im Renderer einen Textknoten erzeugen und Tests ergänzen. Niemals nur ungeprüftes HTML zusammenkleben.
- **Andere Datenquelle:** Die relative `productURL` ändern. Bei einer fremden Domain muss der Zielserver passende CORS-Rechte geben; das kann der Client nicht einfach abschalten.
- **Andere Preisformatierung:** Die reine Anzeige in `price.textContent` ändern; den numerischen JSON-Wert beibehalten.
- **Sortierung:** Nach erfolgreicher Validierung eine Kopie des Arrays sortieren und erst diese rendern. Die Originaldaten bleiben so unverändert.
- **Weshalb Promise und trotzdem Callback?** XHR verarbeitet Ereignisse per Callback; das zurückgegebene Promise ist die zusammengefasste Fertigmeldung. Auch Fetch verwendet beim Warten und beim Timer weiter Funktionen. Es handelt sich nicht um gegenseitig ausschließende Konzepte.
- **Weshalb kein Gesamtergebnis der Summe in Aufgabe 3?** Die unveränderte Funktion lehnt den Schritt mit dem großen nächsten Summanden absichtlich ab. Die Lösung muss an dieser Stelle stoppen und den Fehler behandeln, nicht ein gewünschtes Endergebnis vortäuschen.
