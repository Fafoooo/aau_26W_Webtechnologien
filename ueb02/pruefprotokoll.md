# Prüfprotokoll – Übungsblatt 2

## Tatsächlich ausgeführte automatisierte Prüfungen

- `node ueb02/tests_2_5.cjs` → `ALL 36 TESTS PASSED`, Exitcode 0.
- `node ueb02/tests_3.cjs` → beide Prüfgruppen bestanden, 16 tatsächliche Konsolenaufrufe und vollständiger Original-DOM-Baum; Exitcode 0.
- `node ueb02/tests_4_6.cjs` → `BESTANDEN: 28 Testgruppen (Chromium, file://, ohne Server).`, Exitcode 0.
- Browser: Chromium 148.0.7778.96. Andere Browser nicht getestet.

Die Suiten wurden nach Entfernen umgebungsspezifischer absoluter Installationspfade erneut erfolgreich ausgeführt. Die Browserprodukte benötigen keine Testbibliothek.

## Unabhängige zweite Prüfung

Eine getrennte Instanz erhielt die Original-PDF, das Originalmaterial und die fertigen Lösungen ohne die vorherige Hauptanalyse. Sie las Code und Antworttexte, führte die 36 Spiel-/Ereignistests und 28 Glas-/Galerietestgruppen erneut erfolgreich aus und prüfte alle 16 DOM-Ausgaben mit einem eigenen schreibfreien Browsertest. Byteidentität und Original-JavaScriptpräfixe bestätigt. Keine konkreten Funktionsfehler in Aufgaben 2–6 gefunden.

Befunde und Bearbeitung:
- Persönliches Quiz und Punkte-Screenshot fehlen: bleibt ausdrücklich offen in `ue2.1/antwort.md`, README, Erklärung und KI-Bericht.
- KI-Bericht fehlte zum Reviewzeitpunkt: anschließend wurde die tatsächliche LaTeX-Quelle erstellt und als dreiseitiges PDF zweimal erfolgreich gebaut (Exitcode 0). Seitenzahl, Text und erste/letzte Seite wurden geprüft; der Abschnitt zur eigenen Bearbeitung ist leer.
- Abschließende Artefaktprüfung erfolgreich: Original-PDF und alle Zusatzdateien bytegleich zur Quelle, sechs Antwortdateien vorhanden, alle JavaScriptdateien syntaktisch geprüft, Teilerklärungen vollständig in der Gesamterklärung enthalten, keine Hilfsdateien oder privaten Installationspfade im Ausgabeordner.
- Veraltete Beschreibungen von absoluten Testfallbacks und verschobene Zeilenblöcke: in den Teil-Erklärungen und der zusammengeführten Erklärung korrigiert; aktuelle Tests verwenden normale Modulauflösung oder explizite Umgebungsvariablen.
- Veränderliches `let keepPlaying` statt der widersprüchlichen Konstantenvorgabe: sachlich begründet, kein Laufzeitfehler.

## Bewusste Grenzen

Aufgabe 1 kann nicht als lokale Codeaufgabe erledigt werden. Kein Quiz wurde gestartet, nichts in Moodle abgegeben und kein Screenshot erfunden. Das vorgegebene Glasformular wurde niemals abgeschickt. Die Galerie erweitert nur den geladenen Originalaufbau; dynamisch nachgeladene Thumbnails sind nicht zugesichert. Das ursprüngliche `innerHTML`-Risiko wurde nicht als behoben ausgegeben. Tests verwenden ausschließlich fiktive Kontaktdaten.
