const fs = require('fs-extra')

module.exports = function MoveChosenFiles(dir) {
    // ensureDir With a callback
    fs.readdir(`${dir}`, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < files.length; i++) {

                const file = files[i];
                // console.log(file);

                let fileSize = getFilesizeInKiloBytes(file);
                if (fileSize >= 100) {

                    fs.moveSync(file, `${dir}/../chosen/${i}`);
                    console.log('The file has been moved');

                } else {
                    console.log(`file ${i} is less than 100KB`);
                }

            }
        }
    });
    // =========================
}

function getFilesizeInKiloBytes(filename) {
    console.log(filename);
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    // TODO:: Convert the file to optional sizes
    var fileSizeInKilobytes = fileSizeInBytes / (1024);
    return fileSizeInKilobytes;
}

function test() {
    fs.ensureDir(`${dir}/chosen/`, err => {
        if (err) {
            console.log(err) // => null 
            return;
        } else {
            // dir has now been created, including the directory it is to be placed in
            // console.log("Folder created OR Already found");
            // ==========================
            // console.log(dir);
            fs.readdir(dir, (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    for (let i = 0; i < files.length; i++) {

                        const file = files[i];
                        // console.log(file);
                        if (fs.statSync(file).isDirectory()) {
                            console.log(`${file} is dir`);
                            continue;
                        } else {
                            let fileSize = getFilesizeInKiloBytes(file);
                            if (fileSize >= 100) {

                                fs.moveSync(file, `${dir}/${i}`);
                                console.log('The file has been moved');

                            } else {
                                console.log(`file ${i} is less than 100KB`);
                            }
                        }
                    }
                }
            });
            // =========================
        }
        // =========================
    })
}