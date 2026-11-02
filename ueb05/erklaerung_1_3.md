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
