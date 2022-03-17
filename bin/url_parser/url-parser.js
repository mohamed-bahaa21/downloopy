
function parseURL(link) {
    let url = new URL(link);
    let pathArr = url.pathname.split('/');
    pathArr.shift();

    return {
        url: url,
        pathArr: pathArr,
    }
}

let url = parseURL('https://ocw.u-tokyo.ac.jp/lecture_files/eco_01/10/notes/en/BusinessAdministration1_10.pdf');
console.log(url.host)
