# Erklärung zu Übungsblatt 4 – vollständig

Diese Datei vereinigt die endgültigen Einzel-Erklärungen nach der unabhängigen Prüfung. Produktcode, Originalvorlagen, Tests und Live-Änderungen werden gemeinsam behandelt. Fabios persönliche Durcharbeitung wird dadurch nicht behauptet.

# Blatt 4 — Ausführliche Erklärung zu Aufgaben 1 und 2

Die abzugebenden Antworten stehen auf Englisch in `ue4.1/antwort.md` und `ue4.2/antwort.md`. Dieses Dokument erklärt die Originale, sämtliche gelieferten Code-Dateien und die tatsächlichen Tests auf Deutsch. Die Produktseiten verwenden ausschließlich gewöhnliches Browser-JavaScript und das mitgelieferte Inline-CSS; Node und Playwright gehören nur zum Testwerkzeug.

## 1. Dateien öffnen und die Varianten auseinanderhalten

| Seite | Geladenes Script | Zweck |
| --- | --- | --- |
| `ue4.1/productsA.html` | `shopA.js` | Aufgabe 1 mit normaler anonymer Funktion im Add-Listener. |
| `ue4.1/arrow.html` | `shopA-arrow.js` | Unabhängig ausführbare Alternative mit Arrow-Add-Listener. |
| `ue4.2/productsB.html` | `shopB.js` | Aufgabe 2(a), Konstruktor mit eigenen Methoden pro Instanz, beide `this`-Fehler behoben. |
| `ue4.2/productsC.html` | `productsC.js` | Aufgabe 2(b), gemeinsame Prototypmethoden, Minusbuttons, Zeilensummen und Einzel-Override. |

`productsA.html` und `productsB.html` sind byteidentische Kopien der jeweiligen Vorlage, inklusive CRLF-Zeilenenden. Die Originale in `Angabe/files` wurden nicht verändert. Nur die zusätzlichen Seiten `arrow.html` und `productsC.html` haben eine andere Scriptreferenz. Insbesondere wird die Vorgabe „You must not change the HTML file“ bei Aufgabe 1 nicht dadurch umgangen, dass heimlich `productsA.html` angepasst wird: Die geschützte Datei bleibt identisch, die alternative Demonstration ist ausdrücklich eine eigene Fixture.

Jede Seite enthält genau ein Script. Niemals beide A-Scripte gleichzeitig einbinden: Dann würden nicht nur Listener doppelt registriert; auch die wiederholte globale `let products`-Deklaration wäre problematisch.

Die Angabe schreibt für 2(b) tatsächlich **`productsC.js`**. Deshalb heißt das Script nicht etwa `shopC.js`. Außerdem nennt die PDF das erste Produkt „Sony A7V“, während beide Original-HTML-Dateien **Sony Alpha IV** mit ID **`sonyAIV`** enthalten. Die Lösung bewahrt diese tatsächlichen Daten und versieht genau das erste Originalprodukt mit dem Postfix. Auch „Nicon“ und die voneinander abweichenden Tamron-Zahlen in Titel/Beschreibung werden nicht eigenmächtig korrigiert.

## 2. HTML und CSS — alle vier Seiten verstehen

Die folgende Beschreibung deckt `productsA.html`, `productsB.html`, die zusätzliche `arrow.html` und `productsC.html` vollständig ab. Bis auf die Scriptreferenz besitzen sie denselben Inhalt und dieselben ursprünglichen Zeilennummern.

| Originalzeilen | Bedeutung |
| --- | --- |
| 1 | `<html lang="en">` öffnet das Dokument und legt Englisch als Inhaltssprache fest. Die Vorlage enthält keinen Doctype; das wurde zur Byte-Erhaltung nicht nachgebessert. |
| 2–3 | Der Kopf beginnt; `title` legt den Text des Browsertabs auf „Products“ fest. |
| 4–5 | Beginn des Inline-Stylesheets. Für den Körper werden Arial und ersatzweise eine serifenlose Schrift ausgewählt. |
| 6 | Jedes Element mit Klasse `product` bekommt einen silbernen Hintergrund. |
| 7 | Die direkten untergeordneten `div`-Elemente eines Produkts werden Flexcontainer. Darin stehen Beschreibung, Preis und Kaufbereich nebeneinander. |
| 8 | Produktüberschriften erhalten 20 Pixel Schriftgröße. `flex-direction: column` macht aus einem `h2` allein keinen Flexcontainer; ohne entsprechendes `display` beeinflusst es dessen Kinder hier nicht. |
| 9–11 | `desc`, `buy` und `price` erhalten Flexgewichte 8, 1 und 2. Der Kaufbereich und der Preis sind rechtsbündig; der Kaufbereich bekommt zusätzlich linken Abstand. |
| 12 | Der vorhandene Leer-Button bekommt oben zehn Pixel Abstand. Die ID heißt in der Vorlage `emptyCard`, nicht `emptyCart`. |
| 13–15 | Ende des Stylesheets, danach das externe Script mit `defer`. Bei einem klassischen externen Script wartet die Ausführung damit bis nach dem HTML-Parsing; die benötigten DOM-Knoten existieren. `defer` ist ein boolesches Attribut, sein Vorhandensein zählt. Die Seite lädt je nach Variante `shopA.js`, `shopA-arrow.js`, `shopB.js` oder `productsC.js`. |
| 16–17 | Körperbeginn und Hauptüberschrift „Our Products“. |
| 18–25 | Erstes Produkt: Daten-ID `sonyAIV`, Überschrift „Sony Alpha IV“, Beschreibung, Preistext `2890,00` und ein `input` vom Typ `button` im `.buy`-Bereich. |
| 26–33 | Zweites Produkt mit ID `sony24105`, Titel „Sony 24-105mm lens“, Beschreibung und Preistext `1300,00`; gleicher Aufbau. |
| 34–41 | Drittes Produkt mit ID `NiconDX16400`, Titel „Nicon DX 16-600“, Beschreibung und Preistext `900,00`. Die Schreibweise der ID bleibt exakt erhalten. |
| 42–49 | Viertes Produkt mit ID `tamron1724`, Titel „Tamron 17-24mm“, Beschreibung und Preistext `800,00`. |
| 50–55 | Separater Bestellbereich mit Überschrift und `ul#orderedItems`. Die enthaltenen `li`-Elemente sind Platzhalter, keine echten bestellten Produkte. |
| 56–58 | `div#totalPrice` enthält zunächst ebenfalls einen Platzhalter, der vom Renderer ersetzt wird. |
| 59 | Vorhandener „Empty Shopping Cart“-Button. Nur seine Existenz führt noch keine Funktion aus; dazu braucht es einen registrierten Listener. |
| 60–62 | Ende des Bestellbereichs, des Körpers und des Dokuments. |

`data-prodId` wird vom HTML-Parser als Attributname kleingeschrieben. Der Zugriff im Script heißt daher `dataset.prodid`. Der Wert der ID bleibt dagegen unverändert, also beispielsweise weiterhin `NiconDX16400`.

## 3. Original `shopA.js` — Erklärung jeder Zeile

Die Nummern beziehen sich ausschließlich auf `Angabe/files/shopA.js`, nicht auf die weiterentwickelte Lösung.

| Zeile | Erklärung |
| --- | --- |
| 1 | `'use strict';` aktiviert den strikten Modus für das ganze klassische Script. Beispielsweise entstehen nicht stillschweigend globale Variablen durch Zuweisung an unbekannte Namen. |
| 2 | Leerzeile zur Gliederung. |
| 3 | `let products = [];` erzeugt das zentrale Array. Die Variable ist eine globale lexikalische Bindung und nicht automatisch eine Eigenschaft `window.products`. |
| 4 | Leerzeile. |
| 5 | `function updateCart() {` definiert die Funktion zum vollständigen Neuzeichnen des Warenkorbs. Die Definition allein ruft sie noch nicht auf. |
| 6 | Holt die vorhandene Liste über ihre ID und speichert den DOM-Verweis in einer lokalen Variable. |
| 7 | Setzt deren `innerHTML` auf den leeren String und entfernt damit alle alten Zeilen. |
| 8 | Initialisiert die lokale Gesamtsumme bei jedem Funktionsaufruf neu auf null. |
| 9 | `for ... of` liefert nacheinander die tatsächlichen Produktobjekte aus dem Array; `p` ist kein Arrayindex. |
| 10 | Nur Produkte mit positiver Menge sollen im Warenkorb stehen. |
| 11 | Erstellt einen noch nicht eingehängten `li`-Knoten. |
| 12 | Baut einen Text aus Titel, Stückpreis und Menge und hängt ihn als Textknoten an das neue Listenelement. Die Pluszeichen verbinden wegen der Stringteile Text. Die Klammern um die Menge sind sichtbare Ausgabe. |
| 13 | Hängt das neue Listenelement in die Bestellliste. Erst dadurch erscheint es auf der Seite. |
| 14 | Multipliziert Menge mit Preis und addiert den Wert zur Gesamtsumme. |
| 15 | Ende der Bedingung. |
| 16 | Ende der Produktschleife. |
| 17 | Formatiert die Gesamtsumme mit zwei Nachkommastellen und ersetzt den Inhalt von `totalPrice`. `toFixed(2)` liefert einen String. |
| 18 | Ende von `updateCart`. |
| 19 | Leerzeile. |
| 20 | Sucht alle Produkt-divs. Die Schleife durchläuft diese DOM-Elemente; `let pdiv` ist eine lexikalische Schleifenvariable mit eigener Bindung pro Iteration. |
| 21 | `let cp = {};` erzeugt in jeder Ausführung des Schleifenblocks eine neue Bindung und ein neues, zunächst leeres Produktobjekt. Genau diese Bindung ist für den Closure-Effekt wichtig. |
| 22 | Kommentar zum Auslesen der HTML-Daten, ohne Laufzeiteffekt. |
| 23 | Liest die Produkt-ID aus `dataset.prodid` und schreibt sie als Eigenschaft `id` auf das neue Objekt. |
| 24 | Navigiert über `firstChild.nextSibling.firstChild.nodeValue` zum Überschriftentext. Das erste Kind des Produkt-divs ist in dieser Vorlage ein Whitespace-Textknoten; das nächste Geschwister ist das `h2`. Ändert sich der Whitespace, ist diese Navigation fragil. |
| 25 | Nimmt das erste Element mit Klasse `desc` und liest dessen sichtbaren Text. |
| 26 | Liest den Preistext und verwendet `parseFloat`. Diese Funktion stoppt beim Komma: `2890,00` wird zu `2890`, `2,75` würde fälschlich zu `2`. Dass alle Vorlagenpreise auf `,00` enden, verdeckt den Fehler. |
| 27 | Initialisiert die bestellte Menge auf null. |
| 28 | Merkt sich das ursprüngliche DOM-Element im Objekt. Das ermöglicht später das Umordnen ohne neue Elemente zu erzeugen. |
| 29 | Hängt den Objektverweis an das Array. Es entsteht keine tiefe Kopie: Array und Callback können dasselbe Objekt verändern. |
| 30 | Leerzeile mit Einrückung. |
| 31 | Definiert die benannte Funktion `addListener(e)` im Schleifenblock. Im strikten Modus ist diese Block-Funktionsdeklaration blocklokal. Jede Iteration erzeugt einen passenden Funktionswert mit Zugriff auf ihr `cp`. |
| 32 | Gibt das vom Browser übergebene Ereignisobjekt in der Konsole aus. |
| 33 | Erhöht die Menge des über die Closure gefundenen aktuellen Produkts um eins. |
| 34 | Zeichnet den Warenkorb nach der Zustandsänderung neu. |
| 35 | Ende des Callbackkörpers. |
| 36 | Leerzeile. |
| 37 | Kommentar zur Listenerregistrierung. |
| 38 | `getElementsByClassName('buy')[0]` liefert das Kauf-div. Der Name `clickButton` ist insofern etwas ungenau: Die Variable enthält nicht den darin liegenden Input. |
| 39 | Registriert die Funktion als Click-Listener. Es wird der Funktionswert übergeben, nicht `addListener()` aufgerufen. Ein Input-Klick gelangt durch Bubbling zum Eltern-div. |
| 40 | Ende des jeweiligen Initialisierungsblocks bzw. der Schleife. |
| 41–42 | Abschließende Leerzeilen; keine Anweisungen. |

Wichtige Lücken des Originals: Es gibt keinen initialen `updateCart()`-Aufruf, deshalb bleiben anfangs die Platzhalter sichtbar. Der Empty-Button besitzt keinen Listener. Die Produkte werden nicht sortiert. Diese Lücken gehören zu den geforderten Erweiterungen.

### 3.1 Closure, Bindung und Objekt sind drei verschiedene Dinge

Eine Closure besteht vereinfacht aus einer Funktion und dem erhaltenen Zugriff auf ihre lexikalische Umgebung. Bei der Registrierung merkt sich der Browser die Funktion; die Funktion kann später noch auf ihre ursprüngliche Umgebung zugreifen, obwohl die Initialisierungsschleife bereits beendet ist.

Mit `let cp` gibt es vier Bindungen und vier Objektinstanzen. Der jeweilige Listener findet über seine eigene Umgebung genau das passende Objekt. Wenn er dessen `numInCart` ändert, sieht `updateCart()` diese Änderung beim Zugriff über das Array.

Es werden nicht vier unveränderliche Kopien der Anfangswerte gespeichert. Das Objekt ist veränderbar, und die Closure greift weiterhin auf die Bindung zu. Der Ereignisparameter `e` ist dagegen ein normaler Funktionsparameter, den der Browser beim Aufruf liefert.

### 3.2 Was ändert ausschließlich `var cp = {};`?

`var` ignoriert den Schleifenblock als Gültigkeitsbereich. Weil die Schleife in diesem klassischen Script nicht in einer Funktion steht, gibt es eine globale `cp`-Bindung. Jede Iteration weist dieser gleichen Bindung ein anderes frisch erzeugtes Objekt zu. Nach der vierten Iteration verweist sie auf das Tamron-Objekt.

Die vier Callbackfunktionen existieren weiterhin, greifen aber alle auf diese eine Bindung zu. Ein Klick auf Sony und anschließend auf das Sony-Objektiv erhöht daher zweimal die Menge des Tamron-Produkts. Die ersten drei Produkte bleiben bei null.

Das Array enthält trotzdem vier verschiedene Objekte. Nicht die Objekte wurden gleich, sondern die Listener lesen ihre Referenz über die gleiche Variable. `pdiv` bleibt ausdrücklich `let`; es wurde in diesem Gegenbeispiel nicht verändert. Auch ein imaginärer Index „4 außerhalb des Arrays“ spielt hier keine Rolle: Der endgültige Wert ist das letzte Produktobjekt.

### 3.3 Gültigkeitsbereiche im Zusammenhang

- **Global:** Von globalem Scriptcode aus zugänglich. Oberstes `let`/`const` gehört zur globalen lexikalischen Umgebung; oberstes `var` wird bei klassischen Scripts normalerweise auch Eigenschaft des globalen Objekts. Ein Modul hätte eigenen Modulscope, wird hier aber nicht verwendet.
- **Funktion:** Parameter und lokale `var`-Deklarationen gelten innerhalb eines Funktionsaufrufs. Ein zusätzliches `if`- oder Schleifenpaar aus geschweiften Klammern begrenzt `var` nicht neu.
- **Block:** `let` und `const` sind auf ihren Block beschränkt. Vor ihrer Initialisierung existiert eine Temporal Dead Zone. `const` schützt die Bindung vor erneuter Zuweisung, nicht das Objekt vor Änderungen.
- **Lexikalische Suche:** Zuerst wird im eigenen Funktionsbereich, dann in den umgebenden Bereichen gesucht. Entscheidend ist der Definitionsort der Funktion, nicht der spätere Aufrufort.
- **`this`:** Bei normalen Funktionen entsteht der Receiver durch die Aufrufart. Er ist nicht einfach eine weitere lexikalisch eingefangene Variable. Arrow Functions übernehmen dagegen das `this` ihrer Umgebung. Aufgabe 1 benötigt in ihrem Add-Callback gar kein `this`.

## 4. Finale `ue4.1/shopA.js` — vollständiger Ablauf

### 4.1 Daten und Rendering

`'use strict'` und `let products = []` haben dieselbe Grundfunktion wie im Original. Die Lösung behält das leicht nachvollziehbare zentrale Array bei.

`function updateCart()` ist weiter der gemeinsame Renderer:

1. `const output = document.getElementById('orderedItems')` holt die Liste. `const` verhindert eine Neuzuweisung von `output`, nicht Änderungen an der Liste.
2. `output.replaceChildren()` entfernt alle bisherigen Kinder. Da neue Knoten anschließend mit DOM-Methoden erzeugt werden, ist hier kein HTML-String notwendig.
3. `let totalCents = 0` startet die Gesamtsumme in ganzzahligen Cent.
4. `for (const p of products)` durchläuft die aktuellen Produkte. Die Variable wird innerhalb einer Iteration nicht neu zugewiesen; ihre Objekteigenschaften dürfen sich trotzdem ändern.
5. Die Bedingung `p.numInCart > 0` blendet nicht bestellte Produkte aus.
6. Ein neues `li` bekommt mit einem Template-String Titel, `p.price.toFixed(2)` und Menge als `textContent`. Der Titel wird als Text und nicht als ausführbares HTML eingesetzt.
7. `output.appendChild(row)` macht diese Zeile sichtbar.
8. `Math.round(p.price * 100) * p.numInCart` berechnet den Betrag in Cent. Die Rundung beseitigt die kleinen binären Darstellungsabweichungen beim Übergang zu Cent. Erst der abschließende Ausdruck `(totalCents / 100).toFixed(2)` wandelt zur Ausgabe zurück.
9. Der formatierte Gesamtbetrag wird als Text in `#totalPrice` geschrieben.

Cent-Rechnung ist für die vorgegebenen zweistelligen Preise sinnvoll. Es wird keine umfassende Finanzbibliothek und kein Parser für beliebige Tausendertrenner behauptet.

### 4.2 Produktaufbau und anonyme Funktion

Die äußere `for (let pdiv of document.querySelectorAll('div.product'))` entspricht dem Original. Auch `let cp = {}` bleibt bewusst erhalten, damit die Closure-Frage unmittelbar am Code erklärt werden kann.

- `cp.id = pdiv.dataset.prodid` bewahrt die Original-ID.
- `pdiv.querySelector('h2').textContent` liest die Überschrift unabhängig von der Anzahl der Whitespace-Textknoten.
- `pdiv.querySelector('.desc').textContent` liest die Beschreibung.
- `Number(...textContent.trim().replace(',', '.'))` entfernt äußere Leerzeichen, ersetzt das Dezimalkomma und konvertiert den gesamten resultierenden Text zur Zahl. Die Lösung erwartet das vorgegebene Format ohne Tausendertrennzeichen. Die gleiche Parse-Strategie wird in allen vier Produkt-Scripts benutzt.
- `cp.numInCart = 0` setzt die Anfangsmenge.
- `cp.domElement = pdiv` behält die DOM-Identität.
- `products.push(cp)` macht das Objekt dem Renderer zugänglich.
- `const clickButton = pdiv.querySelector('.buy')` wählt wie im Original den Kaufcontainer.
- Direkt in `addEventListener('click', function (e) { ... })` steht jetzt die geforderte **normale anonyme Funktion**. Die separate Deklaration `function addListener` entfällt. Sie loggt das Ereignis, erhöht ihr lexikalisch gefundenes `cp` und ruft den Renderer.

Weil der Listener auf `.buy` sitzt, wäre bei der normalen Funktion ihr `this` während des Aufrufs dieses div. Der Code verwendet es aber nicht. `e.target` ist beim normalen Input-Klick der Input; `e.currentTarget` ist während der Zustellung das registrierte div.

### 4.3 Leeren und Sortieren

`document.getElementById('emptyCard').addEventListener('click', function () { ... })` verbindet den vorhandenen Leer-Button mit einer Funktion. Die Schleife setzt jede Menge auf null und ruft anschließend `updateCart()`. Nur das sichtbare `ul` zu leeren wäre falsch: Ohne Datenänderung kämen die alten Mengen beim nächsten Update zurück.

`products.sort((a, b) => a.price - b.price)` sortiert numerisch aufsteigend. Ein Stringvergleich oder ein Sortieren ohne Vergleichsfunktion könnte beispielsweise `1300` vor `800` stellen.

`const orderSection = document.getElementById('orderedItems').parentElement` merkt sich den bestehenden Bestellbereich. Die anschließende Schleife ruft für jedes Produkt `orderSection.parentElement.insertBefore(p.domElement, orderSection)` auf. Ein bereits vorhandener Knoten wird dadurch verschoben, nicht kopiert. Die zugehörigen Listener bleiben erhalten. Auch der Bestellbereich selbst bleibt derselbe und steht hinter allen Produkten.

Nur die Sortierung des Arrays würde die DOM-Anordnung nicht verändern. Umgekehrt muss man keine HTML-Quelltextdatei bearbeiten, um die Darstellung zur Laufzeit umzuordnen.

Der abschließende `updateCart()`-Aufruf ersetzt die Originalplatzhalter sofort durch den korrekten leeren Zustand und `0.00`. Die Reihenfolge der gelieferten Produkte ist danach Tamron, Nicon, Sony-Objektiv, Sony-Kamera.

## 5. Finale `ue4.1/shopA-arrow.js` und ihre Fixture

Diese Datei stimmt bis auf genau eine Callbackdeklaration mit `shopA.js` überein. Deshalb gilt die gesamte Erklärung aus Abschnitt 4 auch für sie: Dateneinlesen, Cent-Rechnung, Empty-Listener, DOM-Sortierung und Startaufruf sind dieselben.

Der einzige Unterschied ist:

```js
clickButton.addEventListener('click', (e) => {
    console.log(e);
    cp.numInCart += 1;
    updateCart();
});
```

Die Arrow Function ist eine anonyme Funktion mit lexikalischem `this` und ohne eigenes `arguments`. Ihr Ereignisparameter `e` wird trotzdem normal vom Browser übergeben. Ihr Zugriff auf `cp` funktioniert wie bei der normalen Funktion über eine Closure. Da sie `this` nicht verwendet, ändert der Unterschied am Receiver das Verhalten nicht.

Der Empty-Callback muss nicht ebenfalls in eine Arrow Function umgeschrieben werden: Teilaufgabe 1(b) bezieht sich auf den bisherigen `addListener`. Die Alternative ist nicht ein zusätzlicher zweiter Add-Listener, sondern ersetzt genau dessen Form.

`arrow.html` ist die tatsächlich ausführbare Auswahlmöglichkeit: Sie lädt ausschließlich `shopA-arrow.js`. Ihre übrigen HTML- und CSS-Zeilen wurden bereits in Abschnitt 2 erklärt. Der Test vergleicht zusätzlich den gesamten Scripttext beider Varianten nach Ersetzung genau dieser einen Deklaration.

## 6. Original `shopB.js` — Erklärung jeder Zeile

Die Nummern beziehen sich auf `Angabe/files/shopB.js`.

| Zeile | Erklärung |
| --- | --- |
| 1 | Strikter Modus für das gesamte Script. Das ist insbesondere für das `this` der normalen `forEach`-Callbackfunktion relevant. |
| 2 | Leerzeile. |
| 3 | Gemeinsames Produktarray wie in Aufgabe 1. |
| 4 | Leerzeile. |
| 5 | Beginn des Objektliterals, das `productList` zugewiesen wird. `const` verbietet das Ersetzen der Variablenbindung, nicht die Veränderung des Objekts. |
| 6 | Die Eigenschaft `products` referenziert dasselbe Array wie die äußere Variable. Es wird kein zweites Array kopiert. |
| 7 | `listProducts` erhält eine normale Funktion als Methode. Bei `productList.listProducts()` ist ihr `this` das Objekt `productList`. |
| 8 | Aufruf von `forEach` auf diesem Array. Der Callback ist aber erneut eine normale Funktion; `product` und `index` werden von `forEach` als Argumente übergeben. Ein `thisArg` wird nicht angegeben. |
| 9 | Der Zweig wird nur ausgeführt, wenn das aktuelle Produkt eine positive Warenkorbmenge hat. |
| 10 | `(index + 1) % this.products.length` soll den Index des nächsten Produkts mit Umlauf berechnen. Tatsächlich ist das `this` des strikten normalen Callbacks hier `undefined`; der Eigenschaftszugriff wirft dann einen `TypeError`. |
| 11 | Würde den nächsten Eintrag aus dem Array laden, wenn der Receiver korrekt wäre. |
| 12 | Gibt den Titel des **nächsten** Produkts und ein Semikolon als Template-String aus. Nicht notwendigerweise dieses nächste Produkt wurde bestellt; das entspricht bewusst der vorgegebenen Logik. |
| 13 | Ende des positiven Mengen-Zweigs. |
| 14 | Ende des Callbacks und des `forEach`-Aufrufs. |
| 15 | Ende der Listenmethode. |
| 16 | Ende des Objektliterals und der Zuweisung. |
| 17–18 | Leerzeilen. |
| 19 | Beginn des zentralen Renderers `updateCart`. |
| 20 | Holt das Listen-DOM-Element. |
| 21 | Leert die bisherigen Warenkorbzeilen. |
| 22 | Initialisiert die Summe. |
| 23 | Durchläuft die Produktobjekte. |
| 24 | Berücksichtigt nur positive Mengen. |
| 25 | Erstellt eine neue Listenzeile. |
| 26 | Ruft `p.render()` mit `p` als Receiver auf und fügt den erhaltenen String als Textknoten ein. Diese Aufrufart ist im Original korrekt. |
| 27 | Hängt die Zeile in den DOM. |
| 28 | Addiert Menge mal Stückpreis. |
| 29 | Ende der Bedingung. |
| 30 | Ende der Schleife. |
| 31 | Formatiert und zeigt die Gesamtsumme. |
| 32 | Loggt die Meldung „Log: Updated cart: “. |
| 33 | Ruft die Listenmethode als Methode auf, daher ist das **äußere** `this` korrekt. Der Fehler steckt erst in deren innerem Callback. |
| 34 | Ende des Renderers. |
| 35 | Leerzeile. |
| 36 | Beginn der Konstruktorfunktion `Product(el)`. Bei `new Product(pdiv)` verweist `this` während der Konstruktion auf das neu erzeugte Objekt. |
| 37 | Liest die ID vom übergebenen Produkt-DOM-Element. |
| 38 | Liest den Titel mit derselben whitespaceabhängigen Navigation wie in A. |
| 39 | Liest die Beschreibung. |
| 40 | Liest den Preis über `parseFloat`; dieselbe Komma-Problematik wie in A. |
| 41 | Setzt die echte Produktmenge zunächst auf null. |
| 42 | Leerzeile. |
| 43 | Erzeugt eine normale Funktion und speichert sie als eigene Eigenschaft `updateProduct` auf dieser Instanz. Das passiert bei jedem Konstruktoraufruf erneut. |
| 44 | Erhöht die Menge des jeweiligen Receivers. Der Code setzt also voraus, dass `this` beim späteren Aufruf tatsächlich ein Product ist. |
| 45 | Rendert nach der Änderung. |
| 46 | Ende des Methodenwerts; die Vorlage verlässt sich hier auf automatische Semikolonergänzung. |
| 47 | Leerzeile. |
| 48 | Erzeugt einen weiteren Funktionswert als eigene `render`-Eigenschaft dieser Instanz. |
| 49 | Liefert Titel, Stückpreis und Menge als String. Ein Zeilengesamtpreis fehlt im Original. |
| 50 | Leerzeile innerhalb der Funktion. |
| 51 | Ende des Renderers dieser Instanz. |
| 52 | Leerzeile. |
| 53 | Holt wiederum das `.buy`-div und nicht den Input. |
| 54 | Übergibt den Wert der Eigenschaft `this.updateProduct` als Callback. Das Nachschlagen auf `this` bindet den späteren Receiver **nicht** automatisch an diese Instanz. |
| 55 | Ende des Konstruktors. |
| 56 | Leerzeile. |
| 57 | Durchläuft alle Produkt-divs. |
| 58 | Erzeugt eine Product-Instanz für jedes div und fügt sie dem gemeinsamen Array hinzu. |
| 59 | Ende der Initialisierungsschleife. |
| 60 | Abschließende Leerzeile. |

### 6.1 Erster Fehler: DOM-Receiver statt Product

Bei der Konstruktion war `this` die Product-Instanz. Bei der späteren Ausführung des registrierten normalen Eventlisteners setzt der Browser dagegen dessen Receiver auf das Element, an dem er registriert wurde: auf das `.buy`-div.

Dieses div hat zunächst keine Eigenschaft `numInCart`. `undefined + 1` ergibt `NaN`; es entsteht eine `numInCart`-Eigenschaft mit `NaN` am falschen Objekt. Die echte Menge im Product bleibt null. Der Warenkorb wird dadurch nicht korrekt gefüllt.

Wichtig: Nicht das angeklickte Inputelement bestimmt hier den Receiver, sondern das Element mit dem Listener. Und strikter Modus macht den DOM-Receiver nicht undefiniert; der Browser liefert ihn ausdrücklich.

### 6.2 Zweiter Fehler: `forEach` hat ein eigenes Aufrufverhalten

Die äußere Methode wird mit dem richtigen Receiver aufgerufen. Der innere normale Callback bekommt ohne `thisArg` aber `undefined` als `this` im strikten Modus. Sobald eine echte Produktmenge positiv ist, wirft sein `this.products` einen Fehler.

Der erste Defekt verdeckt diesen zunächst: Solange keine echte Menge erhöht wird, wird der fehlerhafte `if`-Zweig nicht betreten. Nur den Buttonlistener zu reparieren reicht also nicht aus. Die Lösung repariert beide Probleme, statt den Logger zu entfernen.

### 6.3 Wie oft existiert `render`?

Vier Konstruktoraufrufe führen die Funktionsausdruck-Zuweisung viermal aus. Deshalb gibt es vier unterscheidbare Function-Objekte als eigene `render`-Eigenschaften. Zwei Instanzen haben nicht denselben Funktionswert.

Die Aufgabenformulierung „code ... in memory“ darf nicht als garantierte Aussage über vier getrennte Maschinen-Codeblöcke verstanden werden. JavaScript-Engines dürfen internen Bytecode oder kompilierten Code teilen und optimieren. Beobachtbar und überprüfbar sind die **vier Funktionsidentitäten**, nicht eine genaue Zahl physischer Engine-Codekopien oder Bytes. Eine statische Methode `Product.render()` wird durch den Originalcode ebenfalls nicht definiert.

## 7. Finale `ue4.2/shopB.js` — alle Bestandteile

Diese Version hält das Konstruktorprinzip bewusst bei, damit der Unterschied zur Prototype-Version sichtbar bleibt.

### 7.1 Array und Listenobjekt

`let products = []` ist wieder die zentrale Datenstruktur. `const productList = { products: products, listProducts: function () { ... } }` speichert denselben Arrayverweis. Da die Lösung dieses Array per `push` füllt und nicht durch ein neues ersetzt, bleibt der Verweis konsistent.

Die äußere `listProducts` bleibt eine normale Methode. Ihr **innerer** Callback ist nun `(product, index) => { ... }`. Die Arrow Function übernimmt das äußere `this`, also das bei `productList.listProducts()` gesetzte Listenobjekt.

Die positive Mengenprüfung bleibt bestehen. `const nextProductIndex = (index + 1) % this.products.length` erhält den Umlauf. Danach werden das nächste Produkt und sein Titel ausgegeben. Wird das letzte Produkt bestellt, loggt die Methode den ersten Titel. Werden mehrere Produkte bestellt, wird entsprechend in Arrayreihenfolge jeweils der nächste Titel geloggt. Bei leerem Array gibt es keinen Callback und somit auch keinen Modulo-Ausdruck.

Eine alternative korrekte Reparatur wäre `this.products.forEach(function (...) { ... }, this)`. Verwendet wird hier die Arrow-Variante, weil sie den Verlust des Receivers unmittelbar sichtbar behebt.

### 7.2 `updateCart()`

Die Schritte entsprechen dem A-Renderer: Liste holen, `replaceChildren`, Cent-Summe auf null, Produkte durchgehen und nur positive Mengen als `li` einfügen. Der sichtbare Text wird hier über `p.render()` geliefert. Weil es ein Methodenaufruf auf `p` ist, erhält `render` das richtige `this`.

Die Gesamtsumme entsteht aus `Math.round(p.price * 100) * p.numInCart` und wird mit zwei Dezimalstellen als Text ausgegeben. Anschließend erfolgen die ursprüngliche Update-Logmeldung und `productList.listProducts()`. Die Logfunktion ist also tatsächlich weiter erreichbar und funktioniert nach einer positiven Mengenänderung.

### 7.3 `Product(el)`

Der Konstruktor liest `id`, `title`, `desc` und `price` mit derselben robusteren Strategie wie A und setzt `numInCart = 0`.

`this.updateProduct = function (e) { ... }` ist absichtlich weiterhin eine eigene Methode jeder Instanz. Sie erhöht die Menge und startet das Rendering. Der Parameter `e` ist ein Eventparameter, wird in dieser einfachen Methode aber nicht benötigt.

`this.render = function () { ... }` ist ebenfalls weiterhin eine eigene Methode. Der Template-String kombiniert Titel, formatierten Stückpreis und Menge. Aufgabe 2(a) verlangt hier noch keine Zeilensumme.

`const clickButton = el.querySelector('.buy')` wählt den ursprünglichen Listenercontainer. Der entscheidende neue Ausdruck ist:

```js
clickButton.addEventListener('click', this.updateProduct.bind(this));
```

`bind` erzeugt einen gebundenen Funktionswrapper. Das während der Konstruktion gültige `this` wird als späterer Receiver festgelegt; der Browser kann diesen nicht durch das div ersetzen. Das eigentliche `this.updateProduct` bleibt trotzdem ein gewöhnlicher Funktionswert. Der Wrapper wird nur als Listener gehalten.

`this.updateProduct()` an dieser Stelle wäre falsch: Das würde sofort aufrufen und anschließend den Rückgabewert registrieren. Ein bloßes Nachschlagen `this.updateProduct` ohne `bind` war gerade der ursprüngliche Fehler.

### 7.4 Initialisierung und Empty-Button

Die abschließende Schleife erzeugt vier Instanzen und schiebt sie in das Array. Anders als A bleibt ihre Reihenfolge die Originalreihenfolge, damit das erste Element und der Next-Product-Logger unverändert zugeordnet bleiben.

Der zusätzliche Empty-Listener verwendet eine Arrow Function, setzt alle Mengen auf null und rendert neu. Das ist eine Ergänzung für eine vollständig brauchbare Oberfläche und keine der beiden `this`-Reparaturen. Der abschließende Startaufruf entfernt die Platzhalter und zeigt die leere Summe.

## 8. Finale `ue4.2/productsC.js` — Prototype-Version vollständig

### 8.1 Welche Funktionen gehören auf den Prototyp?

Die auf einer einzelnen Product-Instanz arbeitenden wiederverwendbaren Methoden liegen auf `Product.prototype`: `updateProduct`, `removeOneFromCart`, `getTotalPrice`, `render` und `updateButtons`.

Die globale Koordinationsfunktion `updateCart` ist keine Instanzmethode. Ebenso gehört `listProducts` zum Listenobjekt und nicht zu einem einzelnen Produkt. Diese Funktionen bleiben deshalb an ihren fachlich passenden Stellen. „Alle Methoden über den Prototyp“ bedeutet hier, dass die Product-Methoden nicht in jedem Konstruktoraufruf neu angelegt werden. Die ausdrücklich geforderte eigene `render`-Methode des ersten Produkts ist die einzige gezielte Ausnahme.

Gebundene Eventcallbacks erzeugen weiterhin Listenerwrapper pro Produkt. Diese sind aber keine zusätzlichen eigenen Product-Methoden und heben das Teilen der eigentlichen Prototypfunktionen nicht auf.

### 8.2 Gemeinsame Daten und `productList`

Das Array und das Listenobjekt haben dieselbe Rolle wie im reparierten B. `listProducts` benutzt wieder einen Arrow-Callback, prüft positive Mengen und loggt über den Modulo-Index den nächsten Titel. In C wird der Titel direkt mit `this.products[nextProductIndex].title` gelesen; die Hilfsvariable `nextProduct` aus B wird dafür nicht benötigt.

### 8.3 Der globale Renderer

`updateCart()` holt die Liste, entfernt alte Zeilen und beginnt die Cent-Summe bei null. In der Schleife ruft es für **jedes** Produkt `p.updateButtons()` auf, auch wenn die Menge null ist. Nur so werden nach dem Leeren auch die nun unsichtbaren Warenkorbprodukte wieder auf deaktivierte Minusbuttons synchronisiert.

Bei positiver Menge erzeugt es eine Zeile und setzt `row.textContent = p.render()`. Der dynamische Methodenlookup ist hier beabsichtigt: Für das erste Produkt wird später der eigene Override gefunden, für alle anderen die gemeinsame Prototypmethode.

`totalCents += Math.round(p.getTotalPrice() * 100)` benutzt die neue Zeilensummenmethode, anstatt deren fachliche Rechnung an anderer Stelle separat zu duplizieren. Zum Addieren werden die Beträge wieder auf ganzzahlige Cent gebracht. Am Ende wird die Gesamtsumme mit zwei Nachkommastellen geschrieben, dann folgen Update-Log und Listenmethode wie in B.

### 8.4 Der Konstruktor erzeugt Daten und DOM, keine eigenen Standardmethoden

Die ersten Eigenschaften `id`, `title`, `desc`, `price` und `numInCart` entsprechen B. `this.domElement = el` hält zusätzlich den Quellknoten fest.

`this.removeButton = document.createElement('button')` erzeugt das neue Steuerelement ausschließlich in JavaScript. Die folgenden Zuweisungen bedeuten:

- `type = 'button'`: Der Button soll keine implizite Formularübermittlung auslösen.
- `textContent = '\u2212'`: Sichtbares Minuszeichen. Der ASCII-Escape wird erst von JavaScript in das Unicode-Zeichen umgewandelt. Die unveränderte HTML-Vorlage nennt keinen Zeichensatz; ein direktes UTF-8-Minusliteral im externen Script könnte deshalb falsch dekodiert werden.
- `setAttribute('aria-label', ...)`: Zugänglicher Name mit dem konkreten Produkttitel, damit ein Screenreader nicht nur „Minus“ vorliest.
- `disabled = true`: Zu Beginn ist die Menge null, also darf nichts entfernt werden.
- `el.querySelector('.buy').appendChild(this.removeButton)`: Der Button wird beim ursprünglichen Kaufbereich eingehängt.

Danach kommen **zwei getrennte Listener**:

```js
el.querySelector('.buy input').addEventListener('click', this.updateProduct.bind(this));
this.removeButton.addEventListener('click', this.removeOneFromCart.bind(this));
```

Der Add-Listener sitzt in C gezielt auf dem Input, nicht mehr auf dem `.buy`-div. Bliebe er auf dem Eltern-div, würde ein Minus-Klick nach oben bubblen und zusätzlich den Add-Handler auslösen. Mit den getrennten Zielknoten ist kein `stopPropagation` nötig. Beide gebundenen Listener erhalten weiterhin den Product-Receiver.

Die Methode `removeOneFromCart` existiert zur Registrierungszeit bereits auf dem Prototyp: Alle Prototypzuweisungen stehen vor der Schleife, welche die Instanzen tatsächlich konstruiert.

### 8.5 `Product.prototype.updateProduct`

```js
Product.prototype.updateProduct = function (e) {
    this.numInCart += 1;
    updateCart();
};
```

Diese normale Funktion liegt genau einmal als Standardmethode auf dem Prototyp. Sie braucht ein dynamisches `this`, um auf verschiedenen Product-Instanzen zu arbeiten. Sie ist deshalb nicht als Arrow Function definiert. `bind(this)` im Konstruktor sorgt bei DOM-Callbacks für den passenden Empfänger. Ein direkter Methodenaufruf `p.updateProduct()` wäre ebenfalls korrekt.

### 8.6 `Product.prototype.removeOneFromCart`

Die erste Anweisung `if (this.numInCart === 0) return;` ist eine Daten-Schutzbedingung. Ein deaktivierter Button verhindert normale Nutzerklicks, aber Tests oder anderer Code könnten die Methode direkt aufrufen oder ein Ereignis synthetisch auslösen. Deshalb muss die Methode selbst das Unterschreiten von null verhindern.

Bei positiver Menge zieht sie eins ab und ruft `updateCart()`. Wird daraus null, verschwindet die Warenkorbzeile beim nächsten Rendering und der Minusbutton wird deaktiviert. Die Methode löscht nicht das Produkt aus dem Produktkatalog.

### 8.7 `Product.prototype.getTotalPrice`

```js
return Math.round(this.price * 100) * this.numInCart / 100;
```

Zuerst wird der Stückpreis auf Cent gebracht und gerundet, dann mit der Menge multipliziert. Der Rückgabewert ist eine Zahl in der normalen Preiseinheit, kein bereits formatierter String. So können sowohl `render` als auch der Gesamtsummenrenderer ihn nutzen. Die Formatierung mit `toFixed(2)` erfolgt erst dort, wo Text ausgegeben wird.

### 8.8 `Product.prototype.render`

Der Template-String enthält:

1. den Titel,
2. den Stückpreis mit zwei Nachkommastellen,
3. die Menge in Klammern,
4. nach einem Trennstrich `Total: ` und die mit zwei Nachkommastellen formatierte Zeilensumme aus `this.getTotalPrice()`. Der Trennstrich steht im Script als ASCII-Escape `\u2014`, damit er auch bei der zeichensatzlosen HTML-Vorlage korrekt erscheint.

Die Ausgabe ergänzt also den ursprünglichen Stückpreis, statt ihn mit der Gesamtsumme zu verwechseln. Bei mehreren Stück ist sichtbar, welcher Preis pro Stück und welcher für die ganze Position gilt.

### 8.9 `Product.prototype.updateButtons`

`this.removeButton.disabled = this.numInCart === 0` setzt den Zustand direkt aus den Daten. Es wird nicht versucht, ihn unabhängig „umzuschalten“, was bei mehrfachem Rendern zu falschen Zuständen führen könnte. Im durch die Methoden aufrechterhaltenen Bereich nichtnegativer ganzzahliger Mengen ist der Button genau dann aktiviert, wenn die Menge größer als null ist.

### 8.10 Instanzen und ausschließlich erster Render-Override

Erst nach allen Prototypdefinitionen erzeugt die Schleife die vier Instanzen in Originalreihenfolge. Normalerweise würde jede Instanz `render` über denselben Prototyp finden.

Der folgende Existenzcheck schützt auch eine hypothetisch leere Produktliste. Nur für `products[0]` wird danach ein eigener Funktionswert gespeichert:

```js
if (products.length > 0) {
    products[0].render = function () {
        return Product.prototype.render.call(this) + ' New Arrival!';
    };
}
```

Das ist **Shadowing**: Die eigene Eigenschaft verdeckt für diese Instanz die gleichnamige Prototyp-Eigenschaft. Die übrigen Instanzen bekommen keine eigene `render`-Eigenschaft und ändern sich nicht.

`Product.prototype.render.call(this)` wählt ausdrücklich den gemeinsamen Renderer aus und führt ihn mit derselben Product-Instanz als Receiver aus. Würde man hier `this.render()` aufrufen, landete man erneut im Override und erzeugte Rekursion. Hinter den normalen Text wird mit einem führenden Leerzeichen exakt `New Arrival!` angehängt.

Damit existieren über die vier Instanzen hinweg zwei unterschiedliche Renderer-Funktionswerte: die gemeinsame Prototypfunktion und der erste eigene Override. Die anderen Prototypmethoden werden von allen vier Instanzen identisch geteilt. Der neue Renderer auf der ersten Instanz ist keine unerwünschte Verletzung der Prototype-Aufgabe, sondern die ausdrücklich verlangte Ausnahme.

Abschließend setzt der Empty-Listener alle Mengen auf null und ruft den gemeinsamen Renderer. Dieser deaktiviert die Minusbuttons wieder. Der letzte Startaufruf initialisiert auch die sichtbare leere Bestellung und alle Controls konsistent.

`productsC.html` hat die in Abschnitt 2 beschriebene Vorlage mit genau einer anderen Scriptreferenz. Es enthält selbst weder zusätzliche Minusbuttons noch die Meldung „New Arrival!“: Beides entsteht erst durch das Script.

## 9. `tests_1_2.cjs` — Testwerkzeug vollständig erklärt

### 9.1 Start, Abhängigkeiten und Hilfsdaten

Die Datei ist ein CommonJS-Script für Node. Die Endung `.cjs` macht diese Modulart explizit. Ihr eigener `'use strict'` gilt für das Testscript und ist unabhängig vom Strict-Modus der Browserdateien.

- `node:assert/strict` liefert harte Prüfungen mit aussagekräftigem Fehlerabbruch.
- `node:fs` liest die Original- und Lösungsdateien als Buffer.
- `node:path` baut Dateipfade plattformgerecht zusammen.
- `pathToFileURL` erzeugt gültige `file:`-URLs, auch wenn Pfadbestandteile Leerzeichen enthalten.
- `require(process.env.PLAYWRIGHT_MODULE || 'playwright')` verwendet normalerweise das installierte Playwright. Ein optionaler Umgebungswert erlaubt eine bereits vorhandene Entwicklungsinstallation. Es ist keine private Installationsadresse im Script fest eingebaut.
- `root = __dirname` bezieht alle Dateien auf den Standort der Testdatei, nicht auf das zufällige aktuelle Terminalverzeichnis.
- `ids` bewahrt die vier Original-IDs in Originalreihenfolge; `cents` enthält die zugehörigen Originalpreise als ganzzahlige Cent.
- `read(name)` liest relativ zu `root` einen Buffer; `file(name)` macht aus dem relativen Namen eine Browser-URL.
- `passed` zählt ausschließlich erfolgreich abgeschlossene benannte Testblöcke.

`async function test(name, run)` wartet auf den Test, erhöht erst danach den Zähler und schreibt `PASS ...`. Ein fehlgeschlagenes `assert` beendet die normale Ausführung, wird also nicht als Erfolg gezählt.

`card(page, id)` selektiert das konkrete Produkt über seinen exakten Datenattributwert. `add(page, id)` geht innerhalb dieses Produkts gezielt zum Original-Input, nicht zum neu erzeugten Minusbutton.

`state(page)` liest per `page.evaluate` die tatsächlichen lexikalischen `products` des Browser-Scripts aus und gibt Paare aus ID und Menge zurück. Die Prüfung verlässt sich nicht bloß auf sichtbare Texte, die bei einem Datenfehler zufällig richtig aussehen könnten. Weil A das Array sortiert, verwenden viele Prüfungen eine Map nach ID statt eines falschen positionsbasierten Vergleichs.

### 9.2 Die kontrollierte Fixture

`fixture(page, html, script, prices)` dient den Original-Gegenbeispielen und den zusätzlichen Kommapreisen:

1. `page.goto('about:blank')` erzeugt ein frisches Dokument. Dadurch überleben keine früheren globalen `let`-/`const`-Deklarationen, die bei erneutem Einfügen sonst Konflikte verursachen könnten.
2. Das HTML wird im Speicher gelesen, und der einzige ursprüngliche `script`-Block wird mit einer Regex entfernt. Es werden keine Originaldateien geschrieben.
3. `page.setContent` setzt dieses isolierte HTML.
4. Wenn alternative Preise mitgegeben wurden, setzt `evaluateAll` die Textinhalte der Preisfelder vor der Initialisierung auf diese Werte.
5. `page.addScriptTag({ content: ... })` führt den tatsächlich gelesenen Scripttext in diesem neuen Dokument aus.

Die Fixture lädt keine lokalen Bilder, Stylesheets oder externen Assets. Deswegen ist `about:blank` hier geeignet; es muss keine lokale Dateiorigin zum Nachladen relativer Assets eingerichtet werden. Die normalen Lösungstests öffnen hingegen die echten gelieferten HTML-Dateien per `file:` und überprüfen so auch die tatsächliche Scriptverknüpfung.

### 9.3 Byte-Prüfungen und Browseraufbau

Der erste Test vergleicht Buffer statt normalisierte Textzeilen:

- `ue4.1/productsA.html` gegen das Original A,
- `ue4.2/productsB.html` gegen das Original B,
- `arrow.html` gegen genau die eine erwartete Scriptnamen-Ersetzung im Original A,
- `productsC.html` gegen genau die erwartete Scriptnamen-Ersetzung im Original B.

Außerdem muss `shopA-arrow.js` vollständig dem Standard-Script entsprechen, wenn ausschließlich die Add-Callbackdeklaration umgeschrieben wird. Dadurch sind keine versteckten divergierenden Zusatzimplementierungen in der Alternative möglich.

`chromium.launch` startet einen echten headless Chromium. Ein optionaler ausführbarer Browserpfad wird aus `PLAYWRIGHT_CHROMIUM` oder ersatzweise `CHROMIUM_EXECUTABLE` gelesen; andernfalls wird die übliche Playwright-Auflösung benutzt.

Der Browserkontext registriert für jede Seite einen `pageerror`-Listener. Unbehandelte Scriptfehler sammeln sich in `errors`. HTTP- und HTTPS-Anfragen werden abgebrochen, damit externe Netzerreichbarkeit nicht zu einer versteckten Voraussetzung wird. Die lokalen HTML-Dateien und Inline-Fixtures funktionieren ohne solche Anfragen.

### 9.4 Originale tatsächlich reproduzieren

Drei Testblöcke testen nicht bloß die neue Lösung, sondern die zentralen Behauptungen über die Vorlagen:

1. **Original A mit `let`:** Zwei verschiedene Produktbuttons erhöhen genau diese beiden Produkte.
2. **Original A mit ausschließlich `let cp` → `var cp`:** Der Test ändert nur diese eine Deklaration im speicherinternen Scripttext. Nach denselben Klicks hat allein das letzte Produkt Menge zwei. Zusätzlich wird geprüft, dass das globale `cp` tatsächlich dasselbe Objekt wie der letzte Arrayeintrag ist. `pdiv` bleibt unverändert `let`.
3. **Original B:** Zuerst wird gemessen, dass vier verschiedene `render`-Funktionswerte existieren. Ein Add-Klick verändert keine echte Product-Menge, erzeugt aber `NaN` am `.buy`-div. Danach wird eine echte Menge kontrolliert positiv gesetzt und die Listenmethode in `try/catch` aufgerufen. Der erwartete Fehlername ist `TypeError`.

Der letzte Fehler ist absichtlich lokal abgefangen, nicht ignoriert. Er belegt den zweiten Defekt, ohne einen erwarteten Originalfehler als unerwarteten uncaught Fehler im Gesamtlauf mitzuzählen.

### 9.5 Gleiche funktionale Tests für alle vier Seiten

Das Array `versions` enthält A Standard, A Arrow, B repariert und C Prototype mit jeweiligem HTML- und Scriptnamen. Die Schleife führt für jede Version denselben Kern aus:

- **Startzustand:** Keine Platzhalterzeilen mehr, Gesamtpreis `0.00`, genau ein Script.
- **Eigenes Produkt:** Jeder der vier Add-Inputs wird mehrfach geklickt. Nach jedem Klick werden die tatsächlichen Mengen gegen die erwarteten Mengen pro ID verglichen und die Gesamtsumme aus ganzzahligen Referenzpreisen neu errechnet. Es muss genau eine Zeile pro bestelltem Produkt geben. Am Kauf-div darf keine irrtümliche eigene `numInCart`-Eigenschaft entstehen.
- **Leeren und Neustart:** Zweimal leeren muss harmlos sein. Daten, Zeilen und Preis müssen null sein. Ein erneuter Add-Klick darf genau ein Stück erzeugen; so werden auch doppelte Listener entdeckt.
- **Kommapreise und Mehrfachmengen:** Die Fixture benutzt `0,10`, `0,20`, `1,25`, `2,99` mit unterschiedlichen Mengen. Der Gesamtbetrag muss genau der Referenzrechnung in Cent entsprechen. In C werden zusätzlich die Werte von `getTotalPrice()` und die zugehörigen sichtbaren Zeilensummen geprüft.

Nur für die beiden A-Varianten gibt es zwei weitere Tests:

- Der tatsächliche DOM muss in aufsteigender Preisreihenfolge stehen, und hinter dem letzten Produkt muss weiterhin der Bestellbereich folgen. Die bereits erfolgten Klickprüfungen zeigen zugleich, dass verschobene Knoten noch ihre richtigen Listener haben.
- Mit `2,75`, `10,50`, `0,99`, `2,50` muss eine andere, numerisch korrekte Reihenfolge entstehen. Ein Klick auf das erste Originalprodukt muss als Preis `2.75` zeigen. Damit würde sowohl simples `parseFloat` als auch ein Stringvergleich auffallen.

### 9.6 Spezifische `this`- und Identitätstests für B und C

Nach frischem Laden wird ein `console`-Listener angehängt. Ein Klick auf das letzte Produkt muss neben der Update-Meldung den ersten Produkttitel loggen. Nach zusätzlichem Klick auf das erste Produkt müssen der zweite und dann der erste Titel folgen. Das prüft gleichzeitig den funktionierenden `forEach`-Receiver, die Originalsemantik „nächstes Produkt“ und den Umlauf am Arrayende. Der Listener wird im `finally`-Block wieder entfernt, damit spätere Tests keine doppelten Nachrichten sammeln.

Der Identitätstest liest:

- `Object.hasOwn(p, 'render')` für jede Instanz,
- `Object.hasOwn(p, 'updateProduct')` für jede Instanz,
- die Anzahl verschiedener Funktionswerte über `new Set(...)`,
- die tatsächliche Prototypverknüpfung über `Object.getPrototypeOf(p) === Product.prototype`.

B muss vier eigene Renderer und vier eigene Updatefunktionen haben. C muss nur beim ersten Produkt einen eigenen Renderer besitzen, insgesamt zwei Renderer-Funktionsidentitäten und eine einzige gemeinsame Updatefunktion. Die Prototypverknüpfung muss bei beiden Versionen stimmen; auch die Konstruktorversion benutzt schließlich JavaScripts Prototypmechanismus, sie teilt dort nur nicht ihre eigenen Methoden.

### 9.7 Spezifische C-Tests

Der Prototyptest vergleicht seine Methodennamen exakt mit `getTotalPrice`, `removeOneFromCart`, `render`, `updateButtons`, `updateProduct`. Alle vier Instanzen müssen bei den nicht überschriebenen Methoden denselben Funktionswert wie der Prototyp liefern. Unter den eigenen Funktions-Eigenschaften darf nur beim ersten Produkt `render` vorkommen.

Nach dem Hinzufügen aller vier Produkte muss genau eine sichtbare Zeile mit ` New Arrival!` enden und diese Zeile zum tatsächlich gelieferten Titel Sony Alpha IV gehören. Jede vollständige Zeile wird exakt mit Titel, Stückpreis, Menge, Unicode-Trennstrich und Positionssumme verglichen; nur beim ersten Produkt folgt der Postfix. Damit fallen sowohl ein versehentlich global geänderter Renderer als auch falsch dekodierte Zeichen auf. Wichtig ist die echte Datei-Navigation: Eine bloße Scripttext-Injektion würde externe Zeichensatzprobleme umgehen.

Der Minus-Test beginnt mit einem leeren Warenkorb und prüft vier in den DOM eingefügte Buttons. Für jedes Produkt separat:

1. Der Button ist anfangs deaktiviert, hat `type="button"` und zeigt exakt das Unicode-Minus `\u2212`. Auch diese Textprüfung läuft auf der tatsächlich geladenen HTML-Datei.
2. Zweimal Add aktiviert ihn und erhöht auf zwei.
3. Ein Minus-Klick führt auf eins, der zweite auf null.
4. Die Zeile verschwindet, der Preis ist wieder null, der Button deaktiviert.
5. Ein synthetisches Click-Ereignis und ein direkter Methodenaufruf bei null dürfen die Menge nicht negativ machen.

Da nach dem Minus-Klick wirklich eine Verringerung geprüft wird, fiele hier auch der Bubbling-Fehler eines auf dem gemeinsamen Eltern-div verbliebenen Add-Listeners auf.

Ein abschließender Mischkorb-Test fügt alle Produkte hinzu, leert über den vorhandenen Button und kontrolliert die Deaktivierung sämtlicher Minusbuttons sowie leere Zeilen und Gesamtpreis null.

### 9.8 Abschluss und Fehlerbehandlung

Der letzte Test verlangt `errors` gleich dem leeren Array. Es dürfen also in keinem der tatsächlichen Browserläufe unbehandelte Scriptfehler aufgetreten sein.

Die Abschlusszeile verwendet den tatsächlich erhöhten `passed`-Zähler und `browser.version()`, nicht eine vorab erfundene Erfolgszahl. Der äußere `finally`-Block schließt den Browser auch bei fehlgeschlagenen Assertions. `main().catch(...)` gibt einen Fehler aus und setzt den Prozess-Exitcode auf eins, damit ein fehlgeschlagener Lauf nicht als erfolgreich erscheint.

## 10. Tatsächlicher Nachweis und Grenzen

Aufruf vom Repository-Stamm:

```sh
node ueb04/tests_1_2.cjs
```

Voraussetzung ist eine verfügbare Entwicklungsinstallation von Playwright mit Browser. Optional lassen sich Modul und Browser wie oben beschrieben über Umgebungsvariablen auswählen. Keine Bibliothek wird in die Produktseiten eingebunden oder in ihre Auslieferungsordner kopiert.

Der ausgeführte Lauf endete mit:

```text
RESULT 32 tests passed (Chromium 148.0.7778.96; real headless browser; external network blocked).
```

Alle 32 benannten Testblöcke waren erfolgreich; der Prozess beendete sich mit Exitcode 0. Die Vorlagenfehler wurden im selben echten Browser reproduziert, beide alternativen Callbackseiten tatsächlich geöffnet und die fertigen Lösungen auf Daten- und DOM-Ebene geprüft.

Das ist ein funktionaler Browsernachweis, keine Behauptung über jede denkbare Browserengine oder beliebige fremde Preisformate. Die Implementierung geht wie die Aufgabenstellung von existierenden, wohlgeformten Produktfeldern und Preisen mit höchstens zwei Nachkommastellen ohne Tausendergruppierung aus. Keine Aussage über interne Maschinencodekopien wird aus Funktionsidentitäten abgeleitet. Es wurden keine fehlenden Daten, Produkte oder Testergebnisse erfunden.


---

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


---

# Blatt 4 – Aufgaben 4 und 5: ausführliche deutsche Erklärung

Diese Erklärung bezieht sich auf die abgegebenen Dateien `ue4.4/image-video.js`, `ue4.5/image-video.js` und `tests_4_5.cjs`. Die Zeilennummern beziehen sich jeweils auf **die betreffende Datei**, nicht auf dieses Markdown-Dokument. Die englischen Antworten auf alle Teilfragen stehen in `ue4.4/antwort.md` und `ue4.5/antwort.md`. Hier werden die Zusammenhänge und anschließend die ausführbaren Dateien zeilenweise erklärt. Leerzeilen trennen Abschnitte und führen nichts aus; reine Abschlusszeilen werden ebenfalls benannt.

Die Lösungen sind KI-unterstützt; dieses Dokument behauptet keine eigenständige, nicht unterstützte Urheberschaft. Der verpflichtende KI-Bericht wird separat auf Blattebene geführt.

## 1. Starten und Ergebnis nachprüfen

Alle folgenden Shellbefehle werden im Wurzelordner des Repositorys ausgeführt:

```sh
node ueb04/ue4.4/image-video.js
node ueb04/ue4.5/image-video.js
node --test ueb04/tests_4_5.cjs
```

Es muss nichts installiert werden. Die Produktdateien verwenden keine Bibliotheken; der Test verwendet ausschließlich Node-Standardmodule. Die Programme sind Konsolenprogramme, keine Webseiten. Eine zusätzliche HTML-Oberfläche ist für die Angabe nicht erforderlich. `require` und `module.exports` sind die CommonJS-Schnittstelle von Node und keine Drittbibliothek. Die Objekt- und Klassentechniken in den Lösungen sind gewöhnliches JavaScript; die Klassen verwenden ES2015-Syntax.

Tatsächlich ausgeführt wurde mit **Node.js v22.23.3**. Beide Einzelprogramme beendeten sich mit Status 0. Der gemeinsame Testlauf meldete:

```text
# tests 32
# suites 0
# pass 32
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

Das sind 32 Testfälle, nicht bloß 32 einzelne Vergleiche: In den Fällen befinden sich weitere Assertions und Schleifen. Die Zahlen unten werden durch echte `assert`-Aufrufe überprüft; zusätzlich startet der Test jedes Produkt in einem neuen Node-Prozess und prüft dessen tatsächlich geschriebene Konsolenausgabe.

## 2. Begriffe, bevor wir den Code lesen

### 2.1 Objekt, Property, Methode und this

Ein **Objekt** speichert Eigenschaften, auf Englisch **Properties**. Eine Property hat einen Schlüssel und einen Wert, beispielsweise `width` und `640`. Eine Property kann auch einen Funktionswert enthalten. Wird eine solche Funktion über ein Objekt aufgerufen, etwa `image.computeSize()`, sprechen wir von einer **Methode**.

Bei diesem normalen Methodenaufruf ist `this` das Objekt links vom Punkt, also `image`. Deshalb liest `this.width` dessen Breite. Dieselbe Funktion kann für ein anderes Objekt verwendet werden und dann dessen Werte lesen. Eine normale Funktion bindet `this` nicht schon bei ihrer Definition an das ursprüngliche Objekt. Ein isolierter Aufruf einer herausgelösten Methode kann die Bindung verlieren; die Lösungen rufen die Methoden deshalb über ihre Empfänger auf. Eine Arrow Function wäre für die eigentlichen Methoden mit dynamischem Empfänger nicht die richtige Ersetzung, weil sie ihr `this` lexikalisch aus der Umgebung übernehmen würde.

### 2.2 JSON gegenüber JavaScript-Objektliteral

**JSON** ist ein Datenformat. Es kann Objekte mit Daten wie Zahlen und Zeichenketten darstellen, aber **keine Funktionen**. Die Formulierung „JSON syntax“ aus Aufgabe 4a wird daher so umgesetzt: Das anfängliche JavaScript-Objektliteral hat zitierte Datenschlüssel und Zahlenwerte; die Funktion wird anschließend durch eine JavaScript-Zuweisung hinzugefügt. Es wird kein vermeintliches JSON-Dokument mit einem Funktionswert erzeugt.

### 2.3 Pixelzahl, Farbtiefe und Rohgröße

`width` und `height` sind die Abmessungen in Pixeln. `bitdepth` ist die Zahl der **Bits pro Pixel**, nicht die Zahl der Bytes und nicht die Zahl der Bits pro Farbkanal.

```text
pixels  = width × height
rawsize = pixels × bitdepth / 8
```

Die Division durch 8 wandelt Bits in Bytes um. Die Größe ist ein Modell für **unkomprimierte Pixeldaten**. Dateikopf, Metadaten, Zeilenauffüllung, Kompression und Container fehlen absichtlich. Ein JPEG muss deshalb nicht diese Größe haben.

Es wird die direkte Formel verwendet, ohne Runden. Bei nicht durch 8 teilbaren Gesamtbitzahlen kann ein mathematischer Bruchteil eines Bytes entstehen. Für eine reale Ganzbyte-Allokation müsste man zusätzlich aufrunden. Die Tests prüfen dieses bewusst nicht gerundete Verhalten. Alle Vorführungen verwenden gültige numerische Parameter; eine allgemeine Eingabevalidierung ist nicht Teil dieser Übung.

### 2.4 Konstruktor, new und eigene Properties

Eine **Konstruktorfunktion** wird mit `new` aufgerufen. Vereinfacht erzeugt `new` ein Objekt, verknüpft es mit dem Prototyp, ruft den Konstruktor mit diesem Objekt als `this` auf und liefert das Objekt zurück. `this.width = width` erzeugt auf der Instanz eine **eigene Property**. Auch `this.print = function ...` erzeugt eine eigene Property; jede Ausführung des Funktionsausdrucks liefert ein eigenes Funktionsobjekt.

Die Aussage über unterschiedliche Funktionsobjekte ist anhand von `!==` prüfbar. Daraus folgt **keine** Aussage darüber, ob eine JavaScript-Engine intern denselben kompilierten Maschinencode wiederverwendet.

### 2.5 Prototyp und Prototypkette

Ein Objekt kann einen internen Prototypverweis besitzen. Fehlt eine gesuchte Property auf dem Objekt, sucht JavaScript entlang dieser **Prototypkette** weiter. Die Property `Image.prototype` einer Konstruktorfunktion bezeichnet das Objekt, das gewöhnlich zum Prototyp ihrer mit `new` erzeugten Instanzen wird. Dieses öffentliche `.prototype` ist begrifflich von dem internen Prototypverweis einer Instanz zu unterscheiden.

```text
image -> Image.prototype -> Object.prototype -> null
video -> Video.prototype -> Image.prototype -> Object.prototype -> null
```

Ein gemeinsames `printMore` auf `Image.prototype` wird nicht auf jede Instanz kopiert. Auch nachträgliche Änderungen an dieser Property sind bei späteren Zugriffen durch bereits existierende Instanzen sichtbar. Eine eigene Property gleichen Namens hat Vorrang; sie **überschattet** die geerbte Property. `delete image.printMore` entfernt nur eine eigene Property und macht dadurch die geerbte wieder sichtbar.

### 2.6 Aufzählbarkeit und die beiden for-Schleifen

`for...in` liefert aufzählbare, zeichenkettenbasierte Propertynamen, auch geerbte. `this[property]` liest anschließend den jeweiligen Wert über einen dynamischen Namen. `this.property` wäre falsch, denn das würde immer genau die Property mit dem Namen `property` suchen.

`for...of` läuft dagegen über **Werte eines iterierbaren Objekts**, hier über die Bild- und Videoobjekte in Arrays. Es wird nicht über die Indizes oder Propertynamen iteriert.

Nicht aufzählbare Properties und Symbolschlüssel werden von `for...in` nicht geliefert. „Alle Properties“ in der Aufgabenlösung meint die durch diese geforderte Schleife aufzählbaren Eigenschaften. Die normalen Daten und die eigene Funktion `print` sind aufzählbar. Aufgabe 4 setzt Prototypmethoden durch gewöhnliche Zuweisung: Diese sind ebenfalls aufzählbar. Methoden aus `class`-Syntax in Aufgabe 5 sind dagegen nicht aufzählbar. Das erklärt die unterschiedlichen **Methodeneinträge** in den Konsolenausgaben, nicht fehlende Daten.

### 2.7 Video, Bild und Frames

Ein Video **ist hier ein spezialisiertes Image**: Es besitzt Bilddaten für ein Frame und zusätzlich `duration` in Sekunden sowie `framerate` in Frames pro Sekunde. `totalFrames()` liefert deren aktuelles Produkt. Das geerbte `rawsize` bleibt die Größe **eines Frames**. Es wird nicht stillschweigend zur Gesamtgröße des Videos umgedeutet. Ein Ergebnis mit Nachkommastellen wird wie von der Formel vorgegeben nicht gerundet; physische Frame-Zählung und Zeitquantisierung wären ein weiterführendes Modell.

## 3. Aufgabe 4: `ue4.4/image-video.js` zeilenweise

### 3.1 Objektliteral und computeSize – Zeilen 1–12

| Zeile | Erklärung |
| ---: | --- |
| 1 | `"use strict"` schaltet den strikten Modus ein. Unter anderem erzeugen unzulässige Zugriffe eher Fehler statt stiller globaler Zustandsänderungen. Ein normaler Funktionsaufruf ohne Empfänger hat hier kein globales Objekt als `this`. |
| 3 | Kommentar zur Trennung zwischen ausführbarem JavaScript-Objektliteral und JSON als Datenformat. Kommentare führen nichts aus. |
| 4 | `const image = {` beginnt das Objektliteral. `const` verhindert, dass die Variable auf ein anderes Objekt gesetzt wird; die Properties des vorhandenen Objekts bleiben veränderbar. |
| 5 | Setzt die eigene Property `width` auf 640. Das Komma trennt sie von der folgenden Property. |
| 6 | Setzt `height` auf 480. |
| 7 | Setzt `bitdepth` auf 24 Bits pro Pixel. |
| 8 | Schließt das Objektliteral und beendet die Deklaration. |
| 9 | Fügt dem bereits erzeugten Objekt die Methode `computeSize` hinzu. Rechts steht ein benannter normaler Funktionsausdruck. Der Name hilft bei Diagnose und Konsolendarstellung. |
| 10 | Multipliziert die aktuellen Werte des empfangenden Objekts und speichert das Ergebnis als `this.pixels`. Vorher muss diese Property noch nicht existieren. |
| 11 | Multipliziert Pixelzahl mit Bits pro Pixel, teilt durch acht und speichert `this.rawsize` in Bytes. |
| 12 | Schließt den Funktionsausdruck und die Zuweisung. Es wird kein Ergebnis zurückgegeben: Entscheidend ist die Änderung am Objekt. |

Die Funktion wird nicht schon durch ihre Zuweisung ausgeführt. Erst Zeile 87 ruft sie im Vorführprogramm tatsächlich auf. Das importierte Ausgangsobjekt kann deshalb vor dem ersten Aufruf noch ohne `pixels` und `rawsize` existieren.

### 3.2 Image-Konstruktor – Zeilen 14–26

| Zeile | Erklärung |
| ---: | --- |
| 14 | Kommentar: Daten und `print` werden je Instanz angelegt. |
| 15 | Definiert die Konstruktorfunktion `Image` mit drei Parametern. Die Namen der Parameter sind lokale Variablen, nicht automatisch Objektproperties. |
| 16 | Überträgt den Parameter `width` in die eigene Instanzproperty `this.width`. |
| 17 | Speichert `height` auf der Instanz. |
| 18 | Speichert `bitdepth` auf der Instanz. |
| 19 | Berechnet `pixels` sofort im Konstruktor. Anders als beim Objekt aus 4a ist kein nachträglicher `computeSize()`-Aufruf notwendig. |
| 20 | Berechnet die Rohgröße aus der eben gespeicherten Pixelzahl und der übergebenen Farbtiefe. |
| 21 | Erstellt ein neues Funktionsobjekt und weist es der eigenen Instanzproperty `print` zu. Der Ausdruck wird für jedes `new Image(...)` und auch bei `Image.call(...)` erneut ausgewertet. |
| 22 | Die `for...in`-Schleife bindet den nächsten Propertynamen pro Durchlauf an `property`. Auch aufzählbare geerbte Methoden werden gefunden. |
| 23 | Gibt den Namen mit Doppelpunkt und als zweites Konsolenargument den echten Propertywert aus. Funktionswerte werden nicht ausgefiltert. |
| 24 | Schließt den Schleifenrumpf. |
| 25 | Schließt die Printfunktion und ihre Zuweisung. |
| 26 | Schließt den Image-Konstruktor. |

Es wird absichtlich **kein** `Image.prototype.print` angelegt: Sonst wäre der in 4b verlangte Unterschied zur Prototypmethode nicht mehr vorhanden.

### 3.3 printMore – Zeilen 28–35

| Zeile | Erklärung |
| ---: | --- |
| 28 | Kommentar zum gemeinsam genutzten Funktionsobjekt. |
| 29 | Fügt `printMore` dem Prototyp hinzu, nicht einer einzelnen Instanz. |
| 30 | Ruft die zum Aufrufzeitpunkt auf dem Empfänger gefundene `print`-Methode auf. Dadurch werden auch spätere individuelle Ersetzungen respektiert. |
| 31 | Beginnt die bedingte Auswahl der Orientierung. `===` prüft Gleichheit ohne Typumwandlung; bei gleichen Abmessungen wird der erste Fall gewählt. |
| 32 | Der Wahr-Zweig des ternären Operators `? :` liefert `square`. |
| 33 | Der Sonst-Zweig unterscheidet mit einem zweiten ternären Operator zwischen `landscape` bei größerer Breite und `portrait` bei größerer Höhe. |
| 34 | Druckt die bestimmte Orientierung zusätzlich zur vollständigen `print()`-Ausgabe. |
| 35 | Schließt Methode und Prototypzuweisung. |

Bei positiver Höhe ist `width > height` dasselbe Orientierungskriterium wie `width / height > 1`. Ein Quadrat bekommt absichtlich einen eigenen Fall. Die normale Methode unterscheidet alle drei Fälle; die spätere **Ersatzmethode** verwendet zur Erkennbarkeit einen anderen, vereinfachten Ausgabetext.

### 3.4 Video-Vererbung – Zeilen 37–52

| Zeile | Erklärung |
| ---: | --- |
| 37 | Kommentar: Initialisierung und Methodenvererbung sind zwei getrennte Schritte. |
| 38 | Definiert den Video-Konstruktor mit allen fünf geforderten Parametern. |
| 39 | Ruft `Image` als normale Funktion auf, aber mit explizit festgelegtem `this`: dem gerade entstehenden Video. Die Bilddaten und die eigene Printfunktion werden auf diesem selben Objekt angelegt. Es wird **kein zweites Bildobjekt** erzeugt. |
| 40 | Speichert die Dauer in Sekunden. |
| 41 | Speichert die Bildrate in Frames pro Sekunde. |
| 42 | Schließt den Video-Konstruktor. |
| 43 | Erzeugt ein neues, zunächst eigenschaftsloses Objekt mit `Image.prototype` als internem Prototyp und verwendet es als `Video.prototype`. Das ist die eigentliche Verbindung der Instanz-Prototypketten. |
| 44 | Definiert auf dem neuen Video-Prototyp die Property `constructor` ausdrücklich mit einem Propertydeskriptor. |
| 45 | Setzt deren Wert auf die Funktion `Video`, damit `video.constructor` nicht nur die geerbte Image-Referenz liefert. |
| 46 | `writable: true` erlaubt eine spätere Neuzuweisung des Propertywerts. |
| 47 | `configurable: true` erlaubt eine spätere Umdefinition oder Löschung dieser Property. |
| 48 | `enumerable: false` verhindert, dass `constructor` in `for...in` erscheint. Das entspricht der üblichen Konstruktorproperty. |
| 49 | Schließt Deskriptorobjekt und `Object.defineProperty`-Aufruf. |
| 50 | Legt `totalFrames` als gemeinsame Methode auf `Video.prototype` ab. |
| 51 | `return` liefert das aktuelle Produkt aus Dauer und Bildrate an den Aufrufer. Die Werte werden nicht im Konstruktor eingefroren und nicht gerundet. |
| 52 | Schließt die Funktion und ihre Zuweisung. |

`Image.call(...)` **allein** würde `printMore` nicht vererben. `Object.create(...)` **allein** würde die Bilddaten und die eigene Printfunktion nicht initialisieren. Deshalb sind beide Schritte notwendig. Die `constructor`-Property ist eine Referenz und keine Anweisung, nachträglich den Konstruktor auszuführen.

### 3.5 Echte Neuzuweisungen zur Laufzeit – Zeilen 54–83

Die Demonstration erhält zwei unterschiedliche, frisch erzeugte Instanzen ohne eigene `printMore`-Property. Sie ist ein Vorführhelfer für genau diesen Ausgangszustand, keine allgemeine Reparaturfunktion für beliebig vorveränderte Objekte.

| Zeile | Erklärung |
| ---: | --- |
| 54 | Kommentar zur Vorführung und zur anschließenden Rücksetzung. |
| 55 | Definiert den Helfer mit den zwei Objektparametern `first` und `second`. |
| 56 | Vergleicht die beiden Funktionsreferenzen von `print` mit `!==`. Bei den Demoobjekten wird `true` ausgegeben, weil beide eigene, unterschiedliche Funktionen besitzen. |
| 57 | Vergleicht die beiden über die Prototypkette gefundenen `printMore`-Referenzen mit `===`. Vor der Änderung sind sie identisch. |
| 58 | Merkt sich die ursprüngliche eigene Printfunktion des ersten Objekts. Die Konstante schützt die Referenz, nicht das Objekt vor Änderungen. |
| 59 | Merkt sich die ursprüngliche gemeinsame Prototypfunktion. |
| 60 | Beginnt einen `try`-Block. Ein späterer Fehler überspringt nicht den zugehörigen `finally`-Block. |
| 61 | Ersetzt ausschließlich `first.print` durch eine neue normale Funktion. |
| 62 | Die Ersatzfunktion druckt zur eindeutigen Erkennbarkeit nur die aktuelle Breite ihres Empfängers. |
| 63 | Schließt diese Ersatzfunktion und die Zuweisung. |
| 64 | Führt die neue Printfunktion über `first` tatsächlich aus. |
| 65 | Führt `second.print` aus; dieses zweite Objekt behält seine bisherige eigene Funktion. |
| 66 | Ersetzt jetzt die gemeinsame `printMore`-Property auf dem Image-Prototyp. Alle unüberschatteten Instanzen, auch bestehende Videos, finden nun diese Funktion. |
| 67 | Der neue Text ist absichtlich `replacement shared orientation`. Die vereinfachte Ersatzausgabe fasst Querformat und Quadrat zusammen; sie ist nur ein erkennbarer Laufzeittest, nicht die ursprüngliche Orientierungsfunktion. `this` ist weiterhin der jeweilige Empfänger. |
| 68 | Schließt den Ersatzfunktionsausdruck. |
| 69 | Ruft die neue gemeinsame Methode über das erste bereits vorhandene Objekt auf. |
| 70 | Ruft dieselbe neue gemeinsame Methode über das zweite bereits vorhandene Objekt auf. |
| 71 | Legt eine eigene `printMore`-Property nur auf `first` an. Damit überschattet diese die Prototypmethode. |
| 72 | Die eigene Ersatzfunktion druckt zur Unterscheidung die Höhe ihres Empfängers. |
| 73 | Schließt diese Funktion und ihre Zuweisung. |
| 74 | Führt die eigene, überschattende Methode des ersten Objekts aus. |
| 75 | Das zweite Objekt führt weiterhin die gemeinsame Ersatzmethode vom Prototyp aus. |
| 76 | Löscht die eigene Property von `first`. Die Property auf dem Prototyp bleibt unangetastet. |
| 77 | Der erneute Aufruf erreicht dadurch wieder die gemeinsame Ersatzfunktion. |
| 78 | Schließt `try` und beginnt `finally`. Der Aufräumcode läuft auch, wenn einer der vorherigen Aufrufe eine Exception ausgelöst hat; der Fehler wird nicht verschluckt. |
| 79 | Setzt `first.print` auf seine ursprüngliche Funktion zurück. |
| 80 | Entfernt gegebenenfalls eine noch vorhandene eigene Demo-`printMore`-Property. |
| 81 | Stellt die ursprüngliche Prototypmethode wieder her. |
| 82 | Schließt `finally`. |
| 83 | Schließt den Helfer. |

Wichtig: `Image.prototype.print = irgendeineFunktion` würde ein vorhandenes eigenes `first.print` **nicht** verdrängen. Die Suche endet zuerst an der Instanz. Dagegen wird die Änderung von `Image.prototype.printMore` sofort sichtbar, solange keine eigene gleichnamige Property den Zugriff überschattet.

### 3.6 Vorführung und Modulgrenze – Zeilen 85–120

| Zeile | Erklärung |
| ---: | --- |
| 85 | Fasst die ausführbare Vorführung in `runDemo` zusammen. Importierende Tests müssen dadurch nicht automatisch die ganze Ausgabe erhalten. |
| 86 | Druckt die Abschnittsüberschrift zu 4a. |
| 87 | Ruft `computeSize` auf dem Objektliteral tatsächlich auf. |
| 88 | Druckt die danach gespeicherte Pixelzahl `307200`. |
| 89 | Druckt die gespeicherte Rohgröße `921600`. |
| 90 | Beginnt ein Array mit drei Image-Instanzen. |
| 91 | Konstruiert das Querformatbild mit 1920 × 1080 Pixeln und 24 Bits pro Pixel. |
| 92 | Konstruiert das Hochformatbild mit 600 × 800 Pixeln und 32 Bits pro Pixel. |
| 93 | Konstruiert das Quadrat mit 512 × 512 Pixeln und 8 Bits pro Pixel. |
| 94 | Schließt das Array. |
| 95 | Beschriftet den Abschnitt für die beiden Druckmethoden. |
| 96 | `for...of` liefert jedes Bildobjekt aus dem Array als `item`. |
| 97 | Ruft die eigene Printfunktion auf. |
| 98 | Ruft die geerbte PrintMore-Funktion auf. Sie druckt absichtlich nochmals die Werte und danach die Orientierung. |
| 99 | Beendet die Bildschleife. |
| 100 | Beginnt das Array mit drei Video-Instanzen. |
| 101 | Erstellt ein Querformatvideo mit zehn Sekunden und 30 Frames pro Sekunde. |
| 102 | Erstellt ein Hochformatvideo mit einer Dauer von 2,5 Sekunden und 24 Frames pro Sekunde. Im Code steht der JavaScript-Dezimalpunkt `2.5`. |
| 103 | Erstellt ein quadratisches Video mit Dauer null als sinnvollen Randfall. |
| 104 | Schließt das Videoarray. |
| 105 | Beschriftet den Videoabschnitt einschließlich der geerbten Methode. |
| 106 | Iteriert über die Videoobjekte. |
| 107 | Die aus dem Image-Konstruktor stammende Printfunktion druckt auch `duration` und `framerate`, weil sie den aktuellen Empfänger durchläuft. |
| 108 | Führt `totalFrames` aus und druckt dessen Rückgabewert: für die drei Videos 300, 60 und 0. |
| 109 | Führt die über `Image.prototype` geerbte Methode aus. `this` ist dabei weiterhin das Video. |
| 110 | Schließt die Videoschleife. |
| 111 | Überschrift für Laufzeitänderungen. |
| 112 | Demonstriert die Zuweisungen mit den ersten beiden Bildobjekten. |
| 113 | Überschrift für dieselbe Wirkung über die Vererbungskette. |
| 114 | Demonstriert die Zuweisungen mit einem schon vorhandenen Bild und einem schon vorhandenen Video. |
| 115 | Schließt die Vorführfunktion. |
| 117 | Prüft, ob diese Datei das direkt von Node gestartete Hauptmodul ist. Bei einem bloßen `require(...)` ist die Bedingung falsch. |
| 118 | Startet nur im direkten Ausführungsfall die Vorführung. |
| 119 | Schließt die Bedingung. |
| 120 | Exportiert das Objekt, beide Konstruktoren und beide Helfer zur Verwendung durch Tests oder eine Node-REPL. Die Kurzschreibweise erzeugt Properties mit denselben Namen wie die Variablen. |

## 4. Aufgabe 5: `ue4.5/image-video.js` zeilenweise

### 4.1 Image als ES2015-Klasse – Zeilen 1–30

Klassen ersetzen hier die manuell geschriebene Konstruktor-/Vererbungssyntax. **Intern verwenden auch JavaScript-Klassen Prototypen.** Eine Klasse ist nicht ein zweites, davon unabhängiges Vererbungssystem. Das erklärt, warum die verlangten Laufzeitänderungen auch an einer Klassenmethode funktionieren.

`print` bleibt bewusst als Funktionszuweisung **im constructor**, damit die in 4b ausdrücklich verlangte eigene Funktion und der Vergleich aus 4d erhalten bleiben. `computeSize` und `printMore` stehen dagegen in gewöhnlicher Klassenmethodensyntax und werden geteilt. Würde man auch `print()` als normale Klassenmethode definieren, hätten alle Instanzen dieselbe Funktion, was die Vergleichsaussage aus Aufgabe 4 verändern würde.

| Zeile | Erklärung |
| ---: | --- |
| 1 | Schaltet den strikten Modus auch für den CommonJS-Rahmen ein. Klassenrümpfe selbst sind ohnehin strikt. |
| 3 | Kommentar: Die Klasse übernimmt das Objektbeispiel und die bisherige Konstruktorfunktion. |
| 4 | Beginnt die Klassendeklaration `Image`. Eine Instanz wird mit `new Image(...)` erzeugt. |
| 5 | Der besondere `constructor` erhält die drei Bildparameter. Ein `class`-Konstruktor darf nicht wie eine gewöhnliche Funktion ohne `new` aufgerufen werden. |
| 6 | Speichert die Breite auf der Instanz. |
| 7 | Speichert die Höhe. |
| 8 | Speichert die Farbtiefe. |
| 9 | Ruft die über den Prototyp gefundene Methode auf, um Pixelzahl und Rohgröße sofort zu speichern. Die Eingabefelder existieren zu diesem Zeitpunkt bereits. |
| 10 | Kommentar zur bewussten Beibehaltung einer eigenen Printfunktion aus Aufgabe 4b. |
| 11 | Legt diese eigene Funktion an. Sie ist kein gewöhnlicher Klassenmethodeneintrag, sondern eine Zuweisung im Konstruktor. |
| 12 | Durchläuft die aufzählbaren Propertynamen des empfangenden Objekts. |
| 13 | Druckt den jeweiligen Namen und Wert. Eine dynamisch ergänzte Property oder eine Video-Property wird genauso erfasst. |
| 14 | Schließt die Schleife. |
| 15 | Schließt den Funktionsausdruck und die Zuweisung. |
| 16 | Schließt den Konstruktor. |
| 18 | Definiert `computeSize` als nicht aufzählbare gemeinsame Methode auf `Image.prototype`. Im Klassenrumpf ist das Schlüsselwort `function` dafür nicht erforderlich. |
| 19 | Berechnet Pixelzahl aus den **aktuellen** Instanzabmessungen. |
| 20 | Berechnet die aktuelle Rohgröße in Bytes. |
| 21 | Schließt die Methode. |
| 23 | Definiert `printMore` als weitere normale Klassenmethode und damit als gemeinsame Prototypmethode. |
| 24 | Delegiert die Datenausgabe an die aktuell auf dem Objekt gefundene Printfunktion. |
| 25 | Prüft zuerst, ob die Abmessungen gleich sind. |
| 26 | Liefert dann `square`. |
| 27 | Liefert andernfalls `landscape` bei größerer Breite oder `portrait` bei größerer Höhe. |
| 28 | Druckt die Orientierung zusätzlich zu allen zuvor ausgegebenen Properties. |
| 29 | Schließt `printMore`. |
| 30 | Schließt die Klasse Image. |

### 4.2 Video mit extends und super – Zeilen 32–43

| Zeile | Erklärung |
| ---: | --- |
| 32 | Kommentar: `extends` stellt die Vererbungsbeziehung her, `super` initialisiert den Elternteil. |
| 33 | Beginnt `Video` als Unterklasse von `Image`. Dadurch wird unter anderem `Image.prototype` zum Prototyp von `Video.prototype`. Eine manuelle `Object.create`-Zuweisung entfällt. |
| 34 | Definiert den Konstruktor mit Bildparametern, Dauer und Framerate. |
| 35 | Ruft den Elternkonstruktor mit den Bildparametern auf. In einem abgeleiteten Konstruktor muss dies vor dem ersten Zugriff auf `this` geschehen. Der Elternkonstruktor initialisiert die Bildfelder und `print` auf der Video-Instanz. |
| 36 | Speichert jetzt die Dauer auf dem initialisierten Objekt. |
| 37 | Speichert die Framerate. |
| 38 | Schließt den Video-Konstruktor. |
| 40 | Definiert `totalFrames` als gemeinsame, nicht aufzählbare Klassenmethode auf `Video.prototype`. |
| 41 | Gibt das aktuelle Produkt von Dauer und Framerate zurück. |
| 42 | Schließt die Methode. |
| 43 | Schließt die Unterklasse. |

Die normale `constructor`-Property wird von der Klassensyntax korrekt eingerichtet. Eine manuelle Deskriptorreparatur wie in 4e entfällt. `computeSize()` und `printMore()` brauchen in `Video` nicht erneut definiert zu werden: Sie werden über die Kette gefunden.

### 4.3 Laufzeitänderungen bei Klassen – Zeilen 45–74

Der Ablauf entspricht bewusst dem aus Aufgabe 4. Die Tabelle benennt trotzdem jede ausführbare Zeile der Klassenversion, damit beim Lesen keine Zeilennummern übertragen werden müssen.

| Zeile | Erklärung |
| ---: | --- |
| 45 | Kommentar, dass auch Klassenmethoden neu zugewiesen und überschattet werden können. |
| 46 | Beginnt den Helfer mit zwei bestehenden, frischen Demoobjekten. |
| 47 | Gibt aus, ob die eigenen Printfunktionen verschieden sind. |
| 48 | Gibt aus, ob beide Objekte dieselbe geerbte PrintMore-Funktion finden. |
| 49 | Sichert die ursprüngliche eigene Printfunktion des ersten Objekts. |
| 50 | Sichert die ursprüngliche gemeinsame Klassenmethode. |
| 51 | Beginnt den gegen vergessene Rücksetzung abgesicherten `try`-Block. |
| 52 | Weist nur dem ersten Objekt eine neue Printfunktion zu. |
| 53 | Die neue Funktion druckt die Breite ihres Empfängers unter einem erkennbaren Ersatztext. |
| 54 | Schließt Funktionsausdruck und Zuweisung. |
| 55 | Führt die eigene Ersatzfunktion tatsächlich aus. |
| 56 | Führt zur Gegenprobe die unveränderte Printfunktion des zweiten Objekts aus. |
| 57 | Ersetzt die gemeinsame Methode auf `Image.prototype`. Die `class`-Deklaration hat die Property nicht unveränderbar gemacht. |
| 58 | Die Ersatzausgabe gruppiert Quadrat und Querformat bewusst unter einem anderen Text. Der eigentliche ursprüngliche Methodencode unterscheidet weiterhin drei Fälle, sobald er wiederhergestellt ist. |
| 59 | Schließt den Ersatzfunktionsausdruck. |
| 60 | Erstes vorhandenes Objekt ruft die geänderte gemeinsame Methode auf. |
| 61 | Zweites vorhandenes Objekt ruft dieselbe Änderung auf. |
| 62 | Eine neue eigene Property `first.printMore` überschattet nun die gemeinsame Klassenmethode. |
| 63 | Die eigene Ersatzfunktion druckt die Höhe, um die Herkunft sichtbar zu machen. |
| 64 | Schließt die eigene Ersatzfunktion. |
| 65 | Erstes Objekt führt die überschattende Funktion aus. |
| 66 | Zweites Objekt verwendet weiter die gemeinsame Ersatzfunktion. |
| 67 | Löscht die eigene überschattende Property des ersten Objekts. |
| 68 | Erneuter Aufruf erreicht wieder den Prototyp. |
| 69 | Wechselt vom `try`-Block in den immer ausgeführten Aufräumblock. |
| 70 | Stellt die originale eigene Printfunktion wieder her. |
| 71 | Entfernt eine möglicherweise noch vorhandene eigene Demo-PrintMore-Property. |
| 72 | Stellt die ursprüngliche gemeinsame Klassenmethode wieder her. |
| 73 | Schließt `finally`. |
| 74 | Schließt den Helfer. |

Eine bloße Zuweisung auf die **bereits vorhandene** Klassenmethodenproperty ändert deren Aufzählbarkeitsflag nicht. Die ersetzte `Image.prototype.printMore` bleibt in dieser Version nicht aufzählbar. Der Zugriff und die Vererbung funktionieren unabhängig von diesem Flag.

### 4.4 Vorführung und Export – Zeilen 76–112

| Zeile | Erklärung |
| ---: | --- |
| 76 | Beginnt die Vorführfunktion der Klassenlösung. |
| 77 | Beschriftet den Teil zur ComputeSize-Funktionalität. |
| 78 | Erzeugt das Ausgangsbild aus 4a nun als Klasseninstanz. Der Konstruktor hat seine Größe bereits berechnet. |
| 79 | Ruft `computeSize()` zusätzlich explizit auf, damit auch diese geforderte Funktion tatsächlich vorgeführt wird. |
| 80 | Druckt `pixels: 307200`. |
| 81 | Druckt `rawsize: 921600`. |
| 82 | Beginnt das Array der drei weiteren Beispielbilder. |
| 83 | Erstellt das Querformatbild. |
| 84 | Erstellt das Hochformatbild. |
| 85 | Erstellt das Quadrat. |
| 86 | Schließt das Array. |
| 87 | Beschriftet die Ausgabe der Druckmethoden. |
| 88 | Iteriert mit `for...of` über die Bildinstanzen. |
| 89 | Ruft die eigene Printfunktion jedes Bilds auf. |
| 90 | Ruft die gemeinsame Klassenmethode auf, die nochmals Daten und dann Orientierung druckt. |
| 91 | Schließt die Bildschleife. |
| 92 | Beginnt das Videoarray. |
| 93 | Erstellt das Querformatvideo mit zehn Sekunden und 30 fps. |
| 94 | Erstellt das Hochformatvideo mit 2,5 Sekunden und 24 fps. |
| 95 | Erstellt das quadratische Video mit Null-Dauer und 25 fps. |
| 96 | Schließt das Array. |
| 97 | Beschriftet den Videoabschnitt. |
| 98 | Iteriert über die Videos. |
| 99 | Führt die vom Elternkonstruktor angelegte eigene Printfunktion auf dem aktuellen Video aus. |
| 100 | Druckt den echten Rückgabewert von `totalFrames()`. |
| 101 | Führt die geerbte PrintMore-Methode aus. |
| 102 | Schließt die Videoschleife. |
| 103 | Überschrift der Laufzeitvorführung. |
| 104 | Führt die Neuzuweisungen mit zwei Bildern aus. |
| 105 | Überschrift für die Wirkung auf ein schon vorhandenes Video. |
| 106 | Führt dieselben Neuzuweisungen mit Bild und Video aus. |
| 107 | Schließt die Vorführfunktion. |
| 109 | Unterscheidet direkten Node-Start von Modulimport. |
| 110 | Startet die Vorführung nur beim direkten Start dieser Datei. |
| 111 | Schließt die Bedingung. |
| 112 | Exportiert die beiden Klassen und die Helfer. Klassen sind als Werte übertragbar und können deshalb genauso in einem Exportobjekt stehen wie Konstruktorfunktionen. |

## 5. Tatsächliche Beispielwerte und warum beide Programme sie liefern

Diese Werte stammen aus den ausgeführten Programmen und werden unabhängig als feste Sollwerte im Test kontrolliert:

| Objekt | width | height | bitdepth | pixels | rawsize in Bytes | duration | framerate | totalFrames |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Ausgangsbild | 640 | 480 | 24 | 307200 | 921600 | – | – | – |
| Querformatbild | 1920 | 1080 | 24 | 2073600 | 6220800 | – | – | – |
| Hochformatbild | 600 | 800 | 32 | 480000 | 1920000 | – | – | – |
| Quadratbild | 512 | 512 | 8 | 262144 | 262144 | – | – | – |
| Querformatvideo | 1920 | 1080 | 24 | 2073600 | 6220800 | 10 | 30 | 300 |
| Hochformatvideo | 720 | 1280 | 24 | 921600 | 2764800 | 2.5 | 24 | 60 |
| Quadratvideo | 512 | 512 | 8 | 262144 | 262144 | 0 | 25 | 0 |

Ein Methodenaufruf verändert diese Zahlen nicht, sofern er nur druckt. `computeSize()` ist dagegen eine zustandsändernde Methode: Sie schreibt die beiden berechneten Properties. `totalFrames()` berechnet nur einen Rückgabewert und speichert diesen nicht zusätzlich.

Die beiden Programme geben dieselben **Datenwerte** aus. Die zusätzliche Liste von Funktionsproperties ist absichtlich nicht identisch: Klassensyntax macht die Prototypmethoden nicht aufzählbar. In Aufgabe 4 sieht man beispielsweise `printMore: [Function: printMore]`; in Aufgabe 5 bleibt diese Methode aufrufbar, obwohl die Schleife sie nicht auflistet.

## 6. Änderungen live ausprobieren und erklären

### 6.1 In einer Node-REPL mit beiden Implementierungen arbeiten

Im Repository-Wurzelordner `node` starten. Die folgenden Eingaben sind REPL-Eingaben, keine Shellbefehle:

```js
const p = require('./ueb04/ue4.4/image-video.js');
const c = require('./ueb04/ue4.5/image-video.js');
const first = new p.Image(1920, 1080, 24);
const second = new p.Image(600, 800, 32);
const video = new p.Video(720, 1280, 24, 2.5, 24);
first.print();
second.printMore();
video.printMore();
video.totalFrames();
```

Die Variablen enthalten reale Instanzen, keine Beschreibungen von Instanzen. `video.totalFrames()` liefert den im Test bestätigten Wert 60. `printMore()` nutzt die Abmessungen des Video-Frames und liefert im Beispiel die Orientierung `portrait`.

### 6.2 Nur eine eigene Printfunktion ändern

```js
const savedPrint = first.print;
first.print = function () { console.log('custom width:', this.width); };
first.print();
second.print();
first.printMore();
first.print = savedPrint;
```

- Die Zuweisung ändert nur `first`.
- `second` behält seine eigene Funktion.
- `first.printMore()` ist nicht selbst ersetzt worden. Trotzdem verwendet dessen `this.print()` nun die neue eigene Funktion und druckt anschließend die normale Orientierung.
- Der letzte Befehl stellt den Ausgangszustand wieder her.

### 6.3 Eine gemeinsame Methode ändern, überschatten und wieder freilegen

```js
const savedMore = p.Image.prototype.printMore;
p.Image.prototype.printMore = function () { console.log('shared width:', this.width); };
first.printMore();
second.printMore();
video.printMore();
first.printMore = function () { console.log('own height:', this.height); };
first.printMore();
second.printMore();
delete first.printMore;
first.printMore();
p.Image.prototype.printMore = savedMore;
```

Erst erreichen alle drei bereits existierenden Objekte die gemeinsame Ersatzfunktion. Dann überschattet nur `first` sie durch eine eigene Property. Die zweite Instanz und das Video bleiben beim Prototyp. `delete` entfernt die eigene Property, nicht die Prototypmethode. Nach dem Wiederherstellen ist die vollständige ursprüngliche Druck-/Orientierungsfunktion wieder verfügbar.

Für Klassen dasselbe Prinzip mit `c.Image.prototype.printMore` und Instanzen aus `new c.Image(...)` bzw. `new c.Video(...)` verwenden. Die Klassensyntax verbietet diese Änderungen nicht. Die mitgelieferte Funktion `demonstrateAssignments` führt genau diese Arten von Änderungen für beide Versionen wirklich aus und verwendet zum Aufräumen `finally`.

### 6.4 Datenfelder ändern und gespeicherte Werte neu berechnen

```js
const editable = new c.Image(10, 20, 16);
editable.width = 20;
editable.height = 10;
editable.bitdepth = 8;
editable.computeSize();
editable.printMore();
video.duration = 0.5;
video.framerate = 25;
video.totalFrames();
```

`editable.computeSize()` schreibt die im Test bestätigten neuen Werte `pixels = 200` und `rawsize = 200`. Ohne diesen Aufruf blieben die vorher berechneten Felder nach einer Datenänderung zunächst veraltet. Es gibt hier keine automatisch reagierenden Getter oder Setter. `printMore()` bestimmt die Orientierung hingegen bei jedem Aufruf neu aus den aktuellen Abmessungen.

`video.totalFrames()` liest die aktuellen Werte direkt und liefert im letzten Beispiel den ebenfalls getesteten ungerundeten Wert `12.5`. Ein eigenes Neuberechnungsverfahren ist dafür nicht notwendig. Bei Aufgabe 4 besitzen die Konstruktor-Instanzen wie gefordert **keine** ComputeSize-Methode; dort erstellt man für neue Bildparameter entweder eine neue Instanz oder berechnet die gespeicherten Felder ausdrücklich neu. Das Objektliteral aus 4a besitzt seine ComputeSize-Methode weiterhin. Aufgabe 5 vereinigt diese Funktionalitäten als geerbte Klassenmethode.

## 7. `tests_4_5.cjs`: Aufbau und zeilenweise Erklärung

### 7.1 Standardmodule, Ausgabeerfassung und feste Sollwerte – Zeilen 1–32

Ein Test soll nicht bloß die gleiche Formel erneut ausführen und mit sich selbst vergleichen. Die Zahlentabellen enthalten daher feste Sollwerte. Ausgabeprüfungen lesen zudem reale Konsolenargumente beziehungsweise die Standardausgabe eines gestarteten Prozesses.

| Zeile | Erklärung |
| ---: | --- |
| 1 | Aktiviert den strikten Modus für den Test. |
| 3 | Lädt Nodes strikte Assertions. `assert.equal` prüft in diesem Modul strikt und `assert.deepEqual` vergleicht verschachtelte Strukturen. |
| 4 | Lädt den eingebauten Testrunner zum Registrieren der Testfälle. |
| 5 | Importiert `spawnSync`, um die Programme in eigenen Node-Prozessen zu starten und ihren Status sowie ihre Ausgabe zu erhalten. |
| 6 | Lädt die standardisierte Pfadverarbeitung. |
| 7 | Importiert die echte Prototyplösung. Wegen der Hauptmodulprüfung wird die Vorführung beim Import nicht gestartet. |
| 8 | Importiert die echte Klassenlösung ebenso. |
| 10 | Definiert `capture(action)` zum Erfassen synchroner Konsolenausgaben einer Aktion. |
| 11 | Erstellt ein Array für die Konsolenaufrufe. |
| 12 | Sichert die ursprüngliche Konsolenfunktion. |
| 13 | Ersetzt sie vorübergehend durch eine Arrow Function. Der Restparameter `...values` sammelt alle Argumente eines Aufrufs als Array; `push` speichert es. Die Arrow Function braucht hier keinen dynamischen Empfänger. |
| 14 | Beginnt einen abgesicherten Ausführungsblock. |
| 15 | Führt die übergebene Aktion wirklich aus. |
| 16 | Beginnt `finally`, auch im Fehlerfall. |
| 17 | Stellt `console.log` wieder her, damit folgende Tests und der Testrunner nicht beeinträchtigt werden. |
| 18 | Schließt den Aufräumblock. |
| 19 | Gibt die erfassten Argumentarrays zurück. Bei einer Exception wird der Fehler nach `finally` weitergegeben und dieser Rückgabepfad nicht erreicht. |
| 20 | Schließt den Erfassungshelfer. |
| 22 | Beginnt die Tabelle der Bildfälle. Jedes Tupel enthält Breite, Höhe, Bits pro Pixel, erwartete Pixel und erwartete Bytes. |
| 23 | Feste Sollwerte für das Ausgangsbild 640 × 480. |
| 24 | Feste Sollwerte für das Querformatbild. |
| 25 | Feste Sollwerte für das Hochformatbild. |
| 26 | Feste Sollwerte für das Quadrat. |
| 27 | Schließt die Bildtabelle. |
| 28 | Beginnt die Videotabelle. Jedes Tupel enthält zusätzlich Dauer, fps und erwartete Framezahl. |
| 29 | Querformatvideo mit Sollwert 300 Frames. |
| 30 | Hochformatvideo mit gebrochener Dauer und Sollwert 60 Frames. |
| 31 | Quadratvideo mit Dauer und Framezahl null. |
| 32 | Schließt die Videotabelle. |

Der Erfassungshelfer ist für die hier synchronen Methoden gedacht. Er wäre kein allgemeiner Helfer für asynchron erst nach seiner Rückkehr ausgeführte Konsolenaufrufe. Die Tests verändern `console.log` nur während solcher synchronen Aktionen.

### 7.2 Identische Datentests auf beide Lösungen anwenden – Zeilen 34–62

| Zeile | Erklärung |
| ---: | --- |
| 34 | Beginnt eine Schleife über beide Implementierungen und entpackt Kennzeichnung, Exportobjekt und Ordnername. |
| 35 | Erstes Tupel: Prototyplösung. |
| 36 | Zweites Tupel: Klassenlösung. |
| 37 | Schließt die Liste und öffnet den gemeinsamen Schleifenrumpf. |
| 38 | Entnimmt `Image`, `Video` und den Zuweisungshelfer aus dem aktuellen Exportobjekt. Dadurch läuft derselbe Testcode mit unterschiedlichen Implementierungen. |
| 39 | Entpackt nacheinander jeden Bild-Testdatensatz. |
| 40 | Registriert einen benannten Testfall; Template Literals setzen Typ und Abmessungen in den Namen ein. |
| 41 | Konstruiert die zu prüfende echte Instanz. |
| 42 | Prüft alle drei übernommenen Eingabefelder einschließlich ihrer Reihenfolge und Typen. |
| 43 | Prüft die gespeicherte Pixelzahl gegen den festen Tabellenwert. |
| 44 | Prüft die gespeicherte Rohgröße. |
| 45 | Führt `print` unter Ausgabeerfassung aus. |
| 46 | Prüft, dass tatsächlich ein Konsolenaufruf mit dem Schlüssel `pixels:` und dem richtigen Zahlenwert vorkam. `some` bedeutet: Mindestens ein passender Eintrag muss existieren. |
| 47 | Prüft ebenso die gedruckte Rohgröße. |
| 48 | Schließt den aktuellen Testcallback und den Registrierungsaufruf. |
| 49 | Schließt die Bilddatenschleife. |
| 51 | Entpackt nacheinander jeden vollständigen Video-Testdatensatz. |
| 52 | Registriert den benannten Videotest. |
| 53 | Erzeugt die Video-Instanz mit den fünf geforderten Parametern. |
| 54 | Prüft die geerbte Pixelberechnung. |
| 55 | Prüft die geerbte Rohgrößenberechnung. |
| 56 | Führt `totalFrames()` aus und prüft den Rückgabewert. |
| 57 | Erfasst die wirkliche `print()`-Ausgabe. |
| 58 | Erstellt ein Objekt mit allen erwarteten numerischen Feldern und durchläuft dessen Schlüssel-Wert-Paare. `bitdepth: bits` und `duration: seconds` bilden lokale Testvariablennamen auf Produktpropertynamen ab. |
| 59 | Prüft für jedes Feld ein passendes ausgegebenes Schlüssel-Wert-Paar. So könnte eine bloß intern richtige, aber unvollständig druckende Lösung nicht bestehen. |
| 60 | Schließt diese Feldschleife. |
| 61 | Schließt den Videotest. |
| 62 | Schließt die Videodatenschleife. |

### 7.3 Aufzählung, Orientierung und Vererbung – Zeilen 64–107

| Zeile | Erklärung |
| ---: | --- |
| 64 | Registriert den Test für die vollständige aufzählbare Ausgabe. |
| 65 | Erzeugt ein Video als Prüfobjekt, damit eigene Bild- und Videofelder sowie geerbte Methoden vorhanden sind. |
| 66 | Ergänzt nachträglich eine eigene Textproperty. Die Druckfunktion darf nicht auf eine fest codierte Liste ursprünglicher Feldnamen beschränkt sein. |
| 67 | Erstellt die erwartete Ausgabeliste. |
| 68 | Ermittelt die tatsächlich aufzählbaren Namen und Werte des Objekts in Schleifenreihenfolge. |
| 69 | Vergleicht die gesamte echte Printausgabe einschließlich der Funktionsreferenzen mit dieser Liste. |
| 70 | Prüft zusätzlich, dass die eigene Printfunktion als Wert erfasst wird und nicht ausgefiltert wurde. |
| 71 | Prüft die nachträglich ergänzte Textproperty ausdrücklich. |
| 72 | Kontrolliert den dokumentierten Enumerierbarkeitsunterschied von `printMore`: nur in der Prototypversion als Propertyzeile aufgelistet. |
| 73 | Kontrolliert denselben Unterschied bei `totalFrames`. |
| 74 | Schließt den Aufzählungstest. |
| 76 | Registriert den Test auf PrintMore-Ausgabe und Orientierung. |
| 77 | Testet beide Empfängertypen: Bild und Video. |
| 78 | Durchläuft feste Beispiele für Querformat, Hochformat und Quadrat. |
| 79 | Erstellt die jeweilige Instanz. Die zusätzlichen Videoargumente werden vom Image-Konstruktor einfach nicht benutzt. |
| 80 | Erfasst die normale Printausgabe als erwarteten Anfang. |
| 81 | Ergänzt die feste erwartete Orientierungszeile. |
| 82 | Vergleicht die vollständige PrintMore-Ausgabe mit genau dieser Kombination. Das prüft mehr als bloß das Vorkommen des Orientierungsworts. |
| 83 | Schließt die Orientierungsschleife. |
| 84 | Schließt die Typenschleife. |
| 85 | Schließt diesen Testfall. |
| 87 | Registriert den Strukturtest für Funktionseigentum und Vererbung. |
| 88 | Erzeugt das erste Bild. |
| 89 | Erzeugt das zweite Bild. |
| 90 | Erzeugt ein Video. |
| 91 | Prüft ausdrücklich eine eigene `print`-Property. |
| 92 | Prüft unterschiedliche Print-Funktionsobjekte. |
| 93 | Prüft identische geerbte PrintMore-Funktionsobjekte bei den Bildern. |
| 94 | Prüft, dass auch das Video dieselbe Parent-Methode findet. |
| 95 | Stellt sicher, dass die Bildinstanz keine eigene PrintMore-Kopie besitzt. |
| 96 | Stellt sicher, dass die Video-Instanz keine eigene TotalFrames-Kopie besitzt. |
| 97 | Prüft den unmittelbaren Prototyp des Videos. |
| 98 | Prüft die nächste Verbindung zwischen Video- und Image-Prototyp. |
| 99 | Prüft den unmittelbaren Prototyp des Bilds. |
| 100 | Prüft die korrekte Konstruktorreferenz des Videos. |
| 101 | Prüft `video instanceof Video`. |
| 102 | Prüft `video instanceof Image`. |
| 103 | Prüft, dass umgekehrt ein normales Image nicht als Video gilt. |
| 104 | Prüft, dass die Konstruktorproperty nicht aufzählbar ist. |
| 105 | Prüft den tatsächlichen Propertydeskriptor von PrintMore: aufzählbar in der Prototypversion, nicht aufzählbar in der Klassenversion. |
| 106 | Prüft einen Aufruf ohne `new`. Die strikte Konstruktorfunktion scheitert beim Zugriff über undefiniertes `this`; die Klasse lehnt den Aufruf bereits als Klassenkonstruktor ab. Beide ergeben hier einen `TypeError`. |
| 107 | Schließt den Strukturtest. |

### 7.4 Laufzeitänderungen und aktuelle Berechnung – Zeilen 109–151

| Zeile | Erklärung |
| ---: | --- |
| 109 | Registriert den Test für eine individuelle Print-Neuzuweisung. |
| 110 | Erstes Testbild. |
| 111 | Zweites Testbild. |
| 112 | Sichert die Printreferenz des zweiten Bilds zur späteren Identitätsprüfung. |
| 113 | Ersetzt nur die erste Printfunktion durch eine normale Funktion, die `this.width` verwendet. |
| 114 | Prüft die tatsächliche Ersatzfunktionsausgabe und damit auch den richtigen Empfänger. |
| 115 | Prüft, dass die unveränderte PrintMore-Methode die neue eigene Printfunktion aufruft und anschließend die normale Orientierung ausgibt. |
| 116 | Prüft die unveränderte Funktionsidentität beim zweiten Objekt. |
| 117 | Schließt den Test. |
| 119 | Registriert den Test für eine gemeinsame Laufzeitänderung und eigene Überschattung. |
| 120 | Erstes vorhandenes Bild. |
| 121 | Zweites vorhandenes Bild. |
| 122 | Vorhandenes Video. |
| 123 | Sichert die originale gemeinsame Methode. |
| 124 | Definiert die neue gemeinsame Funktion mit dynamischem `this`. |
| 125 | Beginnt den gegen bleibende Prototypänderungen abgesicherten Block. |
| 126 | Weist die neue Funktion dem Image-Prototyp zu. |
| 127 | Durchläuft vorhandene Instanzen und zusätzlich erst **nach der Änderung neu erzeugte** Bild- und Video-Instanzen. |
| 128 | Prüft, dass jedes Objekt dieselbe Ersatzfunktion findet. |
| 129 | Ruft sie wirklich auf und prüft die empfängerabhängige Ausgabe. |
| 130 | Schließt die Instanzenschleife. |
| 131 | Legt eine eigene PrintMore-Funktion auf dem ersten Bild an. |
| 132 | Prüft, dass nun diese eigene Funktion ausgeführt wird. |
| 133 | Prüft die unveränderte gemeinsame Ersatzmethode am zweiten Bild. |
| 134 | Löscht die eigene überschattende Property. |
| 135 | Prüft, dass wieder die gemeinsame Ersatzreferenz sichtbar ist. |
| 136 | Beginnt das sichere Zurücksetzen. |
| 137 | Stellt die ursprüngliche Prototypfunktion wieder her. |
| 138 | Schließt den Aufräumblock. |
| 139 | Prüft, dass das bereits existierende Video die Rücksetzung ebenfalls sofort sieht. |
| 140 | Schließt den Test. |
| 142 | Registriert den Test gegen eingefrorene Werte und unerwünschte Rundung. |
| 143 | Erzeugt ein Video. |
| 144 | Ändert seine Dauer nachträglich auf 2,5 Sekunden. |
| 145 | Ändert die Framerate auf 24. |
| 146 | Prüft das neu gelesene Produkt 60. |
| 147 | Ändert die Dauer erneut auf 0,5 Sekunden. |
| 148 | Ändert die Framerate auf 25. |
| 149 | Prüft den nicht gerundeten Rückgabewert 12,5. |
| 150 | Prüft die direkte Rohgrößenformel für ein einzelnes Bit: 0,125 mathematische Bytes, ohne heimliches Aufrunden. |
| 151 | Schließt den Test. |

### 7.5 Den Demohelfer auch bei einem Fehler überprüfen – Zeilen 153–176

| Zeile | Erklärung |
| ---: | --- |
| 153 | Registriert den Test für die tatsächliche Demofunktion und deren Rücksetzung. |
| 154 | Erzeugt das erste Bild. |
| 155 | Erzeugt ein Video als zweiten Empfänger. |
| 156 | Sichert die anfängliche eigene Printreferenz. |
| 157 | Sichert die anfängliche gemeinsame PrintMore-Referenz. |
| 158 | Führt den echten Produkthelfer unter Ausgabeerfassung aus. Es wird nicht nur eine separat im Test nachgebaute Version geprüft. |
| 159 | Durchläuft die drei charakteristischen Ausgabetexte der verschiedenen Ersatzfunktionen. |
| 160 | Prüft, dass jeder davon wirklich ausgegeben wurde. |
| 161 | Schließt die Markerschleife. |
| 162 | Prüft die Wiederherstellung der eigenen Printfunktion. |
| 163 | Prüft die Wiederherstellung der gemeinsamen Funktion. |
| 164 | Prüft dieselbe Wirkung auf das vorhandene Video. |
| 165 | Prüft, dass keine eigene Demo-PrintMore-Property übrig blieb. |
| 166 | Sichert die globale Konsolenfunktion für den folgenden künstlichen Fehlerfall. |
| 167 | Beginnt einen weiteren abgesicherten Block. |
| 168 | Ersetzt `console.log` so, dass es gerade beim Aufruf der eigenen überschattenden Ersatzfunktion einen Fehler wirft. Zu diesem Zeitpunkt sind eigene und gemeinsame Methoden bereits verändert. Andere Ausgaben werden hier bewusst verworfen. |
| 169 | Verlangt, dass der Produkthelfer diesen Fehler nicht verschluckt. `assert.throws` prüft die Exceptionnachricht über einen regulären Ausdruck. |
| 170 | Beginnt das Aufräumen im Test selbst. |
| 171 | Stellt die originale Konsolenfunktion wieder her. |
| 172 | Schließt diesen Test-Aufräumblock. |
| 173 | Prüft, dass der Produkthelfer trotz der Exception die eigene Printfunktion zurückgesetzt hat. |
| 174 | Prüft die Rücksetzung der gemeinsamen Methode trotz Exception. |
| 175 | Prüft die Entfernung der eigenen überschattenden Demo-Property trotz Exception. |
| 176 | Schließt den Fehlerfalltest. |

### 7.6 Echte Prozesse und besondere ComputeSize-Tests – Zeilen 178–224

| Zeile | Erklärung |
| ---: | --- |
| 178 | Registriert den Test für das vollständig ausgeführte Konsolenprogramm. |
| 179 | Baut den Pfad aus dem Testdateiordner, dem aktuellen Lösungsordner und dem Dateinamen. `__dirname` verhindert eine Abhängigkeit vom gerade gewählten Shellarbeitsverzeichnis. |
| 180 | Startet mit `process.execPath` dieselbe Node-Installation in einem neuen Prozess und übergibt den Skriptpfad als Argument. `encoding: "utf8"` liefert die Ausgaben als Text. Es wird kein `node -e` benötigt. |
| 181 | Prüft, dass bereits das Starten des Prozesses keinen Betriebssystemfehler ergeben hat. |
| 182 | Prüft den Exitstatus 0 und verwendet bei einem Fehler die Standardfehlerausgabe als Diagnose. |
| 183 | Prüft eine leere Standardfehlerausgabe. |
| 184 | Listet die erwarteten echten Zahlenzeilen und Orientierungen auf. Darin befinden sich die Bildwerte, die abweichenden Hochformatvideowerte und alle Framezahlen. |
| 185 | Zerlegt die echte Standardausgabe an Unix- oder Windows-Zeilenenden und verlangt jede erwartete vollständige Zeile. |
| 186 | Schließt die Sollzeilenschleife. |
| 187 | Prüft die ausgegebene Aussage über unterschiedliche eigene Printfunktionen. |
| 188 | Prüft die Aussage über gemeinsam genutztes PrintMore. |
| 189 | Prüft den Ausgabetext der individuellen Print-Ersetzung. |
| 190 | Prüft den Ausgabetext der Prototyp-Ersetzung. |
| 191 | Prüft den Ausgabetext der eigenen Überschattung. |
| 192 | Schließt den Prozesstest. |
| 193 | Schließt die äußere Schleife über beide Lösungen. |
| 195 | Registriert einen eigenen Test für das nur in Aufgabe 4 vorhandene Objektliteral. |
| 196 | Entnimmt das echte exportierte Objekt. |
| 197 | Führt dessen ComputeSize-Methode aus. |
| 198 | Prüft die gespeicherte Pixelzahl des Ausgangsbilds. |
| 199 | Prüft seine Rohgröße. |
| 200 | Erstellt ein temporäres Objekt mit anderen Bilddaten und **derselben Funktionsreferenz**. Damit wird der dynamische Empfänger getestet, ohne das Ausgangsobjekt umzuschreiben. |
| 201 | Ruft die geteilte Funktion als Methode des temporären Objekts auf. |
| 202 | Prüft dessen Pixelzahl 200. |
| 203 | Prüft dessen Rohgröße 400. |
| 204 | Ändert seine Breite. |
| 205 | Ruft die Methode erneut auf. |
| 206 | Prüft die neu gespeicherte Pixelzahl 400. |
| 207 | Prüft die neu gespeicherte Rohgröße 800. |
| 208 | Kontrolliert, dass die ursprüngliche Bildbreite weiterhin 640 ist. Die Funktion hängt also nicht fest an diesem Objekt. |
| 209 | Schließt den Literaltest. |
| 211 | Registriert den zusätzlichen Klassen-ComputeSize-Test. |
| 212 | Entnimmt die echten Klassen. |
| 213 | Durchläuft eine Image- und eine Video-Instanz. Das prüft auch die geerbte ComputeSize-Funktionalität beim Video. |
| 214 | Prüft, dass die Methode nicht pro Instanz kopiert wurde. |
| 215 | Prüft die tatsächlich gemeinsam verwendete Referenz auf `Image.prototype`. |
| 216 | Ändert die aktuelle Breite auf 20. |
| 217 | Ändert die Höhe auf 10. |
| 218 | Ändert die Farbtiefe auf 8 Bits pro Pixel. |
| 219 | Führt die Methode nach den Änderungen aus. |
| 220 | Prüft die aktualisierte Pixelzahl 200. |
| 221 | Prüft die aktualisierte Rohgröße 200 Bytes. |
| 222 | Schließt die Instanzenschleife. |
| 223 | Prüft, dass ComputeSize wie eine gewöhnliche Klassenmethode nicht aufzählbar ist. |
| 224 | Schließt den letzten Test. |

## 8. Was die englischen Antwortdateien abdecken

`ue4.4/antwort.md` beantwortet 4a bis 4f ausdrücklich: Datenliteral und JSON-Grenze; Konstruktor und Schleife; geteiltes PrintMore mit Orientierungen; Eigentum, Funktionsidentität und reale Neuzuweisung; Video-Initialisierung plus Prototypkette plus Frameprodukt; geerbter Aufruf auf Videos. Dort stehen auch Startbefehle, feste Beispielwerte und der tatsächliche Teststatus.

`ue4.5/antwort.md` ordnet jede Funktionalität aus 4a bis 4f ihrer Klassenfassung zu. Besonders erklärt werden `constructor`, das bewusst eigene `print`, normale geteilte Klassenmethoden, `extends`, `super`, die intern weiterhin vorhandenen Prototypen und der Enumerierbarkeitsunterschied. Es enthält ebenfalls Zahlen, Ausführungsbefehle und echte Testergebnisse.

Beide Dateien sind englische fachliche Antworten; diese deutsche Datei ist die zusätzliche detaillierte Lern- und Änderungserklärung. Es wurde kein Browserergebnis erfunden, und für die reinen Konsolenaufgaben wird auch keines benötigt. Der separate KI-Pflichtbericht auf Blattebene bleibt Aufgabe der übergeordneten Abgabezusammenstellung; innerhalb der Aufgaben 4 und 5 gibt es nach dem beschriebenen Testlauf keinen bekannten funktionalen offenen Punkt.


---

# Start, Dateien und gemeinsamer Runner

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
