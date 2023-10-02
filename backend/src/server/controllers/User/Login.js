const VerifyUserAuthentication = require("../../use-cases/User/VerifyAuthentication");
const SignUserToken = require("../../use-cases/User/SignToken");
const ResponseHandler = require("../../utils/ResponseHandler");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ServerError = require("../../utils/ServerError");

/** @type {import("express").RequestHandler}  */
module.exports = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { email, senha, remember } = req.body;

  if (remember && typeof remember !== "boolean") {
    return Handler.clientError("Foram inseridos dados inválidos no formuário");
  }

  if (!email) {
    return Handler.clientError("Nenhum email foi informado");
  }

  if (!senha) {
    return Handler.clientError("Nenhuma senha foi informada");
  }

  if (typeof email !== "string") {
    return Handler.clientError("Email em formato inválido");
  }

  if (typeof senha !== "string") {
    return Handler.clientError("Senha em formato inválido");
  }

  try {
    const validUser = await VerifyUserAuthentication(email, senha, { returning: true });
    const token = SignUserToken(validUser, remember);
    return Handler.ok({ token });
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 404) {
        return Handler.notFound(error.message);
      }
      if (error.status === 401) {
        return Handler.unauthorized(error.message);
      }
    }

    if (error instanceof ConnectionRefusedError) {
      return Handler.databaseConnectionFail(undefined, error);
    }

    if (error instanceof ConnectionAcquireTimeoutError) {
      return Handler.databaseTimeout(undefined, error);
    }
    console.log(error);
    return Handler.fail(undefined, error);
  }
};
