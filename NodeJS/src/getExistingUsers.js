// Include axios module
const axios = require("axios");

const getExistingUsers = async () => {

  const API_TOKEN = "xeYjNEhmutkgkqCZyhBn6DErVntAKDx30FqFOS6D";
  const AID = "o1sRRZSLlw";

  return new Promise((resolve,reject) => {
    let returnedArray = [];

    axios
      .post(
        `https://sandbox.piano.io/api/v3/publisher/user/list?api_token=${API_TOKEN}&aid=${AID}`
      )
      .then(function (response) {
        resolve(response.data.users);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

module.exports = getExistingUsers;
