document.querySelector('#button').addEventListener('click',function (event){ // document = ganze Seite, querySelector('#button') = Element mit id="button", addEventListener = bei 'click' Funktion ausführen
    console.log("inner:");
    console.log("target: "+event.target);               // target = das Element, auf das du wirklich geklickt hast
    console.log("currentTarget: "+event.currentTarget); // currentTarget = das Element, an dem der gerade laufende Listener hängt
    console.log("this: "+this);                         // this = dasselbe wie currentTarget, solange der Listener eine normale function ist
});

document.querySelector('#outerArea').addEventListener('click',function (event){ // '#outerArea' = blaues div um den Button; Button-Klick wandert hierher hoch (Bubbling)
        console.log("outer:");
        console.log("target: " + event.target);               // beim Button-Klick: Button
        console.log("currentTarget: " + event.currentTarget); // hier: div
        console.log("this: " + this);                         // hier: div
});

// Exercise 5.4: stop the click on the button from bubbling up to outerArea
document.querySelector('#button').addEventListener('click', function (event) { // zweiter Listener am Button, der erste läuft weiterhin
    event.stopPropagation(); // stoppt das Hochwandern -> div-Listener läuft beim Button-Klick nicht mehr
});
