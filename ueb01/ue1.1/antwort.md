# Exercise 1 – HTTP Requests

Messung: 10.10.2026, frische automatisierte HTTP-Messung mit Browser-User-Agent. Die Werte koennen sich bei einer echten DevTools-Messung leicht aendern, weil Werbung, Caching, Standort und Cookies dynamisch sind.

## a) www.aau.at

- Requests: 81 beobachtete Requests (Hauptdokument plus die ersten eingebundenen Ressourcen).
- Uebertragene Daten: ca. 1.44 MB.
- Ladezeit aus der Messung: ca. 0.68 s Summe der gemessenen Fetch-Zeiten; der langsamste Einzelrequest dauerte ca. 20 ms.
- Statuscode des ersten Requests: 200 OK.
- Webserver: nginx.
- Angeforderte Ressourcentypen: HTML-Dokument, Stylesheets/CSS, JavaScript. In einer vollstaendigen Browsermessung kommen durch Lazy Loading zusaetzlich Bilder, Fonts und Tracking-/API-Requests dazu.
- Langsamster Request in der Messung: das Hauptdokument `https://www.aau.at/` mit ca. 20 ms; danach mehrere CSS-Dateien.
- Cookies: Im Antwortheader wurde `wp-wpml_current_language` gesetzt, aber mit `Max-Age=0`; dadurch bleibt in der frischen Messung kein persistenter Cookie gespeichert. Bei Zustimmung zu Cookie-Bannern koennen weitere Cookies hinzukommen.

## b) www.orf.at

- Requests: 38 beobachtete Requests.
- Uebertragene Daten: ca. 1.99 MB.
- Ladezeit aus der Messung: ca. 1.65 s Summe der gemessenen Fetch-Zeiten.
- Statuscode des ersten Requests: 200 OK.
- Webserver: Apache.
- Angeforderte Ressourcentypen: HTML-Dokument, JavaScript, Stylesheets/CSS, Bilder und Fonts.
- Langsamster Request in der Messung: `https://data-d6e13c60e8.orf.at/iomm/latest/manager/base/es6/bundle.js` mit ca. 153 ms.
- Cookies: In der frischen Messung wurden keine persistenten Cookies gespeichert. Bei Consent-/Tracking-Einstellungen kann sich das aendern.

## c) www.google.at Suche nach „Klagenfurt“

Wenn man das Network-Fenster leert und dann `Klagenfurt` in das Suchfeld tippt, wird die Seite nicht bei jedem Buchstaben komplett neu geladen. Stattdessen sendet Google waehrend des Tippens mehrere asynchrone Requests im Hintergrund. Diese Requests enthalten den aktuellen Zwischenstand der Eingabe, zum Beispiel `K`, `Kl`, `Kla` usw. Die Antworten liefern Suchvorschlaege, Korrekturen und weitere Daten fuer die Ergebnis-/Vorschlagsansicht. Die sichtbare Seite wird danach per JavaScript aktualisiert. Erst beim Absenden der Suche wird die eigentliche Suchergebnisseite geladen.

## d) Cache

Der Cache ist ein Zwischenspeicher des Browsers. Dort speichert der Browser Ressourcen wie HTML, CSS, JavaScript, Bilder und Fonts lokal. Beim naechsten Besuch muss der Browser diese Dateien nicht immer neu vom Server laden.

Cache loeschen:

1. In Chrome/Firefox die Browserdaten oeffnen.
2. „Zwischengespeicherte Bilder und Dateien“ auswaehlen.
3. Zeitraum waehlen und loeschen.

In den Developer Tools kann man im Network-Tab ausserdem „Disable cache“ aktivieren, solange die DevTools geoeffnet sind.

Cache deaktivieren oder loeschen ist nuetzlich, wenn man Webentwicklung betreibt und sicherstellen will, dass wirklich die neueste HTML-, CSS- oder JavaScript-Version geladen wird. Es ist auch hilfreich, wenn eine Website fehlerhaft wirkt, weil der Browser noch alte Dateien verwendet.
