# Übungsblatt 5 — vollständige Schritt-für-Schritt-Erklärung

Die folgenden beiden Teile decken alle fünf Aufgaben sowie die Entwicklungs- und Berichtsdateien ab. Die Produktlösungen sind Plain JavaScript; die Browser-Testwerkzeuge sind davon getrennt. Vor einer eigenen Abgabe muss Fabio die Lösung selbst nachvollziehen und erklären können. Das wird hier nicht als bereits geschehen behauptet.

# Übungsblatt 5 — Schritt-für-Schritt-Erklärung zu Aufgaben 1–3

Diese Erklärung beschreibt den tatsächlichen Code und die automatisiert geprüften Browserbeobachtungen. Sie behauptet nicht, dass eine Person die Lösung bereits selbst nachvollzogen oder manuell getestet hat. Die englischen Abgabeantworten stehen jeweils in `ue5.1/antwort.md`, `ue5.2/antwort.md` und `ue5.3/antwort.md`.

## 0. Dateien öffnen und Zusammenhänge verstehen

| Datei | Zweck |
|---|---|
| `ue5.1/ex1.html` → `5_1.js` | Unveränderte Callback-Vorlage für Aufgabe 1. |
| `ue5.2/ex2.html` → `5_2.js` | Hauptlösung Aufgabe 2; ausschließlich `runTaskPromise` ergänzt. |
| `ue5.2/experiment-c/ex1.html` → `5_1.js` | Getrenntes Callback-Experiment für 2(c). |
| `ue5.2/experiment-c/ex2.html` → `5_2.js` | Getrenntes Promise-Experiment für 2(c), ohne konkurrierenden Listener zu entfernen. |
| `Angabe/files/ex3.html` → `5_3.js` | Unveränderte Ausgangsversion für Beobachtungen in 3(a). |
| `ue5.3/ex3.html` → `5_3.js` | Lösung 3(b), Promise-Kette. |
| `ue5.3/async/ex3.html` → `5_3.js` | Lösung 3(c), `async`/`await`. |
| `test_1_3.cjs` | Separates Entwicklungswerkzeug: echte Chromium-Tests, keine Produktabhängigkeit. |
| `testergebnis_1_3.md` | Zusammenfassung des tatsächlichen Testlaufs einschließlich Grenzen. |

Für Aufgaben 1–3 reicht das Öffnen der jeweiligen HTML-Datei im Browser. Anders als spätere Netzwerkaufgaben benötigen diese Seiten keinen Webserver. Die beiden Varianten von Aufgabe 3 werden absichtlich **nicht gleichzeitig** auf einer Seite geladen: Sonst würden sich Ausgaben und Alerts vermischen.

### Drei Grundbegriffe vorab

- **Callback:** Eine Funktion, die an eine andere Funktion/API übergeben und von dieser aufgerufen wird. Ein Callback muss nicht asynchron sein.
- **Promise:** Ein Objekt für genau einen zukünftigen Ausgang: zunächst `pending`, dann endgültig `fulfilled` oder `rejected`. Ein Promise ist weder selbst ein Thread noch ein automatisch abbrechbarer Vorgang.
- **Ereignisschleife und Microtasks:** Ein Klickhandler bzw. Timer läuft als Ereignisarbeit. Promise-Reaktionen werden nicht mitten in den aktuellen JavaScript-Aufruf geschoben, sondern später über die Microtask-Verarbeitung ausgeführt. Auch ein Timer mit Verzögerung null unterbricht den gerade laufenden Code nicht.

## 1. HTML für Aufgaben 1 und 2

Die Haupt-HTML-Dateien sind einschließlich Zeilenumbrüchen unveränderte Kopien. Auch die Experimentseiten verwenden die gelieferten HTML-Dateien; wegen ihrer relativen `src`-Angabe laden sie die JavaScript-Datei im jeweiligen Experimentordner.

Die folgenden Zeilen beziehen sich auf `ue5.1/ex1.html`; `ue5.2/ex2.html` hat dieselbe Struktur, aber Titel, Überschrift und Scriptnamen für Promises.

| Zeile(n) | Bedeutung |
|---|---|
| 1 | `<html lang="en">` legt Englisch als Dokumentensprache fest. Das ist passend zur Angabe und den englischen Beschriftungen. |
| 2–5 | Der Kopf enthält Titel und Script. Der Titel erscheint im Browsertab. |
| 4 | `src="5_1.js"` bzw. `src="5_2.js"` ist relativ zum HTML-Dokument. `defer="true"` enthält das boolesche Attribut `defer`: Entscheidend ist seine Anwesenheit, nicht der Text `true`. Ein externes klassisches Script wird erst nach dem Parsen des Dokuments ausgeführt. Daher sind die später notierten Buttons bei der Initialisierung bereits vorhanden. |
| 6–9 | Der sichtbare Dokumentkörper beginnt; die erste Überschrift beschreibt das Beispiel, die zweite bezeichnet Task A. |
| 10 | Ein `<input type="button">` wird durch `value="Start A"` beschriftet. `id="startA"` ist der eindeutige Schlüssel für JavaScript. |
| 11–12 | Dasselbe Prinzip für `cancelA` und `endA`. Noch steht hier kein `disabled`; das setzt der Konstruktor beim Scriptstart. |
| 13–19 | Ein zweiter Abschnitt mit den drei entsprechenden IDs für B. Beide Aufgaben erhalten eigene DOM-Elemente. |
| 21–25 | Der Abschnitt „Event Log“ enthält `id="eventLog"`. Beide Taskobjekte schreiben in dasselbe Element. |
| Rest | Schließende Tags und Leerraum enthalten keine zusätzliche Programmlogik. |

Die Vorlage enthält kein `meta charset`. Der JavaScript-Produktcode verwendet nur ASCII-Zeichen; die lesbaren Markdown-Erklärungen sind UTF-8. Die HTML-Dateien werden für diese Erklärung nicht nebenbei modernisiert. Auch die vorhandene Verwendung von `innerHTML` und die einfache Logstruktur bleiben erhalten.

## 2. Aufgabe 1: `ue5.1/5_1.js` vollständig nachvollziehen

### 2.1 Konstruktor und Zustand, Zeilen 2–22

**Zeile 4: `function task(taskLabel,evlog) {`**

Das ist eine normale Funktion, die mit `new` als Konstruktor aufgerufen wird. Der kleingeschriebene Name stammt aus der Vorlage. Bei `new task(...)` erzeugt JavaScript ein neues Objekt und bindet innerhalb des Konstruktors `this` an dieses Objekt.

**Zeilen 5–6: `this.label = taskLabel; this.evlog = evlog;`**

Die Parameter werden als Objektzustand gespeichert. A und B haben verschiedene Labels, erhalten aber dieselbe Referenz auf das Logelement. `this.evlog` ist also keine Kopie des HTML, sondern ein Verweis auf das lebende DOM-Element.

**Zeilen 7–9: die drei `getElementById`-Aufrufe**

`'start'+taskLabel` ergibt beim Label A die ID `startA`, entsprechend werden `cancelA` und `endA` gesucht. Für B entstehen die drei B-IDs. Die gefundenen Elemente werden gespeichert, damit spätere Klicks nicht erneut danach suchen müssen.

**Zeile 10: `this.counter = 0;`**

Dieser Zähler steuert später, dass End-/Cancel-Listener nur einmal registriert werden. Er ist weder eine Zeitmessung noch ein gemeinsamer Zähler aller Aufgaben. Jede Instanz hat ihren eigenen Zähler.

**Zeilen 14–19: Start-Listener mit drei Pfeilfunktionen**

```js
this.startButton.addEventListener('click',
    ()=> {runTask(this,
        ()=> { endTask(this)},
        ()=> { cancelTask(this)}
    )});
```

1. `addEventListener` registriert einen Callback für spätere Klicks; der Callback läuft nicht schon beim Registrieren.
2. Die äußere Pfeilfunktion ruft beim Klick `runTask` auf. Ihr `this` stammt lexikalisch aus dem Konstruktor und ist deshalb weiterhin das Taskobjekt.
3. Das erste Argument `this` ist der Task, dessen Zustand verändert werden soll.
4. Das zweite Argument ist eine **Funktion** für den erfolgreichen Abschluss. `endTask` läuft noch nicht.
5. Das dritte Argument ist eine **Funktion** für den Abbruch. Auch `cancelTask` läuft noch nicht.
6. Beide inneren Pfeilfunktionen behalten ebenfalls das Taskobjekt als `this`. Ihre späteren Aufrufumstände verändern diese Bindung nicht.

**Zeilen 20–21: End und Cancel deaktivieren**

Mit `disabled = true` kann man diese Buttons vor einem Start nicht normal bedienen. Start bleibt aktiviert. Die Oberfläche bildet den zulässigen Ablauf ab; sie ist keine allgemeine Absicherung gegen absichtliche programmatische Ereignisse.

### 2.2 Eine Aufgabe starten, Zeilen 24–35

**Zeile 24: `runTask(task, endCallback, cancelCallback)`**

`task` ist hier ein Parametername, keine neue Konstruktion. Die anderen beiden Parameter enthalten die übergebenen Funktionen. Weil `runTask` Funktionen entgegennimmt, ist es eine Funktion höherer Ordnung.

**Zeile 25: Logeintrag**

`task.evlog.innerHTML += ...` liest den bisherigen HTML-Inhalt und setzt ihn zusammen mit einem neuen `<pre>`-Block wieder ein. Das Label bezeichnet die Aufgabe, `started` das Ereignis und `new Date()` liefert den Zeitpunkt. `\t` ist ein Tabulator, `\n` ein Zeilenumbruch. `<pre>` erhält deren Darstellung. Es wird keine Laufzeit berechnet. Da die Labels in dieser Vorlage fest A/B sind, stammt hier kein beliebiger Benutzertext aus einem Formular. Für unkontrollierten Text wäre `innerHTML` aus Sicherheitsgründen nicht die geeignete Standardwahl.

**Zeilen 26–28: aktiver Zustand**

Start wird deaktiviert, End und Cancel werden aktiviert. Nun kann der Benutzer genau diese laufende Aufgabe beenden oder abbrechen. Die andere Aufgabe wird dadurch nicht verändert.

**Zeile 30: `if (task.counter === 0)`**

`===` vergleicht ohne Typumwandlung. Nur der erste Start dieser Instanz registriert die beiden weiteren Eventlistener. Nachfolgende Starts benutzen die schon vorhandenen Listener. Ohne diese Bedingung würden zusätzliche Listener bei jedem Start denselben Klick mehrfach protokollieren.

**Zeile 31: End-Listener**

Beim End-Klick ruft die registrierte Pfeilfunktion `endCallback(task)` auf. Das Argument `task` wird tatsächlich übergeben; der innere Callback aus dem Konstruktor hat aber keine Parameter und ignoriert es. Er verwendet stattdessen sein eingefangenes `this` und ruft `endTask(this)` auf. Das ist eine Besonderheit der gelieferten Implementierung, keine Notwendigkeit des Callback-Prinzips.

Die Zuweisung an `task.endListener` speichert **nicht** die Listenerfunktion: `addEventListener` liefert `undefined`. Die Registrierung funktioniert trotzdem, weil der Browser die Funktion intern hält. Wollte man sie später entfernen, müsste man die Callbackfunktion selbst speichern und genau diese Referenz an `removeEventListener` übergeben.

**Zeile 32: Cancel-Listener**

Das ist derselbe Ablauf für `cancelCallback(task)`. Auch `task.cancelListener` erhält nur `undefined`.

**Zeile 34: `task.counter++`**

Nach jedem Start wird der instanzeigene Zähler erhöht. Dadurch gilt die Erstregistrierungsbedingung danach nicht mehr. Die Listener behalten über ihre Closures die Callbacks vom ersten Start, die aber unverändert dieselbe Taskinstanz ansprechen.

### 2.3 Beenden, Abbrechen und Initialisieren

**`endTask`, Zeilen 37–42:**

- Zeilen 38–39 deaktivieren End und Cancel.
- Zeile 40 aktiviert Start für einen späteren neuen Durchlauf.
- Zeile 41 protokolliert `ended` mit dem aktuellen Zeitpunkt; der zusätzliche Tabulator dient nur der Ausrichtung.

**`cancelTask`, Zeilen 44–49:**

- Zeilen 45–47 stellen exakt denselben Buttonzustand wie nach dem normalen Ende her.
- Zeile 48 protokolliert statt `ended` das Wort `cancelled`.
- Dieser Callback-Abbruch ist eine UI-Aktion. Es gibt hier keinen Hintergrundprozess, der technisch gestoppt werden müsste.

**Initialisierung, Zeilen 52–54:**

- `var evlog = document.getElementById('eventLog')` findet das gemeinsame Log.
- `new task('A',evlog)` erstellt und initialisiert A.
- `new task('B',evlog)` erstellt unabhängig davon B.

Man kann also A starten, B starten, B abbrechen und A beenden; das gemeinsame Log zeigt die tatsächliche Klickreihenfolge. Die manuellen Tätigkeiten dürfen sich zeitlich überlappen. Daraus folgt nicht, dass die JavaScript-Handler gleichzeitig auf mehreren Threads laufen.

### 2.4 Callback und Funktion höherer Ordnung

`runTask` und `addEventListener` sind höherer Ordnung, weil sie Funktionen entgegennehmen. Die an sie übergebenen Funktionen spielen die Rolle von Callbacks. Ein Begriff beschreibt also die empfangende Funktion, der andere die übergebene Funktion in ihrer Verwendung. Ein synchroner `forEach`-Callback zeigt, dass „Callback“ nicht automatisch „asynchron“ bedeutet.

Im konkreten Code sind Callbacks: die Start-Pfeilfunktion, die beiden an `runTask` übergebenen Pfeilfunktionen und die beiden in `runTask` registrierten Event-Pfeilfunktionen. `endTask` und `cancelTask` werden in dieser Vorlage aus Callbacks heraus aufgerufen, nicht direkt als Funktionsargumente weitergereicht.

### 2.5 Warum eine normale Funktion nicht einfach austauschbar ist

Eine Pfeilfunktion hat kein eigenes `this`. Eine gewöhnliche Funktion bekommt `this` dagegen nach der Art ihres Aufrufs. Beim DOM-Listener setzt der Browser den Receiver auf das Element, an dem der Listener registriert ist.

Wird die **äußere** Start-Pfeilfunktion durch `function () { ... }` ersetzt, ist `this` beim Klick der Start-Input. `runTask(this, ...)` erhält dann diesen Input statt des Taskobjekts. Der erste Zugriff lautet sinngemäß `startInput.evlog.innerHTML`. `startInput.evlog` existiert nicht. Der echte Chromium-Test ergab:

```text
Cannot read properties of undefined (reading 'innerHTML')
```

Es gibt noch keinen `started`-Eintrag und die Zustandsänderungen werden nicht erreicht. Ersetzt man alle Pfeile, ist das ebenfalls der **erste** Fehler; spätere hypothetische Fehler erklären nicht das zuerst beobachtete Verhalten.

Lässt man den äußeren Pfeil stehen und ersetzt **nur den inneren End-Callback**, wird zunächst richtig gestartet. Später ruft `endCallback(task)` die normale Funktion jedoch ohne Receiver auf. Das Argument `task` bindet nicht `this`! Im nicht-strikten klassischen Script ist dieses `this` dann `window`; bei strengem Code wäre es `undefined`. `endTask(window)` hat keinen gültigen `endButton`. Separat wurde tatsächlich gemessen:

```text
Cannot set properties of undefined (setting 'disabled')
```

Das ist kein allgemeines Verbot gewöhnlicher Funktionen. Mit einer ausdrücklich gespeicherten Taskreferenz, passenden Parametern oder `.bind(this)` wäre eine andere korrekte Konstruktion möglich. Die Vorlage wird für diese Erklärungsaufgabe aber exakt erhalten.

## 3. Aufgabe 2: `ue5.2/5_2.js`

### 3.1 Was gleich bleibt und was der Konstruktor anders macht

Zeilen 3–9 entsprechen dem Zustandsaufbau aus Aufgabe 1: Label, Logreferenz, drei Buttons, ursprünglicher Zähler. Der Zähler bleibt aufgrund der Änderungsbeschränkung erhalten, wird von der Promise-Lösung aber nicht benutzt. Zeilen 20–21 deaktivieren anfangs End und Cancel.

Der wichtige Ersatz steht in Zeilen 12–18:

```js
()=> { runTaskPromise(this).then(
    () => {endTask(this)}
).catch(
    () => {cancelTask(this)}
)
}
```

- `runTaskPromise(this)` wird beim Start sofort aufgerufen. Es muss ein Promise zurückgeben; `undefined.then(...)` wäre ein Fehler.
- `.then(...)` registriert die erfolgreiche Reaktion. Das Taskobjekt bleibt dank Pfeilfunktion erhalten.
- `.then(...)` liefert seinerseits ein neues Promise zurück, an dem `.catch(...)` hängt.
- Bei einem Cancel wird das ursprüngliche Promise rejected; die Ablehnung läuft durch das `.then` ohne Rejection-Handler weiter zum `.catch`.
- Bei End wird `endTask` als Promise-Reaktion aufgerufen. Anders als beim direkten Callback läuft diese Reaktion nicht synchron innerhalb des Klickcallbacks, sondern als Microtask danach.
- Das `.catch` fängt auch einen etwaigen Fehler aus `endTask` ab. Der unveränderte Konstruktor würde auch diesen als Abbruch behandeln. Das ist eine Eigenschaft des vorgegebenen Codes, nicht eine hier zusätzlich entworfene Fehlerstrategie.

### 3.2 `runTaskPromise`, jede neue nichttriviale Zeile

**Zeilen 25–28:** Das Startlog und die Buttonumschaltung sind aus der Vorlage übernommen. Sie laufen synchron beim Start.

**Zeile 31: `return new Promise((resolve, reject) => {`**

`new Promise` ruft den Executor unmittelbar auf und übergibt ihm zwei Funktionen. `resolve` steht hier für den erfolgreichen Abschluss ohne Ergebniswert, `reject` für Abbruch ohne Fehlergrund. `return` gibt das neue Promise an den Konstruktor zurück. Jeder Start erhält ein neues Promise und neue lokale Funktionsobjekte.

**Zeilen 32–35: `cleanup`**

```js
function cleanup() {
    task.endButton.removeEventListener('click', onEnd);
    task.cancelButton.removeEventListener('click', onCancel);
}
```

Beide Listener werden entfernt, unabhängig davon, welcher Button zuerst gewinnt. `onEnd` und `onCancel` sind Funktionsdeklarationen im Executor und innerhalb dieses Gültigkeitsbereichs verfügbar. Entfernen funktioniert nur mit derselben Funktionsreferenz wie beim Registrieren; ein neu formulierter anonymer Callback wäre ein anderes Objekt.

Die normalen lokalen Funktionen verwenden kein dynamisches `this`, sondern die geschlossenen Variablen `task`, `resolve`, `reject` und `cleanup`. Deshalb brauchen sie keine Pfeilsyntax und kein `.bind`.

**Zeilen 36–39: `onEnd`**

Zuerst entfernt `cleanup()` beide Listener. Danach erfüllt `resolve()` das Promise. Die spätere Konstruktor-Reaktion übernimmt `endTask` und damit Log und endgültigen UI-Zustand. Das sofortige Cleanup verhindert auch bei zwei künstlich synchron ausgelösten Events ein zweites Eingreifen desselben Durchlaufs.

**Zeilen 40–43: `onCancel`**

Analog werden zuerst beide Listener entfernt, danach wird das Promise mit `reject()` abgelehnt. Dass kein `Error`-Objekt übergeben wird, ist für diesen unveränderten Konstruktor ausreichend: Sein `.catch` ignoriert einen Fehlerparameter und verwendet nur das Taskobjekt.

**Zeilen 44–45: Listener registrieren**

Die benannten Funktionsobjekte werden an End und Cancel registriert. Der Executor endet; das Promise bleibt pending, bis einer der Klicks eintritt. Die nötigen Variablen bleiben durch Closures erreichbar.

**Zeilen 46–47:** Executor/Promisekonstruktion und Funktion enden. Das Startverfahren wartet nicht blockierend auf einen Klick.

Wichtig: Ein Promise entfernt keine DOM-Listener von selbst. Zwei Listener mit jeweils `{ once: true }` würden nur den tatsächlich angeklickten Listener entfernen; der andere bliebe bestehen. Für viele Start-/End-/Cancel-Zyklen ist das Entfernen **beider** Listener daher der entscheidende zusätzliche Schritt.

### 3.3 Der unveränderte Rest

- `endTask`, Zeilen 51–56, deaktiviert End und Cancel, aktiviert Start und protokolliert `ended`.
- `cancelTask`, Zeilen 58–63, stellt dieselben Buttonzustände her und protokolliert `cancelled`.
- Zeilen 66–68 suchen das Log und erzeugen A/B.

Alle diese Bytes und auch der gesamte Konstruktor sind unverändert. Nur der Rumpf von `runTaskPromise` wurde ergänzt. Der Test vergleicht dazu die Bytebereiche vor und nach dieser Funktion mit der Angabe, nicht bloß eine sichtbare Codeähnlichkeit.

### 3.4 Aufgabe 2(c): die Experimentdateien bewusst getrennt behandeln

#### `ue5.2/experiment-c/5_1.js`

Gegenüber dem originalen Callbackcode ist ausschließlich in `cancelTask` die Zeile `task.endButton.disabled = false;` gesetzt. Nach Start → Cancel ist End also noch bedienbar. Sein dauerhafter Listener ruft den normalen End-Callback auf. Ergebnis:

```text
A started
A cancelled
A ended
```

`endTask` deaktiviert End dann wieder. Der Callbackmechanismus hat kein eingebautes Gesetz „entweder Cancel oder Ende, aber nur einmal“. Die UI der Hauptvorlage verhindert das normalerweise durch Deaktivierung; der Versuch hebt gerade diese Sperre auf.

#### `ue5.2/experiment-c/5_2.js`

Diese Datei ist **nicht** die eingeschränkte Hauptlösung. Im Experiment stehen in Zeilen 31–34 direkte Listener:

```js
return new Promise((resolve, reject) => {
    task.endButton.addEventListener('click', () => { resolve(); }, { once: true });
    task.cancelButton.addEventListener('click', () => { reject(); }, { once: true });
});
```

Jeder Listener wird nach seiner eigenen Ausführung entfernt. Der konkurrierende andere Listener bleibt absichtlich bestehen. Außerdem lässt Zeile 47 in `cancelTask` den End-Button aktiviert.

Damit ist die Beobachtung aussagekräftig: Cancel ruft `reject()` auf; der folgende End-Klick erreicht **wirklich** den verbliebenen Callback und ruft `resolve()` auf. Das Testinstrument hat die Versuche `reject`, dann `resolve` aufgezeichnet. Das Promise war aber schon endgültig rejected. Der zweite Versuch ändert daran nichts; `endTask` läuft nicht und es kommt kein `ended`-Eintrag:

```text
A started
A cancelled
```

End bleibt dabei sogar aktiviert, weil nur `endTask` es wieder deaktivieren würde. Die Erfüllung des von `.catch` zurückgegebenen **anderen** Promises ändert das bereits abgelehnte ursprüngliche Promise nicht.

Warum nicht einfach dieselbe Demonstration mit dem aufgeräumten Hauptcode? Dort wäre nach Cancel schon der End-Listener entfernt. „Es erscheint kein ended“ könnte dann bloß am Cleanup liegen. Der getrennte Versuch zeigt gezielt die Einmaligkeit der Promise-Zustandsänderung. Er ist kein Muster für die dauerhafte Listenerverwaltung der Hauptlösung. Zwischen Cancel und End darf man für diesen Vergleich **nicht erneut Start klicken**: Ein neuer Start erzeugt ein neues Promise, das selbstverständlich wieder erfolgreich enden darf.

## 4. Aufgabe 3: HTML und unveränderte Hilfsfunktionen

### 4.1 `ue5.3/ex3.html` und `ue5.3/async/ex3.html`

Beide HTML-Dateien stimmen bytegenau mit der Angabe überein. Zeile 3 setzt den Titel, Zeile 4 lädt `5_3.js` relativ zum jeweiligen Ordner mit `defer`. Zeile 7 zeigt die Überschrift, Zeilen 8–14 enthalten den Abschnitt mit dem Absatz `eventLog` in Zeile 10. Die unterschiedlichen Rechenvarianten entstehen ausschließlich durch die unterschiedlichen gleichnamigen JS-Dateien im jeweiligen Ordner. Eine zweite Variante wird nicht zusätzlich in derselben Seite ausgeführt.

### 4.2 `delayedCalc` ist in beiden Lösungen identisch, Zeilen 3–23

**Zeile 3:** `const eventLog = document.getElementById('eventLog');` speichert die DOM-Referenz. `const` verhindert eine neue Zuweisung an die Variable, nicht das Verändern des DOM-Elements.

**Zeile 5:** `delayedCalc(a,b)` akzeptiert zwei Operanden. Sein Rückgabewert ist ein Promise, nicht sofort eine Summe.

**Zeilen 6–7:** Der Promise-Executor startet **synchron**. Allein ein `new Promise(...)` verlegt Code noch nicht in einen späteren Thread oder Timer.

**Zeile 8:** Nur `a > b` führt in den Erfolgszweig. Gleichheit wird ebenfalls abgelehnt. Die vorhandene Fehlermeldung beschreibt diese Gleichheit ungenau; wegen der Aufgabenbeschränkung bleibt sie unverändert.

**Zeilen 9–15:** `setTimeout` registriert einen späteren Callback. Der dritte interessante Ausdruck ist der zweite Parameter von `setTimeout`: `Math.random()` liefert eine Zufallszahl ab null und unter eins, die mit `2000` skaliert und von `Math.floor` abgerundet wird. Dies ist eine zufällige Millisekundenwartezeit unter 2000, aber keine Zusage eines exakten Ausführungszeitpunkts. Die Ereignisschleife kann den Callback erst bearbeiten, wenn sie dazu kommt.

**Zeile 11:** Erst im Timer wird `c = a+b` berechnet. Die Operanden bleiben durch die Closure erhalten.

**Zeile 12:** Die Gleichung wird im Log ausgegeben; `<br>` erzeugt die nächste Zeile. Die Leerzeichen stammen aus der Originalformatierung.

**Zeile 13:** `resolve(c)` erfüllt das Promise mit der berechneten Summe. Genau dieses `c` muss der nachfolgende Schritt als neuen ersten Operanden erhalten.

**Zeilen 17–20:** Bei `a <= b` gibt es keinen Timer. `reject('error: b larger than a')` lehnt das Promise sofort ab; die nächste Zeile schreibt sofort `rejected`. `reject` ist kein `throw`, das den restlichen Executor überspringt. Deshalb wird diese Logzeile auch nach dem Rejection-Aufruf erreicht.

**Zeilen 21–22:** Nach dem Executor wird `promise` zurückgegeben. Im Fehlerzweig ist es zu diesem Zeitpunkt schon rejected; im Timerzweig ist es zunächst pending.

**`handleError(error)`**, Zeilen 40–42 der `.then`-Variante bzw. 46–48 der `async`-Variante, zeigt mit `alert(error)` den empfangenen Ablehnungsgrund. Auch diese Funktion bleibt unverändert. Funktionsdeklarationen stehen im jeweiligen Script auch vor ihrer textlichen Deklarationsposition zur Verfügung; der frühere `.catch`-Aufruf ist daher zulässig.

### 4.3 Aufgabe 3(a): Ausgangsversion und tatsächliche Refreshes

Die unveränderte `Angabe/files/5_3.js` startet vier voneinander unabhängige Aufrufe:

| Aufruf | Sofortige Wirkung | Spätere Wirkung |
|---|---|---|
| `delayedCalc(5,3)` | Timer registrieren | `5 + 3 = 8` ausgeben und erfüllen. |
| `delayedCalc(7,14)` | Ablehnen und `rejected` ausgeben | Unbehandeltes Rejection melden. |
| `delayedCalc(23,25)` | Ablehnen und `rejected` ausgeben | Unbehandeltes Rejection melden. |
| `delayedCalc(1000,1)` | Zweiten Timer registrieren | `1000 + 1 = 1001` ausgeben und erfüllen. |

Die beiden `rejected`-Zeilen stehen immer zuerst. Die zwei erfolgreichen Gleichungen können danach ihre Reihenfolge tauschen, weil ihre Timer unabhängig zufällig verzögert werden. Auch ein Null-Timer läuft erst nach dem synchronen Code.

Zehn echte Seitenladungen mit der unveränderten Zufallsquelle zeigten im erfolgreichen Testlauf **beide** Reihenfolgen. Außerdem wurden insgesamt 20 unbehandelte Rejection-Fehler über Playwrights `pageerror` beobachtet. Die Originalaufrufe hängen weder `.catch` an noch verwenden sie `await` mit `try/catch`; die bloße Definition von `handleError` behandelt keinen Fehler.

Die Testausgabe normalisiert den Inhalt nicht weg: Für Chromium/Playwright ist lediglich berücksichtigt, dass der als String abgelehnte Wert `error: b larger than a` als Fehlermeldung `b larger than a` gemeldet werden kann. Der String im Produktcode wird nicht verändert. Auf `file:`-Seiten ist der JavaScript-DOM-Event `unhandledrejection` nicht in jeder Konstellation ein gleichwertiger Beobachtungskanal; für den eigentlichen Browsernachweis benutzt der Test die tatsächlich gelieferten `pageerror`-Meldungen.

## 5. Aufgabe 3(b): `ue5.3/5_3.js`, Zeilen 29–37

```js
delayedCalc(5,3)
    .then(result => delayedCalc(result,7))
    .then(result => delayedCalc(result,14))
    .then(result => delayedCalc(result,23))
    .then(result => delayedCalc(result,25))
    .then(result => delayedCalc(result,1000))
    .then(result => delayedCalc(result,1))
    .catch(error => handleError(error));
```

1. **Zeile 30:** Der erste Aufruf startet mit 5 und 3. Er liefert das erste Promise.
2. **Zeile 31:** `.then` erhält beim Erfolg dessen tatsächliches Ergebnis, hier 8. Die Pfeilfunktion ruft also `delayedCalc(8,7)` auf. Weil ein Ausdruck ohne `{...}` verwendet wird, ist der Rückgabewert **implizit zurückgegeben**. Das nächste Kettenpromise wartet auf dieses neue Promise.
3. **Zeile 32:** Erst nach dessen Erfüllung erhält der nächste Callback 15 und startet `(15,14)`.
4. **Zeile 33:** Der nächste echte Wert ist 29; daraus entsteht `(29,23)`.
5. **Zeile 34:** Mit dem erhaltenen Wert 52 wird `(52,25)` gestartet.
6. **Zeile 35:** Nun wird mit 77 `(77,1000)` aufgerufen. Der unveränderte Vergleich `a > b` ist falsch; es wird synchron `rejected` geschrieben und ein abgelehntes Promise zurückgegeben.
7. **Zeile 36:** Dieser Erfolgs-Callback ist korrekt im gewünschten Rechenprogramm vorhanden, wird aber wegen der vorherigen Ablehnung **nicht aufgerufen**. Es findet kein `delayedCalc(...,1)` mehr statt.
8. **Zeile 37:** `.catch` bekommt den Ablehnungsgrund und gibt ihn an `handleError` weiter. Es erscheint ein Alert. Die Ablehnung ist behandelt; es gibt in der fertigen Lösung kein unbehandeltes Rejection.

Der häufige Fehler wäre eine Blockfunktion ohne `return`:

```js
// Falsch für eine fortlaufende Kette:
.then(result => { delayedCalc(result,7); })
```

Sie würde `undefined` liefern, das innere Promise nicht mit der äußeren Kette verknüpfen und den Folgeschritt nicht korrekt mit der berechneten Summe fortsetzen. Im eingereichten Code wird jedes Zwischenpromise zurückgegeben. Zufällige Timer beeinflussen dadurch nur die Wartezeit, nicht mehr die Rechenreihenfolge.

## 6. Aufgabe 3(c): `ue5.3/async/5_3.js`, Zeilen 29–43

**Zeile 29: `async function calculateSequence()`**

Eine `async`-Funktion liefert beim Aufruf immer ein Promise. In ihrem Körper ist `await` erlaubt. Sie startet synchron und wird am jeweiligen noch nicht erfüllten `await` angehalten, ohne den Browser zu blockieren.

**Zeile 30: `try {`**

Der gesamte Ablauf liegt im Fehlerbehandlungsbereich. Eine von `await` weitergereichte Ablehnung wird hier gefangen.

**Zeile 31: `let result = await delayedCalc(5,3);`**

`delayedCalc` wird sofort aufgerufen; `await` wartet auf sein Promise und setzt danach `result` auf dessen Erfüllungswert. `let` wird verwendet, weil `result` im weiteren Ablauf erneut zugewiesen wird.

**Zeilen 32–35: vier aufeinanderfolgende Zuweisungen**

Jede Zeile verwendet den gerade erhaltenen Wert als ersten Operanden, startet genau einen neuen Rechenschritt und wartet auf dessen Abschluss. Der nächste Schritt wird nicht parallel vorweg gestartet. Das entspricht den vier ersten `.then`-Callbacks.

**Zeile 36: `result = await delayedCalc(result,1000);`**

Mit `result` gleich 77 wird das Promise abgelehnt. `await` setzt den normalen Ablauf nicht mit einem Fehlerstring als Zahlenwert fort, sondern verhält sich hier wie ein geworfener Ablehnungsgrund. Es springt zum `catch`.

**Zeile 37: letzter `+1`-Schritt**

Die Zeile ist enthalten, wird aber wegen des Sprungs zum `catch` nicht erreicht. Eine vollständige numerische Endsumme ist unter der ausdrücklich unveränderten `delayedCalc`-Bedingung nicht das Ergebnis dieser Aufgabenstellung.

**Zeilen 38–39:** `catch (error)` erhält den Grund und ruft `handleError(error)` auf. Danach ist der Fehler behandelt. Das von `calculateSequence` zurückgegebene Promise kann normal ohne Ergebniswert enden.

**Zeile 43: `calculateSequence();`**

Eine Funktionsdefinition allein würde noch nichts rechnen. Dieser Aufruf startet die einmalige Berechnung. Eine zusätzliche äußere `.catch`-Kette ist für diese konkret intern behandelte Ablehnung nicht erforderlich. Es wird keine zweite Variante zusätzlich gestartet.

### Gemeinsame Browserausgabe beider Lösungen

```text
5 + 3 = 8
8 + 7 = 15
15 + 14 = 29
29 + 23 = 52
52 + 25 = 77
rejected
```

Dazu kommt genau ein Alert mit `error: b larger than a`. Es gibt keine Additionsausgabe für den 1000-Schritt, weil dieser bereits vor dem Berechnen ablehnt. Der letzte `+1`-Schritt wird nicht einmal aufgerufen.

## 7. `test_1_3.cjs`: reproduzierbare Browserprüfung verstehen

### 7.1 Installation und Aufruf ohne Produktbibliothek

Die abzugebenden HTML-/JS-Dateien benutzen ausschließlich Browser-APIs. Playwright ist nur ein Werkzeug für den Entwicklungsnachweis. Es steht nicht in den Produktordnern und wird nicht von einer HTML-Datei geladen.

Beispiel mit frei wählbarem externem Werkzeugordner:

```sh
npm install --prefix /path/to/dev-tools playwright
/path/to/dev-tools/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/path/to/dev-tools/node_modules/playwright node test_1_3.cjs
```

`/path/to/dev-tools` ist ein zu ersetzender Platzhalter, kein versteckter Installationspfad. Ist Playwright ohnehin per normalem Node-`require` erreichbar und sein Browser installiert, reicht `node test_1_3.cjs`. Bei einem separat vorhandenen Chromium kann zusätzlich `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium` gesetzt werden. Der Test funktioniert unabhängig vom Aufrufordner, weil er Pfade relativ zu `__dirname` bildet. Netzwerkzugriff ist bei der einmaligen Werkzeuginstallation nötig, nicht beim eigentlichen Test dieser lokalen Aufgaben.

### 7.2 Imports, Pfade und kleine Hilfsfunktionen

- `'use strict'` gilt nur für den Node-Testcode. Es verändert nicht die separat geladenen ursprünglichen Browserdateien und verfälscht deshalb nicht die `this`-Beobachtungen.
- `node:assert/strict` liefert harte Vergleiche, die bei Abweichungen mit Fehler abbrechen.
- `fs`, `path` und `pathToFileURL` lesen Quellen bzw. erzeugen richtige `file:`-URLs anstelle fehleranfälliger Stringverkettung.
- `createHash` berechnet den ausgegebenen SHA-256 der unveränderten Callbackdatei. Der Wert wird nicht von Hand geraten.
- `require(process.env.PLAYWRIGHT_MODULE || 'playwright')` erlaubt normale Modulauflösung oder einen ausdrücklich gesetzten Werkzeugpfad. Im Code steht kein privater absoluter Installationspfad.
- `read` liest `Buffer`, `text` decodiert bei Bedarf als UTF-8. Bytevergleiche verwenden ausdrücklich Buffer, damit auch CRLF-Zeilenumbrüche kontrolliert werden.
- `test(name, body)` wartet den jeweiligen Prüfabschnitt ab und erhöht den Erfolgszähler nur nach erfolgreicher Ausführung. `PASS` steht also nicht vor einer bloß geplanten Prüfung.
- `unchangedExcept` findet die Grenzen der erlaubten Änderungsregion und vergleicht Präfix und Suffix unverändert. So werden Konstruktor, Abschlussfunktionen und Initialisierung von Aufgabe 2 sowie die Hilfsfunktionen von Aufgabe 3 geschützt.

### 7.3 Browserinstrumente ohne Änderung der Hauptdateien

`trackListeners` umschließt im Test die DOM-Methoden `addEventListener` und `removeEventListener`. Nur die vier relevanten End-/Cancel-Buttons werden erfasst. `Set` speichert die tatsächlichen Funktionsreferenzen; `__active()` liefert ihre Anzahl. Für die Haupt-Promiselösung wird damit geprüft, dass bei laufender Aufgabe je ein End-/Cancel-Listener existiert und nach Ende oder Abbruch beide entfernt sind. Diese Hilfsinstrumentierung wertet nicht automatisch die Entfernung von `{ once: true }` aus; dafür wird sie im Experiment nicht als Nachweis verwendet.

`recordSettlements` umschließt nur im Experiment den Promise-Konstruktor: Aufrufe von `resolve` und `reject` werden protokolliert, danach an ein echtes natives Promise weitergereicht. Prototyp und statische Vererbung bleiben angebunden. Es wird kein Promise-Verhalten nachgebaut und kein Erfolg fingiert. Dadurch wird beobachtbar, dass das spätere `resolve` wirklich aufgerufen und vom bereits abgelehnten Promise ignoriert wird.

`state` liest die drei `disabled`-Eigenschaften in der Reihenfolge Start, End, Cancel. Zum Beispiel bedeutet `[false, true, true]`: Start erlaubt, Ende und Abbruch gesperrt. `log` liest den tatsächlich dargestellten Text, nicht eine erwartete JS-Zeichenkette.

### 7.4 Hauptablauf der Tests

1. **Quellenschutz:** Exakte Kopien und erlaubte Änderungsregionen werden geprüft, einschließlich der einzelnen Callbackänderung im Experiment.
2. **Chromium starten:** Der Test gibt die echte Version aus. `newContext` schafft einen isolierten Browserkontext.
3. **`open`:** Eine neue Seite registriert einen Fehlerbeobachter, setzt optionale Initialinstrumentierung vor dem Produktcode und lädt dann die wirkliche HTML-Datei über `file:`.
4. **Callback- und Promise-Hauptseiten:** Zunächst werden gesperrte Buttons überprüft. Danach laufen 12 A/B-Paare mit wechselnder Start- und Abschlussreihenfolge, teils End, teils Cancel. Der komplette Ereignisverlauf wird verglichen, nicht nur das Vorhandensein einzelner Wörter. Datumsangaben werden ebenfalls kontrolliert.
5. **Listener-Cleanup:** Bei jedem Promise-Durchlauf wird die Listeneranzahl während und nach dem Lauf geprüft. Künstlich erzwungene End-/Cancel-Events nach Abschluss dürfen keinen weiteren Logeintrag erzeugen. Normale Bedienbarkeit wird zuvor mit sichtbaren echten Klicks geprüft.
6. **`this`-Fehler:** Getrennte Browserfixtures ersetzen gezielt nur den äußeren bzw. inneren Callback durch eine normale Funktion und vergleichen Empfänger sowie tatsächlichen Chromiumfehler. Das geschieht nur im Test; `ue5.1/5_1.js` wird nicht verändert.
7. **Experiment 2(c):** Beide echten Experimentseiten durchlaufen Start → Cancel → End. Der Logvergleich und die aufgezeichneten Settlementversuche unterscheiden Callbackmehrfachaufruf von einmaliger Promise-Festlegung.
8. **Original 3(a):** Initiales Laden und neun echte Refreshes sammeln die tatsächliche Timerreihenfolge. Der Test fordert keine zufällige bestimmte Verteilung; er berichtet die wirklich beobachteten Varianten. So entsteht kein unnötig flüchtiger Zufallstest.
9. **Lösungen 3(b)/(c):** Beide echten Dateien laufen mit ihren echten unveränderten Zufallstimern. `waitForFunction` wartet auf den tatsächlichen Endzustand statt auf eine geschätzte fixe Pause. Der Alert wird vom Test erfasst und geschlossen. Die vollständigen sechs Ausgabezeilen, genau ein Alert und keine unerwarteten Seitenfehler sind Pflicht.
10. **Zusätzlicher Datenflussnachweis:** In eigenständigen Browserfixtures wird `delayedCalc` für die Aufzeichnung umschlossen, aber weiterhin die echte ursprüngliche Funktion ausgeführt. Die tatsächlichen Argumentpaare müssen bis `(77,1000)` passen. Ein Paar mit dem abschließenden Operanden 1 darf nicht auftauchen.
11. **Deterministische Ergänzung:** Zwei weitere Originalseiten erhalten nur für diesen Diagnosezweck kontrollierte Zufallswerte, sodass beide möglichen Timerreihenfolgen sicher abgedeckt werden. Das ersetzt nicht die vorherigen echten Refreshbeobachtungen.
12. **Aufräumen und Exitcode:** Ein `finally` schließt Browserkontext und Browser auch bei einem Fehler. Die oberste `.catch` gibt echte Fehler aus und setzt einen fehlerhaften Prozess-Exitcode. Nur bei vollständigem Erfolg erscheint `ALL 12 TEST GROUPS PASSED`.

### 7.5 Was der Nachweis kann und was nicht

Der tatsächliche Lauf verwendete Chromium 148.0.7778.96. Alle zwölf Gruppen waren erfolgreich. Pro Hauptseite wurden 24 Taskdurchläufe und 48 geordnete Logeinträge geprüft. Die absichtlich unveränderte Originalaufgabe 3(a) produziert die erwarteten unbehandelten Rejections; die fertigen Lösungen tun das nicht.

Das ist eine echte Headless-Browserprüfung, keine persönliche manuelle Studienleistung und kein Nachweis für Firefox, Safari oder jedes mögliche Browsersystem. Die Zufallsreihenfolge kann beim nächsten normalen Refresh anders sein; die feste Kettenreihenfolge und die Fehlerbehandlung dürfen sich nicht ändern. Übungen 4 und 5 sowie der gesonderte KI-Bericht gehören nicht zum Umfang dieser Datei.

## 8. Kurzer Verständnistest zur Vorbereitung auf die Besprechung

1. Warum verhindert ein Eventlistener allein nicht den mehrfachen Aufruf eines Callbacks?
2. Was ist beim DOM-Listener einer normalen Funktion `this`, und warum ändert ein übergebenes Argument diese Bindung nicht?
3. Warum muss die Haupt-Promiselösung zusätzlich zur einmaligen Promise-Festlegung Listener entfernen?
4. Warum beweist der getrennte Versuch mit `reject` und anschließendem tatsächlichem `resolve` mehr als ein bereits entfernter End-Listener?
5. Warum steht bei der Originalaufgabe 3 zweimal `rejected` vor jeder Timerrechnung?
6. Was bewirkt das implizite `return` einer knappen `.then`-Pfeilfunktion?
7. An welcher konkreten Zeile bzw. welchem Operandenpaar bricht jede Rechenvariante ab?
8. Warum ist `await` hier nicht gleichbedeutend mit „den gesamten Browser blockieren“?

Wer diese Fragen anhand der hier beschriebenen Zeilen beantworten und die Seiten selbst bedienen kann, kann die wesentlichen Entscheidungen erklären; dieser Text selbst ersetzt dieses eigene Nachvollziehen nicht.


---

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
