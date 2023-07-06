const http = require("http");

const { handleReqRes } = require("./helpers/handleReqRes");

const worker = {};

//handle request response

worker.init = () => {
  console.log("Workers started");
};
module.exports = worker;
