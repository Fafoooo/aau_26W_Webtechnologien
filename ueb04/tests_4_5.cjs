"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const prototypeVersion = require("./ue4.4/image-video.js");
const classVersion = require("./ue4.5/image-video.js");

function capture(action) {
  const calls = [];
  const original = console.log;
  console.log = (...values) => calls.push(values);
  try {
    action();
  } finally {
    console.log = original;
  }
  return calls;
}

const imageCases = [
  [640, 480, 24, 307200, 921600],
  [1920, 1080, 24, 2073600, 6220800],
  [600, 800, 32, 480000, 1920000],
  [512, 512, 8, 262144, 262144]
];
const videoCases = [
  [1920, 1080, 24, 10, 30, 2073600, 6220800, 300],
  [720, 1280, 24, 2.5, 24, 921600, 2764800, 60],
  [512, 512, 8, 0, 25, 262144, 262144, 0]
];

for (const [label, api, directory] of [
  ["prototypes", prototypeVersion, "ue4.4"],
  ["classes", classVersion, "ue4.5"]
]) {
  const { Image, Video, demonstrateAssignments } = api;
  for (const [width, height, bits, pixels, bytes] of imageCases) {
    test(`${label}: image ${width}x${height}/${bits}`, () => {
      const item = new Image(width, height, bits);
      assert.deepEqual([item.width, item.height, item.bitdepth], [width, height, bits]);
      assert.equal(item.pixels, pixels);
      assert.equal(item.rawsize, bytes);
      const output = capture(() => item.print());
      assert.ok(output.some(([key, value]) => key === "pixels:" && value === pixels));
      assert.ok(output.some(([key, value]) => key === "rawsize:" && value === bytes));
    });
  }

  for (const [width, height, bits, seconds, fps, pixels, bytes, frames] of videoCases) {
    test(`${label}: video ${width}x${height}, ${seconds}s at ${fps}fps`, () => {
      const item = new Video(width, height, bits, seconds, fps);
      assert.equal(item.pixels, pixels);
      assert.equal(item.rawsize, bytes);
      assert.equal(item.totalFrames(), frames);
      const output = capture(() => item.print());
      for (const [key, value] of Object.entries({ width, height, bitdepth: bits, pixels, rawsize: bytes, duration: seconds, framerate: fps })) {
        assert.ok(output.some(([printedKey, printedValue]) => printedKey === key + ":" && printedValue === value));
      }
    });
  }

  test(`${label}: print enumerates own and inherited enumerable properties`, () => {
    const item = new Video(640, 480, 24, 1, 30);
    item.caption = "added at runtime";
    const expected = [];
    for (const key in item) expected.push([key + ":", item[key]]);
    assert.deepEqual(capture(() => item.print()), expected);
    assert.ok(expected.some(([key, value]) => key === "print:" && value === item.print));
    assert.ok(expected.some(([key, value]) => key === "caption:" && value === item.caption));
    assert.equal(expected.some(([key]) => key === "printMore:"), label === "prototypes");
    assert.equal(expected.some(([key]) => key === "totalFrames:"), label === "prototypes");
  });

  test(`${label}: printMore preserves print output and handles all orientations`, () => {
    for (const Type of [Image, Video]) {
      for (const [width, height, orientation] of [[8, 4, "landscape"], [4, 8, "portrait"], [4, 4, "square"]]) {
        const item = new Type(width, height, 8, 1, 25);
        const expected = capture(() => item.print());
        expected.push(["orientation:", orientation]);
        assert.deepEqual(capture(() => item.printMore()), expected);
      }
    }
  });

  test(`${label}: own print, shared printMore, and correct inheritance chain`, () => {
    const first = new Image(8, 4, 8);
    const second = new Image(4, 8, 8);
    const video = new Video(8, 4, 8, 2, 25);
    assert.ok(Object.hasOwn(first, "print"));
    assert.notEqual(first.print, second.print);
    assert.equal(first.printMore, second.printMore);
    assert.equal(video.printMore, first.printMore);
    assert.equal(Object.hasOwn(first, "printMore"), false);
    assert.equal(Object.hasOwn(video, "totalFrames"), false);
    assert.equal(Object.getPrototypeOf(video), Video.prototype);
    assert.equal(Object.getPrototypeOf(Video.prototype), Image.prototype);
    assert.equal(Object.getPrototypeOf(first), Image.prototype);
    assert.equal(video.constructor, Video);
    assert.ok(video instanceof Video);
    assert.ok(video instanceof Image);
    assert.equal(first instanceof Video, false);
    assert.equal(Object.getOwnPropertyDescriptor(Video.prototype, "constructor").enumerable, false);
    assert.equal(Object.getOwnPropertyDescriptor(Image.prototype, "printMore").enumerable, label === "prototypes");
    assert.throws(() => Image(1, 1, 8), TypeError);
  });

  test(`${label}: own print assignment is isolated and printMore calls the new function`, () => {
    const first = new Image(8, 4, 8);
    const second = new Image(4, 8, 8);
    const secondPrint = second.print;
    first.print = function () { console.log("custom width:", this.width); };
    assert.deepEqual(capture(() => first.print()), [["custom width:", 8]]);
    assert.deepEqual(capture(() => first.printMore()), [["custom width:", 8], ["orientation:", "landscape"]]);
    assert.equal(second.print, secondPrint);
  });

  test(`${label}: runtime prototype assignment reaches existing/new images and videos; own shadow wins`, () => {
    const first = new Image(8, 4, 8);
    const second = new Image(4, 8, 8);
    const video = new Video(8, 4, 8, 1, 25);
    const original = Image.prototype.printMore;
    const replacement = function () { console.log("shared width:", this.width); };
    try {
      Image.prototype.printMore = replacement;
      for (const item of [first, second, video, new Image(8, 4, 8), new Video(8, 4, 8, 1, 25)]) {
        assert.equal(item.printMore, replacement);
        assert.deepEqual(capture(() => item.printMore()), [["shared width:", item.width]]);
      }
      first.printMore = function () { console.log("own height:", this.height); };
      assert.deepEqual(capture(() => first.printMore()), [["own height:", 4]]);
      assert.equal(second.printMore, replacement);
      delete first.printMore;
      assert.equal(first.printMore, replacement);
    } finally {
      Image.prototype.printMore = original;
    }
    assert.equal(video.printMore, original);
  });

  test(`${label}: totalFrames reads current duration and framerate without rounding`, () => {
    const video = new Video(8, 4, 8, 1, 25);
    video.duration = 2.5;
    video.framerate = 24;
    assert.equal(video.totalFrames(), 60);
    video.duration = 0.5;
    video.framerate = 25;
    assert.equal(video.totalFrames(), 12.5);
    assert.equal(new Image(1, 1, 1).rawsize, 0.125);
  });

  test(`${label}: assignment demo executes replacements and restores all changed methods`, () => {
    const first = new Image(8, 4, 8);
    const video = new Video(4, 8, 8, 1, 25);
    const originalPrint = first.print;
    const originalMore = Image.prototype.printMore;
    const output = capture(() => demonstrateAssignments(first, video));
    for (const marker of ["replacement print width:", "replacement shared orientation:", "own printMore height:"]) {
      assert.ok(output.some(([key]) => key === marker));
    }
    assert.equal(first.print, originalPrint);
    assert.equal(Image.prototype.printMore, originalMore);
    assert.equal(video.printMore, originalMore);
    assert.equal(Object.hasOwn(first, "printMore"), false);
    const originalLog = console.log;
    try {
      console.log = (key) => { if (key === "own printMore height:") throw new Error("injected log failure"); };
      assert.throws(() => demonstrateAssignments(first, video), /injected log failure/);
    } finally {
      console.log = originalLog;
    }
    assert.equal(first.print, originalPrint);
    assert.equal(Image.prototype.printMore, originalMore);
    assert.equal(Object.hasOwn(first, "printMore"), false);
  });

  test(`${label}: standalone Node demonstration produces real numeric console output`, () => {
    const script = path.join(__dirname, directory, "image-video.js");
    const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    for (const line of ["pixels: 307200", "rawsize: 921600", "pixels: 2073600", "rawsize: 6220800", "pixels: 480000", "rawsize: 1920000", "pixels: 262144", "rawsize: 262144", "pixels: 921600", "rawsize: 2764800", "totalFrames: 300", "totalFrames: 60", "totalFrames: 0", "orientation: landscape", "orientation: portrait", "orientation: square"]) {
      assert.ok(result.stdout.split(/\r?\n/).includes(line), `Missing console line: ${line}`);
    }
    assert.match(result.stdout, /Different own print functions: true/);
    assert.match(result.stdout, /Shared printMore function: true/);
    assert.match(result.stdout, /replacement print width:/);
    assert.match(result.stdout, /replacement shared orientation:/);
    assert.match(result.stdout, /own printMore height:/);
  });
}

test("4a: object literal computeSize stores values and recomputes from changed fields", () => {
  const { image } = prototypeVersion;
  image.computeSize();
  assert.equal(image.pixels, 307200);
  assert.equal(image.rawsize, 921600);
  const temporary = { width: 10, height: 20, bitdepth: 16, computeSize: image.computeSize };
  temporary.computeSize();
  assert.equal(temporary.pixels, 200);
  assert.equal(temporary.rawsize, 400);
  temporary.width = 20;
  temporary.computeSize();
  assert.equal(temporary.pixels, 400);
  assert.equal(temporary.rawsize, 800);
  assert.equal(image.width, 640);
});

test("5: computeSize is an inherited class method and supports live changes", () => {
  const { Image, Video } = classVersion;
  for (const item of [new Image(10, 20, 16), new Video(10, 20, 16, 1, 25)]) {
    assert.equal(Object.hasOwn(item, "computeSize"), false);
    assert.equal(item.computeSize, Image.prototype.computeSize);
    item.width = 20;
    item.height = 10;
    item.bitdepth = 8;
    item.computeSize();
    assert.equal(item.pixels, 200);
    assert.equal(item.rawsize, 200);
  }
  assert.equal(Object.getOwnPropertyDescriptor(Image.prototype, "computeSize").enumerable, false);
});
