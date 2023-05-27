const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

const app = {};

app.config = {
  port: 3000,
};

//create server

app.createServer = () => {
  const server = http.createServer(app.handelReqRes);
  server.listen(app.config.port, () => {
    console.log(`listen port ${app.config.port} `);
  });
};

//handle request response

app.handelReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;
  const decoder = new StringDecoder("utf-8");
  let realData = "";
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);
    res.end("Hello world");
  });
  //console.log(headersObject);
};
app.createServer();
