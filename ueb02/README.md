# Übungsblatt 2 – JavaScript und DOM

**Aufgabe 1 bleibt persönlich zu erledigen:** Moodle-Quiz absolvieren und echten Punkte-Screenshot in `ue2.1/` ergänzen. Es wurde nichts in Moodle abgegeben. Aufgaben 2–6 sind implementiert; der offene Quiz-Nachweis ist keine fertige Abgabe.

## Start ohne Installation

Die Seiten direkt im Browser öffnen:
- `ue2.2/index.html`: Zahlenratespiel mit Browserdialogen, drei Versuche.
- `ue2.3/ex3.html`: DOM-Ausgaben in der Entwicklerkonsole; `ue2.3/dom-skizze.svg` zeigt den vollständigen Originalbaum.
- `ue2.4/glassOrder.html`: Glaspreis. Alle erforderlichen Formulardaten ausfüllen, auch die Kontaktdaten; solange etwas fehlt, zeigt das Preisfeld `-`. **Keinen Submit-Button betätigen:** Die Vorlage hat eine `mailto:`-Formularaktion. Die Tests versenden nichts.
- `ue2.5/ex5.html`: Button klicken und Konsole ansehen. Nur die Button-Ausgabe wird protokolliert; ein direkter Klick auf die Div-Fläche zeigt weiterhin `outer`.
- `ue2.6/gallery.html`: Bild öffnen und previous/next verwenden; ein Klick außerhalb der Buttons schließt wie in der Vorlage.

## Unterlagen

- `angabe_blatt02.pdf`: vollständige Originalangabe (sechs Aufgaben).
- `Angabe/files/`: unveränderte zusätzliche Moodle-Dateien.
- `ue2.N/antwort.md`: Antworten und dokumentierte Entscheidungen pro Aufgabe.
- `erklaerung_blatt02.md`: zusammengeführte deutsche Erklärung für alle Dateien, inklusive Testcode und möglicher Live-Änderungen.
- `ki-bericht_blatt02.pdf` und `.tex`: tatsächlicher KI-/Werkzeug-/Prompt-Verlauf. Den Abschnitt „Eigene Bearbeitung“ erst nach echter Durchsicht selbst ausfüllen.
- `ue2.3/browser-ergebnis.json`, `dom-baum.txt`, `dom-skizze.svg`: gemessene DOM-Ausgabe und daraus generierte Originalskizze.

## Tests wiederholen

Nur die Tests benötigen Node und Playwright. Die gelösten Webseiten selbst sind reines JavaScript/CSS ohne Frameworks. Mit einem vorhandenen Node-/Playwright-Setup vom Repository-Hauptordner aus:

```sh
node ueb02/tests_2_5.cjs
node ueb02/tests_3.cjs
node ueb02/tests_4_6.cjs
```

Falls Playwright noch fehlt, kann es **außerhalb des Abgabeordners** als Testwerkzeug installiert werden, beispielsweise im Projekt-Hauptordner:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Alternativ können ein vorhandenes Modul über `PLAYWRIGHT_MODULE` bzw. `NODE_PATH` und ein vorhandener Browser über `PLAYWRIGHT_CHROMIUM` gewählt werden. `CHROMIUM_EXECUTABLE` wird zusätzlich vom Spiel-/Eventtest akzeptiert. Keine Testabhängigkeiten oder `node_modules` einreichen.

Die automatisierten Prüfungen decken 36 Spiel-/Eventtests, zwei DOM-Prüfgruppen und 28 Glas-/Galerie-Testgruppen ab. Alle wurden mit Chromium ausgeführt. Andere Browser wurden nicht geprüft. Fremde Flaggenbild-Hosts werden im DOM-Test blockiert; die URLs im Abgabe-HTML bleiben unverändert. Die DOM-Grafik beschreibt die Originaldatei ohne ergänztes Skript.

## Bewusste Entscheidungen

- Die Wiederholungsentscheidung des Spiels ist `let`, da sie nach jedem Durchlauf geändert wird; das Versuchslimit bleibt `const`.
- Ungültige Spiel-Eingaben zählen als Versuch. Bruchzahlen im Bereich sind nach der wörtlichen Vorgabe erlaubt; die geheime Zahl ist immer ganzzahlig.
- Beim Preis gilt die Gültigkeit des gesamten Formulars. Glasstärken werden von mm nach cm umgerechnet; Nullmaße sind nach dem vorgegebenen `min="0"` gültig.
- Bei Aufgabe 5 und 6 ist der Original-JavaScriptcode bytegenau als Präfix erhalten; Ergänzungen stehen ausschließlich dahinter. HTML, CSS und Bilder dieser Vorlagen sowie das Glas-HTML wurden nicht geändert.
- Die Galerie unterstützt beliebig viele **beim Laden vorhandene** Bilder im Vorlagenformat. Dynamisch erst später eingefügte Thumbnails waren nicht gefordert und erhalten vom Originalcode keine Listener. Die ursprüngliche `innerHTML`-Verwendung ist erhalten: Fremde, nicht vertrauenswürdige Bildbeschriftungen sollten deshalb nicht eingespeist werden.

Die empfohlenen Projektvorbereitungen: überlegen, welche Felder später per DOM ergänzt/gelöscht oder aktualisiert werden und wo `required`, Grenzen und Ereignisbehandlung gebraucht werden. Es wurde kein nicht vorhandenes eigenes Projekt oder eine persönliche Projektentscheidung erfunden.
