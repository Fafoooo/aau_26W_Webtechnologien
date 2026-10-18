// AI-assisted solution (OpenAI, gpt-6.1-sol); explanation: ../erklaerung_blatt02.md.
var link = document.getElementsByTagName("a")[1];
console.log(link.attributes["href"].nodeValue);
console.log(link.getAttributeNode("href").nodeValue);
console.log(link.href);
console.log(link.firstChild);
console.log(link.attributes[0].nodeType);
console.log(link.firstChild.nodeType);
console.log(link.parentNode.nodeName);
console.log(link.lastChild.parentNode.nodeName);
console.log(link.attributes.length);
console.log(link.innerHTML);
console.log(link.outerHTML);
console.log(link.innerText);
console.log(link.outerText);
console.log(link.textContent);
console.log(link);
console.log(link.nodeValue);

// Exercise 3.3: item(2) selects the third link (zero-based indexing).
var link = document.getElementsByTagName("a").item(2);
link.removeAttribute("target");
