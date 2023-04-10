const http = require("http");
let count = 1;

http
  .createServer((req, res) => {
    count++;
    console.log(`count is ${count}`);
    if (count % 3 === 0) {
      res.write("hello\n");
      res.end();
    } else {
      res.statusCode = 500;
      res.end();
    }
  })
  .listen(3000);
