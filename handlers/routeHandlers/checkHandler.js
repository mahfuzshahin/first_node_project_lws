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
handler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //look up the check
    data.read("checks", id, (err, checkData) => {
      //const check = { ...parseJSON(checkData) };
      if (!err && checkData) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, { error: "Auth Failure" });
            }
          }
        );
      } else {
        callback(500, { error: "YOu have a problem in your request" });
      }
    });
  } else {
    callback(404, { error: "YOu have a problem in your request" });
  }
};
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
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
  if (id) {
    if (protocol || url || method || successCodes || timeOutSeconds) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObject = parseJSON(checkData);
          let token =
            typeof requestProperties.headersObject.token === "string"
              ? requestProperties.headersObject.token
              : false;
          tokenHandler._token.verify(
            token,
            checkObject.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.protocol = protocol;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeOutSeconds) {
                  checkObject.timeOutSeconds = timeOutSeconds;
                }
                //store the checkO
                data.update("checks", id, checkObject, (err2) => {
                  if (!err2) {
                    callback(200);
                  } else {
                    callback(500, {
                      error: "There was a problem in server side",
                    });
                  }
                });
              } else {
                callback(403, { error: "Auth Error" });
              }
            }
          );
        } else {
          callback(500, { error: "There was a problem in server side" });
        }
      });
    } else {
      callback(400, { error: "You mus provide one field to update" });
    }
  } else {
    callback(400, { error: "Request Problem" });
  }
};
handler._check.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //look up the check
    data.read("checks", id, (err1, checkData) => {
      //const check = { ...parseJSON(checkData) };
      if (!err1 && checkData) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              //delete the check data
              data.delete("checks", id, (err2) => {
                if (!err2) {
                  data.read(
                    "users",
                    parseJSON(checkData).userPhone,
                    (err3, userData) => {
                      let userObject = parseJSON(userData);
                      if (!err3 && userData) {
                        let userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];
                        //remove the deleted checks id
                        let checkPosition = userChecks.indexOf(id);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          //resave the user data
                          userObject.checks = userChecks;
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err4) => {
                              if (!err4) {
                                callback(200);
                              } else {
                                callback(500, {
                                  error: "YOu have a problem in your request",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            error: "The check id is not found",
                          });
                        }
                      } else {
                        callback(500, {
                          error: "YOu have a problem in your request",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, {
                    error: "YOu have a problem in your request",
                  });
                }
              });
            } else {
              callback(403, { error: "Auth Failure" });
            }
          }
        );
      } else {
        callback(500, { error: "YOu have a problem in your request" });
      }
    });
  } else {
    callback(404, { error: "YOu have a problem in your request" });
  }
};
module.exports = handler;
