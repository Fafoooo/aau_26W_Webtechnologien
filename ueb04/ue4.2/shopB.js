'use strict';

let products = [];

const productList = {
    products: products,
    listProducts: function () {
        this.products.forEach((product, index) => {
            if (product.numInCart > 0) {
                const nextProductIndex = (index + 1) % this.products.length;
                const nextProduct = this.products[nextProductIndex];
                console.log(`${nextProduct.title};`);
            }
        });
    }
};

function updateCart() {
    const output = document.getElementById('orderedItems');
    output.replaceChildren();
    let totalCents = 0;
    for (const p of products) {
        if (p.numInCart > 0) {
            const row = document.createElement('li');
            row.textContent = p.render();
            output.appendChild(row);
            totalCents += Math.round(p.price * 100) * p.numInCart;
        }
    }
    document.getElementById('totalPrice').textContent = (totalCents / 100).toFixed(2);
    console.log('Log: Updated cart: ');
    productList.listProducts();
}

function Product(el) {
    this.id = el.dataset.prodid;
    this.title = el.querySelector('h2').textContent;
    this.desc = el.querySelector('.desc').textContent;
    this.price = Number(el.querySelector('.price').textContent.trim().replace(',', '.'));
    this.numInCart = 0;

    this.updateProduct = function (e) {
        this.numInCart += 1;
        updateCart();
    };
    this.render = function () {
        return `${this.title} ${this.price.toFixed(2)} (${this.numInCart})`;
    };
    const clickButton = el.querySelector('.buy');
    clickButton.addEventListener('click', this.updateProduct.bind(this));
}

for (const pdiv of document.querySelectorAll('div.product')) {
    products.push(new Product(pdiv));
}
document.getElementById('emptyCard').addEventListener('click', () => {
    for (const p of products) p.numInCart = 0;
    updateCart();
});
updateCart();
