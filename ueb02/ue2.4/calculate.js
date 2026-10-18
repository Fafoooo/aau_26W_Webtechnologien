// KI-unterstützte Lösung (OpenAI, gpt-6.1-sol); Erläuterung: ../erklaerung_4_6.md.
"use strict";

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const colorInput = document.getElementById("color");
const orderForm = widthInput.form;

// Nur den Absatz mit der wiederholten Überschrift entfernen.
const heading = document.querySelector("h1");
const duplicate = heading.nextElementSibling;
if (duplicate && duplicate.tagName === "P" &&
    duplicate.textContent.trim() === heading.textContent.trim()) {
    duplicate.remove();
}

// Das Original-HTML bleibt unverändert; die Ergänzung entsteht nur im DOM.
const priceInput = document.createElement("input");
priceInput.type = "text";
priceInput.id = "price";
priceInput.name = "price";
priceInput.readOnly = true;
const priceLabel = document.createElement("label");
priceLabel.htmlFor = priceInput.id;
priceLabel.textContent = "price";
widthInput.closest("fieldset").append(priceInput, priceLabel);

// Alle drei Parameter sind in cm. Die Farbe wird aus dem Formular gelesen.
function calculate(width, height, thickness) {
    const color = colorInput.value.toLowerCase();
    const red = color.slice(1, 3);
    const green = color.slice(3, 5);
    const blue = color.slice(5, 7);
    const divisor = red === green && green === blue ? 50 : 32;
    return width * height * thickness / divisor;
}

function update() {
    // "All required inputs" umfasst auch die erforderlichen Kontaktdaten.
    // checkValidity prüft zusätzlich Einschränkungen optionaler Felder.
    if (!orderForm.checkValidity()) {
        priceInput.value = "-";
        return;
    }
    const thicknessInput = orderForm.querySelector('input[name="thickness"]:checked');
    if (!thicknessInput) {
        priceInput.value = "-";
        return;
    }
    const width = widthInput.valueAsNumber;
    const height = heightInput.valueAsNumber;
    const thickness = Number(thicknessInput.value) / 10; // mm -> cm
    const price = calculate(width, height, thickness);
    priceInput.value = Number.isFinite(price) ? price.toFixed(2) : "-";
}

// Delegation berücksichtigt Geometrie, Farbe, Pflichtkontakte und optionale Felder.
orderForm.addEventListener("input", update);
orderForm.addEventListener("change", update);
update();
