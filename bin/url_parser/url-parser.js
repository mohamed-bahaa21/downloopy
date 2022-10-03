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

    // console.log('====================================');
    // console.log(url);
    // console.log(url.origin);
    // console.log(pathArr);
    // console.log('====================================');

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

    let letter = 0;
    while ((strA.charAt(letter) == strB.charAt(letter))) {
        str_before += strB.charAt(letter);
        letter++;
    }

    let rest = strB.slice(letter, strB.length);
    str_after += rest;

    return {
        str_before: str_before,
        str_after: str_after
    };
}

function generateNewUrls(origin, pathArr, inputs, FINISH_NUM, pages_arr = null) {
    let paths = pathArr.split(',');

    // console.log(pages_arr);

    if (pages_arr) {
        console.log('WTH');
        newPathsArr = [];
        for (let i = 0; i <= pages_arr.length-1; i++) {
            if (typeof inputs == Array) {
                inputs.map(ele => {
                    let tmp_ele = ele.split(',');

                    // NORMAL_bool = ele.includes("NORMAL");
                    // CIPHER_bool = ele.includes("CIPHER");

                    let str1 = paths[tmp_ele[0]];
                    let str2 = tmp_ele[1];
                    let newPath_tmp = this.parsePath(str1, str2); // page-1 / page-01

                    let str_type = tmp_ele[2];
                    if (str_type == "NORMAL") {
                        number = pages_arr[i];
                    }
                    if (str_type == "CIPHER") {
                        number = pages_arr[i];
                    }

                    let result = `${newPath_tmp.str_before}${number}${newPath_tmp.str_after}`
                    paths[tmp_ele[0]] = result;
                })
            } else {
                let tmp_ele = inputs.split(',');

                // NORMAL_bool = ele.includes("NORMAL");
                // CIPHER_bool = ele.includes("CIPHER");

                let str1 = paths[tmp_ele[0]]; // with numbers (page-12-)
                let str2 = tmp_ele[1]; // without numbers (page--)

                if (pages_arr[i] == 10) {
                    console.log({
                        a: paths,
                        b: paths[tmp_ele[0]],
                        c: paths[2],
                        d: pathArr,
                    });
                }


                let newPath_tmp = this.parsePath(str1, str2); // page-1 / page-01

                let str_type = tmp_ele[2];
                if (str_type == "NORMAL") {
                    number = pages_arr[i];
                }
                if (str_type == "CIPHER") {
                    number = pages_arr[i];
                }

                // from-web-developer-to-hardware-developer- - 1 024.jpg
                // from-web-developer-to-hardware-developer- 5 - 1024.jpg
                // 52
                console.log('====================================');
                console.log({ newPath_tmp, number });
                console.log('====================================');

                let result = `${newPath_tmp.str_before}${number}${newPath_tmp.str_after}`
                paths[tmp_ele[0]] = result;
            }

            let new_url = `${origin}/${paths.join('/')}`;
            newPathsArr.push(new_url);
        }
    } else {
        console.log('WTF');
        try {
            let number = 0;
            var _pages_num = checkValue(1, '00', 0, FINISH_NUM + 1);
            _pages_num.pop(-1);

            // let NORMAL_bool = false;
            // let CIPHER_bool = false;

            // console.log(origin);

            newPathsArr = [];
            for (let i = 1; i <= FINISH_NUM; i++) {
                if (typeof inputs == Array) {
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
                } else {
                    let tmp_ele = inputs.split(',');

                    // NORMAL_bool = ele.includes("NORMAL");
                    // CIPHER_bool = ele.includes("CIPHER");

                    let str1 = paths[tmp_ele[0]]; // with numbers (page-12-)
                    let str2 = tmp_ele[1]; // without numbers (page--)

                    if (i == 17) {
                        console.log({
                            a: paths,
                            b: paths[tmp_ele[0]],
                            c: paths[2],
                            d: pathArr,
                        });
                    }


                    let newPath_tmp = this.parsePath(str1, str2); // page-1 / page-01

                    let str_type = tmp_ele[2];
                    if (str_type == "NORMAL") {
                        number = i;
                    }
                    if (str_type == "CIPHER") {
                        number = _pages_num[i - 1];
                    }

                    // from-web-developer-to-hardware-developer- - 1 024.jpg
                    // from-web-developer-to-hardware-developer- 5 - 1024.jpg
                    // 52
                    console.log('====================================');
                    console.log({ newPath_tmp, number });
                    console.log('====================================');

                    let result = `${newPath_tmp.str_before}${number}${newPath_tmp.str_after}`
                    paths[tmp_ele[0]] = result;
                }

                let new_url = `${origin}/${paths.join('/')}`;
                newPathsArr.push(new_url);
            }
        } catch (error) {
            res.redirect('/');
        }
    }

    return newPathsArr;
}

// let str1 = 'hello20world10';
// let str2 = 'hello20world';

//let res = str2.split(str1)
// let res = parsePath(str1, str2);
// console.log(`${res.str_before} 050 ${res.str_after}`)

module.exports = { parseURL, parsePath, generateNewUrls };