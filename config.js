const dotenv = require("dotenv");

module.exports = {
  port: 3600,
  cookieSecret: dotenv.COOKIE_SECRET,
  dbConnect: dotenv.DB_CONNECT,
};
