const express = require("express");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request"), {
    multiArgs: true
});
const fs = Promise.promisifyAll(require("fs"));

// const htmlparser2 = require("htmlparser2");

// download all files
exports.downloadAll = (req, response, next) => {
    // NUMBERS CONFIG
    // SHOULD HAVE CHOICES FOR NUMBER FORMAT (1, 01, 001)

    // let imgs_nums_arr = [
    //   '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    //   '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    //   '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
    // ]

    const imgs_nums = 59;

    // TODO:: if !== finish_num -> index++
    const start_num = 319;
    const finish_num = 378;

    // FOR LOOP STARTS
    for (let index = 0; index < imgs_nums; index++) {
        const element = start_num + index;

        const uri = `https://archive.alsharekh.org/MagazinePages/Magazine_JPG/EL_Mawred/mogalad_12/Issue_4/${element}.JPG`;

        request.head(uri, function (err, res, body) {
            console.log("content-type:", res.headers["content-type"]);
            console.log("content-length:", res.headers["content-length"]);

            var f = fs.createWriteStream(`imgs/image-${element}.jpg`);

            f.on("finish", function () {
                // do stuff
                console.log(`STREAM::WRITE::DONE__IMG::${element}`);
            });

            request(uri)
                .pipe(f)
                .on("finish", () => {
                    console.log(`PIPE::DONE__IMG::${element}`);
                });
        });
    }

    // FOR LOOP ENDS
    response.send('<h1>Download Finished</h1>')
};

// download one file
exports.downloadOne = (req, response, next) => {

    const img_num = 378;
    const uri = `https://archive.alsharekh.org/MagazinePages/Magazine_JPG/EL_Mawred/mogalad_12/Issue_4/${img_num}.JPG`;

    request.head(uri, function (err, res, body) {
        console.log("content-type:", res.headers["content-type"]);
        console.log("content-length:", res.headers["content-length"]);

        var f = fs.createWriteStream(`imgs/image-${img_num}.jpg`);

        f.on("finish", function () {
            // do stuff
            console.log(`STREAM::WRITE::DONE__IMG::${img_num}`);
        });

        request(uri)
            .pipe(f)
            .on("finish", () => {
                console.log(`PIPE::DONE__IMG::${img_num}`);
                response.send('<h1>Download Finished</h1>')
            });
    });
}

// watch stream
var progress = require('progress-stream');
var fs = require('fs');

var stat = fs.statSync(filename);
var str = progress({
  length: stat.size,
  time: 100 /* ms */
});

str.on('progress', function (progress) {
  console.log(progress);

  /*
  {
    percentage: 9.05,
    transferred: 949624,
    length: 10485760,
    remaining: 9536136,
    eta: 42,
    runtime: 3,
    delta: 295396,
    speed: 949624
  }
  */
});

fs.createReadStream(filename)
  .pipe(str)
  .pipe(fs.createWriteStream(output));

// landing
exports.getLanding = (req, res, next) => {
    Horizon.find().then((result) => {
        Blog.find().limit(3).then(blogs => {
            // console.log(blogs;      
            // console.log(result[4]);

            res.render("index", {
                msgs: req.flash('success'),
                blogs: blogs,
                horizon: result[0],
                ld1: result[1],
                li1: result[2],
                ld2: result[6],
                li2: result[3],
                wv: result[4],
                ss: result[5],
                ld3: result[7],
                pi: result[8],
                ti: result[9]
            })
        });
    });
};