# Aufgaben 3.1 und 3.2 — vollständige Code-Erklärung

Diese Erklärung ist KI-generiert; sie behauptet nicht, dass Fabio den Code schon verstanden oder selbst geschrieben hat. Ziel: jede ausführbare Zeile erklären und gezielt ändern können. Der gemeinsame KI-Bericht zur Abgabe wird separat geführt. Die folgenden Zeilennummern beziehen sich auf die hier abgelegten Endfassungen. Leerzeilen trennen nur Blöcke; schließende Klammern beenden jeweils den beschriebenen Block.

## 1. Starten, prüfen und Grundbegriffe

- Spiel: `ue3.1/index.html` direkt im Browser öffnen.
- Editor: `ue3.2/editable.html` direkt öffnen. Die drei JPG-Dateien müssen daneben liegen.
- Die **HTML-Datei** beschreibt Elemente, **CSS** ihre Darstellung, **JavaScript** das Verhalten. Das **DOM** ist der vom Browser aufgebaute, veränderbare Objektbaum dieser Elemente. Eine Änderung im DOM schreibt die HTML-Datei auf der Festplatte nicht um.
- Ein **Event** ist z. B. ein Klick oder eine Eingabe. `addEventListener` verbindet das Event mit einer Funktion. Diese Funktion wird erst beim Event ausgeführt, nicht beim Registrieren.
- `const` bindet einen Namen an einen unveränderten Verweis; Eigenschaften des referenzierten Elements dürfen trotzdem verändert werden. `let` erlaubt eine spätere Zuweisung an den Namen selbst.
- `=` weist zu; `===` vergleicht ohne Typumwandlung; `!==` bedeutet ungleich. `!` verneint; `&&` verlangt beide Bedingungen; `||` verlangt mindestens eine. `return` beendet die aktuelle Funktion.
- `null` bedeutet hier „noch kein Objekt/kein gültiger Zustand“. `[]` ist ein leeres Array, also eine geordnete Liste.
- `element.id` ist die HTML-ID. `getElementById` findet genau das passende DOM-Element. Die IDs in HTML, CSS und JS müssen zueinander passen.

### Reproduzierbare Browser-Prüfung

Nur der Test benötigt Node und Playwright. Die abgegebenen Webseiten importieren keinerlei Bibliothek.

Mit einer regulär installierten Playwright-Version und deren Chromium:

```sh
node tests_1_2.cjs
```

Falls die Abhängigkeiten noch nicht vorhanden sind, kann man sie **außerhalb** des Abgabeordners installieren; `PLAYWRIGHT_MODULE` zeigt anschließend auf den absoluten Pfad des dortigen `node_modules/playwright`. `npx playwright install chromium` im entsprechenden Testprojekt installiert den Browser. Keine `node_modules` ins Abgabeverzeichnis kopieren.

Im tatsächlichen Test wurden diese drei Variablen auf die vorhandene externe Installation, den Chromium-Browser und einen Screenshot-Ordner gesetzt. Private Installationspfade sind hier absichtlich nicht enthalten. Nach dem Setzen der Variablen lautet der Aufruf (aus `ueb03/`):

```sh
node tests_1_2.cjs
```

`PLAYWRIGHT_MODULE` und `PLAYWRIGHT_CHROMIUM` sind nur für abweichende Testinstallationen nötig, nicht für das ausgelieferte JavaScript. `TEST_SCREENSHOT_DIR` ist optional; ohne diese Variable werden keine Bildschirmbilder geschrieben. Das Skript bestimmt den Aufgabenordner über `__dirname`, funktioniert also auch mit absolutem Skriptpfad aus einem anderen Arbeitsverzeichnis.

Tatsächliches Endergebnis: **18 bestandene Tests**, Chromium **148.0.7778.96**, Exitcode **0**, keine JavaScript-Seitenfehler. Die vollständigen Einzeltests stehen im Abschnitt 7. Ein erster Lauf ohne Modulpfad scheiterte ehrlich mit `Cannot find module 'playwright'`; nach Auffinden der vorhandenen Installation und Setzen von `PLAYWRIGHT_MODULE` lief die reale Browser-Prüfung erfolgreich. Externe HTTP(S)-Anfragen werden im Test absichtlich abgebrochen, damit Netzverfügbarkeit das Ergebnis nicht beeinflusst. Das ursprüngliche CSS-Logo ist deshalb im Test nicht geladen; die drei lokalen Bilder sind tatsächlich geladen und dekodiert worden.

## 2. `ue3.1/index.html` — Zeilen 1–24

| Zeile/Block | Was passiert, warum steht es hier? |
|---|---|
| 1 | `<!doctype html>` aktiviert den üblichen HTML-Standardsmodus. Es ist kein sichtbares Element. |
| 2 | Ehrlicher KI-Hinweis als HTML-Kommentar. Kommentare werden nicht als Seitentext angezeigt. |
| 3 | Beginn des Wurzelelements; `lang="en"` kennzeichnet die englische Oberfläche für Browser und Vorleseprogramme. |
| 4–10 | `head` enthält Metadaten, Seitentitel und eingebundene Dateien, nicht die sichtbaren Spielkontrollen. |
| 5 | UTF-8 verhindert falsche Zeichen bei Texten mit Sonderzeichen. |
| 6 | Der Viewport entspricht auf Mobilgeräten der Gerätebreite; der Browser soll die Seite nicht wie eine breite Desktopseite verkleinern. |
| 7 | Titel des Browsertabs, getrennt von der sichtbaren Überschrift. |
| 8 | `rel="stylesheet"` lädt die relative Datei `style.css`. Beide Dateien liegen im selben Ordner. |
| 9 | `src` verweist auf `game.js`; `defer` lässt das Skript erst nach dem Parsen des HTML laufen. Daher sind die Elemente vorhanden, wenn `getElementById` ausgeführt wird. |
| 11–23 | Im `body` liegt der sichtbare Inhalt. |
| 12 | Die verlangte Hauptüberschrift. Sie bleibt beim Start sichtbar; nur die Begrüßung wird versteckt. |
| 13 | Begrüßung als Absatz. Die ID `welcome` dient als JS-Anker, der Text nennt Bereich und Versuchslimit. |
| 14–18 | Das `fieldset` gruppiert die Eingabe mit ihrer Legende. Das boolesche `hidden` versteckt die gesamte Gruppe zunächst. |
| 15 | `legend` ist die Beschriftung der Gruppe und enthält den verlangten Zahlenbereich. |
| 16 | `label for="guess"` beschriftet die Eingabe mit ID `guess`; Klick auf die Beschriftung fokussiert das Feld. |
| 17 | `type="number"` aktiviert Zahleneingabe und ggf. Pfeiltasten. `min`, `max`, `step` und `required` definieren Gültigkeit: nicht leer, zwischen 1 und 10, ganzzahlige Schritte ab 1. Diese Attribute verhindern nicht jeden Tastendruck; die JavaScript-Prüfung verhindert die Verarbeitung ungültiger Werte. |
| 19–22 | Ein gemeinsamer Container für die vorhandenen und später angefügten Buttons. Er steht nach dem Fieldset; die Rückmeldungen werden später dazwischen eingeschoben. |
| 20 | Check existiert von Anfang an, ist aber `disabled` und `hidden`. Boolesche Attribute gelten schon durch ihre Anwesenheit: `disabled="false"` würde ihn nicht aktivieren! JS setzt stattdessen die Eigenschaft auf `false`. `type="button"` verhindert unerwünschtes Formularabsenden. |
| 21 | Start ist der einzige anfangs sichtbare Button. Die englische Beschriftung entspricht der Angabe. |
| 22–24 | Schließen Container, Body und Dokument. Kein Exit und keine Rückmeldungs-Divs sind statisch vorhanden: sie müssen dynamisch entstehen und wieder entfernt werden. |

## 3. `ue3.1/style.css` — Zeilen 1–37

Eine CSS-Regel besteht aus Selektor und `{ Eigenschaft: Wert; }`. Elementnamen wie `p` treffen alle passenden Elemente; `#start` trifft die ID. `:focus` und `:disabled` sind Zustandsselektoren. Die Reihenfolge ist nur bei konkurrierenden Regeln gleicher Priorität entscheidend.

| Zeile/Block | Erklärung jeder Deklaration |
|---|---|
| 1 | KI-Kommentar; keine Layoutwirkung. |
| 2–5 | Der Body verwendet Arial, ersatzweise eine verfügbare serifenlose Schrift. `text-align: center` zentriert Text und Inline-Inhalte. Blockelemente werden dadurch nicht automatisch mittig angeordnet. |
| 6–10 | Die Überschrift bekommt ausdrücklich Verdana, mit serifenlosem Ersatz, `2em` Schriftgröße und rundum `15px` Außenabstand. `em` bezieht sich hier auf die geerbte Schriftgröße. Verdana muss auf dem Betriebssystem vorhanden sein, sonst greift der deklarierte Ersatz. Der Test prüft die angeforderte Schriftfamilie, nicht das Vorhandensein einer proprietären Schriftdatei. |
| 11–14 | Jeder Absatz bekommt zentrierten Text und rundum genau `10px` Margin. Das erfüllt die Angabe unabhängig von der Body-Vererbung. |
| 15–20 | Das Fieldset wird mit `width: fit-content` nur so breit wie nötig. Die Maximalbreite lässt Platz am Rand. `calc(100% - 4rem)` ist eine vom Browser berechnete Breitenangabe; `rem` bezieht sich auf die Wurzelschriftgröße. `margin: 20px auto` bedeutet oben/unten 20 Pixel, links/rechts automatisch gleiche Ränder: das zentriert den Block. Die letzte Zeile zentriert seinen Inhalt. |
| 21–23 | Nur bei Fokus auf der Eingabe wird der Hintergrund `lightblue`. Fokus erhält das Feld durch Klick, Tab oder das JS-`focus()`. Kein permanenter blauer Hintergrund. |
| 24–31 | Buttons sind Blockelemente (`display: block`) und bekommen mit `margin: 10px auto` gleiche Seitenränder. Innenabstand: oben/unten 8, links/rechts 16 Pixel. Weiße Schrift, durchgehender schwarzer 1-Pixel-Rahmen und Handzeiger geben eine einfache konsistente Darstellung. |
| 32 | Start-Hintergrund ist die CSS-Farbe `blue`. |
| 33 | Check-Hintergrund ist `green`, auch wenn der Button deaktiviert ist. Die Funktionssperre kommt vom HTML/JS-Zustand, nicht von einer Farbe. |
| 34 | Die ID `exit` wird erst dynamisch angelegt, die CSS-Regel gilt dann automatisch und macht ihn rot. |
| 35 | Deaktivierte Buttons zeigen `not-allowed` statt des Handzeigers. CSS selbst deaktiviert keine Klicklogik. |
| 36 | Beide Rückmeldungsbereiche erhalten 10 Pixel Außenabstand. Das Komma bildet eine gemeinsame Regel für zwei Selektoren. |
| 37 | `[hidden]` trifft alle Elemente mit dem Attribut und setzt `display: none`. Die Regel steht nach der allgemeinen Button-Regel; damit überschreibt sie deren `display: block` und versteckte Buttons tauchen nicht versehentlich auf. |

## 4. `ue3.1/game.js` — Zeilen 1–109

### Aufbau und Zustand, Zeilen 1–18

- **1** dokumentiert die KI-Unterstützung. **2** aktiviert den strikten JavaScript-Modus, der z. B. versehentlich nicht deklarierte Variablen ablehnt.
- **4 und 109** bilden eine sofort aufgerufene Pfeilfunktion: `(() => { ... })();`. Dadurch bleiben alle Namen im eigenen Funktionsbereich und verschmutzen nicht `window`. Der letzte Aufruf führt die Initialisierung genau einmal aus.
- **5–10** speichern Verweise auf die sechs vorhandenen DOM-Elemente. Jede Zeile nennt die zugehörige HTML-ID. Wiederholte DOM-Suchen in jedem Handler sind dadurch unnötig.
- **11** ist die zentrale Grenze `maxAttempts = 3`.
- **12** speichert die geheime Zielzahl, zunächst keine. **13** zählt alle angenommenen Tipps. **14** sagt, ob gerade noch geraten werden darf.
- **15** speichert ausschließlich falsche Tipps, weil die Angabe die Historie im Falsch-Zweig verlangt. **16–18** speichern die erst später erzeugten Knoten: Meldung, Historie, Exit-Button. `history` ist eine lokale Variable und nicht die Browser-Navigationshistorie.

### Eingabeprüfung, Zeilen 20–27

- **20–23 `validGuess()`**: Zeile 21 liest mit `valueAsNumber` eine echte Zahl statt des Eingabestrings. Eine leere/ungültige Eingabe liefert keinen gültigen Zahlenwert. Zeile 22 verbindet native HTML-Validität mit einer expliziten Ganzzahlprüfung und dem inklusiven Bereich. `Number.isInteger` akzeptiert keine Dezimalbrüche und kein `NaN`. `checkValidity()` prüft insbesondere `required`, `min`, `max` und `step`.
- **25–27 `updateCheck()`**: Der Button ist genau dann deaktiviert, wenn **nicht gespielt wird oder der Tipp ungültig ist**. Das Spielende hat Vorrang vor einer später wieder gültigen Eingabe. Die Funktion zählt keinen Versuch und verändert keine Meldung.

### Zurücksetzen, Zeilen 29–47

- **30–33** beenden den aktiven Zustand, löschen Ziel und Zähler und ersetzen die Tipp-Liste durch eine neue leere Liste.
- **34** leert das Eingabefeld. **35–37** verstecken Fieldset und Check und deaktivieren Check zusätzlich.
- **38–39** machen Begrüßung und Start wieder sichtbar.
- **40–42** entfernen die tatsächlich erzeugten Knoten aus dem DOM. Nur `textContent = ''` wäre nicht ausreichend, denn die Angabe verlangt das Entfernen der Elemente.
- **43–45** löschen auch die gespeicherten Verweise. Vor allem `exit = null` erlaubt anschließend einen echten Neustart. **46** gibt den Tastaturfokus an Start zurück.
- Die Funktion ist nur als Handler des vorhandenen Exit-Buttons registriert. Deshalb existieren die drei Knoten beim Aufruf; optionale Verkettung ist hier nicht nötig.

### Spiel starten, Zeilen 49–83

- **50** ist eine Schutzschranke: bei laufendem Spiel oder noch vorhandenem Exit (auch nach Sieg/Niederlage) wird kein zweites Spiel über den verborgenen Start erzeugt. Nach Reset ist `exit` wieder `null`.
- **51** erzeugt die Zufallszahl: `Math.random()` liefert einen Wert ab 0 und kleiner als 1; Multiplikation mit 10 verteilt ihn auf zehn Intervalle, `Math.floor` nimmt den unteren ganzzahligen Intervallindex, `+ 1` verschiebt den Bereich auf 1 bis 10. Kein `Math.round`, das die Randwerte anders gewichten würde.
- **52–54** beginnen eine frische Runde mit leerer Historie, null Versuchen und aktivem Zustand.
- **55–58** setzen die verlangten Eingabeattribute ausdrücklich auch beim Start. Eigenschaften wie `min` sind hier Strings; `required` ist boolesch.
- **59** befüllt das Feld mit dem gültigen Anfangswert 1. Damit kann Check sofort aktiv sein und gleichzeitig nur gültige Eingaben zulassen. Das Vorbelegen zählt nicht als Versuch.
- **60–63** schalten Begrüßung und Start aus, Fieldset und Check ein.
- **65–67** erzeugen den Meldungs-Div, geben ihm seine ID und `role="status"` für assistive Technik.
- **68–70** erzeugen den zweiten Div für die Historie. `aria-live="polite"` kündigt Textänderungen bei geeigneten Vorleseprogrammen an, ohne die aktuelle Ausgabe sofort zu unterbrechen.
- **71** fügt beide Knoten in dieser Reihenfolge direkt nach dem Fieldset ein. Da vorher der Buttoncontainer folgte, stehen die beiden Divs jetzt genau zwischen Fieldset und Buttons.
- **72–73** zeigen die Anfangsmeldung und die noch leere Historie. `textContent` interpretiert keinen HTML-Code.
- **75–78** erzeugen und beschriften den Exit-Button. Seine ID aktiviert die vorhandene rote CSS-Regel. `type='button'` ist eine explizite Funktionsentscheidung.
- **79** verbindet genau diesen Exit-Knoten mit Reset; **80** hängt ihn nach den vorhandenen Buttons an. Der versteckte Start bleibt im DOM, ist aber nicht bedienbar sichtbar.
- **81** berechnet den Check-Zustand aus dem gültigen Anfangswert; **82** fokussiert die Eingabe und aktiviert dadurch auch den hellblauen Fokusstil.

### Tipp auswerten, Zeilen 85–104

- **86** schützt den Handler selbst: weder ein künstlich ausgelöster Klick noch ein veralteter Buttonzustand darf nach Spielende oder bei ungültiger Zahl einen Tipp annehmen.
- **87** liest den akzeptierten Tipp als Zahl. **88** zählt erst jetzt einen Versuch. Ungültige Eingaben gelangen nie bis zu dieser Zeile.
- **89–91** behandeln den Treffer zuerst. Ein Template-String mit Backticks und `${...}` setzt Zielzahl und aktuelle Versuchszahl in die Gratulation ein. Danach ist `playing = false`. Weil dieser Zweig vor der Verlustprüfung steht, gewinnt auch ein korrekter dritter Tipp.
- **92–95** behandeln nur falsche Tipps: `push` hängt an die Liste an; `join(', ')` erzeugt die sichtbare Aufzählung. Der bedingte Ausdruck `Bedingung ? wahrerWert : falscherWert` wählt „Too high!“ oder „Too low!“.
- **96–98** beenden nach dem dritten falschen Tipp die Runde und nennen die geheime Zahl. „Maximum 3“ wird so eingehalten, statt erst einen vierten Tipp abzuwarten.
- **99–100** geben ansonsten Hinweis und Restversuche aus. Die Subtraktion wird beim Rendern vom JavaScript-Interpreter ausgeführt.
- **103** aktualisiert zum Schluss den Button: bei Sieg/Niederlage deaktiviert, bei weiterlaufendem Spiel und gültiger Zahl aktiv. Die Eingabe selbst bleibt nach Spielende sichtbar und editierbar, kann den abgeschlossenen Zustand aber nicht aufheben.

### Listener, Zeilen 106–109

- **106** verbindet Start mit `startGame`, **107** jede tatsächliche Eingabeänderung mit `updateCheck`, **108** Check mit `checkGuess`. Es werden Funktionsreferenzen übergeben, **keine** Aufrufe wie `startGame()`; sonst würde das Spiel schon beim Laden starten.
- **109** beendet und startet den beschriebenen Funktionsrahmen. Listener der dauerhaften Buttons werden nur einmal registriert. Jeder erzeugte Exit-Knoten hat einen eigenen Listener und verschwindet beim Reset wieder.

### Zustandsmodell und gezielte Änderungen

| Zustand | playing | Vorhandener Exit | Check | Erlaubter Übergang |
|---|---|---|---|---|
| Willkommen | false | nein | versteckt, deaktiviert | Start → aktive Runde |
| Runde | true | ja | sichtbar, nur bei gültigem Tipp aktiv | Treffer/3. Fehler → beendet; Exit → Willkommen |
| Beendet | false | ja | sichtbar, deaktiviert | Exit → Willkommen |

Will man andere Farben, ändert man CSS 32–34. Andere Texte stehen in HTML 12–21 und JS 72–78, 90–100. Für ein anderes Versuchslimit reicht **nicht** nur JS 11: auch Begrüßung, Anfangsmeldung, Antwort und Tests müssen angepasst werden. Für einen anderen Zahlenbereich müssen HTML 15–17, JS 22, 51, 55–59, Begrüßung und Tests zusammen geändert werden. Ohne diese Konsistenz wären Oberfläche und Regeln widersprüchlich.

## 5. `ue3.2/editable.html`, Bilder und Antwortdateien

### Unveränderte Vorlage mit einer einzigen Einfügung

Die Vorlage durfte nicht überarbeitet werden. Daher bleibt auch ihre ursprünglich fehlende Doctype-/Charset-Deklaration, ihre deutsche Sprachangabe und der ungenutzte CSS-Platzhalter unverändert. **Nur Zeile 8 ist neu**: `<script src="editable.js" defer></script>`. `defer` ist auch hier nötig, weil die Sections erst später im Dokument stehen. Die ursprünglichen Bytes einschließlich CRLF-Zeilenenden sind nach Entfernen dieser einen Einfügung wieder exakt die Vorlage; der Test vergleicht Binärpuffer und nicht bloß normalisierten Text.

| Zeile/Block der Kopie | Bedeutung der vorhandenen Vorlage |
|---|---|
| 1–9 | HTML-Rahmen, `lang="de"`, Head mit Tabtitel, internem Styleblock und unserem Scriptverweis. Zeile 6 ist ein CSS-Kommentar und enthält keine ausgeführte Regel. |
| 11–15 | Body und Header mit Seitenüberschrift und externem CSS-Logo. Diese Überschrift ist **keine** Section-Überschrift und gehört nicht in die Auswahlliste. Der externe Logo-Server ist keine lokale Abhängigkeit des Editors. |
| 16–23 | Navigation als ungeordnete Liste mit vier Einträgen. Vier Nav-Einträge bedeuten nicht vier Sections: das Dokument hat nur drei. Der Editor liest Sections aus dem DOM und verlässt sich nicht auf die Navigation. |
| 24–34 | Inhaltscontainer und erste Section: direkte `h1`, lokales Bild, Text, Absatz mit `strong` und zwei Links. `target="_blank"` öffnet in einem neuen Kontext. Der relative Link `erat.html` stammt aus der Vorlage; seine Zieldatei ist nicht mitgeliefert und wird nicht erfunden. |
| 36–45 | Zweite Section mit eigener direkter Überschrift, `pic2.jpg`, Text, Hervorhebung und Link. Der Editor lädt auch diese kompletten Kindknoten als HTML-Quelltext. |
| 47–55 | Dritte Section mit `pic3.jpg` und Absatz. Das Formular wird zur Laufzeit unmittelbar **nach diesem Section-Element**, noch innerhalb von `.content`, eingefügt. Es steht damit auch vor dem Footer. |
| 56–67 | Ende des Containers, Footer mit drei Listeneinträgen und Abschluss von Body/HTML. Leerzeilen ändern keine Editorlogik. |

`pic1.jpg`, `pic2.jpg`, `pic3.jpg` sind unveränderte Binärkopien der gelieferten Vorlagen, keine neu erzeugten Bilder und kein Code. Das relative `src` funktioniert, weil die Dateien im selben Ordner liegen. Der Test bestätigt nicht nur Bytegleichheit, sondern im Browser auch `complete` und eine positive `naturalWidth`.

### `ue3.1/antwort.md` und `ue3.2/antwort.md`

Diese Markdown-Dateien werden nicht von den Programmen geladen. Sie sind die englischen Abgabeantworten: Startanleitung, erfüllte Anforderungen, getroffene Auslegung, Teststand und ehrliche KI-Kennzeichnung. Aufgabe 1 erläutert insbesondere Vorbelegung, Anfangssichtbarkeit, drei statt vier Versuche und Historie falscher Tipps. Aufgabe 2 beschreibt Byteerhaltung, Überschriftenvorrang und die Vertrauensgrenze. Ändert man Verhalten, müssen diese Aussagen mitgeändert werden. Markdown-`#` markiert Überschriften, `-` Listen und Backticks Code/Dateinamen.

## 6. `ue3.2/editable.js` — Zeilen 1–88

### Erfassung und Formularobjekte, Zeilen 1–23

- **1–4, 88**: KI-Kommentar, strikter Modus und gekapselte sofort ausgeführte Funktion wie im Spiel.
- **5**: `querySelectorAll('section')` findet die Sections des ursprünglichen Dokuments. `Array.from` macht aus der statischen NodeList ein Array. Das Array behält Elementverweise; eine spätere Inhaltsänderung tauscht nicht die Section selbst aus.
- **6**: Ohne Sections gibt es nichts zu bearbeiten; die Funktion endet, statt einen Fehler beim Zugriff auf das letzte Element auszulösen.
- **7–10**: Neues Formular und neue Auswahl, jeweils mit einer eindeutigen ID. Sie existieren zunächst nur als Objekte und sind noch nicht in die Seite eingefügt.
- **11–13**: Texteingabe für die Überschrift, mit ID und explizitem Typ `text`.
- **14–17**: Textarea für mehrzeiligen HTML-Quelltext. `rows=12` und `cols=70` bestimmen ihre anfängliche sichtbare Größe, nicht die maximal erlaubte Textlänge.
- **18–21**: Submit-Button mit Beschriftung und zunächst `disabled=true`. Die Anfangsauswahl ist absichtlich noch keine Section.
- **22–23**: Ein sichtbarer Hinweis erklärt Vertrauensgrenze und fehlende Speicherung. Er wird später ins Formular eingefügt.

### Felder mit Labels zusammenbauen, Zeilen 25–32

- **25** definiert eine Hilfsfunktion mit Text (`caption`) und Control-Element (`control`). Das vermeidet drei fast identische Codeblöcke.
- **26–27** erzeugen für jedes Feld Absatz und Label.
- **28** setzt `htmlFor`, die DOM-Eigenschaft zum HTML-Attribut `for`, auf die Control-ID. Das Label ist damit programmatisch zugeordnet.
- **29** setzt den Labeltext als reinen Text. **30** hängt Label, Zeilenumbruch und Control in dieser Reihenfolge an den Absatz. `append` kann mehrere Knoten aufnehmen; vorhandene Knoten werden dabei verschoben, nicht kopiert.
- **31** hängt den vollständigen Absatz ins noch nicht sichtbare Formular.

### Richtige Überschrift finden, Zeilen 34–36

`sectionHeading(section)` liefert mit `section.querySelector(':scope > h1')` die erste **direkte** h1 dieser Section. `:scope` meint das übergebene Element, `>` genau eine Eltern-Kind-Beziehung. Dadurch wird nicht versehentlich die globale Header-Überschrift oder eine tiefer verschachtelte Überschrift als Section-Titel benutzt. Wird die ursprüngliche direkte h1 gelöscht oder in einen anderen Container geschoben, fehlt sie im geforderten direkten Verhältnis und wird beim Speichern neu angelegt.

### Optionen neu aufbauen, Zeilen 38–51

- **38** hat den Standardparameter `selectedValue = ''`. Ohne Argument soll die Anfangsauswahl gelten; mit Argument soll die bisherige Section ausgewählt bleiben.
- **39–41** erzeugen die Placeholder-Option. Ihr leerer Wert steht ausdrücklich für „keine Section“, auch wenn die erste echte Section den Index 0 hat.
- **42** ersetzt alle bisherigen Optionen durch den neuen Placeholder. Alte Titel verschwinden sicher.
- **43** läuft mit `forEach` über Section und numerischen Index.
- **44–45** erzeugen eine Option; ihr Wert ist der Index als String. HTML-Optionen verwenden Stringwerte, deshalb die explizite Umwandlung.
- **46–47** lesen die direkte Überschrift. Wenn sie existiert, wird deren Text der sichtbare Optionsname. Falls sie fehlt, dient `Section ${index + 1}` als Ersatz. Eine absichtlich **leere**, aber existierende Überschrift bleibt leer; „fehlt“ und „leer“ sind nicht dasselbe.
- **48–49** fügen alle Optionen an. **50** wählt nach dem Neuaufbau wieder den übergebenen Wert. Das ist wichtig, weil Ersetzen der Optionsknoten sonst die Auswahl verlieren könnte.

### Auswahl sicher auflösen, Zeilen 53–56

- **54** prüft zuerst den leeren Placeholder. Ohne diese Sonderbehandlung wäre `Number('')` null und man würde unbeabsichtigt die erste Section bearbeiten.
- **55** wandelt einen echten Optionswert in den Arrayindex um und liefert den vorhandenen Elementverweis. `|| null` fällt bei ungültigem Index auf „keine Section“ zurück.
- Optionen werden anhand von IDs/Indizes und nicht anhand des sichtbaren Texts identifiziert. Daher sind identische Überschriften oder eine Umbenennung kein Zuordnungsproblem.

### Bei Auswahl laden, Zeilen 58–64

- **58** reagiert auf ein `change` der Auswahl.
- **59–60** lösen die Section auf und aktivieren Submit nur bei einer echten Section.
- **61–62** holen deren Überschrift und kopieren den Text in die Texteingabe. Bei Placeholder oder fehlender h1 wird das Feld geleert.
- **63** lädt den vollständigen HTML-Inhalt der Section in die Textarea; bei Placeholder wird sie geleert. Wichtig: `.value` eines Formularfeldes ist sein aktueller Inhalt. `textarea.textContent` wäre hier die falsche Eigenschaft für den aktuellen bearbeiteten Wert.
- `section.innerHTML` enthält die gesamte **innere** Struktur einschließlich h1, Bild und Absätzen, aber nicht das äußere `<section>` selbst. Deshalb kann nur der Inhalt, nicht der gespeicherte Section-Verweis, ersetzt werden.

### Speichern und Überschriftenvorrang, Zeilen 66–80

- **66** reagiert auf das Formular-`submit`, nicht nur auf einen Mausklick. Damit funktioniert auch normales Absenden über die Tastatur.
- **67** verhindert das Standardverhalten, das sonst navigieren bzw. die Seite neu laden könnte. Wir bearbeiten nur das DOM.
- **68–69** prüfen nochmals die Auswahl. Auch ein künstlich ausgelöstes Submit ohne Auswahl darf nichts verändern; ein deaktivierter Button allein wäre keine ausreichende Logikprüfung.
- **70–71** machen die bewusste Vertrauensgrenze sichtbar: der Textarea-Inhalt wird als HTML geparst und ersetzt sämtliche Kinder der gewählten Section. Es gibt **keine Sanitization**. `textContent` würde dagegen alle Tags als Text anzeigen und die Aufgabe verfehlen.
- **72** sucht die h1 **nach** dem Ersetzen neu. Ein vorher gespeicherter h1-Verweis würde jetzt auf einen entfernten alten Knoten zeigen und die sichtbare Seite nicht ändern.
- **73–76** behandeln den Fall ohne direkte h1: neue h1 erzeugen und mit `prepend` ganz vorne in die Section einsetzen. Ein bloßes `querySelector(...).textContent = ...` ohne Nullprüfung würde hier abstürzen.
- **77** setzt zuletzt den Titel aus der separaten Texteingabe. Weil dieser Schritt nach der Textarea-Übernahme passiert, gewinnt immer der Input. `textContent` behandelt z. B. `<text>` und `&` als sichtbaren Titeltext, nicht als auszuführendes Markup.
- **78** wertet das aktuelle `select.value` als Argument aus und baut damit alle Optionsnamen neu auf. Die Funktion bekommt den Wert, bevor sie die alten Optionen entfernt; deshalb bleibt die Auswahl erhalten.
- **79** lädt die endgültige HTML-Serialisierung zurück in die Textarea. Eine neu angelegte bzw. überschriebene h1 ist so sofort im Quelltext sichtbar. Der Browser darf Anführungszeichen/Entities beim Parsen und Serialisieren normalisieren; verlangt ist die DOM-Inhaltsbearbeitung, keine Bytekonservierung der eingegebenen Zeichenfolge.

### Fertigstellen, Zeilen 82–88

- **82–84** erzeugen die drei beschrifteten Felder in der Reihenfolge Auswahl, Titel, HTML.
- **85** hängt Button und Warnung an.
- **86** befüllt die Optionen mit Anfangsplaceholder. Submit bleibt von Zeile 21 deaktiviert.
- **87** wählt das letzte Element des Arrays (`length - 1`) und setzt das komplette Formular mit `.after(form)` direkt dahinter. Nicht ans Body-Ende und nicht hinter den Footer.
- **88** schließt den gekapselten Initialisierungsaufruf. Das ursprüngliche HTML enthält bis auf den Scriptverweis weiterhin keinen Formularcode.

### Was der Editor bewusst nicht leistet

Keine Speicherung, kein Undo-System und keine Bereinigung fremden HTMLs sind verlangt. Inline-Eventhandler, aktive URLs, Frames und andere Inhalte können nach dem Einfügen Wirkung haben. Dass per `innerHTML` eingefügte Script-Tags üblicherweise nicht direkt ausgeführt werden, ist **kein** Sicherheitsbeweis. Nur eigenes, vertrauenswürdiges HTML verwenden. Der Test demonstriert mit einem harmlosen Button ausdrücklich einen funktionierenden Inline-Handler.

Das Programm arbeitet mit den ursprünglichen Sections. Es verspricht nicht, beliebig neu hineingeschachtelte Sections automatisch zu registrieren, entfernte Eltern durch fremde Eventhandler zu reparieren oder mehrere direkte h1 in unkontrolliertem HTML zu einem einzigen gültigen Dokument zu normalisieren. Die Angabe beginnt mit genau einer direkten h1 pro Section. Die ausdrücklich verlangte Entfernung dieser h1 wird korrekt abgefangen.

Für andere Feldtexte ändert man 20, 23, 41 und 82–84. Für eine andere Textarea-Größe 16–17. Für h2 statt h1 müssten **beide** Stellen 35 und 74 sowie die Vorlage/Anforderung geändert werden. Die Vorlage selbst darf bei dieser Aufgabe gerade nicht geändert werden. Die Navigation ist unabhängig und bleibt unverändert.

## 7. `tests_1_2.cjs` — Zeilen 1–244

### Testtechnik und jede Aufbaugruppe

| Zeile/Block | Erklärung |
|---|---|
| 1–5 | Strikter Modus, KI-Kommentar, Startbefehl und optionale Umgebungsvariablen. Diese Kommentare werden nicht ausgeführt. |
| 6–10 | CommonJS-`require` lädt strikte Assertions, Dateisystem, Pfadfunktionen, Datei-URL-Umwandlung und Playwright. `node:` kennzeichnet Node-Standardmodule; nur Playwright ist eine externe Testabhängigkeit. Der explizite Modulpfad hat Vorrang vor dem regulären Modulnamen. |
| 11–17 | `__dirname` ist das Verzeichnis der Testdatei. `passed` zählt nur vollständig bestandene Testgruppen. `async test` wartet mit `await` auf den Testkörper, erhöht erst danach und druckt `PASS`. Ein geworfener Assertionfehler verhindert einen falschen Erfolg. |
| 18 | Eine Pfeilfunktion baut aus dem relativen Dateinamen über `path.join` und `pathToFileURL` eine korrekt kodierte Datei-URL. Kein selbst zusammengebautes `file://` mit problematischen Leerzeichen. |
| 19–23 | Optionale Screenshots: ohne Zielvariable sofort zurück; andernfalls Verzeichnis rekursiv anlegen und die gesamte Seite aufnehmen. Der Test schreibt nie standardmäßig in den Abgabeordner. |
| 24–35 | Erste Testgruppe liest Original und Lösung binär. Die exakt erwartete neue Scriptzeile wird herausgeschnitten; der Rest muss bytegleich zum Original sein. `assert.deepEqual` vergleicht Buffer-Inhalte. Danach werden auch alle drei JPG-Dateien paarweise verglichen. |
| 36–43 | Optionalen Browserpfad auflösen, echten headless Chromium starten, reproduzierbaren Viewport setzen, Seite öffnen und unbehandelte JS-Fehler sammeln. Die Route blockiert ausschließlich HTTP(S); lokale Datei-Assets bleiben erreichbar. |
| 44 und 240–242 | `try/finally` stellt sicher, dass der Browser auch bei einem Fehler geschlossen wird. Das verhindert liegengebliebene Prozesse. |
| 45–48 | Vor jedem Dokument wird nur im Test `Math.random` durch eine kontrollierte Folge ersetzt. Damit werden Ziel 5, oberer Rand 10, unterer Rand 1 und weitere Runden reproduzierbar. `shift()` nimmt jeweils den nächsten Wert; `?? 0.4` liefert nach Ende der Folge einen Ersatz. Das Produkt-JS selbst bleibt unverändert zufällig. |
| 49 und 161 | Öffnen nacheinander die beiden echten HTML-Dateien mit ihren echten Skripten und Assets; kein DOM-Mock und keine synthetische Ersatzseite. |
| 50–238 | Die nachfolgend einzeln erklärten Browser-Assertions und Aktionen. `locator` findet Elemente; `.fill`, `.click`, `.selectOption` bedienen sie. `evaluate` führt kleine Prüfungen im Browserkontext aus, `innerText` liest sichtbaren Text, `innerHTML` den HTML-Inhalt. `dispatchEvent` testet bewusst künstliche Ereignisse als zusätzliche Schutzprüfung, nicht als Ersatz für normale Bedienung. |
| 239 | Zusammenfassung enthält den tatsächlich erhöhten Testzähler und die echte Browser-Version. |
| 243–244 | Starten `main`; bei einem Fehler Ausgabe auf stderr und `process.exitCode = 1`. Dadurch kann eine automatisierte Prüfung Erfolg und Misserfolg zuverlässig unterscheiden. |

### Die 18 Testgruppen im Einzelnen

1. **25–35, geschützte Dateien:** Nur die erlaubte Scriptzeile darf das HTML ändern; jedes lokale JPG muss exakt gleich sein. CRLF-Normalisierung würde auffallen.
2. **50–59, Startansicht:** Tabtitel und Hauptüberschrift stimmen; Begrüßung sichtbar; einzig sichtbarer Button ist Start; Check deaktiviert, Fieldset verborgen, temporäre Knoten noch nicht vorhanden; Start ist wirklich blau.
3. **60–71, CSS:** `getComputedStyle` liest die vom Browser berechneten Werte. Verdana-Deklaration, Größe, exakter Margin und Absatzzentrierung werden geprüft. Die Buttonmitte muss bis auf weniger als einen Pixel auf der Mitte des vorgegebenen Viewports liegen; `boundingBox` liefert Position und Größe.
4. **72–86, Start:** Echter Start-Klick. Begrüßung und Start weg, Fieldset und aktiver Check da; Vorbelegung 1 und alle Attribute stimmen. Die IDs der direkt folgenden Geschwister beweisen die Reihenfolge Fieldset → Meldung → Historie → Buttons. Farben und hellblauer Eingabefokus sowie Fieldset-Zentrierung werden geprüft.
5. **87–101, ungültige Eingaben:** Schleife über leer, untere/obere Bereichsverletzung, Dezimalzahl und negative Zahl. Button bleibt deaktiviert, selbst ein künstlicher Klick zählt nicht. Ein nichtnumerischer Wert wird direkt gesetzt, weil Playwright solche Zeichen bei `type=number` nicht normal eintippt; der Browser normalisiert ihn zu ungültig/leer. Weder Meldung noch Historie ändern sich.
6. **102–112, Hinweise/Historie:** Tipps 1 und 10 sind bei Ziel 5 falsch und liefern beide Richtungen samt Restversuchen. Ein am Meldungs-Div gesetztes Test-Datenattribut bleibt erhalten und beweist, dass derselbe Knoten aktualisiert statt ersetzt wird. Historie muss beide Werte in Reihenfolge enthalten.
7. **113–123, Verlust:** Dritter falscher Tipp endet sofort und verrät 5. Danach 5 eingeben und künstlich klicken darf den deaktivierten Check und die dreiteilige Historie nicht ändern. Optional entsteht `exercise1.png`.
8. **124–133, Reset:** Echter Exit-Klick entfernt alle drei temporären Elemente, verbirgt Eingabe und Check, zeigt Begrüßung und Start und leert das Feld.
9. **134–145, Neustart/3. Treffer:** Neues Ziel ist der obere Rand 10. Die Historie ist leer. Zwei falsche Tipps und dann 10 müssen auf Versuch drei gewinnen, nicht verlieren; die falsche Historie enthält nur 1 und 2. Auch danach kann eine Eingabe Check nicht reaktivieren.
10. **146–160, unterer Rand und Wiederholungen:** Nach Reset ist Ziel 1 und die Vorbelegung gewinnt sofort. Anschließend drei aktive Runden starten und wieder verlassen: nie doppelte IDs/Divs, ein Check zählt immer nur einen Versuch. Das erkennt auch versehentlich mehrfach registrierte Listener.
11. **162–170, Editor-Anfang:** Ein Formular direkt nach letzter Section, korrekt benannte drei Optionen plus Placeholder, leere Textarea, deaktivierter Submit und drei Labels.
12. **171–174, Bilder:** `waitForFunction` wartet auf tatsächlich abgeschlossene und erfolgreiche lokale Bilddecodierung, nicht bloß auf einen festen Zeitabstand. Alle drei Bilder müssen vorhanden sein.
13. **175–182, alle Sections:** Schleife wählt jede Section, prüft Überschrift und exakten vollständigen innerHTML-String und aktiven Submit. Kein Abschneiden nur auf Absätze oder auf Text.
14. **183–197, Konflikt:** Vorherige Section-Inhalte werden gesichert. In der ersten Section widersprechen sich Textinput und HTML-h1 absichtlich. Der Input mit `&` und `<text>` muss als Text gewinnen, die h1-Klasse erhalten bleiben, anderer HTML-Inhalt ankommen, die Auswahl/Option/Textarea aktualisiert werden und beide Nachbarsections unverändert bleiben.
15. **198–209, entfernte/leere h1:** HTML ohne h1 wird gespeichert; neue h1 muss erstes Kind und eindeutig sein. Danach werden Titel und Source vollständig geleert; eine leere h1 muss trotzdem existieren. Ein leerer Titel darf nicht fälschlich zum Fallbacknamen werden.
16. **210–229, wiederholtes Editieren/Placeholder:** Zweite Section umbenennen, zwischen zweiter und dritter wechseln und aktualisierte Werte laden. Placeholder muss Eingaben leeren und Submit deaktivieren. Ein künstliches Submit ohne Auswahl darf keine Section ändern. Optional entsteht `exercise2.png`.
17. **230–237, kein Reload/keine vorgetäuschte Sicherheit:** URL bleibt nach Submit gleich. Ein harmloser eingefügter HTML-Button setzt per Inline-Handler seinen eigenen Text. Dass der Klick wirkt, dokumentiert ausdrücklich die nicht vorhandene HTML-Bereinigung.
18. **238, Fehlerkanal:** Die während beider Seiten gesammelten unbehandelten JavaScriptfehler müssen eine leere Liste sein. Ein Netzwerkfehler des absichtlich blockierten Logos ist kein JavaScript-Seitenfehler und wird nicht als erfolgreiche Logo-Prüfung ausgegeben.

### Grenzen der Prüfaussage

Die Tests sind eine reale, deterministische Chromium-Prüfung, keine Behauptung über jede Browser-/Gerätekombination. Sie prüfen die in der Angabe genannten Zustände und zusätzliche Randfälle, nicht Internet-Erreichbarkeit des alten Logos/Links oder Barrierefreiheit mit einem echten Screenreader. Zwei Screenshots wurden zusätzlich visuell geprüft: beim Spiel ist die Reihenfolge korrekt und die Bedienung mittig; beim Editor folgt das benutzbare Formular den Sections. Die ungestylte Vorlagenoptik und das im Offline-Test nicht geladene externe Logo wurden bewusst nicht durch unerlaubte HTML-/Assetänderungen kaschiert.

## 8. Selbstkontrolle vor der Abgabe

Fabio sollte ohne Blick in diese Erklärung beantworten können:

1. Warum ist das Feld mit 1 vorbelegt, aber die Versuchszahl noch 0?
2. Warum braucht es die Prüfung sowohl in `updateCheck` als auch in `checkGuess`?
3. Welche drei Dinge verhindert `playing=false` nach dem dritten Versuch?
4. Warum kommt die Trefferprüfung vor der Prüfung des Versuchslimits?
5. Warum entfernt Reset die Divs, anstatt sie nur zu leeren?
6. Warum benötigt das Skript `defer` und die CSS-Datei eine `[hidden]`-Regel?
7. Was wäre falsch an `Number(select.value)` ohne vorherige Leerwertprüfung?
8. Warum muss die h1 nach `innerHTML` erneut gesucht werden?
9. Warum wird die Titel-Eingabe erst nach dem HTML eingesetzt?
10. Worin unterscheiden sich `value`, `textContent` und `innerHTML` und welches davon kann aktives HTML erzeugen?
11. Warum bleibt eine Section nach Umbenennung dieselbe Section?
12. Welche Dateien/Regeln/Tests müssen zusammen angepasst werden, wenn Zahlenbereich oder Versuchslimit geändert werden?

Verständnis wird durch diese Datei nicht automatisch nachgewiesen. Erst nach eigenem Durchgehen, Ausprobieren und Erklären kann Fabio den persönlichen Verständnisteil des KI-Berichts wahrheitsgemäß ausfüllen.
