const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  //console.log(requestProperties);
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._users = {};
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  console.log(typeof requestProperties.body.password);
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;
  console.log(tosAgreement);
  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure user not exists
    data.read("users", phone, (err1) => {
      if (err1) {
        //porer kaj
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        //store to database
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, { message: "user created success" });
          } else {
            callback(500, { error: "server side error" });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in server",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem by request",
    });
  }
};
handler._users.get = (requestProperties, callback) => {
  //check phone no valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    //verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    console.log(requestProperties.headersObject.token);
    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        console.log(tokenId);
        data.read("users", phone, (err, u) => {
          const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { error: "Requested was not found" });
          }
        });
      } else {
        callback(403, { error: "Not Authenticated" });
      }
    });
    //look up the use
  } else {
    callback(404, { error: "Requested was not foundw" });
  }
};
handler._users.put = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  console.log(typeof requestProperties.body.password);
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      //console.log(firstName);
      const token =
        typeof requestProperties.headersObject.token === "string"
          ? requestProperties.headersObject.token
          : false;
      //look up the user
      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("users", phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }
              //update data
              data.update("users", phone, userData, (err2) => {
                if (!err2) {
                  callback(200, { message: "success" });
                } else {
                  callback(500, { error: "server side" });
                }
              });
            } else {
              callback(400, { error: "You have a problem in your " });
            }
          });
        } else {
          callback(403, { error: "Auth Failed" });
        }
      });
    } else {
      callback(400, { error: "You have a problem in your request" });
    }
  } else {
    callback(400, { error: "Invalid Phone no" });
  }
};
handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  console.log(phone);
  if (phone) {
    const token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    //look up the user
    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err1, uData) => {
          const userData = { ...parseJSON(uData) };
          if (!err1 && userData) {
            //update data
            data.read("users", phone, (err1, userData) => {
              if (!err1 && userData) {
                data.delete("users", phone, (err2) => {
                  if (!err2) {
                    callback(200, { message: "success deleted" });
                  } else {
                    callback(500, { error: "there was a server side error" });
                  }
                });
              } else {
                callback(400, {
                  error: "there was a problem in your request5",
                });
              }
            });
          } else {
            callback(400, { error: "You have a problem in your " });
          }
        });
      } else {
        callback(403, { error: "Auth Failed" });
      }
    });
  } else {
    callback(400, { error: "there was a problem in your request" });
  }
};
module.exports = handler;
