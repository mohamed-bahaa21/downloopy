// 1) choose charachters to change
// 2) pick number sys for each part
// 3) prevent similar to change

const checkValue = require('../url_numbers_generator/zeros_pattern');

function main() {
    let str = "string001str";
    let str2 = "001";
    let res = str.split(str2).join('010');
    console.log(res);
}

function parseURL(link) {
    let url = new URL(link);
    let pathArr = url.pathname.split('/');
    pathArr.shift();

    return {
        url: url,
        origin: url.origin,
        pathArr: pathArr,
    }
}

// let url = parseURL('https://ocw.u-tokyo.ac.jp/lecture_files/eco_01/10/notes/en/BusinessAdministration1_10.pdf');
// console.log(url.host)

function parsePath(strA, strB) {
    str_before = "";
    str_after = "";
    for (var i = 0; i < strA.length; i++) {
        checkLetterEqual = (strA.charAt(i) == strB.charAt(i))

        if (checkLetterEqual) {
            str_before += strB.charAt(i);
        } else {
            str_after += strB.charAt(i);
        }
    }
    return {
        str_before: str_before,
        str_after: str_after
    };
}

function generateNewUrls(origin, pathArr, inputs) {
    let paths = pathArr.split(',');

    let number = 0;
    var _pages_num = checkValue(1, '00', 0, 16);
    _pages_num.pop(-1);

    // let NORMAL_bool = false;
    // let CIPHER_bool = false;

    newPathsArr = [];
    for (let i = 1; i <= 15; i++) {
        inputs.map(ele => {
            let tmp_ele = ele.split(',');

            // NORMAL_bool = ele.includes("NORMAL");
            // CIPHER_bool = ele.includes("CIPHER");

            let str1 = paths[tmp_ele[0]];
            let str2 = tmp_ele[1];
            let newPath_tmp = this.parsePath(str1, str2); // page-1 / page-01

            let str_type = tmp_ele[2];
            if (str_type == "NORMAL") {
                number = i;
            }
            if (str_type == "CIPHER") {
                number = _pages_num[i - 1];
            }

            let result = `${newPath_tmp.str_before}${number}${newPath_tmp.str_after}`
            paths[tmp_ele[0]] = result;
        })
        let new_url = `${origin}/${paths.join('/')}`;
        newPathsArr.push(new_url);
    }

    return newPathsArr;
}

// let str1 = 'hello20world10';
// let str2 = 'hello20world';

//let res = str2.split(str1)
// let res = parsePath(str1, str2);
// console.log(`${res.str_before} 050 ${res.str_after}`)

module.exports = { parseURL, parsePath, generateNewUrls };