const { compareSync } = require("bcrypt");
const Usuario = require("../../../database/models/Usuario");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");

/** @type {import("express").RequestHandler}  */
const CheckPasswordController = async (req, res) => {
  const Handler = new ResponseHandler(res);
  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { senha } = req.body;

  if (!senha || typeof senha !== "string") {
    return Handler.clientError("Não foi informada nenhuma senha válida");
  }

  try {
    const usuario = await Usuario.findByPk(idUsuario);

    if (compareSync(senha, usuario.dataValues.senha)) {
      return Handler.ok();
    }

    return Handler.clientError();
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 404) {
        return Handler.notFound(error.message);
      }
    }

    if (error instanceof ConnectionRefusedError) {
      return Handler.databaseConnectionFail(undefined, error);
    }

    if (error instanceof ConnectionAcquireTimeoutError) {
      return Handler.databaseTimeout(undefined, error);
    }

    return Handler.fail(undefined, error);
  }
};

module.exports = CheckPasswordController;
