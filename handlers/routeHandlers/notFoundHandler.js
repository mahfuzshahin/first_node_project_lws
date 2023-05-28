const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  //console.log("Not Found");
  callback(404, {
    message: "Your request not found",
  });
};
module.exports = handler;
