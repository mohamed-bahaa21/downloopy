const express = require("express");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request"), {
  multiArgs: true
});
const fs = Promise.promisifyAll(require("fs"));

const app = express();


app.use(bodyParser.urlencoded({
  extended: false
}), bodyParser.json());

const download = (response) => {

  // NUMBERS CONFIG
  // SHOULD HAVE CHOICES FOR NUMBER FORMAT (1, 01, 001)
  let imgs_nums = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ]

  // FOR LOOP STARTS
  for (let index = 0; index < imgs_nums.length; index++) {
    const element = imgs_nums[index];

    const uri = `https://image.slidesharecdn.com/paradigmsofleadership-160122220040/95/paradigms-of-leadership-${imgs_nums[index]}-638.jpg?cb=1453500159`;

    request.head(uri, function (err, res, body) {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      var f = fs.createWriteStream(`imgs/image-${imgs_nums[index]}.jpg`);

      f.on("finish", function () {
        // do stuff
        console.log(`STREAM::WRITE::DONE__IMG::${imgs_nums[index]}`);
      });

      request(uri)
        .pipe(f)
        .on("finish", () => {
          console.log(`PIPE::DONE__IMG::${imgs_nums[index]}`);
        });
    });
  }

  // FOR LOOP ENDS
  response.send('<h1>Download Finished</h1>')
};

app.get("/", (req, res) => {
  download(res);
});

app.listen(3000, console.log("Main Server: 3000"));