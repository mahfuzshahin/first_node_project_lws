//dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

// base directory of the data folder

lib.basedir = path.join(__dirname, "/../.data/");

// write data to file
lib.create = function (dir, file, data, callback) {
  //open file for writting
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, function (err2) {
          if (!err2) {
            fs.close(fileDescriptor, function (err3) {
              if (!err3) {
                callback(false);
              } else {
                callback("error closing the new file!");
              }
            });
          } else {
            callback("Error Writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exists!");
      }
    }
  );
};
//Read File
lib.read = (dir, file, callback) => {
  fs.readFile(lib.basedir + dir + "/" + file + ".json", "utf8", (err, data) => {
    callback(err, data);
  });
};
//update
lib.update = (dir, file, data, callback) => {
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (err1) => {
          if (!err1) {
            fs.writeFile(fileDescriptor, stringData, (err2) => {
              if (!err2) {
                fs.close(fileDescriptor, (err3) => {
                  if (!err3) {
                    callback(false);
                  } else {
                    callback("Error closing focuse");
                  }
                });
              } else {
                callback("Error writing to file");
              }
            });
          } else {
            console.log("Error truncating file");
          }
        });
      } else {
        console.log("erro updating, file may not exists");
      }
    }
  );
};
//delete existing file
lib.delete = (dir, file, callback) => {
  //unlick
  fs.unlink(lib.basedir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("error detec");
    }
  });
};
module.exports = lib;
