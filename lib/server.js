const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

const server = {};

server.config = {
  port: 3000,
};

server.createServer = () => {
  const createServervariable = http.createServer(server.handelReqRes);
  createServervariable.listen(server.port, () => {
    console.log(`listen port ${server.config.port} `);
  });
};

//handle request response

server.handelReqRes = handleReqRes;
server.init = () => {
  server.createServer();
};
module.exports = server;
