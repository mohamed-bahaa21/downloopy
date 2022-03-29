// =======================================
// a href

var hrefs_arr = [];
function getAllImgs() {
    var links = document.getElementsByTagName("a");
    for (var i = 0, max = links.length; i < max; i++) {
        hrefs_arr.push(links[i].href);
    }

    return hrefs_arr;
}

// =======================================
// img src
var imgs_arr = [];
function getAllImgs() {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0, max = imgs.length; i < max; i++) {
        imgs_arr.push(imgs[i].src);
    }

    return imgs_arr;
}
