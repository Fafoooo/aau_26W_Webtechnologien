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
