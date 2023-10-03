const { ConnectionAcquireTimeoutError, ConnectionRefusedError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const CreateUser = require("../../use-cases/User/Create");
const SignUserToken = require("../../use-cases/User/SignToken");
/** @type {import("express").RequestHandler}  */
module.exports = async (req, res) => {
  const Handler = new ResponseHandler(res);
  const { nome, email, senha } = req.body;
  if (!nome) {
    return Handler.clientError("Nenhum nome foi informado para o usuário");
  }

  if (nome.length > 45) {
    return Handler.clientError("Nome precisa ter menos de 45 caracteres");
  }

  if (!senha) {
    return Handler.clientError("Nenhuma senha foi informado para o usuário");
  }

  if (!email) {
    return Handler.clientError("Nenhum email foi informado para o usuário");
  }

  if (email.length > 255) {
    return Handler.clientError("Email precisa ter menos de 255 caracteres");
  }

  try {
    const usuario = await CreateUser(nome, email, senha);
    const token = SignUserToken(usuario);
    return Handler.ok({ token });
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 400) {
        return Handler.clientError(error.message);
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
