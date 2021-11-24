const request = require("request")
const fs = require('fs-extra')

function request_page() {
    return function (uri, element, total_dir) {
        request.head(uri, function (err, res, body) {
            // console.log("content-type:", res.headers["content-type"]);
            // console.log("content-length:", res.headers["content-length"]);
            // check file size before downloading, if !maxSize download else write a blank file.
            let maxSize = false;
            if (!maxSize) {
                var f = fs.createWriteStream(`${total_dir}/IMG-${element}.jpg`);

                f.on("finish", () => {
                    console.log({
                        msg: `STREAM::WRITE::PIPE::DONE__IMG::${element}`
                    });
                });
                f.on('close', () => {
                    console.log({
                        msg: `PIPE::CLOSED`
                    });
                })

                request
                    .get(uri)
                    .on('response', (response) => {
                        return console.log({
                            statusCode: response.statusCode, //200
                            header: response.headers['content-type'], //img/jpg
                            msg: `STREAM::WRITE::PIPE::STARTED__IMG::${element}`
                        })
                    })
                    .pipe(f)

            } else {
                var f = fs.createWriteStream(`${total_dir}/IMG-${element}.jpg`);
            }
        });
    }
}

module.exports = request_page


