# Exercise 7 – CSS Selectors

Hinweis: Das vorgegebene HTML verschachtelt teilweise `p`-Elemente in `h1`/`h2`. Das ist semantisch kein gutes HTML. Fuer die folgenden Antworten wird das DOM so betrachtet, wie es ein HTML5-Parser fuer dieses Dokument erzeugt.

1. `#content, p { color: red; }`
   Zwei Selektoren werden kombiniert. `#content` faerbt das komplette `div id="content"` rot. Der zweite Selektor `p` faerbt alle 15 `p`-Elemente im Dokument rot, also auch die Absaetze ausserhalb von `#content`.

2. `#content p { color: red; }`
   Alle `p`-Nachfahren von `#content` werden rot. Das sind 8 Absaetze: die zwei direkten Absaetze in `#content`, die vier Absaetze im `h2` innerhalb von `#content` und die zwei Absaetze im `h1` innerhalb von `#content`.

3. `#content h2 p { color: red; }`
   Rot werden nur die vier `p`-Elemente im `h2`, das innerhalb von `#content` liegt: `Text within paragraph 1 in h2.` bis `Text within paragraph 4 in h2.`

4. `#content > p { color: red; }`
   Das `>` bedeutet direktes Kind. Deshalb werden nur die zwei direkten `p`-Kinder von `#content` rot: `Text within paragraph 1` und `text within paragraph 2`.

5. `#content h1 p { color: red; }`
   Rot werden die zwei `p`-Elemente im `h1` innerhalb von `#content`: `Text within h1 and p` und `Text within h1 and p 2`.

6. `div p:nth-child(2) { color: red; }`
   Ein `p` wird rot, wenn es das zweite Kind seines Elternelements ist und innerhalb eines `div` liegt. Im gegebenen DOM sind das vier Absaetze: der zweite direkte Absatz in `#content`, der zweite Absatz im `h2` von `#content`, der zweite Absatz im `h1` von `#content` und `Text within p1` in `.othercontent`, weil dort vorher das `h1` steht.

7. `div p:nth-child(2n) { color: red; }`
   `2n` trifft gerade Kindpositionen. Rot werden sechs Absaetze: der zweite direkte Absatz in `#content`, der zweite und vierte Absatz im `h2` von `#content`, der zweite Absatz im `h1` von `#content`, sowie `Text within p1` und `Text within p3` in `.othercontent`.

8. `h2 { color: red; }`
   Alle drei `h2`-Elemente werden rot. Dazu gehoeren die obere Ueberschrift `This is some text`, das `h2` innerhalb von `#content` und das `h2` innerhalb von `.othercontent`. Kindelemente erben die rote Textfarbe, solange keine speziellere Regel greift.

9. `div.othercontent > p:first-child { color:red; }`
   Diese Regel trifft kein Element. `p:first-child` muesste das erste direkte Kind von `div.othercontent` sein, dort steht aber zuerst ein `h1`.

10. `div.othercontent h1 + p { color:red; }`
   `+` bedeutet direkt folgendes Geschwisterelement. Rot wird der Absatz `Text within p1`, weil er direkt nach dem ersten `h1` in `.othercontent` steht.

11. `div.othercontent h1 ~ p { color:red; }`
   `~` bedeutet spaeteres Geschwisterelement. Rot werden alle direkten `p`-Geschwister, die nach dem ersten `h1` in `.othercontent` kommen: `Text within p1`, `Text within p2`, `Text within p3` und `Text within p4`.

12. `a[title^=other]:link { color:red; }`
   Der Attributselektor sucht Links, deren `title` mit `other` beginnt. `:link` beschraenkt es auf noch nicht besuchte Links. Im Dokument trifft das den Link mit `title="otherlink"`.

13. `body a[title^=other]:link { color:red; }`
   Das Ergebnis ist hier gleich wie bei Regel 12, weil der passende Link im `body` liegt. Der Selektor ist nur etwas spezifischer.

14. `.othercontent * p { color: red; }`
   Der Stern steht fuer ein beliebiges Zwischenelement innerhalb von `.othercontent`. Deshalb werden nicht die direkten `p`-Kinder von `.othercontent` rot, sondern die `p`-Elemente, die tiefer verschachtelt sind: der Absatz im `h2` und der Absatz im zweiten `h1` innerhalb von `.othercontent`.
