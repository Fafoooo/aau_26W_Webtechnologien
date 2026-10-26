'use strict';

let products = [];

const productList = {
    products: products,
    listProducts: function () {
        this.products.forEach((product, index) => {
            if (product.numInCart > 0) {
                const nextProductIndex = (index + 1) % this.products.length;
                console.log(`${this.products[nextProductIndex].title};`);
            }
        });
    }
};

function updateCart() {
    const output = document.getElementById('orderedItems');
    output.replaceChildren();
    let totalCents = 0;
    for (const p of products) {
        p.updateButtons();
        if (p.numInCart > 0) {
            const row = document.createElement('li');
            row.textContent = p.render();
            output.appendChild(row);
            totalCents += Math.round(p.getTotalPrice() * 100);
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
    this.domElement = el;
    this.removeButton = document.createElement('button');
    this.removeButton.type = 'button';
    this.removeButton.textContent = '\u2212';
    this.removeButton.setAttribute('aria-label', `Remove one ${this.title} from cart`);
    this.removeButton.disabled = true;
    el.querySelector('.buy').appendChild(this.removeButton);
    // Use the original input, not its parent: a minus click must not also add.
    el.querySelector('.buy input').addEventListener('click', this.updateProduct.bind(this));
    this.removeButton.addEventListener('click', this.removeOneFromCart.bind(this));
}

Product.prototype.updateProduct = function (e) {
    this.numInCart += 1;
    updateCart();
};
Product.prototype.removeOneFromCart = function (e) {
    if (this.numInCart === 0) return;
    this.numInCart -= 1;
    updateCart();
};
Product.prototype.getTotalPrice = function () {
    return Math.round(this.price * 100) * this.numInCart / 100;
};
Product.prototype.render = function () {
    return `${this.title} ${this.price.toFixed(2)} (${this.numInCart}) \u2014 Total: ${this.getTotalPrice().toFixed(2)}`;
};
Product.prototype.updateButtons = function () {
    this.removeButton.disabled = this.numInCart === 0;
};

for (const pdiv of document.querySelectorAll('div.product')) {
    products.push(new Product(pdiv));
}
// The supplied HTML calls the first item Sony Alpha IV (id sonyAIV), not A7V.
if (products.length > 0) {
    products[0].render = function () {
        return Product.prototype.render.call(this) + ' New Arrival!';
    };
}
document.getElementById('emptyCard').addEventListener('click', () => {
    for (const p of products) p.numInCart = 0;
    updateCart();
});
updateCart();
