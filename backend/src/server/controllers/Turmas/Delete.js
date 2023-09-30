const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const DeleteClass = require("../../use-cases/Turmas/Delete");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");

/** @type {import("express").RequestHandler}  */
const DeleteClassController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idTurma } = req.query;

  if (!idTurma) {
    return Handler.clientError("Identificador da turma ausente");
  }

  if (isNaN(Number(idTurma))) {
    return Handler.clientError("Identificador da turma em formato inválido");
  }

  try {
    const userPermission = await VerifyUserPermission(Number(idUsuario), { idTurma });

    if (userPermission !== 0) {
      return Handler.unauthorized("Você não tem permissão para realizar esta ação");
    }

    await DeleteClass(Number(idTurma));
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

module.exports = DeleteClassController;
