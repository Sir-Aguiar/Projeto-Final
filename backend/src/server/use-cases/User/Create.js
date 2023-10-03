require("dotenv/config");
const Usuario = require("../../../database/models/Usuario");
const ServerError = require("../../utils/ServerError");
const { hashSync } = require("bcrypt");

const CreateUser = async (nome, email, senha) => {
  const userExists = await Usuario.findOne({ where: { email } });

  if (userExists) throw new ServerError("Email já em uso", 400);

  const usuario = await Usuario.create(
    { nome, email, senha: hashSync(senha, Number(process.env.SALT)) },
    { raw: true, nest: true },
  );

  return usuario;
};

module.exports = CreateUser;
