// FOR LOOP STARTS
for (let index = 0; index < imgs_nums; index++) {
    const element = start_num + index;

    const uri = `${uri_start}${element}${uri_end}`;

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