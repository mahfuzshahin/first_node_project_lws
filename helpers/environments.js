const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
};

environments.production = {
  port: 5000,
  envName: "production",
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
