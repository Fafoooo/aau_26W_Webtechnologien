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
