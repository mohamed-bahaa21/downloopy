// 1) choose charachters to change
// 2) pick number sys for each part
// 3) prevent similar to change

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

// let str1 = 'hello20world10';
// let str2 = 'hello20world';

//let res = str2.split(str1)
// let res = parsePath(str1, str2);
// console.log(`${res.str_before} 050 ${res.str_after}`)

module.exports = { parseURL, parsePath };