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
