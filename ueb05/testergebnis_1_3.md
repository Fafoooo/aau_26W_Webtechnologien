# Testergebnis — Aufgaben 1–3

## Tatsächlicher erfolgreicher Lauf

- Testdatei: `test_1_3.cjs` (Node.js, Playwright als externes Entwicklungswerkzeug).
- Node.js: `v22.23.3`.
- Tatsächlich gestarteter Browser: **Chromium 148.0.7778.96**, headless.
- Seiten wurden als echte lokale `file:`-HTML-Seiten geöffnet; zusätzliche Diagnosefixtures wurden ausdrücklich getrennt ausgeführt.
- Prozess-Exitcode: **0**.
- Abschließende Testausgabe: **`ALL 12 TEST GROUPS PASSED`**.

## Geprüfte Ergebnisse

| Gruppe | Ergebnis |
|---|---|
| Originalschutz | Callback-JS und gelieferte HTML-Kopien bytegleich; bei Aufgabe 2 nur `runTaskPromise` geändert; `delayedCalc` und `handleError` beider Aufgabe-3-Lösungen unverändert. |
| Aufgabe 1, Hauptseite | 12 überlappende A/B-Paare, also 24 Taskdurchläufe mit 48 korrekt geordneten Logeinträgen; Ausgangszustand, aktive Buttons, beide Start-/Abschlussreihenfolgen und Wiederholung korrekt. |
| Aufgabe 2, Hauptseite | Dieselben 24 Taskdurchläufe und 48 Logeinträge; je aktiver Aufgabe genau ein End-/Cancel-Listener, danach beide entfernt; keine Wirkung erzwungener später Events. |
| Aufgabe 1(d), äußerer normaler Callback | Tatsächlich `this === startA`; Chromiumfehler `Cannot read properties of undefined (reading 'innerHTML')`. |
| Aufgabe 1(d), innerer normaler Callback | Tatsächlich `this === window` im nicht-strikten Browser-Quellscript; Chromiumfehler `Cannot set properties of undefined (setting 'disabled')`. |
| Aufgabe 2(c), Callbackexperiment | `A started → A cancelled → A ended`. |
| Aufgabe 2(c), Promiseexperiment | `A started → A cancelled`; tatsächlich protokollierte Settlementversuche `reject`, danach `resolve`; kein `ended`. Beide Experimentvarianten gehören zu einer gemeinsamen Testgruppe. |
| Original Aufgabe 3(a) | Zehn echte Seitenladungen einschließlich neun Refreshes; immer zuerst zwei synchrone `rejected`-Zeilen; beide möglichen Reihenfolgen der Timerrechnungen tatsächlich beobachtet; insgesamt 20 erwartete unbehandelte Rejection-Fehlermeldungen. |
| Aufgabe 3(b), echte Hauptseite | Exakt die sechs geforderten Logzeilen, einmal Alert `error: b larger than a`, keine unbehandelten Seitenfehler. |
| Aufgabe 3(c), echte Async-Seite | Identischer korrekter Log-/Alert-/Fehlerbefund. |
| Aufgabe 3(b)/(c), getrennte Tracefixtures | Tatsächliche Aufrufpaare jeweils `(5,3), (8,7), (15,14), (29,23), (52,25), (77,1000)`; der abschließende `+1`-Aufruf findet nicht statt. Jede Variante bildet eine eigene Testgruppe. |
| Original Aufgabe 3(a), Zusatzdiagnose | Beide zulässigen Timerreihenfolgen mit kontrollierten Zufallsextremen zusätzlich deterministisch geprüft. |

Gemeinsame Ausgabe beider fertigen Rechenvarianten:

```text
5 + 3 = 8
8 + 7 = 15
15 + 14 = 29
29 + 23 = 52
52 + 25 = 77
rejected
```

SHA-256 der bytegleich erhaltenen `ue5.1/5_1.js`:

```text
34c605c7bd15dfc38a76a9fe579d71b4f37d2eebcca1c6549459a811d78c3bc7
```

## Reproduzieren

Voraussetzung: Node.js und ein separat installiertes Playwright mit verfügbarem Chromium. Die Produktseiten selbst benötigen keine Bibliothek.

```sh
npm install --prefix /path/to/dev-tools playwright
/path/to/dev-tools/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/path/to/dev-tools/node_modules/playwright node test_1_3.cjs
```

Die Pfade sind Platzhalter für die eigene externe Werkzeuginstallation. Wenn Playwright normal auflösbar ist, reicht `node test_1_3.cjs`. Bei einem separat vorhandenen Browser kann zusätzlich `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium` gesetzt werden. Keine privaten Installationspfade sind im Test fest codiert.

## Grenzen und Besonderheiten

- Nur Chromium wurde tatsächlich ausgeführt, nicht Firefox, WebKit/Safari oder ein manueller GUI-Browserdurchgang.
- Die Originalseite 3(a) verursacht absichtlich unbehandelte Rejections; sie wurde nicht „repariert“, um einen künstlich fehlerfreien Ausgangszustand zu behaupten.
- Chromium/Playwright meldete deren Stringfehler als `b larger than a`; der Quellwert lautet unverändert `error: b larger than a`. Ein zunächst zu strikter Harnessvergleich wurde entsprechend korrigiert und danach vollständig erneut ausgeführt.
- Ein versuchsweiser DOM-`unhandledrejection`-Beobachter lieferte auf diesen `file:`-Seiten keine passenden Ereignisse. Der endgültige Test stützt sich auf die tatsächlich gelieferten Browser-`pageerror`-Meldungen. Das ist eine Harness-/Beobachtungskanalbesonderheit, kein hinzugefügter Fehler der Lösung.
- Die echten Zufallsläufe sind nicht auf eine bestimmte Verteilung festgelegt; sie berichten ihre realen Beobachtungen. Die ergänzende deterministische Diagnose ist separat ausgewiesen.
- Das isolierte Promiseexperiment 2(c) behält den konkurrierenden Listener absichtlich; die Hauptlösung entfernt beide Listener und ist die für wiederholte Abläufe bestimmte Variante.
- Es wird keine persönliche Eigenleistung oder bereits erfolgte menschliche Erklärung behauptet. Übungen 4/5 und der gesonderte KI-Bericht sind nicht Gegenstand dieses Nachweises.
