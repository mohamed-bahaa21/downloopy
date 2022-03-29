var basis = 0;
var end = 999;
let result = [];

function checkValue(basis) {
    for (let i = basis; i <= end; i++) {
        result.push(i);
    }
    return;
}

console.log(checkValue(basis));