# Übungen 3 und 4 – ausführliche Erklärung zum Nachvollziehen

Diese Datei erklärt die tatsächlich abgelegten Dateien, nicht eine andere Musterlösung. Die Zeilennummern beziehen sich auf die Quelltexte im selben Ordnerstand. Leerzeilen dienen nur der Gliederung; schließende Klammern beenden jeweils den unmittelbar davor begonnenen Block. Die Benutzeroberflächen und `antwort.md` sind wie die Angabe Englisch, die Lernhilfe ist Deutsch.

**Wichtig zur Eigenleistung:** Implementierung, Tests und diese Erklärung wurden mit Hermes Agent / OpenAI `gpt-6.1-sol` erstellt. Das ist keine Behauptung, Fabio habe den Code bereits selbst geschrieben, verstanden oder geprüft. Fabio muss ihn vor einer Abgabe selbst durchgehen, ausführen und erklären können. Der übergeordnete KI-Bericht wird getrennt erstellt. Es gab hier keinen Commit, Push oder Moodle-Upload.

## 1. Orientierung und Voraussetzungen

| Datei | Aufgabe |
|---|---|
| `ue3.3/gallery.html` | unverändertes HTML aus Übung 2.6: Vorschaubilder und zunächst versteckte Großansicht |
| `ue3.3/gallery.css` | unveränderte ursprüngliche Gestaltung |
| `ue3.3/gallery.js` | unveränderte bisherige Datei als Byte-Präfix, danach neue Diashow |
| `ue3.3/*JPG` | sechs unveränderte kleine/große Galerie-Bilddateien |
| `ue3.3/antwort.md` | englische Bedienung, Lösungsbeschreibung und Grenzen |
| `ue3.4/puzzle.html` | Originalvorlage mit genau einer neuen Script-Referenz |
| `ue3.4/puzzle.js` | Auswahl, Mausvorschau, Platzierung, Austausch und Siegesprüfung |
| `ue3.4/bus-*.jpg` | vier unveränderte Puzzle-Bildteile |
| `ue3.4/antwort.md` | englische Bedienung, Lösungsbeschreibung und Grenzen |
| `tests_3_4.cjs` | ausführbare Erhaltungs- und Chromium-Browsertests |
| `erklaerung_3_4.md` | diese Lernhilfe |

HTML beschreibt Elemente, CSS deren Darstellung und JavaScript Verhalten. Der **DOM** ist die vom Browser aufgebaute Baumstruktur der HTML-Elemente. Ein **Event-Listener** ist eine Funktion, die der Browser bei einem Ereignis wie einem Klick aufruft. Eine **Referenz auf ein Element** bezeichnet genau dieses Objekt im DOM, nicht nur seine URL oder seinen Text.

`const` verhindert, dass eine Variable später auf ein anderes Objekt zeigt; das referenzierte Objekt darf trotzdem verändert werden. `let` erlaubt eine neue Zuweisung. `null` bezeichnet hier ausdrücklich „keine Auswahl“ bzw. „kein Timer“. Eine Funktion mit `return` endet an dieser Stelle. `=>` schreibt eine Funktion kurz. `(() => { ... })();` definiert eine Funktion und ruft sie sofort auf. Dadurch bleiben lokale Variablen der Erweiterung von denen anderer Script-Blöcke getrennt. `"use strict"` aktiviert strengere JavaScript-Regeln, etwa gegen versehentlich erzeugte globale Variablen.

Die Produktseiten brauchen **keine Bibliotheken**, keinen Server und keinen Build. HTML jeweils im Browser öffnen. Nur das separate Testprogramm verwendet Node.js und Playwright.

## 2. `ue3.3/gallery.html`: jede Zeilengruppe

- **Z. 1–3:** `<!DOCTYPE html>` aktiviert den modernen HTML-Modus. `<html lang="en">` nennt die Dokumentsprache. `<head>` öffnet den Bereich für Metadaten und Ressourcen.
- **Z. 4:** `gallery.js` wird geladen. `defer="true"` ist ein vorhandenes boolesches HTML-Attribut: Entscheidend ist seine Anwesenheit, nicht das Wort `true`. Die Ausführung wartet auf das geparste HTML. Die DOM-Abfragen im Script finden deshalb bereits die Bilder und die Großansicht.
- **Z. 5:** Das `link`-Element verbindet die externe CSS-Datei mit der Seite. `rel="stylesheet"` bezeichnet ihre Rolle.
- **Z. 6–8:** `title` setzt den Browser-Tabtitel; danach endet der Kopf und der sichtbare Dokumentkörper beginnt.
- **Z. 9:** `.gallery` ist der gemeinsame Bereich der Vorschaubilder. Ein Punkt im CSS-/DOM-Selektor bedeutet „Klasse“.
- **Z. 10–12:** Jedes `img` besitzt `src` für das kleine Bild, `data-large` für das große Bild und `alt` für Bildbeschreibung und spätere Beschriftung. JavaScript liest `data-large` als `image.dataset.large`. Reihenfolge im Dokument ist Reihenfolge der Navigation. Es ist keine spezielle Reihenfolge von Dateinamen nötig.
- **Z. 13:** Ende der Vorschaubildgruppe.
- **Z. 14:** `id="displayDIV"` ist die Großansicht. `#displayDIV` bedeutet im Selektor „Element mit dieser ID“. Diese ID muss innerhalb des Dokuments eindeutig sein.
- **Z. 15:** `.bigIMG` ist das Bild in der Großansicht. `src` und `alt` sind zunächst leer und werden beim Öffnen gesetzt.
- **Z. 16:** `.desc` ist der Absatz für die Bildbeschreibung. Der anfängliche Text wird beim Öffnen ersetzt.
- **Z. 17:** Der Kommentar beschreibt den vorgesehenen Einfügeort für dynamische Bedienelemente. Er wird nicht angezeigt und führt nichts aus.
- **Z. 18–20:** Ende der Großansicht, des Dokumentkörpers und des HTML-Dokuments.

**Beim Ändern:** Ein weiteres `img` mit diesen drei Attributen kann vor dem Laden ergänzt werden. Die verwendeten Selektoren müssen erhalten bleiben; zusätzliche Wrapper um die Bilder sind erlaubt. Dynamisch nach der Script-Ausführung neu eingesetzte Vorschaubilder werden nicht automatisch neu verdrahtet. Das ist der statische Dokumentvertrag dieser Vorlage.

## 3. `ue3.3/gallery.css`: jede Regel

- **Z. 1:** Die folgende Regel betrifft nur `#displayDIV`.
- **Z. 2:** `display:none` nimmt die Großansicht zunächst vollständig aus der Darstellung. JavaScript schaltet sie später auf `block`.
- **Z. 3:** `background-color:silver` setzt den silbernen Hintergrund.
- **Z. 4–5:** `100vw` und `100vh` entsprechen Breite und Höhe des sichtbaren Browserfensters.
- **Z. 6:** `position:absolute` ermöglicht Positionierung über `top` und `left`.
- **Z. 7:** `text-align:center` zentriert den Inline-Inhalt, insbesondere das große Bild und den Beschriftungstext.
- **Z. 8–10:** `top:0` und `left:0` setzen den Bereich an die obere linke Ecke; die Klammer beendet die Regel.
- **Z. 12:** Der Selektor gilt nur für Bilder der Klasse `bigIMG` innerhalb der Großansicht.
- **Z. 13:** Oberhalb des Bildes bleiben 20 Pixel Abstand.
- **Z. 14–15:** `calc(100% - 70px)` setzt die ursprüngliche Bildhöhe relativ zur Großansicht; die Klammer beendet die Regel.

Die Datei wurde nicht geändert. Die Erweiterung braucht mehr Platz für eine zweite Kontrollzeile und ergänzt deshalb eine kleinere maximale Bildhöhe als Inline-Stil. Inline-Stile setzen wir an einzelnen Elementen über `element.style`; die unveränderte CSS-Datei bleibt damit nachweisbar erhalten. Die originale Seite ist keine vollständige responsive Anwendung für beliebig winzige Fenster oder sehr lange Beschriftungen.

## 4. `ue3.3/gallery.js`, Z. 1–65: vollständig erhaltene bisherige Lösung

### 4.1 Ursprüngliches Öffnen und Schließen, Z. 1–15

- **Z. 1:** `showImg(e)` wird als Klickbehandlung verwendet. `e` ist das Ereignisobjekt.
- **Z. 2:** `querySelector` findet das erste passende große Bild. `e.target` ist das angeklickte Vorschaubild; dessen `dataset.large` liefert den neuen Bildpfad. Das Zuweisen von `src` löst das Laden aus.
- **Z. 3:** Die ursprüngliche Vorlage schreibt den Alternativtext über `innerHTML` in die Beschreibung. Dabei würde HTML interpretiert. Diese Zeile ist unverändert erhalten; die nachfolgende Erweiterung überschreibt die Beschreibung als Text. Für fremde, nicht vertrauenswürdige Eingaben ist die ursprüngliche `innerHTML`-Zeile trotzdem keine sichere Lösung. Ein nachträgliches Überschreiben ist keine Sicherheitsbereinigung.
- **Z. 4–5:** Die Großansicht wird als Block eingeblendet; die Funktion endet.
- **Z. 7–9:** `hideImg(e)` setzt die Anzeige des Elements auf `none`, an dem der Listener registriert ist. Hier ist `e.currentTarget` also die Großansicht, auch wenn ursprünglich das darin liegende Bild angeklickt wurde.
- **Z. 11:** `querySelectorAll('.gallery img')` liefert alle passenden Bilder beim Initialisieren.
- **Z. 12–14:** Die `for`-Schleife besucht jedes Bild und registriert `showImg` für dessen Klicks. `i++` erhöht den Laufindex nach einem Durchgang. Bei einer leeren Sammlung läuft der Schleifenkörper gar nicht.
- **Z. 15:** Ein Klick auf die Großansicht oder ein zu ihr hochlaufender Klick führt zu `hideImg`.

**Bubbling:** Klicks laufen vom getroffenen Element zu seinen Eltern weiter. Ein Button im Overlay würde deshalb ohne Gegenmaßnahme auch dessen Schließfunktion auslösen. `stopPropagation()` unterbindet genau dieses Weiterreichen. Andere Listener am selben Element werden dadurch nicht entfernt.

### 4.2 Vorher-/Nächstes-Navigation, Z. 17–44

- **Z. 17:** Der bisherige KI-Kommentar bleibt als Teil des alten Byte-Präfixes bestehen. Sein Verweis gehört zur früheren Übung. Diese neue Datei erklärt den alten Code vollständig mit.
- **Z. 18–23:** Eine sofort ausgeführte Funktion kapselt die Navigation. `display`, `bigImage` und `description` speichern häufig benötigte DOM-Referenzen. `currentImage` startet ohne Auswahl.
- **Z. 25–32:** Jedes Vorschaubild erhält einen weiteren Klick-Listener. Da er nach `showImg` registriert wurde, ergänzt er dessen Arbeit. `event.currentTarget` ist genau das Vorschaubild, dessen Listener ausgeführt wird. Es wird in `currentImage` gespeichert; `bigImage.alt` wird gesetzt; `textContent` schreibt die Beschreibung ohne HTML-Auswertung.
- **Z. 34–35:** `move(direction)` navigiert vor oder zurück. Die aktuelle Sammlung wird mit `Array.from` in ein Array umgewandelt. Das ermöglicht `indexOf` und Zugriff über einen Index.
- **Z. 36:** Ohne Bilder endet die Funktion, bevor eine Rechnung modulo null oder ein Zugriff auf ein fehlendes Bild versucht wird.
- **Z. 37:** `indexOf(currentImage)` sucht das ausgewählte **Elementobjekt**. `Math.max(0, ...)` verhindert einen negativen Startindex, falls noch keines ausgewählt wurde.
- **Z. 38:** `(index + direction + thumbnails.length) % thumbnails.length` berechnet den nächsten gültigen Index mit Umbruch. `direction` ist `-1` oder `1`; `%` ist der Restoperator. Das zusätzliche `length` verhindert bei einem Schritt zurück vom ersten Bild ein negatives Ergebnis. Bei einem Bild bleibt die Auswahl bei diesem einen Element.
- **Z. 39–44:** Das gewählte Element wird gespeichert. Danach werden Großbild-URL, Alternativtext und Beschreibung aktualisiert und die Großansicht sichtbar gehalten. Zwei Elemente mit gleicher URL bleiben unterscheidbar, weil `indexOf` nicht nach der URL sucht.

### 4.3 Navigationsbuttons, Z. 46–65

- **Z. 46–49:** `addButton(text, direction)` erstellt einen echten HTML-Button. `type="button"` verhindert versehentliches Abschicken eines eventuell umgebenden Formulars. Der sichtbare Text kommt aus dem Funktionsparameter.
- **Z. 50–54:** Der Button sitzt absolut positioniert 12 Pixel über dem unteren Rand. „previous“ wird links der Mitte über `right`, „next“ rechts der Mitte über `left` positioniert. `calc` verbindet Prozentangabe und Pixelabstand.
- **Z. 55–59:** Der Klick-Listener stoppt das Bubbling und ruft `move` mit der passenden Richtung auf.
- **Z. 60–61:** `append` hängt den Button in die Großansicht; die Hilfsfunktion endet.
- **Z. 63–65:** Beide Buttons werden genau einmal erzeugt; anschließend endet die gekapselte Navigationsfunktion.

## 5. `ue3.3/gallery.js`, Z. 67–148: neue Diashow

### 5.1 Referenzen und Layout, Z. 67–86

- **Z. 67–70:** Der Kommentar nennt echte KI-Unterstützung und die aktuelle Erklärung. Eine zweite sofort ausgeführte Funktion vermeidet Namenskonflikte mit der bisherigen Navigation.
- **Z. 71–72:** Großansicht und Großbild werden gefunden und gespeichert.
- **Z. 73–74:** Alle bereits erzeugten Buttons werden in ein Array umgewandelt; `find` sucht den bisherigen Button mit Text `next`. Er existiert, weil Z. 64 vorher ausgeführt wurde. Diese Abhängigkeit ist beabsichtigt: Wir erweitern die konkrete Übung-2.6-Lösung und nutzen deren geprüfte Navigation, statt einen zweiten Auswahlzustand einzuführen.
- **Z. 75:** `timer` ist entweder `null` oder die von `setInterval` gelieferte Kennung. Die Kennung ist kein Bildindex und keine Sekundenangabe.
- **Z. 77–78:** Ein Container für die neuen Bedienelemente wird erstellt und bekommt eine Klasse zur Identifikation.
- **Z. 79–82:** `Object.assign` kopiert mehrere Style-Eigenschaften. Absolute Positionierung mit `bottom:48px` legt die neue Zeile über die alte. `left:0` und `right:0` spannen sie über die Breite. Flexbox zentriert die Kinder horizontal und vertikal; `gap` lässt Abstand zwischen ihnen.
- **Z. 83–86:** Die maximale Bildhöhe reserviert Platz für Beschriftung und beide Kontrollzeilen. `maxWidth:95vw` begrenzt breite Bilder. `objectFit:contain` verhindert, dass das Bild für eine vorgegebene Box beschnitten wird. Die ursprüngliche CSS-Datei wird dabei nicht bearbeitet.

### 5.2 Erzeugung aller Eingabeelemente, Z. 88–107

- **Z. 88–91:** Play wird als Button angelegt. Der Text zeigt die verfügbare Aktion. `aria-pressed=false` meldet unterstützender Technik den ausgeschalteten Zustand; während Wiedergabe wird er `true`.
- **Z. 92–94:** Exit wird als zweiter normaler Button erstellt.
- **Z. 95–96:** Ein Label mit englischer Erklärung wird erzeugt. Es enthält später direkt das Eingabefeld; deshalb braucht es kein separates `for`-Attribut.
- **Z. 97–98:** Ein Input wird angelegt und als Zahleneingabe typisiert.
- **Z. 99:** Die kleinste erlaubte Dauer ist 0,001 Sekunden, also die grundlegende Millisekundeneinheit der Timer-API. Null und negative Werte sind nicht sinnvoll für diese Diashow.
- **Z. 100:** Die Obergrenze verhindert die Überlaufproblematik großer Browser-Timer-Verzögerungen. Browser-Timer arbeiten mit einem begrenzten Millisekundenbereich.
- **Z. 101:** `step="any"` erlaubt auch andere Dezimalwerte, statt nur ganze Sekunden oder ein fixes Schrittraster.
- **Z. 102–103:** Startwert ist die geforderte 3; `required` verbietet ein leeres Feld.
- **Z. 104:** `6em` macht das Feld kompakt. `em` bezieht sich auf die Schriftgröße.
- **Z. 105–107:** Der Input kommt ins Label, die Bedienelemente kommen in den Container und der Container in die Großansicht. Erst `append` verankert die erzeugten Elemente im sichtbaren Dokument.

### 5.3 Ein gemeinsamer Abschaltpfad, Z. 109–114

- **Z. 109:** `pause()` ist die zentrale Aufräumfunktion.
- **Z. 110:** Nur wenn eine Timerkennung vorhanden ist, wird `clearInterval(timer)` aufgerufen. Dadurch werden zukünftige Intervallaufrufe dieses Timers verhindert.
- **Z. 111:** Die Kennung wird unabhängig vom vorherigen Zustand auf `null` gesetzt. Mehrfaches Pausieren ist dadurch unschädlich.
- **Z. 112–114:** Text und ARIA-Zustand werden auf „nicht laufend“ zurückgesetzt. An einer einzigen Stelle bleiben Bedienoberfläche und Timerzustand synchron.

**Warum nicht nur Overlay verstecken?** Ein unsichtbares Overlay beendet keinen Timer. Die alte Navigation blendet beim nächsten Schritt das Overlay sogar wieder ein. Ohne `clearInterval` könnte eine scheinbar beendete Diashow unerwartet zurückkehren.

### 5.4 Start und Daueränderung, Z. 116–127

- **Z. 116–117:** Jeder Start beginnt mit `pause()`. Auch der Neustart nach einer Daueränderung beseitigt also zuerst das alte Intervall. Es kann höchstens eine aktive Kennung geben.
- **Z. 118–122:** `checkValidity()` berücksichtigt Zahlentyp, Pflichtfeld, Minimum und Maximum. `valueAsNumber` liefert den Zahlenwert; `Number.isFinite` schließt ungültige/unendliche Zahlen aus. `!` verneint eine Bedingung, `||` bedeutet „oder“. Bei einem Fehler zeigt `reportValidity()` die native Browsermeldung und `return` beendet den Start. Diese native Meldung kann je nach Browsersprache lokalisiert sein; die selbst geschriebenen Oberflächentexte sind Englisch.
- **Z. 123:** Eine leere Galerie startet keinen Timer.
- **Z. 124:** `setInterval` wiederholt die übergebene Funktion nach jeweils der eingestellten Dauer. Sekunden werden durch `* 1000` in Millisekunden umgewandelt. Die Callback-Funktion ruft `next.click()` auf. Dadurch läuft dieselbe Navigation wie bei einem echten Next-Klick, einschließlich Elementidentität und Umbruch. Der erste Wechsel geschieht erst nach einem vollständigen Intervall; Play wechselt nicht sofort das Bild.
- **Z. 125–127:** Der Button zeigt jetzt „pause“ und den aktiven ARIA-Zustand. Ein Bild oder eine bestimmte Bildzahl ist nirgends in dieser Funktion fest eingebaut.

Ein Intervall kann nicht nachträglich durch Änderung des Input-Wertes schneller werden: Beim Erzeugen erhält es einen festen Zeitabstand. Deshalb muss die laufende Diashow bei einer Änderung gelöscht und neu gestartet werden. Der neue Abstand läuft vollständig ab der Änderung; Restzeit des alten Intervalls wird nicht übernommen. Browser dürfen Timer in Hintergrund-Tabs drosseln; die Aufgabe verlangt keine Echtzeitgarantie bei inaktivem Tab.

### 5.5 Listener und ihre Reihenfolge, Z. 129–148

- **Z. 129–130:** Ein Klick irgendwo in der neuen Kontrollzeile stoppt am Container. Das schließt Label und Input ein. Er erreicht nicht den ursprünglichen `hideImg`-Listener auf dem Overlay.
- **Z. 131–134:** Play/Pause prüft nur `timer`. Ohne Timer wird gestartet, mit Timer pausiert. Der Klick läuft anschließend zum Kontrollcontainer, dessen Listener das weitere Bubbling stoppt.
- **Z. 135–138:** Exit pausiert ausdrücklich und versteckt anschließend das Overlay. Der Container verhindert auch hier den zusätzlichen alten Schließklick.
- **Z. 139–141:** `input` reagiert sofort auf Wertänderungen, nicht erst auf Fokusverlust. Nur bei laufender Diashow wird neu gestartet. Wenn der neue Wert ungültig ist, bleibt die Diashow nach der Prüfung pausiert; nach einer Korrektur muss Play erneut gedrückt werden.
- **Z. 142–143:** Ein normaler Overlay-/Großbildklick erreicht weiterhin den alten Schließlistener und zusätzlich `pause`. Der alte Listener versteckt zuerst, der neue räumt den Timer auf. Die bisherigen Previous-/Next-Buttons stoppen selbst das Bubbling und lösen deshalb diese Pause nicht aus.
- **Z. 144–146:** Jedes Vorschaubild erhält einen weiteren Listener, der einen Resttimer sicher entfernt. Das ursprüngliche Öffnen und Merken des Bildes läuft weiterhin. Die nächste Öffnung startet pausiert, aber mit der zuletzt eingestellten Dauer.
- **Z. 147–148:** Beim Verlassen der Seite räumt `pagehide` zusätzlich auf. Die abschließende Klammer und `()` beenden und starten die gekapselte Funktion.

**Zum selbst Erklären:** Folge einem Klick auf ein Thumbnail: Originalhandler → bisheriger Auswahlhandler → neuer Pause-Handler. Folge einem Play-Klick: Buttonhandler → Kontrollcontainer mit `stopPropagation`; das Overlay wird nicht erreicht. Folge einem Intervalltick: vorhandener Next-Button → vorhandenes `move(1)`; dessen `stopPropagation` verhindert ungewolltes Pausieren.

## 6. Galerie-Bilddateien und `antwort.md`

`hk_small.JPG`, `street_small.JPG` und `taichung_small.JPG` sind die Vorschauen. `hk.JPG`, `street.JPG` und `taichung.JPG` sind die zugehörigen großen Bilder. Groß-/Kleinschreibung der Dateinamen ist auf vielen Dateisystemen relevant. Ein JPEG ist eine Binärdatei ohne erklärbare Programmzeilen. Sein Inhalt wird nicht umgeschrieben; der Test vergleicht die vollständigen Bytes mit Übung 2.6.

`ue3.3/antwort.md` ist eine englische Abgabe-/Bedienbeschreibung: erster Block Einstieg; „Controls“ beschreibt die Aktionen; „Implementation“ erklärt Erhalt und Funktionsprinzip; „Verification“ nennt ausführbaren Test und reale Abdeckung; „AI assistance and limits“ nennt Herkunft und Grenzen. Markdown-Überschriften beginnen mit `#`, Listen mit `-`, Backticks markieren Code. Diese Datei wird nicht vom Produkt-JavaScript eingelesen und steuert die Seite nicht. Eine Änderung dort ändert deshalb keine Funktion; bei einer funktionalen Änderung muss die Beschreibung entsprechend aktualisiert werden.

## 7. `ue3.4/puzzle.html`: Original plus Script-Zeile

- **Z. 1–3:** HTML-Dokument mit englischer Sprache; im Kopf beginnt ein eingebetteter CSS-Block. Das Original hat keinen Doctype. Wir erfinden keinen neuen Dokumentaufbau, sondern erhalten die Vorlage.
- **Z. 4–8:** `#puzzleTarget` ist der originale gemeinsame Bereich. Die Vorlage gibt Breite, Höhe und schwarze Textfarbe vor.
- **Z. 10–14:** `.puzzlePic` legt Breite und Höhe der ursprünglichen Zielrechtecke fest. `inline-block` stellt die Rechtecke nebeneinander, solange Platz ist. Der Zeilenumbruch ergibt die Darstellung als vier Felder. Die Spiellogik verwendet diese Maße nicht.
- **Z. 16–18, 20–22, 24–26, 28–30:** Die IDs `ul`, `ur`, `ll`, `lr` erhalten silberne, grüne, blaue und rote Hintergrundfarben. Diese IDs sind nur Gestaltung der Vorlage, kein Lösungsschlüssel im JavaScript.
- **Z. 31–32:** CSS-Block endet; der Tabtitel lautet „Puzzle“.
- **Z. 33:** Einzige Ergänzung: `<script src="puzzle.js" defer></script>`. Das Script wird nach dem Parsen des HTML ausgeführt und findet Quelle und Ziele. `defer` genügt als boolesches Attribut ohne Wert.
- **Z. 34–37:** Ende des Kopfes, Beginn des Körpers und sichtbare Überschrift.
- **Z. 39–44:** Der ursprüngliche Zielcontainer enthält vier `div`-Ziele. Jedes `data-result` nennt den erwarteten Bildpfad. `dataset.result` liest dieses Attribut. Die Klasse gestaltet das Ziel, die ID ist für die Lösung nicht nötig. Die vier Ziele werden ausschließlich über `div[data-result]` erkannt.
- **Z. 46–47:** Überschrift der Bildliste und Quellencontainer `puzzleSource`. Dieser Quellen-Identifier gehört zum Format der Vorlage und wird weiterhin verwendet.
- **Z. 48–51:** Vier Quellbilder in bewusst nicht sortierter Reihenfolge. `src` liefert jeweils die Bilddatei, `alt` beschreibt den Ausschnitt. Die Reihenfolge ist für die Richtigkeitsprüfung irrelevant.
- **Z. 52–54:** Ende der Quelle, des Körpers und des Dokuments.

**Ändern des Layouts:** Die Ziele dürfen an anderen Positionen, in anderer Reihenfolge und ohne diese vier IDs stehen. Sie müssen sichtbare, anklickbare `div`-Elemente mit einem passenden `data-result` bleiben. Mehr Ziele sind möglich, sofern es entsprechend passende Bildstücke gibt. Im Test werden fünf Ziele statt vier verwendet. Die Ziele werden beim Laden erfasst; später eingefügte Ziele werden nicht automatisch registriert. Quellbilder innerhalb von `#puzzleSource` werden dagegen bei jedem Klick durch Event Delegation erkannt, auch wenn sie erst nach dem Laden hinzugefügt wurden.

## 8. `ue3.4/puzzle.js`: Zustand und Oberfläche, Z. 1–19

- **Z. 1–3:** Ehrlicher KI-Kommentar, gekapselte sofort ausgeführte Funktion und strikter Modus.
- **Z. 4:** `source` speichert den vorhandenen Container für unplatzierte Bilder.
- **Z. 5:** `querySelectorAll("div[data-result]")` findet jedes Ziel im ganzen Dokument, nicht nur innerhalb einer vermeintlichen Raster-ID. `Array.from` erlaubt später `every`, `some` und `includes`.
- **Z. 6:** `placed` ist eine `Map`, also eine Zuordnung von Schlüsseln zu Werten. Schlüssel ist das tatsächliche Ziel-Element, Wert das tatsächliche Original-Bild-Element. Damit können Elemente dieselbe URL haben und trotzdem eigene Spielstücke bleiben.
- **Z. 7–8:** `selected` speichert das gerade ausgewählte Original; `ghost` die reine Anzeige-Kopie, die der Maus folgt. Anfangs existiert beides nicht.
- **Z. 10–13:** Ein Absatz mit `role="status"` wird erzeugt. Er zeigt Anleitung, Rückmeldung und Sieg. `source.before(status)` fügt ihn direkt vor die Bildliste ein. `textContent` interpretiert keine HTML-Tags.
- **Z. 14–18:** Jede Zielbox bekommt Hintergrundskalierung auf ihre eigene Breite und Höhe, kein wiederholtes Hintergrundmuster und einen Zeige-Cursor. Das sind zusätzliche Inline-Stile; die HTML-Vorlage bleibt bis auf die Script-Referenz unverändert. Unterschiedliche Boxgrößen funktionieren, können die Bildteile aber verzerren; das ist eine Darstellungsentscheidung, keine Zuordnungslogik.
- **Z. 19:** Auch die Quellliste signalisiert Anklickbarkeit mit einem Cursor.

**Zustandsregel:** Ein platziertes Original liegt nicht mehr im Quellen-DOM, bleibt aber als Objekt in `placed` erhalten. Der Ghost ist kein Spielstück und kommt nie in die `Map`. Die Richtigkeitsprüfung liest nicht den möglicherweise formatierten CSS-Text zurück, sondern diese eindeutige Zuordnung.

## 9. Mausvorschau und Abbruch, Z. 21–48

### 9.1 `follow`, Z. 21–25

Ohne Ghost endet `follow(event)` sofort. Sonst setzt es `left` und `top` aus `event.clientX` und `event.clientY` mit jeweils 16 Pixeln Abstand. Die Backtick-Schreibweise ist ein Template-String: `${...}` setzt einen Ausdruck in den Text ein, `px` liefert die CSS-Einheit.

`clientX/clientY` sind Koordinaten des sichtbaren Fensters. Dazu passt `position:fixed` der Vorschau. `pageX/pageY` würden Dokumentkoordinaten inklusive Scrollversatz liefern und wären hier die falsche Kombination. Der Ghost liegt nicht unter der Maus; zusätzlich ignoriert er alle Pointer-Hit-Tests.

### 9.2 `cancel`, Z. 27–32

- **Z. 28:** Falls ein Original ausgewählt war, wird dessen temporäre Deckkraft entfernt. Ein leerer Style-Wert bedeutet: keine lokale Überschreibung mehr.
- **Z. 29:** Falls eine Vorschau existiert, wird sie aus dem DOM entfernt.
- **Z. 30–32:** Beide Zustandsreferenzen werden auf `null` gesetzt. Das funktioniert bei Escape, Auswahlwechsel und nach einer Platzierung. Ein normales Original wird durch Cancel nicht aus der Quelle entfernt.

### 9.3 `select`, Z. 34–48

- **Z. 34–37:** Die Funktion bekommt ein Bild und das Klickereignis. Zuerst räumt `cancel()` eine alte Auswahl auf. Danach wird das neue Original gespeichert und in der Quelle leicht transparent dargestellt.
- **Z. 38:** `cloneNode(false)` erzeugt eine flache Kopie des Bild-Elements samt Attributen. Ein `img` hat keine für uns nötigen Kinder. Die Kopie ist nur Vorschau, das Original bleibt bis zur Platzierung in der Quelle.
- **Z. 39:** Eine eventuell vorhandene ID wird von der Kopie entfernt, damit die Vorschau keine doppelten IDs erzeugt.
- **Z. 40–41:** Die Klasse identifiziert die Vorschau für Tests; `aria-hidden=true` versteckt die redundante Kopie vor assistiver Technik.
- **Z. 42–45:** `position:fixed` nutzt Fensterkoordinaten; `pointerEvents:none` macht die Kopie für Maus-Hit-Tests durchlässig; `zIndex:1000` hebt sie optisch über den normalen Seiteninhalt. Die Kopie ist halbtransparent und 160 Pixel breit; `height:auto` hält ihr Seitenverhältnis.
- **Z. 46–48:** Die Vorschau wird an den Körper angehängt und sofort an die Klickposition gesetzt. Erst auf das nächste `mousemove` zu warten, würde sie zunächst an einer falschen Stelle erscheinen lassen.

Die Bedienung ist **Klicken – Maus bewegen – Klicken**, nicht „Maustaste halten und HTML5-Drop auslösen“. Es gibt keine `dragstart`-/`drop`-Abhängigkeit. Das entspricht der verlangten Vorlesungsinteraktion. Vollständige Touch- und Tastaturbedienung sind nicht Teil dieser Lösung; Escape ist ein zusätzlicher Abbruchweg.

## 10. Richtigkeitsprüfung, Z. 50–62

- **Z. 50–54:** `updateStatus()` definiert lokal eine Prüffunktion `correct(target)`. `placed.get(target)` liefert das gespeicherte Original oder `undefined`. `piece && ...` verlangt zunächst überhaupt ein Bild; erst dann wird dessen URL verglichen.
- **Z. 53:** `piece.src` ist vom Browser bereits als absolute URL aufgelöst. `data-result` kann ein relativer Pfad sein. `new URL(target.dataset.result, document.baseURI).href` löst ihn gegen dieselbe Dokumentbasis auf, sodass beide Seiten vergleichbar sind. Es wird keine Liste von `bus-1.jpg` usw. im Programm fest eingebaut. `===` verlangt exakte Gleichheit.
- **Z. 55–56:** Ein Sieg verlangt mindestens ein Ziel **und** `targets.every(correct)`. `every` verlangt ein positives Ergebnis für alle Ziele. Die zusätzliche Längenprüfung verhindert, dass ein leeres Array wegen der logischen Definition von `every` als gewonnen gilt.
- **Z. 57–58:** Gibt es noch keinen Sieg, sucht `some` nach mindestens einem bereits belegten, aber falsch belegten Ziel. Dafür wird „Wrong placement“ angezeigt. Eine falsche frühere Platzierung bleibt also sichtbar gemeldet, auch wenn die zuletzt gesetzte Zelle richtig war.
- **Z. 59–62:** Sind alle bisher belegten Zellen richtig, aber noch nicht alle Ziele vollständig richtig, folgt die Fortsetzungsnachricht. „Einige korrekt“ ist kein Sieg. Nach erneutem Aufnehmen einer gesetzten Figur wird der vorherige Sieg dadurch ebenfalls zurückgenommen.

**Häufiger Fehler:** Nur `source.children.length === 0` zu prüfen. Eine leere Quelle kann bedeuten, dass alle Bilder falsch verteilt wurden. Unsere Prüfung kontrolliert stattdessen jede Zielzuordnung.

## 11. Platzieren und Austausch, Z. 64–72

- **Z. 64–65:** `place(target)` liest mit `placed.get` die bisherige Belegung dieser konkreten Box.
- **Z. 66:** Ein vorhandenes Original wird mit `source.append(previous)` zurück in die Quelle gehängt. `append` verschiebt existierende Knoten; es kopiert sie nicht. Es wird genau das frühere Bild zurückgegeben, nicht irgendein Bild mit gleicher URL. Ohne vorherige Belegung passiert nichts.
- **Z. 67:** Die Map speichert nun das neu ausgewählte Original unter diesem Ziel. Ein vorhandener Eintrag wird dabei ersetzt.
- **Z. 68:** Der Hintergrund wird aus der absoluten `src`-URL gesetzt. `JSON.stringify` liefert einen zitierten, maskierten String innerhalb von `url(...)`; das ist robuster als eine unzitierte URL. Das Spielstück erscheint als Hintergrund der Box, nicht als neues Kind-`img` im Ziel.
- **Z. 69:** Das Original wird aus der Quellenliste entfernt. Seine Referenz bleibt in der Map erhalten und kann später zurückgegeben werden.
- **Z. 70:** `cancel()` entfernt die Vorschau und die Auswahl und setzt auch beim jetzt abgehängten Original die Deckkraft zurück. Der Hintergrund ist davon unabhängig.
- **Z. 71–72:** Die gesamte Belegung wird neu geprüft; die Funktion endet.

**Warum die Map nötig ist:** Nur ein Hintergrundbild zu setzen, würde zwar ähnlich aussehen, aber den Bezug zum Original verlieren. Bei einem Austausch wüsste man dann nicht mehr sicher, welches konkrete Element zurück in die Liste soll. Zwei Stücke können denselben Pfad verwenden.

## 12. Ereignisse und tatsächliche Mausposition, Z. 74–99

- **Z. 74:** `mousemove` am Dokument ruft `follow` auf. Ohne Auswahl ist die Funktion schnell wieder beendet.
- **Z. 75–80:** Der zentrale Klick-Listener sucht zuerst ein Quellbild über `event.target.closest("#puzzleSource img")`. Ein solches Bild wird ausgewählt; `return` verhindert, dass derselbe Klick zusätzlich eine Platzierung auslöst. Weil der Listener am Dokument hängt, funktioniert er auch für zurückgegebene Bild-Elemente, ohne neue Einzel-Listener anzubringen. Dieses Muster heißt **Event Delegation**.
- **Z. 81–82:** `elementFromPoint` fragt nach dem Element direkt unter den aktuellen Fensterkoordinaten des Klicks. Es wird weder die Ghost-Position verwendet noch aus einer festen Zeilen-/Spaltenzahl ein Ziel berechnet.
- **Z. 83:** Mit `closest("div[data-result]")` wird auch ein Klick auf einen untergeordneten Text oder ein anderes Kind dem umgebenden Ziel zugeordnet. Falls überhaupt kein Element getroffen wird, verhindert das vorangestellte `hit && ...` einen Methodenaufruf auf `null`.
- **Z. 84:** Nur Elemente aus der beim Initialisieren erfassten Zielmenge sind erlaubt. Klicks auf die Quelle oder irgendwo außerhalb entfernen keine Bilder und behalten eine laufende Auswahl.
- **Z. 85–86:** Mit ausgewähltem Stück führt der Zielklick die Platzierung aus.
- **Z. 87–93:** Ohne Auswahl kann ein belegtes Ziel wieder aufgenommen werden. Sein Original wird aus der Map gelöst; der Hintergrund wird gelöscht; das Original kommt in die Quelle zurück und wird direkt ausgewählt. Danach wird der Status aktualisiert. Das verhindert eine Sackgasse, wenn alle Bilder gesetzt sind, aber die Verteilung falsch ist.
- **Z. 94–95:** Ende des Zielzweigs und des Klick-Listeners.
- **Z. 96–98:** Bei `keydown` mit `event.key === "Escape"` wird die Auswahl abgebrochen. Andere Tasten ändern nichts.
- **Z. 99:** Ende und sofortiger Aufruf der gekapselten Implementierung.

Ein Klick auf ein belegtes Ziel **mit** laufender Auswahl ersetzt; derselbe Klick **ohne** Auswahl nimmt das bisherige Bild auf. Diese Unterscheidung ergibt sich aus der Reihenfolge der beiden Bedingungen, nicht aus unterschiedlichen Zieltypen.

## 13. Puzzle-Bilder und `antwort.md`

`bus-1.jpg`, `bus-2.jpg`, `bus-3.jpg` und `bus-4.jpg` sind die vier Original-Bildausschnitte. Die genaue Zuordnung steht im HTML in `data-result`, nicht in der Zahlenfolge einer JavaScript-Schleife. Die Binärdateien wurden unverändert kopiert; der Test vergleicht jede davon mit der Angabe.

`ue3.4/antwort.md` beschreibt auf Englisch Einstieg, Klickbedienung, Rückgabe aus belegten Zielen, Aufbau, Trefferprüfung, Map und Browsertests. Der letzte Block grenzt die getestete Mouse-/Chromium-Lösung von einer vollständig barrierefreien oder dynamisch nachgeladenen Anwendung ab. Wie bei der anderen Antwortdatei ist dies Dokumentation, kein ausgeführter Code.

## 14. `tests_3_4.cjs`: reproduzierbare Tests, Block für Block

Die Dateiendung `.cjs` bedeutet CommonJS: Node lädt Module mit `require`. Das Testprogramm ist kein Teil der Browser-Produkte. Es testet die echten HTML-/JS-Dateien in Chromium und ergänzt künstliche Dokumente, damit eine zufällig zum Beispiel passende Lösung auffällt.

### 14.1 Starten, Abhängigkeiten und Pfade

Vom Repository-Hauptordner:

```sh
node ueb03/tests_3_4.cjs
```

Voraussetzungen: Node.js, Playwright mit `page.clock`-Unterstützung und Chromium. Liegen die Testtools außerhalb der normalen Modulauflösung, werden ihre Pfade über die Umgebungsvariablen `PLAYWRIGHT_MODULE` und `PLAYWRIGHT_CHROMIUM` gesetzt. Es stehen **keine privaten Installationspfade im abgegebenen Testcode**. `PLAYWRIGHT_MODULE` wählt das Modul; `PLAYWRIGHT_CHROMIUM` wählt nur die Browser-Binärdatei. Ohne Browser-Override wird Playwrights Standard-Chromium verwendet. Es gibt keine zusätzlichen `npm`-Produktabhängigkeiten in `ue3.3` oder `ue3.4`.

### 14.2 Infrastruktur und Byte-Erhalt, Z. 1–39

- **Z. 1–7:** Strikter Modus und Herkunftskommentar; `assert/strict` liefert strenge Prüfungen, `fs` Dateizugriff, `path` plattformgerechte Pfadbildung und `pathToFileURL` korrekt maskierte lokale Browser-URLs. Playwright wird aus dem expliziten Override oder unter dem normalen Paketnamen geladen. Ein fehlendes Modul ist ein echter Startfehler, keine übersprungene Prüfung.
- **Z. 8–12:** `__dirname` ist der Ordner der Testdatei, nicht das möglicherweise andere Arbeitsverzeichnis. `groups` zählt bestandene Gruppen. `pass` erhöht den Zähler erst beim tatsächlichen Aufruf. `read` liefert Dateibytes, `fileURL` den passenden lokalen URL-String.
- **Z. 14–16:** Die gesamte bisherige `gallery.js` wird als Buffer eingelesen und mit genau gleich vielen Anfangsbytes der neuen Datei verglichen. Das prüft auch Zeilenenden; ein Textvergleich allein könnte eine ungewollte Normalisierung verstecken.
- **Z. 17–21:** HTML, CSS und sechs Galeriebilder werden einzeln byteweise verglichen. Erst wenn alles stimmt, wird die erste Gruppe gemeldet.
- **Z. 22–24:** Alle vier Puzzle-JPEGs werden mit der Originalangabe verglichen.
- **Z. 25–28:** Die genau erwartete neue Script-Zeile wird aus der Puzzle-Kopie entfernt. Der Rest muss dem vollständigen Originaltext einschließlich CRLF-Zeilenenden entsprechen. Das verhindert unbeabsichtigte sonstige HTML-Änderungen.
- **Z. 31–39:** `loaded` prüft bei allen passenden Bildern `complete` und positive `naturalWidth`. `complete` allein reicht nicht: Auch ein gescheitertes Laden kann als abgeschlossen gelten. Bei noch nicht geladenen Bildern wartet Node kurz und fragt erneut; nach begrenzten Versuchen schlägt der Test ausdrücklich fehl. Die Pause ist nur ein Polling-Abstand, kein Ersatz für eine erfolgreiche Bildprüfung. Bei der absichtlich leeren Galerie ist die leere Bildmenge erwartungsgemäß erlaubt.

### 14.3 Galerie-Testseiten und kontrollierte Zeit, Z. 41–86

- **Z. 41–45:** Neue Browserseite mit definierter Fenstergröße und Timeouts; JavaScript-Seitenfehler werden gesammelt und später mit einer leeren Liste verglichen.
- **Z. 46–47:** Playwright installiert eine kontrollierbare Browseruhr und pausiert sie auf einem festen Zeitpunkt. Der Zeitpunkt ist ausschließlich Testdaten, kein behauptetes aktuelles Datum. Dadurch können wir z.B. die letzte Millisekunde vor einem Wechsel und den eigentlichen Grenzzeitpunkt getrennt testen.
- **Z. 48–62:** Ein Initialisierungsscript merkt die installierten Timerfunktionen und ergänzt Beobachtung: aktive Kennungen im `Set`, gestartete Verzögerungen im Array, ausgeführte Callbacks als Zähler. Es ruft die vorhandenen Timerfunktionen weiter auf und ist kein Ersatz der Produktlogik. `clearInterval` entfernt die beobachtete Kennung und löscht den wirklichen Testtimer. So prüfen wir nicht nur sichtbare Bilder, sondern auch unsichtbar weiterlaufende/mehrfache Intervalle.
- **Z. 63–65:** Ohne künstliche Bildzahl wird die echte Produktseite geladen.
- **Z. 66–75:** Für künstliche Dokumente wird zunächst eine harmlose lokale CSS-Datei geöffnet. Das etabliert einen Datei-Ursprung, führt aber keine alten Produktlistener aus. Danach ersetzt `setContent` das Dokument. `base` setzt die Ressourcenbasis korrekt. Andere Wrapper sowie identische `data-large`-URLs prüfen Formatunabhängigkeit und Elementidentität. Das echte Script wird anschließend geladen. Einfach `about:blank` zu verwenden kann lokale Bilder blockieren; zuvor die echte Produktseite auszuführen kann alte globale Variablen oder Dokumentlistener in die neue Testseite schleppen.
- **Z. 76–78:** Die Bildladung wird geprüft; Seite und Fehlerliste gehen an die eigentlichen Tests zurück.
- **Z. 80–86:** Helfer lesen die Timerzahl, die Beschriftung und Buttons. `includeHidden:true` ist nur zum programmatischen Prüfen der leeren Galerie nötig. Normale Tests klicken sichtbare Buttons. `expectCaption` vergleicht den Text und wartet zusätzlich auf ein tatsächlich geladenes Großbild.

### 14.4 Galerie-Testfälle, Z. 88–211

- **Z. 88–95:** Die echte Galerie wird geöffnet; das zweite Vorschaubild muss richtig erscheinen. Standarddauer und Sichtbarkeit aller vier Buttonaktionen werden geprüft.
- **Z. 97–108:** Play muss genau ein Intervall und passenden ARIA-Zustand erzeugen. Vor Ablauf der Standarddauer darf das Bild nicht wechseln; an der Zeitgrenze muss es wechseln. Weitere Ticks prüfen Umbruch und wiederholte Umläufe. `clock.runFor` führt die echten Browser-Callbacks mit kontrollierter Zeit aus; es wird nicht nur eine Funktion außerhalb des Browsers simuliert.
- **Z. 110–119:** Nach Pause muss die Timerzahl null sein und auch weiteres Vorrücken der Uhr darf nichts ändern. Previous und Next müssen weiterhin korrekt umbrechen und dürfen die Großansicht nicht schließen.
- **Z. 121–136:** Während eines bereits teilweise abgelaufenen Intervalls wird die Dauer erst kürzer, dann länger eingestellt. Bis jeweils unmittelbar vor Ablauf der neuen vollen Dauer muss das Bild bleiben; danach muss es wechseln. Die Timerzahl bleibt eins und die beobachtete neue Verzögerung wird kontrolliert. Dadurch fällt auch die falsche Implementierung „Input ändert nur beim nächsten Play den Abstand“ auf.
- **Z. 138–153:** Eine ungültige laufende Dauer pausiert. Leer, negativ und über dem Maximum starten nichts. Danach wird wieder gültig gestartet und per Exit beendet. Neben Sichtbarkeit und Timerzahl wird geprüft, dass auch später kein Callback mehr ausgeführt wird.
- **Z. 155–177:** Mehrfaches Öffnen auf unterschiedlichen Thumbnails beginnt pausiert. Der alte Hintergrundklick muss jeweils schließen und aufräumen. Zusätzlich wird während des Spielens manuell navigiert und anschließend durch Großbildklick geschlossen. Nach weiterem Zeitsprung darf sich die Großansicht nicht heimlich wieder öffnen. Alle gesammelten Seitenfehler müssen fehlen.
- **Z. 178:** Die normale Testseite wird geschlossen.
- **Z. 180–211:** Eine Schleife erzeugt unabhängig 0, 1, 2 und 5 Thumbnails. Im leeren Dokument werden versteckte Buttons nur programmatisch ausgelöst, um gefahrlose Leermengenbehandlung nachzuweisen. Sonst prüfen echte Klicks Auswahl, Umbruch, bedienbares Input ohne Schließen, Diashow und Exit. Da alle diese Bilder dieselbe große URL besitzen, kann ein reiner URL-Vergleich die erwarteten Beschriftungen nicht zuverlässig liefern. Jede Größe bildet eine eigene Testgruppe, Seitenfehler werden je Dokument geprüft und jede Seite geschlossen.

### 14.5 Puzzle-Fixtures und Klick-Helfer, Z. 213–251

- **Z. 213–218:** Neue Browserseite, Timeout und Fehlersammlung wie zuvor. Normal wird `puzzle.html` geöffnet; die künstliche Variante beginnt auf der harmlosen CSS-Datei statt auf der Produktseite. So bleiben keine alten Dokument-Klicklistener für das neue Dokument aktiv.
- **Z. 219–230:** Das künstliche Puzzle hat fünf separat und unregelmäßig positionierte Ziele, ohne die vier Vorlagen-IDs oder `.puzzlePic`. Ein Ziel enthält ein Kind-`span`, eines liegt in einem anderen Container, ein Bildpfad wird doppelt verwendet. Die Quelle bleibt wie im vorgegebenen Format `puzzleSource`. Das echte Puzzle-Script wird in dieses Dokument geladen.
- **Z. 231–233:** Quellbilder müssen geladen sein; Seite und Fehlersammlung werden zurückgegeben.
- **Z. 235–239:** `pick` klickt ein Quellbild und verlangt genau eine Vorschau. Bei doppelten Dateipfaden wird das erste noch verfügbare Original genommen.
- **Z. 240–247:** `drop` scrollt ein Ziel bei Bedarf in den sichtbaren Bereich, fragt dessen tatsächliches Rechteck ab und bewegt/klickt die Maus in dessen Mitte. Das prüft die reale Mausinteraktion; kein künstliches HTML5-Drop-Ereignis wird erzeugt. Danach darf kein Ghost übrig sein.
- **Z. 248–251:** `background` liest die zugewiesene CSS-Hintergrund-URL und prüft den erwarteten Bildnamen. Die eigentlichen Bildressourcen wurden bereits erfolgreich geladen.

### 14.6 Puzzle-Testfälle und Ende, Z. 253–351

- **Z. 253–267:** Nach Auswahl wird der Mauszeiger tatsächlich bewegt. Die Vorschauposition muss den erwarteten Abstand besitzen und `fixed`/`pointer-events:none` verwenden. Ein Außenklick verändert weder Auswahl noch Stückzahl. Escape entfernt die Vorschau.
- **Z. 269–282:** Vor dem Setzen wird eine Elementreferenz gespeichert. Zuerst erfolgt eine falsche Platzierung mit Quelllistenabnahme und Fehlertext. Anschließend ersetzt das passende Bild die Belegung. Der Test prüft Hintergrund, Stückzahl und ausdrücklich, dass **genau das ursprüngliche Elementobjekt** wieder in der Quelle steht. Eine neu erzeugte Kopie mit gleichem Dateinamen würde den Identitätsvergleich nicht bestehen.
- **Z. 284–293:** Weitere Stücke werden korrekt gesetzt. Vor dem letzten Stück darf es keinen Sieg geben; danach müssen Quelle leer und Siegesnachricht vorhanden sein.
- **Z. 295–302:** Ein gesetztes Stück wird wieder aufgenommen. Der Sieg muss verschwinden, die Vorschau erscheinen und das anschließende Zurücksetzen den Sieg wiederherstellen. So wird die Wiederaufnahmefunktion tatsächlich ausgeführt und nicht nur beschrieben.
- **Z. 304–325:** Das unabhängige Fünf-Ziel-Dokument wird gespielt. Ein Klick auf das innere `span` muss das umgebende Ziel treffen. Eine falsche Belegung wird ersetzt und das alte Original zurückgegeben. Nach vier richtigen Zielen darf es noch keinen Sieg geben, erst nach dem fünften. Unterschiedliche Positionen und doppelte Bild-URLs dürfen keine Sonderfälle im Produktcode verlangen.
- **Z. 327–337:** Eine frische normale Seite wird vollständig falsch belegt. Die nun leere Quelle darf niemals als Sieg gewertet werden. Fehlertext und fehlende Seitenfehler werden geprüft; die Seite wird geschlossen.
- **Z. 340–346:** Die asynchrone Hauptfunktion führt zuerst Dateierhaltung, dann beide Browser-Testblöcke aus. Chromium läuft headless, also ohne sichtbares Fenster. Die bedingte Objekt-Erweiterung `...(condition ? {...} : {})` setzt `executablePath` nur bei explizitem Override.
- **Z. 347–350:** `finally` schließt den Browser auch bei einem Fehler. Nur nach erfolgreichem Durchlauf wird die Abschlusszeile mit dem tatsächlich hochgezählten Gruppenzähler gedruckt.
- **Z. 351:** Ein Fehler wird auf stderr ausgegeben und setzt den Prozess-Exitcode auf 1. Ein fehlgeschlagener Test wird also nicht als Erfolg kaschiert.

### 14.7 Tatsächlich ausgeführter Endstand

Der finale kombinierte Lauf gab aus:

```text
PASS 1: gallery original JS prefix, HTML, CSS and all six images are byte-identical
PASS 2: puzzle images unchanged; HTML changed only by adding deferred script reference
PASS 3: gallery opens selected image with default 3 seconds and all controls visible
PASS 4: real setInterval uses 3000 ms, advances at boundary and loops indefinitely
PASS 5: pause clears timer; previous/next still wrap without closing the overlay
PASS 6: live shorter/longer duration changes clear the old timer and restart a full interval
PASS 7: invalid durations never start a timer; exit clears timer and closes full-window mode
PASS 8: original overlay close and repeated reopening leave no hidden or duplicate timers
PASS 9: arbitrary gallery: 0 thumbnails, changed wrappers and repeated large URLs
PASS 10: arbitrary gallery: 1 thumbnails, changed wrappers and repeated large URLs
PASS 11: arbitrary gallery: 2 thumbnails, changed wrappers and repeated large URLs
PASS 12: arbitrary gallery: 5 thumbnails, changed wrappers and repeated large URLs
PASS 13: piece follows actual mouse with 16px offset, ignores hit tests; outside clicks and Escape are safe
PASS 14: wrong placement feedback; occupied-cell replacement returns the exact old image to source
PASS 15: win appears only after all four targets match their data-result values
PASS 16: placed pieces can be picked up again, so an exhausted source cannot deadlock the game
PASS 17: five arbitrarily positioned targets, no target IDs/grid classes, nested content and duplicate images
PASS 18: all cells occupied incorrectly never produces a false win
OK: 18 test groups passed in Chromium; no page errors.
```

Zusätzlich wurden Browser-Screenshots der Galerie und einer laufenden Puzzle-Auswahl außerhalb der Abgabedateien betrachtet: Bei der Galerie waren Großbild, Beschreibung sowie beide Kontrollzeilen gleichzeitig sichtbar; beim Puzzle war die Mausvorschau versetzt über dem Ziel. Diese Screenshots sind technische Sichtprüfungen, keine behaupteten persönlichen Moodle-Nachweise.

Während der Testerstellung wurden zwei reine Harness-Probleme korrigiert: Rollen-Locators finden versteckte Buttons standardmäßig nicht, deshalb `includeHidden` für den expliziten Leergalerie-Test; ein Bilddokument als Ausgang für `setContent` führte zu einem Load-Timeout, deshalb wird eine lokale Text-/CSS-Ressource ohne Produktlistener als Ursprung verwendet. Das sind keine verbliebenen Produktfehler. Nur Chromium wurde getestet, keine weitere Browserfamilie. Der unabhängige Schlussreview und der KI-PDF-Bericht liegen beim übergeordneten Ablauf.

## 15. Konkrete Änderungen selbst üben

1. **Ein neues Galeriebild:** Datei kopieren und ein `img` im gleichen Format hinzufügen. Nach Neuladen muss es durch Previous, Next und Diashow erreichbar sein. Keine Bildzahl im JS ändern.
2. **Andere Standarddauer:** Nur die anfängliche `duration.value` ändern und die Beschreibung sowie Erwartung des Standardwerttests anpassen. Minimum und Maximum sind davon getrennte Vorgaben.
3. **Anderer Mausabstand:** Beide Koordinaten in `follow` ändern. Ghost und Trefferprüfung müssen getrennt bleiben; der Treffer bleibt bei `clientX/clientY` ohne Abstand. Den zugehörigen Koordinatentest mit ändern.
4. **Ein fünftes Puzzle-Ziel:** Ein sichtbares `div[data-result]` und ein dazu passendes Quellbild ergänzen. Nicht den Siegestest auf vier Felder zurückbauen. Der vorhandene Fünf-Ziel-Test demonstriert diese Verallgemeinerung bereits.
5. **Andere Rückmeldung:** Die englischen `status.textContent`-Texte ändern; die entscheidenden Status-Prüfungen in Tests entsprechend aktualisieren. Nie nur das Wort „win“ setzen, ohne die `every`-Bedingung zu erhalten.
6. **Navigation verstehen:** Im Debugger bei `move`, `pause` und `place` Haltepunkte setzen. Beobachten, welches konkrete Element `currentImage` bzw. `selected` ist, und die `Map` vor/nach Ersatz ansehen. Das trennt sichtbare Darstellung vom tatsächlich gespeicherten Zustand.

## 16. Fragen für die mündliche Erklärung

- Warum funktioniert ein URL-Vergleich nicht als eindeutiger Galerie-Index, ein Elementvergleich aber schon?
- Warum muss die neue Dauer ein neues Intervall erzeugen?
- Welche drei Benutzeraktionen schließen die Großansicht, und wo wird jeweils der Timer gelöscht?
- Warum darf ein Kontrollklick nicht bis zum Overlay weiterlaufen?
- Warum werden die neuen Buttons nur einmal beim Initialisieren angelegt und nicht bei jedem Öffnen?
- Wofür sind `selected`, `ghost` und `placed` jeweils zuständig?
- Warum kombiniert die Vorschau `position:fixed` mit `clientX/clientY`?
- Warum wäre das Rechteck der Vorschau die falsche Grundlage für die Zielsuche?
- Warum brauchen wir trotz des Mausabstands zusätzlich `pointer-events:none`?
- Warum ist das Zurückgeben mit `append(previous)` ein Verschieben und kein Klonen?
- Warum reicht eine leere Quelle nicht als Siegesbedingung?
- Woran erkennt man im Test, dass weder Zielanzahl vier noch die vier Ziel-IDs fest eingebaut sind?

Wer diese Fragen anhand des Codes beantworten und die beschriebenen kleinen Änderungen selbst ausführen kann, kann die wesentlichen Entscheidungen der Lösung erklären. Diese Datei selbst ist noch kein Nachweis, dass das persönliche Nachvollziehen bereits stattgefunden hat.
