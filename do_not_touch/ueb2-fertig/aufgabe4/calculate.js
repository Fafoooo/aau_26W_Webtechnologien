const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const colorInput = document.getElementById("color");
const thicknessInputs = document.querySelectorAll('input[name="thickness"]');

// delete the paragraph that repeats the heading
document.querySelector("h1 + p").remove();

// add read-only price field with label at the end of the glass specification
const priceInput = document.createElement("input");
priceInput.type = "text";
priceInput.id = "price";
priceInput.name = "price";
priceInput.readOnly = true;

const priceLabel = document.createElement("label");
priceLabel.htmlFor = "price";
priceLabel.textContent = "price";

widthInput.parentElement.append(priceInput, priceLabel);

// width, height and thickness in cm
function calculate(width, height, thickness) {
    // color value has the form #rrggbb
    const color = colorInput.value.toLowerCase();
    const r = color.substring(1, 3);
    const g = color.substring(3, 5);
    const b = color.substring(5, 7);

    if (r === g && g === b) {
        return width * height * thickness / 50; // shade of grey
    }
    return width * height * thickness / 32; // colored
}

function update() {
    // a required radio group is only valid if one radio is checked
    const valid = widthInput.checkValidity() &&
        heightInput.checkValidity() &&
        thicknessInputs[0].checkValidity();

    if (!valid) {
        priceInput.value = "-";
        return;
    }

    const thickness = document.querySelector('input[name="thickness"]:checked').value / 10; // mm -> cm
    const price = calculate(Number(widthInput.value), Number(heightInput.value), thickness);
    priceInput.value = price.toFixed(2);
}

widthInput.addEventListener("input", update);
heightInput.addEventListener("input", update);
colorInput.addEventListener("input", update);
for (const radio of thicknessInputs) {
    radio.addEventListener("change", update);
}
update();
