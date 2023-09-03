const { Sequelize } = require("sequelize");
const credentials = require("../database/config/config");

const Database = new Sequelize(credentials);

module.exports = Database;
