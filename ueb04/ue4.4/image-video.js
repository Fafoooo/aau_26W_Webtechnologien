"use strict";

// 4a: JavaScript object literal, not a JSON document containing functions.
const image = {
  "width": 640,
  "height": 480,
  "bitdepth": 24
};
image.computeSize = function computeSize() {
  this.pixels = this.width * this.height;
  this.rawsize = this.pixels * this.bitdepth / 8;
};

// 4b: Data and a separate print function are created for every instance.
function Image(width, height, bitdepth) {
  this.width = width;
  this.height = height;
  this.bitdepth = bitdepth;
  this.pixels = width * height;
  this.rawsize = this.pixels * bitdepth / 8;
  this.print = function print() {
    for (const property in this) {
      console.log(property + ":", this[property]);
    }
  };
}

// 4c: This function is shared through the prototype.
Image.prototype.printMore = function printMore() {
  this.print();
  const orientation = this.width === this.height
    ? "square"
    : this.width > this.height ? "landscape" : "portrait";
  console.log("orientation:", orientation);
};

// 4e: Inherit initialization AND the prototype methods.
function Video(width, height, bitdepth, duration, framerate) {
  Image.call(this, width, height, bitdepth);
  this.duration = duration;
  this.framerate = framerate;
}
Video.prototype = Object.create(Image.prototype);
Object.defineProperty(Video.prototype, "constructor", {
  value: Video,
  writable: true,
  configurable: true,
  enumerable: false
});
Video.prototype.totalFrames = function totalFrames() {
  return this.duration * this.framerate;
};

// 4d: Assign, call, and restore methods; leave no persistent prototype changes.
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
  console.log("4a - Object literal");
  image.computeSize();
  console.log("pixels:", image.pixels);
  console.log("rawsize:", image.rawsize);
  const images = [
    new Image(1920, 1080, 24),
    new Image(600, 800, 32),
    new Image(512, 512, 8)
  ];
  console.log("4b/c - Image print() and printMore()");
  for (const item of images) {
    item.print();
    item.printMore();
  }
  const videos = [
    new Video(1920, 1080, 24, 10, 30),
    new Video(720, 1280, 24, 2.5, 24),
    new Video(512, 512, 8, 0, 25)
  ];
  console.log("4e/f - Video print(), totalFrames(), and inherited printMore()");
  for (const video of videos) {
    video.print();
    console.log("totalFrames:", video.totalFrames());
    video.printMore();
  }
  console.log("4d - Runtime method assignments");
  demonstrateAssignments(images[0], images[1]);
  console.log("4d/f - A Video also sees runtime changes to Image.prototype");
  demonstrateAssignments(images[0], videos[0]);
}

if (require.main === module) {
  runDemo();
}
module.exports = { image, Image, Video, demonstrateAssignments, runDemo };
