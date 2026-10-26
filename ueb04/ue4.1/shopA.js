'use strict';

let products = [];

function updateCart() {
    const output = document.getElementById('orderedItems');
    output.replaceChildren();
    let totalCents = 0;
    for (const p of products) {
        if (p.numInCart > 0) {
            const row = document.createElement('li');
            row.textContent = `${p.title} ${p.price.toFixed(2)} (${p.numInCart})`;
            output.appendChild(row);
            totalCents += Math.round(p.price * 100) * p.numInCart;
        }
    }
    document.getElementById('totalPrice').textContent = (totalCents / 100).toFixed(2);
}

for (let pdiv of document.querySelectorAll('div.product')) {
    let cp = {};
    cp.id = pdiv.dataset.prodid;
    cp.title = pdiv.querySelector('h2').textContent;
    cp.desc = pdiv.querySelector('.desc').textContent;
    cp.price = Number(pdiv.querySelector('.price').textContent.trim().replace(',', '.'));
    cp.numInCart = 0;
    cp.domElement = pdiv;
    products.push(cp);

    const clickButton = pdiv.querySelector('.buy');
    clickButton.addEventListener('click', function (e) {
        console.log(e);
        cp.numInCart += 1;
        updateCart();
    });
}

document.getElementById('emptyCard').addEventListener('click', function () {
    for (const p of products) p.numInCart = 0;
    updateCart();
});

// Move the existing nodes, keeping their listeners and the order section intact.
products.sort((a, b) => a.price - b.price);
const orderSection = document.getElementById('orderedItems').parentElement;
for (const p of products) orderSection.parentElement.insertBefore(p.domElement, orderSection);
updateCart();
