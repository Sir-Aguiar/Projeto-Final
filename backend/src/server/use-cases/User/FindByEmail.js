const Usuario = require("../../../database/models/Usuario");
const ServerError = require("../../utils/ServerError");
/**
 *
 * @param {string} email Email do usuário
 * @returns {Promise<import("../../@types/Usuario").__Usuario__>}
 */
const FindUserByEmail = async (email) => {
  const usuario = await Usuario.findOne({ where: { email }, raw: true, nest: true });

  if (!usuario) {
    throw new ServerError("Nenhum usuário foi encontrado com este email", 404);
  }

  return usuario;
};

module.exports = FindUserByEmail;
