/*

A generator for numbers like [009, 099, 999]
============================================
0-1-2-3-4-5-6-7-8-9 (9) 0-9
0-1-2-3-4-5-6-7-8-9 (99) 0-99

---------------
used functions:
---------------
standard:
    > substring
    > parseInt
    > push

made:
    > checkValue
    > get_Final_Numbers
    > setCharAt

*/

var basis = '00'
var level = 0;
var num = 0;
var stop_num = 33;
let final_nums_arr = [];
let result = [];

// console.log(checkValue(num, basis, level));
// checkValue(num, basis, level, stop_num);

module.exports = function checkValue(num, basis, level, stop_num) {
    console.log({
        num: num,
        tmp_num: final_nums_arr[level],
        basis: basis,
        level: level
    })
    if (level >= basis.length) { console.log(result); console.log("level reached basis.length FINISHED..."); return; }

    get_Final_Numbers(basis);
    let temp_basis = basis.substring(level + 1);
    let tmp_num = parseInt(final_nums_arr[level]);

    for (let i = num; i <= tmp_num; i++) {
        result.push(temp_basis + i);
        if (i == stop_num) { return result; }
    }

    checkValue(tmp_num + 1, basis, level + 1, stop_num)

    console.log(result);
    return result;
}

// ==============================================

function get_Final_Numbers(basis) {
    var str = basis;
    let newString = '';
    for (let i = 1; i <= str.length; i++) {
        let cropped = newString.substring(0, i);
        newString = setCharAt(cropped, cropped.length - i, '9');
        // console.log(typeof newString);
        final_nums_arr.push(newString);
    }
    // console.log(final_nums_arr);
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}



// ===============================================
// function endNum(basis) {
//   let new_basis = "";
//   for(let i=0; i<= basis.length; i++) {
//     new_basis.concat('9');
//   }
//   return new_basis;
// }

// console.log(endNum(basis));