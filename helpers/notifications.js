const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./environments");
const { error } = require("console");

//module scaffolding

const notificiations = {};

notificiations.sendTwilioSms = (phone, msg, callback) => {
  //input validation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (userPhone && userMsg) {
    //configure the requst payload
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };
    const stringifyPayload = querystring.stringify(payload);
    //confirue the request detauks
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    };
    console.log(requestDetails);
    //instant the request object
    const req = https.request(requestDetails, (res) => {
      //get the statusof the sent request
      const status = res.statusCode;

      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`status code returned was ${status}`);
      }
    });
    req.on("error", (e) => {
      callback(e);
    });
    req.write(stringifyPayload);
    req.end();
  } else {
    callback("Given parameter were missing");
  }
};

//export the module
module.exports = notificiations;
