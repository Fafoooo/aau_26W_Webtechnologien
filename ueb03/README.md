# Assignment 3 – Web-Technologien UE

KI-generierte Lösungen für alle vier Aufgaben. Die Verwendung vollständiger KI-Lösungen ist laut dokumentierter Kursfreigabe nur zulässig, wenn Fabio die Lösung vollständig versteht und erklären kann. Der Bericht behauptet keine persönliche Eigenleistung oder bereits erfolgtes Verständnis. Vor einer Abgabe: die Lernhilfe durcharbeiten und den Abschnitt „Eigene Bearbeitung“ im KI-Bericht selbst ausfüllen.

## Starten

Die folgenden Dateien direkt in einem Browser öffnen; die übrigen Dateien jeweils im gleichen Ordner belassen:

- Aufgabe 1: [ue3.1/index.html](ue3.1/index.html) – Zahlenratespiel, maximal drei Versuche.
- Aufgabe 2: [ue3.2/editable.html](ue3.2/editable.html) – Section auswählen, Überschrift/HTML bearbeiten und aktualisieren. Nur vertrauenswürdiges HTML eingeben; Änderungen existieren nur im aktuellen DOM, nicht auf der Festplatte.
- Aufgabe 3: [ue3.3/gallery.html](ue3.3/gallery.html) – Bild öffnen, previous/next oder play/pause, Sekundenfeld, exit.
- Aufgabe 4: [ue3.4/puzzle.html](ue3.4/puzzle.html) – Bild anklicken, Maus bewegen, Ziel anklicken. Belegte Ziele geben das vorige Bild zurück; gesetzte Bilder lassen sich erneut aufnehmen. Escape bricht die Auswahl ab.

Die Produktdateien benötigen keine Bibliotheken, Installation oder Server. Die englische Oberfläche folgt der englischen Angabe; die Lernhilfe ist auf Deutsch. Jede Aufgabe enthält eine `antwort.md` mit Umsetzung und begründeten Auslegungen.

## Dokumentation

- [angabe_blatt03.pdf](angabe_blatt03.pdf): vollständige Originalangabe.
- `Angabe/files/`: unveränderte zusätzliche Moodle-Dateien für Editor und Puzzle.
- [erklaerung_blatt03.md](erklaerung_blatt03.md): vollständige Schritt-für-Schritt-Lernhilfe für jede Datei; zusammengesetzt aus den beiden ebenfalls abgelegten Teil-Erklärungen.
- [ki-bericht_blatt03.pdf](ki-bericht_blatt03.pdf), `.tex`: ehrlicher KI-Bericht mit Ablauf, Prompt-Verlauf und freiem Abschnitt für Fabio.
- [pruefbericht_unabhaengig.md](pruefbericht_unabhaengig.md): unabhängige Zweitprüfung und dokumentierte Korrektur einer Formulierung der Lernhilfe.

## Tests reproduzieren

Nur die Tests brauchen Node.js, Playwright und Chromium. Playwright samt Browser außerhalb der Produktordner installieren. Bei regulärer Modulauflösung aus `ueb03/`:

```sh
node tests_1_2.cjs
node tests_3_4.cjs
```

Bei einer externen Installation `PLAYWRIGHT_MODULE` auf das dortige Playwright-Paket setzen; bei abweichendem Browserpfad `PLAYWRIGHT_CHROMIUM` auf die ausführbare Chromium-Datei setzen. Diese Umgebungsvariablen enthalten lokale Pfade, die nicht ins Repository gehören. Optional schreibt `TEST_SCREENSHOT_DIR` bei den ersten beiden Aufgaben Browserbilder.

Beide Tests wurden vom übergeordneten Bearbeitungslauf tatsächlich erneut ausgeführt: jeweils 18 bestandene Tests bzw. Prüfgruppen, keine JavaScript-Seitenfehler, Chromium 148.0.7778.96. Die unabhängige Zweitprüfung verwendete ein separates Skript und bestand 18 eigene Prüfgruppen. Zeittests nutzen die deterministische Browseruhr, keine Behauptung über exakte Echtzeit oder Hintergrundtab-Drosselung. Andere Browserfamilien wurden nicht geprüft.

Originaltreue wurde binär geprüft. Die Galerie stammt vollständig aus `../ueb02/ue2.6/`; das dortige JavaScript ist ein exaktes Byte-Präfix der erweiterten Version. Die Vorlage des Editors und des Puzzles ist jeweils nur um eine Scriptreferenz ergänzt. Relative Testpfade setzen die Repositorystruktur voraus; der jeweilige Produktordner läuft dagegen für sich.

Externe Verweise in den Originalvorlagen wurden nicht verändert. Tests blockieren externe HTTP(S)-Ressourcen, laden die lokalen Bilder aber tatsächlich. Das externe CSS-Logo und das bereits in der Vorlage fehlende Ziel `erat.html` werden dadurch nicht als verfügbare Zusatzdateien behauptet. Niemals wurde etwas in Moodle abgegeben.

## KI-Bericht neu bauen

Von `ueb03/` aus mit installiertem pdfLaTeX und deutscher Sprachunterstützung:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=/PFAD/ZUM/BUILDORDNER ki-bericht_blatt03.tex
```

Die entstandene PDF nach `ueb03/ki-bericht_blatt03.pdf` kopieren; Hilfsdateien im externen Buildordner belassen. Der ursprüngliche Bericht wurde tatsächlich mit pdfLaTeX gebaut und auf Seitenzahl sowie Textauszug geprüft.
