const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./environments");

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
      To: `+880${userPhone}`,
      Body: userMsg,
    };
    const stringifyPayload = querystring.stringify(payload);
    //confirue the request detauks
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/{AccountSid}/Messages,json`,
    };
  } else {
    callback("Given parameter were missing");
  }
};

//export the module
module.exports = notificiations;
