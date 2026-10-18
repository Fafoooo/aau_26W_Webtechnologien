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

// Ergänzung: KI-unterstützt (OpenAI, gpt-6.1-sol); siehe ../erklaerung_4_6.md.
(() => {
    "use strict";
    const display = document.getElementById("displayDIV");
    const bigImage = display.querySelector(".bigIMG");
    const description = display.querySelector(".desc");
    let currentImage = null;

    // Der Original-Handler öffnet das Bild zuerst; danach merken wir die Auswahl.
    for (const image of document.querySelectorAll(".gallery img")) {
        image.addEventListener("click", (event) => {
            currentImage = event.currentTarget;
            bigImage.alt = currentImage.alt;
            description.textContent = currentImage.alt;
        });
    }

    function move(direction) {
        const thumbnails = Array.from(document.querySelectorAll(".gallery img"));
        if (thumbnails.length === 0) return;
        const index = Math.max(0, thumbnails.indexOf(currentImage));
        const nextIndex = (index + direction + thumbnails.length) % thumbnails.length;
        currentImage = thumbnails[nextIndex];
        bigImage.src = currentImage.dataset.large;
        bigImage.alt = currentImage.alt;
        description.textContent = currentImage.alt;
        display.style.display = "block";
    }

    function addButton(text, direction) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        // Die Original-CSS lässt unter dem großen Bild kaum Platz für weitere Zeilen.
        button.style.position = "absolute";
        button.style.bottom = "12px";
        if (direction < 0) button.style.right = "calc(50% + 4px)";
        else button.style.left = "calc(50% + 4px)";
        button.addEventListener("click", (event) => {
            // Sonst würde derselbe Klick zum Overlay weiterlaufen und hideImg auslösen.
            event.stopPropagation();
            move(direction);
        });
        display.append(button);
    }

    addButton("previous", -1);
    addButton("next", 1);
})();

// Assignment 3 extension: AI-assisted (OpenAI gpt-6.1-sol).
// The Assignment 2 file above is an unchanged byte prefix; see ../erklaerung_3_4.md.
(() => {
    "use strict";
    const display = document.getElementById("displayDIV");
    const bigImage = display.querySelector(".bigIMG");
    const next = Array.from(display.querySelectorAll("button"))
        .find((button) => button.textContent === "next");
    let timer = null;

    const controls = document.createElement("div");
    controls.className = "slideshow-controls";
    Object.assign(controls.style, {
        position: "absolute", bottom: "48px", left: "0", right: "0",
        display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
    });
    // Keep both control rows visible without modifying the supplied CSS file.
    bigImage.style.maxHeight = "calc(100% - 150px)";
    bigImage.style.maxWidth = "95vw";
    bigImage.style.objectFit = "contain";

    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "play";
    play.setAttribute("aria-pressed", "false");
    const exit = document.createElement("button");
    exit.type = "button";
    exit.textContent = "exit";
    const label = document.createElement("label");
    label.textContent = "Seconds per picture: ";
    const duration = document.createElement("input");
    duration.type = "number";
    duration.min = "0.001";
    duration.max = "2147483";
    duration.step = "any";
    duration.value = "3";
    duration.required = true;
    duration.style.width = "6em";
    label.append(duration);
    controls.append(play, exit, label);
    display.append(controls);

    function pause() {
        if (timer !== null) window.clearInterval(timer);
        timer = null;
        play.textContent = "play";
        play.setAttribute("aria-pressed", "false");
    }

    function start() {
        pause();
        // The maximum avoids the signed 32-bit millisecond limit of setInterval.
        if (!duration.checkValidity() || !Number.isFinite(duration.valueAsNumber)) {
            duration.reportValidity();
            return;
        }
        if (document.querySelectorAll(".gallery img").length === 0) return;
        timer = window.setInterval(() => next.click(), duration.valueAsNumber * 1000);
        play.textContent = "pause";
        play.setAttribute("aria-pressed", "true");
    }

    // No click in the new controls may reach the original overlay-close listener.
    controls.addEventListener("click", (event) => event.stopPropagation());
    play.addEventListener("click", () => {
        if (timer === null) start();
        else pause();
    });
    exit.addEventListener("click", () => {
        pause();
        display.style.display = "none";
    });
    duration.addEventListener("input", () => {
        if (timer !== null) start();
    });
    // Original background/image closing must also stop the slideshow.
    display.addEventListener("click", pause);
    for (const image of document.querySelectorAll(".gallery img")) {
        image.addEventListener("click", pause);
    }
    window.addEventListener("pagehide", pause);
})();
