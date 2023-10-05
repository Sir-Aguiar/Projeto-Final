require("dotenv/config");
const ServerError = require("../../utils/ServerError");
const { hashSync } = require("bcrypt");
const Usuario = require("../../../database/models/Usuario");

const UpdateUser = async (idUsuario, { email, nome, senha }) => {
  const updatingObject = {};

  if (email) updatingObject.email = email;
  if (nome) updatingObject.nome = nome;
  if (senha) updatingObject.senha = hashSync(senha, Number(process.env.SALT));

  const usuario = await Usuario.findByPk(idUsuario);

  if (!usuario) {
    throw new ServerError("Nenhum usuário foi encontrado", 404);
  }

  const updated = await usuario.update(updatingObject);
  return updated;
};

module.exports = UpdateUser;
