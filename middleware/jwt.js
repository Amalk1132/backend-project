const jwt = require("jsonwebtoken");

module.exports = {
  signToken: (userId) => {
    return new Promise((res, rej) => {
      const payload = {
        name: userId,

      };
    });
    jwt.sign(payload, secretcode, (err, token) => {
      if (err) {
        rej(err);
      } else {
        res(token);
      }
    });
  },
};
