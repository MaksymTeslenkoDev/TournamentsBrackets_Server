const dotenv = require("dotenv");
dotenv.config({ path: `../.${process.env.NODE_ENV}.env` });

module.exports = {
  development: {
    host: "localhost",
    username: "postgres",
    password: "root",
    database: "tournaments-brackets",
    dialect: "postgres",
  },
  test: {
    host: "localhost",
    username: "postgres",
    password: "root",
    database: "tournaments-brackets",
    dialect: "postgres",
  },
  production: {
    host: "localhost",
    username: "postgres",
    password: "root",
    database: "tournaments-brackets",
    dialect: "postgres",
  },
};
