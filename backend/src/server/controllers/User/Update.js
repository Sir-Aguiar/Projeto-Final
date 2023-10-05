const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const Usuario = require("../../../database/models/Usuario");
const UpdateUser = require("../../use-cases/User/Update");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");

/** @type {import("express").RequestHandler}  */
const UpdateUserController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { toUpdate } = req.body;

  if (!toUpdate) {
    return Handler.clientError("Nenhum campo para atualizar foi informado");
  }

  const { nome, email, senha } = toUpdate;

  if (!nome && !email && !senha) {
    return Handler.clientError("Nenhum campo para atualizar foi informado");
  }

  if (nome) {
    if (typeof nome !== "string") {
      return Handler.clientError("Nome em formato inválido");
    }

    if (nome.length > 45) {
      return Handler.clientError("Nome deve ter menos de 45 caracteres");
    }
  }

  if (email) {
    if (typeof email !== "string") {
      return Handler.clientError("Email em formato inválido");
    }

    if (email.length > 255) {
      return Handler.clientError("Email deve ter menos de 255 caracteres");
    }
  }

  if (senha) {
    if (typeof email !== "string") {
      return Handler.clientError("Email em formato inválido");
    }
  }

  try {
    const updated = await UpdateUser(Number(idUsuario), { email, nome, senha });
    return Handler.ok();
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
module.exports = UpdateUserController;
