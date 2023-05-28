const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

const { handleReqRes } = require("./helpers/handleReqRes");
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

app.handelReqRes = handleReqRes;
app.createServer();
