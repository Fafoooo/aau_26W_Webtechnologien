'use strict';

// 3a: A higher-order function takes a function as an argument.
function repeatTransform(transform, times, initial) {
    let result = initial;
    for (let i = 0; i < times; i += 1) {
        result = transform(result);
    }
    return result;
}

// 3b: Each invocation creates its own persistent lexical environment.
function createCounter(start) {
    let value = start;
    return function (step = 1) {
        value += step;
        return value;
    };
}

// 3c: Three arguments become three successive one-argument calls.
function shippingCost(base) {
    return function (perItem) {
        return function (quantity) {
            return base + perItem * quantity;
        };
    };
}

function runDemo() {
    console.log('3a - repeatTransform:', repeatTransform(value => value * 2, 3, 5));
    console.log('3a - map:', [1, 2, 3].map(value => value * 2));
    console.log('3a - filter:', [1, 2, 3, 4].filter(value => value % 2 === 0));
    console.log('3a - reduce:', [1, 2, 3].reduce((sum, value) => sum + value, 0));
    const first = createCounter(10);
    const second = createCounter(100);
    console.log('3b - first:', first());
    console.log('3b - first again:', first(2));
    console.log('3b - independent second:', second());
    const localRate = shippingCost(5)(2);
    console.log('3c - curried:', shippingCost(5)(2)(3));
    console.log('3c - partially applied:', localRate(4));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { repeatTransform, createCounter, shippingCost, runDemo };
    if (require.main === module) runDemo();
} else {
    runDemo();
}
