// Aufgabe 4: KEINE Vorlage in der Angabe -> die ganze Datei ist neu; jede Teilaufgabe steht zwischen [NEU] und [ENDE NEU]

// ======================== [NEU] Aufgabe 4a ========================
// image object in JSON syntax with computeSize()
let img = {                         // { ... } = Objekt direkt hinschreiben, wie ein Steckbrief mit Name: Wert
    width: 1920,                    // Breite in Pixeln
    height: 1080,                   // Höhe in Pixeln
    bitdepth: 24,                   // Bits pro Pixel für die Farbe (24 = 8 Bit je Rot, Grün, Blau)
    computeSize: function () {      // Funktion als Wert -> Methode des Objekts
        this.pixels = this.width * this.height;        // this = das Objekt selbst (img); Pixel = Breite mal Höhe
        this.rawsize = this.pixels * this.bitdepth / 8; // Bits / 8 = Bytes; neue Eigenschaften entstehen einfach beim Zuweisen
    }
};
img.computeSize();                                      // erst jetzt gibt es pixels und rawsize
console.log("4a pixels: " + img.pixels);                // 2073600
console.log("4a rawsize: " + img.rawsize + " bytes");   // 6220800
// ======================== [ENDE NEU] Aufgabe 4a ========================

// ======================== [NEU] Aufgabe 4b ========================
// constructor function Image
function Image(width, height, bitdepth) {  // Konstruktor = Bauplan; mit "new Image(...)" wird ein neues Objekt gebaut
    this.width = width;                    // this = das neue Objekt, das gerade gebaut wird
    this.height = height;
    this.bitdepth = bitdepth;
    this.pixels = width * height;          // gleich beim Bauen ausrechnen, kein computeSize() mehr nötig
    this.rawsize = this.pixels * bitdepth / 8;

    this.print = function () {             // print steht IM Konstruktor -> jedes Objekt bekommt seine EIGENE Kopie
        for (let key in this) {            // for...in = alle Eigenschaften durchgehen (auch die vom Prototype)
            if (typeof this[key] !== "function") {  // Funktionen (print, printMore) nicht mit ausgeben, nur Daten
                console.log(key + ": " + this[key]); // this[key] = Wert der Eigenschaft mit diesem Namen
            }
        }
    };
}

let small = new Image(800, 600, 8);        // drei Testbilder
let tall = new Image(1080, 1920, 24);
let square = new Image(500, 500, 32);
console.log("--- 4b ---");
small.print();
tall.print();
// ======================== [ENDE NEU] Aufgabe 4b ========================

// ======================== [NEU] Aufgabe 4c ========================
// printMore() via prototype
Image.prototype.printMore = function () {  // prototype = gemeinsamer Werkzeugkasten aller Image-Objekte; nur EINMAL im Speicher
    this.print();                          // erst alles wie print()
    if (this.width > this.height) {
        console.log("orientation: landscape");  // breiter als hoch = Querformat
    } else if (this.width < this.height) {
        console.log("orientation: portrait");   // höher als breit = Hochformat
    } else {
        console.log("orientation: square");     // gleich breit wie hoch
    }
};
console.log("--- 4c ---");
small.printMore();                         // funktioniert auch für Objekte, die VOR printMore gebaut wurden
tall.printMore();
square.printMore();
// ======================== [ENDE NEU] Aufgabe 4c ========================

// ======================== [NEU] Aufgabe 4e ========================
// constructor function Video inherits from Image
function Video(width, height, bitdepth, duration, framerate) {
    Image.call(this, width, height, bitdepth);  // Image-Konstruktor für DIESES Objekt ausführen -> width, pixels, print usw. kommen dazu
    this.duration = duration;                   // Länge in Sekunden
    this.framerate = framerate;                 // Bilder pro Sekunde
}
Video.prototype = Object.create(Image.prototype);  // Werkzeugkasten von Video baut auf dem von Image auf -> printMore wird gefunden
Video.prototype.constructor = Video;               // sonst würde constructor fälschlich auf Image zeigen
Video.prototype.totalFrames = function () {
    return this.duration * this.framerate;         // z. B. 10 s * 25 fps = 250 Bilder
};

let clip = new Video(1280, 720, 24, 10, 25);
let shorts = new Video(1080, 1920, 24, 60, 30);
console.log("--- 4e ---");
clip.print();                                      // print kommt aus Image.call -> zeigt auch duration und framerate
console.log("totalFrames: " + clip.totalFrames()); // 250
shorts.print();
console.log("totalFrames: " + shorts.totalFrames()); // 1800
// ======================== [ENDE NEU] Aufgabe 4e ========================

// ======================== [NEU] Aufgabe 4f ========================
// printMore() on Video objects
console.log("--- 4f ---");
clip.printMore();                          // geht: clip -> Video.prototype -> Image.prototype.printMore
shorts.printMore();
// ======================== [ENDE NEU] Aufgabe 4f ========================

// ======================== [NEU] Aufgabe 4d ========================
// reassigning print / printMore at runtime (absichtlich GANZ UNTEN: sonst würden c), e), f) schon die neuen Funktionen benutzen)
console.log("--- 4d ---");
small.print = function () {                // nur small bekommt ein neues print, die anderen behalten ihr eigenes
    console.log("small: " + this.width + "x" + this.height);
};
small.print();                             // neue Version
tall.print();                              // alte Version, unverändert
Image.prototype.printMore = function () {  // printMore im Prototype ersetzen -> gilt sofort für ALLE Images und Videos
    console.log("printMore replaced: " + this.width + "x" + this.height);
};
tall.printMore();
clip.printMore();
// ======================== [ENDE NEU] Aufgabe 4d ========================
