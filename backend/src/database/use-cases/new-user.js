require("dotenv/config");
const { genSaltSync, hashSync } = require("bcrypt");
const Professor = require("../models/Professor");
const { ValidationErrorItem } = require("sequelize");

const newUser = async (userData) => {
  const { nome, email, login, senha } = userData;


  try {
    const insertedUser = await Professor.create({ nome, email, login, senha: HASHED_PASSWORD });
    console.log(insertedUser.dataValues);
  } catch (error) {
    const errorPath = error.errors[0].path;
    const errorType = error.errors[0].type;

    if (errorType === "unique violation") {
    }
  }
};

module.exports = newUser;
