addToPipe(req, res, 1).then(() => {
    res.send('hello');
})

// promises.push();
// Promise.all(promises)
//     .then(function (data) {
//         // console.log(data);
//         // add the test sample to download.samples file
//         let newSample = {
//             name: `${FOLDER_NAME}`,
//             website: `${website}`,
//             link: `${URI_START}{page_number}${URI_END}`
//         }
//         addNewSampleToFile(newSample);
//     }).then(() => {
//         res.send('<h1>Downloaded...</h1>')
//     })
//     .catch(function (err) {
//         console.error(err);
//         res.send('ERROR...')
//     });

// A function for adding to pipe with page_number parameter
// add number if !total else return
const addToPipe = (req, res, start) => {
    const FOLDER_DIR = "data/imgs/output/";
    const {
        website,
        FOLDER_NAME,
        URI_START,
        URI_END
    } = req.body;

    let START_NUM = start;
    const FINISH_NUM = Number(req.body.FINISH_NUM);
    // TODO:: if !== FINISH_NUM -> index++
    // console.log(typeof(Number(process.env.FINISH_NUM)));

    const total_dir = FOLDER_DIR + FOLDER_NAME
    const total_imgs_num = FINISH_NUM - START_NUM;

    // ensureDir With a callback:
    fs.ensureDir(total_dir, err => {
        console.log(err) // => null
        // dir has now been created, including the directory it is to be placed in
        console.log("Folder Created.");
    })
    var promises = [];
    // FOR LOOP STARTS
    let index = 0;
    const element = START_NUM + index;
    const uri = `${URI_START}${element}${URI_END}`;

    // request logic
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
                    console.log({
                        statusCode: response.statusCode, //200
                        header: response.headers['content-type'], //img/jpg
                        msg: `STREAM::WRITE::PIPE::STARTED__IMG::${element}`
                    })
                })
                .pipe(f)
                .end(() => {
                    if (START_NUM <= total_imgs_num) {
                        START_NUM++;
                        addToPipe(req, res, START_NUM)
                    } else {
                        return;
                    }
                })
        } else {
            var f = fs.createWriteStream(`${total_dir}/IMG-${element}.jpg`);
        }
    })
}
