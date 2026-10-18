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
