const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const DeleteSchool = require("../../use-cases/Escolas/Delete");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
/** @type {import("express").RequestHandler}  */
const DeleteSchoolController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola } = req.query;

  if (!idEscola) {
    return Handler.clientError("Identificador da escola ausente");
  }

  if (isNaN(Number(idEscola))) {
    return Handler.clientError("Identificador da escola em formato inválido");
  }

  try {
    const isUserAdmin = await VerifySchoolPermission(Number(idEscola), Number(idUsuario));

    if (!isUserAdmin) {
      return Handler.unauthorized("Você não possui autorização para realizar esta ação");
    }

    await DeleteSchool(Number(idEscola));
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

module.exports = DeleteSchoolController;
