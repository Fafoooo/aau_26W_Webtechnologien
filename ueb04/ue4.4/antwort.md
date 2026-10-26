# Exercise 4 — JavaScript prototypes

## Run and verify

From the repository root:

```sh
node ueb04/ue4.4/image-video.js
node --test ueb04/tests_4_5.cjs
```

`image-video.js` uses plain JavaScript, without libraries. It runs a complete console demonstration when executed directly. Requiring it as a CommonJS module exports the object, constructors and demonstrations without running the console demonstration. The test harness uses only Node's built-in modules. The German, line-by-line explanation is in `../erklaerung_4_5.md`.

## (a) Object literal and computeSize()

The object `image` starts with quoted `width`, `height` and `bitdepth` keys. Its initial data uses the object-literal syntax corresponding to a JSON object. Strictly speaking, JSON is a data format: a JSON document cannot contain functions. Therefore, the executable JavaScript function is attached afterwards as `image.computeSize`.

Calling `image.computeSize()` binds `this` to `image` and stores:

```text
pixels = width * height
rawsize = pixels * bitdepth / 8
```

There are eight bits in a byte. The demonstration prints `pixels: 307200` and `rawsize: 921600` for an image of 640 × 480 pixels at 24 bits per pixel. `computeSize()` can be called again after changing the data fields.

`rawsize` describes uncompressed pixel data, not a JPEG/PNG file size. No headers, row padding or compression are modelled. The calculation deliberately follows the formula without rounding. If the bit count is not a multiple of eight, it represents a fractional byte count; allocating whole physical bytes would additionally require rounding up. The examples use valid numeric dimensions and bit depths. Input validation is outside this exercise.

## (b) Image constructor and print()

`new Image(width, height, bitdepth)` creates a new object linked to `Image.prototype`. Within the constructor, `this` refers to that object. The constructor immediately stores the three arguments, `pixels` and `rawsize`; it does **not** require a subsequent `computeSize()` call.

`this.print = function print() { ... }` creates an **own** method on each instance. Its `for...in` loop prints every enumerable string-keyed property and its value, including functions. It also visits enumerable inherited properties, so the prototype methods are visible in this version. Non-enumerable properties such as the standard `constructor` property are not printed; this is the enumeration intended by the exercise's `for` loop, not a reflection over every possible property descriptor.

The constructor is tested with landscape, portrait and square images:

| Width | Height | Bit depth | Pixels | Raw bytes |
| ---: | ---: | ---: | ---: | ---: |
| 1920 | 1080 | 24 | 2073600 | 6220800 |
| 600 | 800 | 32 | 480000 | 1920000 |
| 512 | 512 | 8 | 262144 | 262144 |

## (c) Shared printMore() and orientation

`Image.prototype.printMore` is one shared function. It calls `this.print()` to print the same properties and then prints the orientation:

- `width > height`: `landscape`;
- `width < height`: `portrait`;
- `width === height`: `square`.

For positive heights, comparing width and height is equivalent to comparing `width / height` with 1. Handling square images separately avoids falsely labelling them as portrait or landscape. The demonstration calls both printing methods on all three images.

## (d) Difference and reassignment at runtime

`print` belongs to the instance and its function expression is evaluated for every constructor invocation. Consequently, two different instances have distinct `print` function objects. `printMore` is found by prototype lookup, so initially those instances share the same function object. This is about observable JavaScript function identity; it does not claim that an engine necessarily duplicates the underlying compiled machine code.

Both methods can be reassigned while the program is running. `demonstrateAssignments` actually performs these steps:

1. Save the original functions.
2. Assign a new function to `first.print`, call it, and call `second.print` to show that the second object's own method was not replaced.
3. Assign a new function to `Image.prototype.printMore`, then call it through both existing objects. Both see the shared replacement.
4. Assign `first.printMore` an own function. This shadows the prototype method only on `first`; `second` still uses the shared replacement.
5. Delete the own `first.printMore` property. Lookup reaches the prototype again; `delete` does not delete the inherited method.
6. Restore the original functions in `finally`, including when a demonstration call throws.

The helper is a demonstration for the supplied fresh, distinct instances, initially without an own `printMore` property. It runs once with two images and again with an image and a video. Replacing `Image.prototype.print` alone would not replace an existing instance's own `print`, because own properties take precedence. Methods use the receiving object as `this`; an ordinary method call such as `first.print()` preserves this binding.

## (e) Video inheritance and totalFrames()

`Video(width, height, bitdepth, duration, framerate)` first calls `Image.call(this, width, height, bitdepth)`. This initializes the image data and the own `print` method on the **same video object**. It then saves `duration` in seconds and `framerate` in frames per second.

Calling the parent constructor alone does not establish prototype inheritance. The additional line `Video.prototype = Object.create(Image.prototype)` creates this lookup chain:

```text
video -> Video.prototype -> Image.prototype -> Object.prototype -> null
```

`constructor` is restored to `Video` with a non-enumerable property descriptor. Defining it does not execute any constructor; it restores the informative constructor reference after replacing the prototype object.

`Video.prototype.totalFrames()` returns `this.duration * this.framerate`, reading current values each time. It does not round or multiply `rawsize`. The inherited `rawsize` remains the size of **one image/frame**, not the size of the whole video.

| Video | Duration (s) | Frame rate (fps) | Pixels/frame | Raw bytes/frame | totalFrames() |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1920 × 1080, 24 bit | 10 | 30 | 2073600 | 6220800 | 300 |
| 720 × 1280, 24 bit | 2.5 | 24 | 921600 | 2764800 | 60 |
| 512 × 512, 8 bit | 0 | 25 | 262144 | 262144 | 0 |

The program creates all three videos, calls `print()`, prints `totalFrames()`, and calls `printMore()`. The automated tests assert these exact numbers, including a fractional duration and a zero-duration video. An additional test verifies the specified unrounded result for a non-integral frame count.

## (f) Can videos call printMore()?

Yes. If `video` has no own `printMore`, JavaScript looks at `Video.prototype`, then `Image.prototype`, where it finds the method. `this` still refers to the video, so the inherited method prints the video's image and video properties, followed by the frame's orientation. Calling a shared parent method does not change the receiving object into an image.

The runtime demonstration also replaces `Image.prototype.printMore` after the video already exists, and the video immediately observes that replacement. The tests verify the prototype chain and both `video instanceof Video` and `video instanceof Image`.

## Actual verification

Executed using Node.js v22.23.3:

- Standalone `node ueb04/ue4.4/image-video.js`: exit status 0; numeric results and all three orientations printed.
- Shared `node --test ueb04/tests_4_5.cjs`: **32 tests passed, 0 failed, 0 skipped** across Exercises 4 and 5.
- Assertions cover all example numbers, printed property/value pairs, orientation, function identity, inheritance, dynamic reassignment/shadowing, restoration after an injected error, live recalculation and standalone CLI output.

No browser interface is required for these console-only exercises. No claim of unaided authorship is made here; the mandatory AI-use report is maintained separately at assignment level.
