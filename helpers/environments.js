const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "askfasfhgsjadf",
  maxChecks: 5,
  twilio: {
    fromPhone: "+15005550006",
    accountSid: "AC12139600fa990e2a36db5d5246769da3",
    authToken: "dad7fca29c2abc23c19937e0cb3c1bf2",
  },
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "rwqejwetwertre",
  maxChecks: 5,
  twilio: {
    fromPhone: "+15005550006",
    accountSid: "AC12139600fa990e2a36db5d5246769da3",
    authToken: "dad7fca29c2abc23c19937e0cb3c1bf2",
  },
};
// determine which environemnt was passed

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//export coresponding environment

const environemntToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environemntToExport;
