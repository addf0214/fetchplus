const http = require('node:http');
let count = 1;

// Server has a 5 seconds keep-alive timeout by default
http.createServer((req, res) => {
    count++;
    console.log(`count is ${count}`)
    if (count % 3 === 0) {
        res.setHeader('Content-Type', 'text/plain');
        res.write('hello\n');
        res.end();
    } else {
        res.statusCode = 500;
        res.end();
    }
}).listen(3000);