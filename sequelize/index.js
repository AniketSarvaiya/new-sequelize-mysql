const { Sequelize } = require("sequelize");
require("dotenv").config();
const { associationSetup } = require("../sequelize/associationSetup");
const { DB_SCHEMA, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_NAME,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database connect successfuly...");
  })
  .catch((err) => {
    console.log(`error in => ${err}`);
  });

const allModels = [
  require("./models/user.model"),
  require("./models/book.model"),
  require("./models/borrow.model"),
];

for (const newModel of allModels) {
  newModel(sequelize);
}

associationSetup(sequelize);

sequelize
  .sync({
    alter: true,
    // force: true,
  })
  .then(() => {
    console.log("database Synced again...");
  })
  .catch((err) => {
    console.log(`error in syncing => ${err}`);
  });
module.exports = sequelize;
