const { Sequelize } = require("sequelize");
const credentials = require("./config/config");

const Database = new Sequelize(credentials);

module.exports = Database;
