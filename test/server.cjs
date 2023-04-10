const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);

  const responseObject = {
    message: "Hello, world!",
  };

  const jsonResponse = JSON.stringify(responseObject);
  res.end(jsonResponse);
});

server.listen(3000, () => {
  console.log("Server started");
});
