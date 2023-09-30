const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const FindAllSchools = require("../../use-cases/Escolas/FindAll");
const FindSchoolById = require("../../use-cases/Escolas/FindById");
const ResponseHandler = require("../../utils/ResponseHandler");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ServerError = require("../../utils/ServerError");

/** @type {import("express").RequestHandler}  */
const GetSchoolsController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola } = req.query;

  try {
    if (idEscola) {
      if (isNaN(Number(idEscola))) {
        return Handler.clientError("Identificador da escola em formato inválido");
      }

      const isUserAdmin = await VerifySchoolPermission(Number(idEscola), Number(idUsuario));

      if (!isUserAdmin) {
        return Handler.unauthorized("Você não possui autorização para realizar esta ação");
      }

      const escola = await FindSchoolById(idEscola);
      return Handler.ok({ escola });
    }

    const escolas = await FindAllSchools(Number(idUsuario));
    return Handler.ok({ escolas });
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

module.exports = GetSchoolsController;
