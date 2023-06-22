const data = require("../../lib/data");
const { parseJSON, createRandomString } = require("../../helpers/utilities");
const { maxChecks } = require("../../helpers/environments");
const tokenHandler = require("./tokenHandler");
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  //console.log(requestProperties);
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._check = {};
handler._check.post = (requestProperties, callback) => {
  // validate inputs
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : "tt";
  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;
  console.log("url", successCodes);
  if (protocol && url && method && successCodes && timeOutSeconds) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    data.read("tokens", token, (err1, tokenData) => {
      if (!err1) {
        let userPhone = parseJSON(tokenData).phone;
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      //add check id to the users object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      //save the new user data
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          //return data
                          callback(200, checkObject);
                        } else {
                          callback(500, { error: "Server Problem" });
                        }
                      });
                    } else {
                      callback(500, { error: "Server Problem" });
                    }
                  });
                } else {
                  callback(401, { error: "Not Allw" });
                }
              } else {
                callback(403, { error: "User Not Found" });
              }
            });
          } else {
            callback(403, { error: "User Not Found" });
          }
        });
      } else {
        callback(403, { error: "Auth Problem" });
      }
    });
  } else {
    callback(400, { error: "Problem last" });
  }
};
handler._check.get = (requestProperties, callback) => {};
handler._check.put = (requestProperties, callback) => {};
handler._check.delete = (requestProperties, callback) => {};
module.exports = handler;
