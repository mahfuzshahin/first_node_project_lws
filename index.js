const http = require("http");

const { handleReqRes } = require("./helpers/handleReqRes");
const environemnt = require("./helpers/environments");
const data = require("./lib/data");
const app = {};

// data.create(
//   "test",
//   "newFile",
//   { name: "Bangladesh", language: "Bangla" },
//   function (err) {
//     console.log(`error was`, err);
//   }
// );
// data.read("test", "newFile", (err, data) => {
//   console.log(err, data);
// });
// data.update(
//   "test",
//   "newFile",
//   { name: "Eangladesh", language: "Eangla" },
//   (err) => {
//     console.log(err);
//   }
// );
data.delete("test", "newFile", (err) => {
  console.log(err);
});
//update existing file
//create server

app.createServer = () => {
  const server = http.createServer(app.handelReqRes);
  server.listen(environemnt.port, () => {
    //console.log(`environment variable is ${process.env.NODE_ENV}`);
    console.log(`listen port ${environemnt.port} `);
  });
};

//handle request response

app.handelReqRes = handleReqRes;
app.createServer();
