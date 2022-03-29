const fs = require('fs')

// let testarr = require('./test.js')
let testarr = JSON.parse(fs.readFileSync('test.js', {encoding: 'UTF-8', flag: 'r'}))

let newObj = {
    name: 'ayk',
    age: 4
}

function addObjectToArray(arr, obj) {
    console.log("Array: ", arr);
    console.log("Object: ", obj);
    arr.push(obj);
}
addObjectToArray(testarr, newObj)

fs.writeFileSync('test.js', JSON.stringify(testarr), err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
})