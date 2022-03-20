// let promises = [];
// let stream = needle.head(uri, function (error, response) {
//     if (!error && response.statusCode == 200) {
//         downloaded_pages.push(element)
//     } else {
//         lost_pages.push(element);
//         console.log({
//             msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
//             err: error,
//             downloaded_pages: downloaded_pages.length,
//             lost_pages: lost_pages.length,
//             all_download_task: all_download_task,
//             sum: lost_pages.length + downloaded_pages.length,
//             total_imgs_num: total_imgs_num
//         });
//     }
// });
// promises.push(needle.get(uri, (error, response) => {
//     // console.log(response)
//     if (!error && response.statusCode == 200) {
//         downloaded_pages.push(element);
//     } else {
//         lost_pages.push(element);
//         console.log({
//             msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
//             err: error,
//         });
//     }
// }).pipe(f));

// --------------------------------------------------------------------------------

// let promises = []
// promises.push(needle.get(uri, function (error, response) {
//     // console.log(response)
//     if (!error && response.statusCode == 200) {
//         downloaded_pages.push(element);
//     } else {
//         lost_pages.push(element);
//         console.log({
//             msg: `STREAM::WRITE::PIPE::ERROR::${element}`,
//             err: error,
//         });
//     }
// }).pipe(f));
// Promise.all(promises);


// cipher numbering 
// request.head(uri, function (err, res, body) {
//     // console.log("content-type:", res.headers["content-type"]);
//     // console.log("content-length:", res.headers["content-length"]);
//     // check file size before downloading, if !maxSize download else write a blank file.
//     let maxSize = false;
//     if (!maxSize) {
//         var f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);

//         f.on("finish", () => {
//             console.log({
//                 msg: `STREAM::WRITE::PIPE::DONE__${FILE_NAME}::${element}`
//             });
//         });
//         f.on('close', () => {
//             console.log({
//                 msg: `PIPE::CLOSED`
//             });
//         })

//         request
//             .get(uri)
//             .on('response', (response) => {
//                 console.log({
//                     statusCode: response.statusCode, //200
//                     header: response.headers['content-type'], //img/${FILE_TYPE}
//                     msg: `STREAM::WRITE::PIPE::STARTED__${FILE_NAME}::${element}`
//                 })
//             })
//             .pipe(f)

//     } else {
//         var f = fs.createWriteStream(`${total_dir}/${FILE_NAME}-${element}.${FILE_TYPE}`);
//     }
// });