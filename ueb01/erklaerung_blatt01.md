# Erklaerung Blatt 01 – Web-Technologien

## ue1.1/antwort.md

Diese Datei beantwortet die HTTP-Fragen. Zuerst werden die gemessenen Werte fuer `www.aau.at` genannt: Anzahl der Requests, uebertragene Daten, Statuscode, Server, Ressourcentypen, langsamster Request und Cookies. Danach folgt dieselbe Struktur fuer `www.orf.at`. Anschliessend erklaert die Datei die Google-Suche: Beim Tippen entstehen Hintergrundrequests fuer Suchvorschlaege, die Seite wird nicht fuer jeden Buchstaben komplett neu geladen. Zum Schluss wird der Browsercache erklaert: Er speichert Ressourcen lokal, kann ueber die Browserdaten geloescht werden und wird beim Entwickeln oft deaktiviert, damit keine alten Dateien verwendet werden.

## ue1.2/antwort.md, ue1.2/index.html, ue1.2/mytest/index.html

`antwort.md` beschreibt die Apache-Installation, `httpd.conf`, `ServerRoot`, `DocumentRoot`, Virtual Hosts, `127.0.0.1`, `localhost`, `index.html` und das Verhalten eines Ordners ohne oder mit Indexdatei. `index.html` ist eine einfache Startseite mit `h1` und Absatz. `mytest/index.html` simuliert den Ordner `mytest`, damit beim Oeffnen des Ordners eine eigene Indexseite angezeigt wird.

## ue1.3/index.html

Die Datei ist bewusst HTML-only. Im `head` stehen `charset`, `viewport`, `description` und `title`. Im `body` folgt die Ueberschrift, ein Absatz, eine horizontale Linie, ein Absatz mit AAU-Logo, eine verschachtelte Liste, ein externer Link zur AAU-Seite und am Ende wieder eine horizontale Linie. Es gibt keine CSS-Regeln, weil die Aufgabe CSS verbietet.

## ue1.4/index.html und Bildseiten

`index.html` ist die Uebersicht der Galerie. Der Bereich hat die geforderte ID `gallery-section`. Jedes Thumbnail ist ein Link zur Detailseite. Das `title`-Attribut zeigt beim Hover den Bildtitel, das `alt`-Attribut beschreibt das Bild fuer Screenreader und fuer den Fall, dass das Bild nicht geladen wird. Die Dateien `img1.html`, `img2.html` und `img3.html` enthalten jeweils den Bildtitel als Seitentitel und Ueberschrift, das grosse Bild, die Beschreibung und Navigation zu vorherigem Bild, Startseite und naechstem Bild. Das Meta-Refresh im Kopf laedt nach sieben Sekunden automatisch die naechste Seite; bei Bild 3 geht es wieder zu Bild 1.

## ue1.5/ex5.html

Die Tabelle nutzt eine echte Tabellenstruktur: `caption` fuer die Quelle, `thead` fuer die Spaltenueberschriften und `tbody` fuer die Daten. `scope="col"` markiert Spaltenueberschriften, `scope="row"` markiert die Universitaet als Zeilenueberschrift. Dadurch greifen die vorgegebenen CSS-Regeln, ohne dass neue Regeln noetig sind.

## ue1.6/ex6.html

Das Formular ist in `fieldset`-Gruppen gegliedert: Kontaktdaten, Mietdaten, Fahrzeugwuensche und Kommentare. Jedes Eingabefeld hat ein `label`, eine `id` und einen `name`. Die `name`-Attribute sind wichtig, weil sie beim Mailversand die Schluessel der uebertragenen Daten bilden. Pflichtfelder haben `required`; Kommentare sind optional und mit `maxlength="512"` begrenzt. Die Eingabetypen pruefen viele Werte direkt im Browser: `email`, `tel`, `date`, `number`, `color`, Radio-Buttons und `select`.

## ue1.7/antwort.md

Die Datei erklaert jede CSS-Regel einzeln. Wichtig ist der Unterschied zwischen Nachfahren-Selektor, direktem Kind-Selektor `>`, Nachbar-Selektor `+`, allgemeinem Geschwister-Selektor `~`, Attributselektor und `nth-child`. Die Antworten beschreiben jeweils, welche Elemente im gegebenen HTML rot werden und warum.

## ue1.8/ex8.html

Nur das `style`-Element wurde erweitert. `body` wird als Flex-Container aufgebaut, damit der Footer unten stehen kann. Header, Navigation, Content und Footer erhalten eine gemeinsame Breite. Der Header nutzt Flexbox, damit Text links und Logo rechts stehen. Die Navigation nutzt Flexbox fuer eine horizontale Liste und faerbt das zweite Element rot. Die Inhaltsueberschriften werden ueber `.content > section > h1` formatiert. Das zweite Thema wird rot, weil es das zweite `section`-Element ist. Bilder erhalten 100 px Breite; in ungeraden Sections floaten sie links, in geraden rechts. Externe Links bekommen per `::after` den Zusatz „(external)“. Der Footer nutzt dieselbe blaue Hintergrundfarbe wie das Menue.

## ue1.9/ex8.html

Diese Datei enthaelt die Regeln aus Exercise 8 plus eine Media Query fuer maximal 600 px Breite. Innerhalb der Media Query werden die Hauptbereiche auf volle Breite gesetzt. Das Menue wird von einer Zeile in eine Spalte umgewandelt. Jeder Menuepunkt bekommt einen grauen Hintergrund und abgerundete Ecken. Die Bilder werden in der schmalen Ansicht ausgeblendet, damit die Textspalten nicht zu eng werden. Auch die Footer-Links werden als graue abgerundete Elemente angezeigt.
