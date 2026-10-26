"use strict";

// 5 / 4a-b: A class replaces the literal and the constructor function.
class Image {
  constructor(width, height, bitdepth) {
    this.width = width;
    this.height = height;
    this.bitdepth = bitdepth;
    this.computeSize();
    // Kept inside the constructor to preserve 4b's per-instance print function.
    this.print = function print() {
      for (const property in this) {
        console.log(property + ":", this[property]);
      }
    };
  }

  computeSize() {
    this.pixels = this.width * this.height;
    this.rawsize = this.pixels * this.bitdepth / 8;
  }

  printMore() {
    this.print();
    const orientation = this.width === this.height
      ? "square"
      : this.width > this.height ? "landscape" : "portrait";
    console.log("orientation:", orientation);
  }
}

// 5 / 4e-f: extends links prototypes; super initializes the Image part.
class Video extends Image {
  constructor(width, height, bitdepth, duration, framerate) {
    super(width, height, bitdepth);
    this.duration = duration;
    this.framerate = framerate;
  }

  totalFrames() {
    return this.duration * this.framerate;
  }
}

// 5 / 4d: Class methods can also be reassigned and shadowed at runtime.
function demonstrateAssignments(first, second) {
  console.log("Different own print functions:", first.print !== second.print);
  console.log("Shared printMore function:", first.printMore === second.printMore);
  const originalPrint = first.print;
  const originalPrintMore = Image.prototype.printMore;
  try {
    first.print = function replacementPrint() {
      console.log("replacement print width:", this.width);
    };
    first.print();
    second.print();
    Image.prototype.printMore = function replacementPrintMore() {
      console.log("replacement shared orientation:", this.width >= this.height ? "landscape/square" : "portrait");
    };
    first.printMore();
    second.printMore();
    first.printMore = function ownPrintMore() {
      console.log("own printMore height:", this.height);
    };
    first.printMore();
    second.printMore();
    delete first.printMore;
    first.printMore();
  } finally {
    first.print = originalPrint;
    delete first.printMore;
    Image.prototype.printMore = originalPrintMore;
  }
}

function runDemo() {
  console.log("5 / 4a - computeSize() using a class instance");
  const image = new Image(640, 480, 24);
  image.computeSize();
  console.log("pixels:", image.pixels);
  console.log("rawsize:", image.rawsize);
  const images = [
    new Image(1920, 1080, 24),
    new Image(600, 800, 32),
    new Image(512, 512, 8)
  ];
  console.log("5 / 4b/c - Image print() and printMore()");
  for (const item of images) {
    item.print();
    item.printMore();
  }
  const videos = [
    new Video(1920, 1080, 24, 10, 30),
    new Video(720, 1280, 24, 2.5, 24),
    new Video(512, 512, 8, 0, 25)
  ];
  console.log("5 / 4e/f - Video print(), totalFrames(), and inherited printMore()");
  for (const video of videos) {
    video.print();
    console.log("totalFrames:", video.totalFrames());
    video.printMore();
  }
  console.log("5 / 4d - Runtime method assignments");
  demonstrateAssignments(images[0], images[1]);
  console.log("5 / 4d/f - A Video also sees runtime changes to Image.prototype");
  demonstrateAssignments(images[0], videos[0]);
}

if (require.main === module) {
  runDemo();
}
module.exports = { Image, Video, demonstrateAssignments, runDemo };
