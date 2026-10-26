# Exercise 5 — ECMAScript 2015 classes

## Run and verify

From the repository root:

```sh
node ueb04/ue4.5/image-video.js
node --test ueb04/tests_4_5.cjs
```

The solution uses ES2015 `class`, `constructor`, `extends`, `super` and method syntax. The executable product has no library dependency. Node's built-in CommonJS wrapper makes it directly runnable and importable for testing; it is not a third-party framework. The German line-by-line explanation is in `../erklaerung_4_5.md`.

## Full correspondence with Exercise 4

### (a) computeSize() and the initial example

The object-literal example becomes `new Image(640, 480, 24)`. `Image` has a `computeSize()` class method which stores:

```text
pixels = width * height
rawsize = pixels * bitdepth / 8
```

The constructor calls `computeSize()` to initialize the fields immediately. The demonstration also explicitly calls `image.computeSize()` and prints `pixels: 307200` and `rawsize: 921600`. Repeating the method after modifying width, height or bit depth recalculates both stored values. Videos inherit this functionality too.

In Exercise 4, “JSON syntax” means the data-shaped JavaScript object literal, not a JSON document containing a function. Here, the literal is intentionally replaced by a class instance as required by Exercise 5.

### (b) Constructor, print() and several images

`class Image` contains `constructor(width, height, bitdepth)`. The constructor saves its arguments, computes the size and assigns `this.print = function print() { ... }`.

**Design choice:** `print` stays inside the constructor to preserve Exercise 4b's explicitly required per-instance method and Exercise 4d's own-versus-shared contrast. Moving it into ordinary class-method syntax would also be possible, but would change that ownership and identity behaviour: all instances would then share `Image.prototype.print`. The actual implementation keeps the required distinction while using a class as the constructor abstraction.

`print()` uses `for...in` to print enumerable property names and their values, including its own function-valued `print` property. It deliberately does not filter out methods or dynamically added enumerable properties.

| Width | Height | Bit depth | Pixels | Raw bytes |
| ---: | ---: | ---: | ---: | ---: |
| 1920 | 1080 | 24 | 2073600 | 6220800 |
| 600 | 800 | 32 | 480000 | 1920000 |
| 512 | 512 | 8 | 262144 | 262144 |

All three instances call `print()` and `printMore()` in the demonstration.

### (c) printMore() and orientation

The class method `printMore()` calls the current `this.print()` and then prints `landscape`, `portrait` or `square`. Width greater than height means landscape, width smaller than height means portrait, and equal dimensions mean square. For positive dimensions this is equivalent to checking the aspect ratio against 1, without division.

Ordinary class methods are still stored on prototypes: `printMore` and `computeSize` reside on `Image.prototype`. “Instead of prototypes” in the assignment means using class syntax instead of manually wiring the inheritance implementation. JavaScript's class mechanism still uses prototype lookup internally.

**Enumeration difference:** class-defined prototype methods are non-enumerable. Therefore `for...in` prints all enumerable instance data and the own `print` function, but does not list `computeSize`, `printMore` or `totalFrames` as properties in the output. In Exercise 4, the prototype methods added by ordinary assignment are enumerable, so those function entries also appear there. This is a documented language-level difference, not missing image/video data. Neither version's loop lists non-enumerable built-in properties.

### (d) Runtime assignment, sharing and shadowing

Two instances still have different own `print` function objects and share the same `printMore` function through the prototype. This describes JavaScript object identity, not an assertion about how an engine stores compiled code.

Class methods are not immutable. `demonstrateAssignments` runs the same live changes as Exercise 4:

1. Replace `first.print` by assignment and call it. The second object's own `print` remains unchanged.
2. Replace `Image.prototype.printMore` and call it through both existing objects. Both resolve to the new shared function.
3. Assign an own `first.printMore` function. It shadows the shared function only for that object.
4. Delete that own property and call again, exposing the inherited replacement.
5. Restore the saved original functions in `finally`, also on an exception.

This demonstration is run with fresh, distinct instances without an own `printMore` property: first with two images, then with an image and a video. The video observes runtime changes to its ancestor prototype even though it already existed. Replacing `Image.prototype.print` alone would not override an own `print` property.

### (e) Video, extends, super and totalFrames()

`class Video extends Image` declares inheritance. Its constructor takes all five required arguments and calls `super(width, height, bitdepth)` **before using `this`**. The parent constructor initializes width, height, bit depth, pixels, raw size and the own print function on the video. The subclass then stores duration and frame rate.

Unlike Exercise 4, no `Object.create` call or manual `constructor` repair is needed. `extends` establishes the instance-prototype relationship, and `super` performs parent initialization. The chain is:

```text
video -> Video.prototype -> Image.prototype -> Object.prototype -> null
```

`totalFrames()` is a class method on `Video.prototype`. It returns current `duration * framerate` without rounding. `rawsize` is still the raw size of **one frame**, not the entire video.

| Video | Duration (s) | Frame rate (fps) | Pixels/frame | Raw bytes/frame | totalFrames() |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1920 × 1080, 24 bit | 10 | 30 | 2073600 | 6220800 | 300 |
| 720 × 1280, 24 bit | 2.5 | 24 | 921600 | 2764800 | 60 |
| 512 × 512, 8 bit | 0 | 25 | 262144 | 262144 | 0 |

The program constructs all three videos and actually calls `print()` and `totalFrames()` for each. Tests assert every listed value and confirm that changing duration/frame rate changes the returned result immediately.

### (f) Inherited printMore() on videos

Yes, `video.printMore()` works without redefining that method in `Video`. The method is found on `Image.prototype`; its `this` remains the video. As a result, it prints image fields, video fields, the own `print` function and the frame orientation. The demo covers landscape, portrait and square videos. The tests also verify `video instanceof Image`, `video instanceof Video`, the prototype chain and runtime prototype replacement.

## Numerical assumptions

The formula models uncompressed pixel data only; it excludes compression, headers, row alignment and metadata. Inputs in the examples are valid numeric values; additional validation is not part of this exercise. The mathematical byte count is not rounded, so a non-byte-aligned bit count can give a fractional byte result. A real whole-byte allocation would require additional rounding. Likewise, the exact `duration * framerate` expression can yield a non-integral count, which is intentionally not rounded because the assignment specifies that product.

## Actual verification

Executed using Node.js v22.23.3:

- Standalone `node ueb04/ue4.5/image-video.js`: exit status 0; numeric results, three orientations and runtime method replacements printed.
- Shared `node --test ueb04/tests_4_5.cjs`: **32 tests passed, 0 failed, 0 skipped** across Exercises 4 and 5.
- Tests inspect actual function identities and descriptors, exact printed data, current-value calculations, inherited class methods, prototype lookup and restoration even after an injected exception. They additionally launch both solution files in fresh Node processes and check their console output.

No DOM/browser page is needed for this console assignment. No claim of unaided authorship is made here; the mandatory AI-use report is maintained separately at assignment level.
