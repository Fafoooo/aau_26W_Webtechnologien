function showImg(e) {
   document.querySelector("#displayDIV .bigIMG").src=e.target.dataset.large;
   document.querySelector("#displayDIV .desc").innerHTML=e.target.alt;
   document.getElementById("displayDIV").style.display="block";
}

function hideImg(e) {
   e.currentTarget.style.display="none";
}

let images = document.querySelectorAll('.gallery img');
for (let i=0; i< images.length; i++) {
   images[i].addEventListener("click", showImg);
}
document.getElementById("displayDIV").addEventListener("click", hideImg);

// Extension: previous / next buttons
let currentIndex = 0;

// remember which thumbnail was opened
for (let i = 0; i < images.length; i++) {
   images[i].addEventListener("click", function () {
      currentIndex = i;
   });
}

function showImgAt(index) {
   currentIndex = (index + images.length) % images.length; // wraps around at both ends
   document.querySelector("#displayDIV .bigIMG").src = images[currentIndex].dataset.large;
   document.querySelector("#displayDIV .desc").innerHTML = images[currentIndex].alt;
}

function addButton(text, step, side) {
   let button = document.createElement("button");
   button.textContent = text;
   button.style.position = "absolute";
   button.style.top = "50%";
   button.style[side] = "20px";
   button.addEventListener("click", function (e) {
      e.stopPropagation(); // otherwise hideImg on displayDIV closes the picture
      showImgAt(currentIndex + step);
   });
   document.getElementById("displayDIV").appendChild(button);
}

addButton("previous", -1, "left");
addButton("next", 1, "right");




// Extension Assignment 3: slideshow with play/pause, seconds and exit
let slideshowTimer = null;  // Gedächtnis: läuft die Diashow? null = läuft nicht, eine Nummer = läuft (Nummer vom Wecker)

const controls = document.createElement("div");  // Leiste für play, Zahlenfeld und exit bauen
controls.style.position = "absolute";            // frei hinsetzen, egal was sonst auf der Seite ist
controls.style.top = "10px";                     // 10 Pixel von oben
controls.style.left = "10px";                    // 10 Pixel von links -> oben links
controls.style.backgroundColor = "white";        // weißer Hintergrund, damit man die Leiste auf dunklen Bildern lesen kann
controls.style.padding = "4px";                  // 4 Pixel Innenabstand
controls.addEventListener("click", function (e) {
   e.stopPropagation();  // Klick in die Leiste nicht zum Vollbild hochwandern lassen, sonst würde es zugehen
});

const playButton = document.createElement("button");  // ein Button für play UND pause
playButton.textContent = "play";                       // am Anfang steht "play" drauf
playButton.addEventListener("click", function () {     // Wenn man auf den Button klickt, führe das aus
   if (slideshowTimer === null) {  // läuft nicht?
      startSlideshow();            //   -> starten
   } else {                        // läuft schon?
      stopSlideshow();             //   -> anhalten (wie die Play/Pause-Taste bei Spotify)
   }
});

const secondsInput = document.createElement("input");  // Zahlenfeld für die Sekunden pro Bild
secondsInput.type = "number";                          // nur Zahlen
secondsInput.min = 1;                                  // mindestens 1
secondsInput.value = 3;                                // Standard: 3 Sekunden
secondsInput.style.width = "4em";                      // schmal, es kommt ja nur eine kleine Zahl rein
secondsInput.addEventListener("change", function () {  // Wenn man die Zahl ändert, führe das aus
   if (slideshowTimer !== null) {  // läuft die Diashow gerade?
      stopSlideshow();             //   -> kurz stoppen
      startSlideshow();            //   -> und mit der neuen Zeit neu starten
   }
});

const exitButton = document.createElement("button");  // exit-Button bauen
exitButton.textContent = "exit";                       // das steht drauf
exitButton.addEventListener("click", function () {     // Wenn man auf exit klickt, führe das aus
   stopSlideshow();                                                // Diashow aus
   document.getElementById("displayDIV").style.display = "none";   // Vollbild zu
});

controls.append(playButton, " ", secondsInput, " seconds ", exitButton);  // alle Teile in die Leiste; " " und " seconds " werden einfach als Text dazwischen gesetzt
document.getElementById("displayDIV").appendChild(controls);              // die Leiste ins Vollbild setzen

// Der alte Code schließt das Vollbild auch bei Klick auf den Hintergrund -> dann Diashow auch stoppen, sonst läuft sie unsichtbar weiter
document.getElementById("displayDIV").addEventListener("click", stopSlideshow);

function startSlideshow() {
   let seconds = Number(secondsInput.value);  // Zahl aus dem Feld holen, z. B. 3
   if (isNaN(seconds) || seconds <= 0) {      // Quatsch eingegeben (keine Zahl, 0 oder minus)?
      seconds = 3;                            //   -> zurück auf 3
      secondsInput.value = 3;                 //   -> und auch im Feld wieder 3 anzeigen
   }
   slideshowTimer = setInterval(function () { // setInterval = Wecker, der immer wieder klingelt; seine Nummer merken wir uns in slideshowTimer
      showImgAt(currentIndex + 1);            // bei jedem Klingeln: nächstes Bild; nach dem letzten kommt wieder das erste (Modulo, Blatt 2)
   }, seconds * 1000);                        // JS rechnet in Millisekunden: 3 Sekunden = 3000
   playButton.textContent = "pause";          // Button heißt jetzt "pause"
}

function stopSlideshow() {
   clearInterval(slideshowTimer);    // clearInterval = Wecker mit dieser Nummer ausschalten
   slideshowTimer = null;            // merken: läuft nicht mehr
   playButton.textContent = "play";  // Button heißt wieder "play"
}
