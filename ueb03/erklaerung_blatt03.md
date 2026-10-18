# Erklärung zu Assignment 3 – alle vier Aufgaben

Diese Lernhilfe erklärt die tatsächlich vorhandenen Dateien Schritt für Schritt. Sie wurde mit KI erstellt; eigenes Verständnis oder eine persönliche Bearbeitung durch Fabio werden nicht behauptet. Vor der Abgabe muss Fabio alle Funktionen nachvollziehen und live ändern können. Den eigenen Anteil trägt er selbst im KI-Bericht ein.

## Weg durch das Blatt

1. Aufgaben 3.1 und 3.2: Spielzustand, Eingabevalidierung, DOM-Aufbau und HTML-Editor.
2. Aufgaben 3.3 und 3.4: Ereignisweitergabe, Intervallsteuerung, Bildauswahl und positionsunabhängiges Puzzle.
3. Die jeweilige `antwort.md` enthält die knappe englische Antwort und die begründeten Auslegungen.
4. Der unabhängige Prüfbericht beschreibt die gesonderte Gegenprüfung. Die dort gefundene ungenaue Aussage über Quellbilder wurde vor dieser Zusammenführung korrigiert.

Die nachfolgenden Teile sind wortgleich mit den separat abgelegten Teil-Erklärungen. Zeilenangaben innerhalb der Texte beziehen sich auf die Produktdateien beziehungsweise Tests, nicht auf Zeilennummern dieser Markdown-Datei. Die geschützten Vorlagen und Bilddateien sind ebenfalls erläutert.

---

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


---

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
