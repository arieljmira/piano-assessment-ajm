// Include fs module
const fs = require("fs");
// Include csv parser module
const csv = require("csv-parser");

const readCSVfile = async (filePath) => {
  return new Promise((resolve, reject) => {
    let returnedArray = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        returnedArray.push(row);
      })
      .on("end", () => {
        console.log("Successfully processed the CSV file in " + filePath);
        resolve(returnedArray);
      })
      .on("error", function (err) {
        reject(err);
      });
  });
};

module.exports = readCSVfile;
