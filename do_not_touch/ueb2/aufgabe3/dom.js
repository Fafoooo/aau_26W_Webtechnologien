// Exercise 3.2
var link = document.getElementsByTagName("a")[1];        // Sie sucht den zweiten Link der Seite und speichert ihn in der Variable link
console.log(link.attributes["href"].nodeValue);          // Gibt die Adresse aus, genau wie sie im HTML steht: https://de.wikipedia.org mit Liste
console.log(link.getAttributeNode("href").nodeValue);    // Gibt dieselbe Adresse aus, nur mit einer anderen Methode geholt, mit methode
console.log(link.href);                                  // Gibt die Adresse aus, wie der Browser sie vervollständigt, deshalb mit / am Ende
console.log(link.firstChild);                            // Gibt das erste Kind im Link aus, also <p>Text</p> was nach a kommt.
console.log(link.attributes[0].nodeType);                // Gibt 2 aus, weil das erste Attribut (href) ein Attributknoten ist
console.log(link.firstChild.nodeType);                   // Gibt 1 aus, weil das erste Kind (<p>) ein Element ist href z.B 2
console.log(link.parentNode.nodeName);                   // Gibt BODY aus, weil der Link direkt im body liegt
console.log(link.lastChild.parentNode.nodeName);         // Gibt A aus: das letzte Kind ist der Text "After", und sein Eltern ist wieder der Link
console.log(link.attributes.length);                     // Gibt 2 aus, weil der Link zwei Attribute hat: href und target
console.log(link.innerHTML);                             // Gibt das HTML aus, das im Link steht, in a quasi
console.log(link.outerHTML);                             // gleich wie 12 nur mit a selbst (Beim Schreiben ersetzt outerText den ganzen Link, innerText nur seinen Inhalt.)
console.log(link.innerText);                             // Gibt den Text aus, wie man ihn auf der Seite sieht
console.log(link.outerText);                             // Gibt beim Lesen dasselbe aus wie innerText
console.log(link.textContent);                           // Gibt den Text roh aus dem Quelltext aus, mit allen Leerzeichen und Zeilenumbrüchen
console.log(link);                                       // Gibt den Link selbst aus, in der Konsole kann man ihn aufklappen
console.log(link.nodeValue);                             // Gibt null aus, weil ein Element keinen eigenen Wert hat. a hat keinen wert

console.log("");

// Exercise 3.3
var link = document.getElementsByTagName("a").item(2);   // Sie sucht den dritten Link der Seite und speichert ihn in der Variable link
link.removeAttribute("target");                          // Löscht target beim dritten Link, dadurch öffnet er sich im selben Tab
