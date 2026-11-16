// Aufgabe 5 = Aufgabe 4 nochmal, aber mit ECMAScript-2015-Klassen statt Prototypes.
// Vorlage: classes_old.js (= image.js aus Aufgabe 4, unverändert; wird NICHT in index.html geladen, nur zum Vergleichen).
// Alles hier ist neu; bei jedem Block steht, was er aus Aufgabe 4 ersetzt.

// ======================== [NEU] Aufgabe 5: class Image (ersetzt function Image + Image.prototype.printMore) ========================
class Image {                                  // class = Bauplan, macht dasselbe wie function Image in 4b, nur übersichtlicher
    constructor(width, height, bitdepth) {     // constructor läuft automatisch bei "new Image(...)"
        this.width = width;                    // this = das neue Objekt
        this.height = height;
        this.bitdepth = bitdepth;
        this.computeSize();                    // 4a + 4b: pixels und rawsize gleich beim Bauen ausrechnen
    }

    computeSize() {                            // Methode aus 4a, jetzt im Bauplan
        this.pixels = this.width * this.height;          // Pixel = Breite mal Höhe
        this.rawsize = this.pixels * this.bitdepth / 8;  // Bits / 8 = Bytes
    }

    print() {                                  // Methoden in einer class landen automatisch im Prototype -> nur EINMAL im Speicher
        for (let key in this) {                // for...in findet nur die Daten: Klassen-Methoden zählt for...in nicht mit
            console.log(key + ": " + this[key]);
        }
    }

    printMore() {                              // 4c: wie print, plus Hoch- oder Querformat
        this.print();
        if (this.width > this.height) {
            console.log("orientation: landscape");
        } else if (this.width < this.height) {
            console.log("orientation: portrait");
        } else {
            console.log("orientation: square");
        }
    }
}
// ======================== [ENDE NEU] class Image ========================

// ======================== [NEU] Aufgabe 5a (statt Objekt-Literal aus 4a) ========================
let img = new Image(1920, 1080, 24);                    // computeSize läuft schon im constructor
console.log("5a pixels: " + img.pixels);                // 2073600
console.log("5a rawsize: " + img.rawsize + " bytes");   // 6220800
// ======================== [ENDE NEU] Aufgabe 5a ========================

// ======================== [NEU] Aufgabe 5b + 5c (gleiche Testaufrufe wie 4b + 4c) ========================
let small = new Image(800, 600, 8);
let tall = new Image(1080, 1920, 24);
let square = new Image(500, 500, 32);
console.log("--- 5b ---");
small.print();
tall.print();
console.log("--- 5c ---");
small.printMore();
tall.printMore();
square.printMore();
// ======================== [ENDE NEU] Aufgabe 5b + 5c ========================

// ======================== [NEU] Aufgabe 5e: class Video (ersetzt function Video + Image.call + Object.create) ========================
class Video extends Image {                    // extends = Video erbt alles von Image (ersetzt Object.create aus 4e)
    constructor(width, height, bitdepth, duration, framerate) {
        super(width, height, bitdepth);        // super = Konstruktor von Image aufrufen (ersetzt Image.call); muss vor this kommen
        this.duration = duration;              // Länge in Sekunden
        this.framerate = framerate;            // Bilder pro Sekunde
    }

    totalFrames() {
        return this.duration * this.framerate; // z. B. 10 s * 25 fps = 250 Bilder
    }
}

let clip = new Video(1280, 720, 24, 10, 25);
let shorts = new Video(1080, 1920, 24, 60, 30);
console.log("--- 5e ---");
clip.print();                                  // print kommt geerbt von Image
console.log("totalFrames: " + clip.totalFrames());   // 250
shorts.print();
console.log("totalFrames: " + shorts.totalFrames()); // 1800
// ======================== [ENDE NEU] Aufgabe 5e ========================

// ======================== [NEU] Aufgabe 5f ========================
console.log("--- 5f ---");
clip.printMore();                              // geht, weil Video von Image erbt
shorts.printMore();
// ======================== [ENDE NEU] Aufgabe 5f ========================

// ======================== [NEU] Aufgabe 5d (wieder ganz am Ende, wie in 4) ========================
console.log("--- 5d ---");
small.print = function () {                    // eigenes print nur für small; überdeckt das aus dem Prototype
    console.log("small: " + this.width + "x" + this.height);
};
small.print();                                 // neue Version
tall.print();                                  // alte Version aus der Klasse
Image.prototype.printMore = function () {      // auch bei Klassen kann man den Prototype nachträglich ändern -> gilt für ALLE
    console.log("printMore replaced: " + this.width + "x" + this.height);
};
tall.printMore();
clip.printMore();
// ======================== [ENDE NEU] Aufgabe 5d ========================
