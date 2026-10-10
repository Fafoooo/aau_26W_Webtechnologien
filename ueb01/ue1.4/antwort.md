# Exercise 4 – HTML Page 2

`index.html` enthaelt die Galerie mit der Section-ID `gallery-section`. Jedes Vorschaubild hat ein sinnvolles `alt`-Attribut und ein `title`-Attribut, das beim Hover den Bildtitel anzeigt. Die Detailseiten zeigen Titel, Originalbild, Beschreibung sowie Links zu vorherigem Bild, naechstem Bild und zur Startseite.

Das `alt`-Attribut ist wichtig fuer Barrierefreiheit und Robustheit: Screenreader lesen den Alternativtext vor, Suchmaschinen koennen den Bildinhalt besser einordnen, und bei nicht ladenden Bildern bleibt trotzdem eine sinnvolle Information sichtbar.

Teil b ist in den Detailseiten umgesetzt: Jede Seite hat ein Meta-Refresh nach 7 Sekunden zur naechsten Detailseite. Nach `img3.html` wird wieder `img1.html` geladen.
