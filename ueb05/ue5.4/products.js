'use strict';

const container = document.getElementById('productContainer');
const productURL = 'products.json';
initialize(productURL, container);

function initialize(jsonURL, domElement) {
    domElement.textContent = 'Loading products...';
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        const fail = error => {
            showError(domElement, error);
            resolve(null);
        };
        request.addEventListener('load', () => {
            try {
                if (request.status < 200 || request.status >= 300) {
                    throw new Error('HTTP ' + request.status);
                }
                const products = validateProducts(JSON.parse(request.responseText));
                renderProducts(products, domElement);
                resolve(products);
            } catch (error) {
                fail(error);
            }
        });
        request.addEventListener('error', () => fail(new Error('Network error.')));
        request.addEventListener('timeout', () => fail(new Error('Request timed out.')));
        request.addEventListener('abort', () => fail(new Error('Request aborted.')));
        try {
            request.open('GET', jsonURL, true);
            request.timeout = 10000;
            request.send();
        } catch (error) {
            fail(error);
        }
    });
}

// Validate the complete document before changing the displayed product list.
function validateProducts(products) {
    if (!Array.isArray(products)) throw new Error('Expected an array of products.');
    const ids = new Set();
    for (const product of products) {
        if (!product || typeof product !== 'object' ||
            typeof product.id !== 'string' || product.id.trim() === '' ||
            typeof product.title !== 'string' || typeof product.desc !== 'string' ||
            typeof product.price !== 'number' || !Number.isFinite(product.price) ||
            product.price < 0 || ids.has(product.id)) {
            throw new Error('Invalid or duplicate product data.');
        }
        ids.add(product.id);
    }
    return products;
}

function renderProducts(products, domElement) {
    const fragment = document.createDocumentFragment();
    for (const product of products) {
        const card = document.createElement('div');
        card.className = 'product';
        card.dataset.prodid = product.id;
        const heading = document.createElement('h2');
        heading.textContent = product.title;
        const row = document.createElement('div');
        const description = document.createElement('div');
        description.className = 'desc';
        description.textContent = product.desc;
        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = product.price.toFixed(2).replace('.', ',');
        const buy = document.createElement('div');
        buy.className = 'buy';
        const button = document.createElement('input');
        button.type = 'button';
        button.value = 'add to cart';
        button.setAttribute('aria-label', 'Add ' + product.title + ' to cart');
        const quantity = document.createElement('output');
        quantity.className = 'quantity';
        quantity.setAttribute('aria-live', 'polite');
        let count = 0;
        quantity.textContent = ' (0)';
        button.addEventListener('click', () => {
            count += 1;
            quantity.textContent = ' (' + count + ')';
        });
        buy.append(button, quantity);
        row.append(description, price, buy);
        card.append(heading, row);
        fragment.appendChild(card);
    }
    domElement.replaceChildren(fragment);
    if (products.length === 0) domElement.textContent = 'No products available.';
}

function showError(domElement, error) {
    const message = document.createElement('p');
    message.className = 'error';
    message.setAttribute('role', 'alert');
    message.textContent = 'Could not load products: ' + error.message;
    domElement.replaceChildren(message);
}
