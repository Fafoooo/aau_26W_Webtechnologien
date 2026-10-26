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
