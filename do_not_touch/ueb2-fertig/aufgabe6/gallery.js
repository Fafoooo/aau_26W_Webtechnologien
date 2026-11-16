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
