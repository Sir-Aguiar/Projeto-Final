const FindClassesBySchool = require("../../use-cases/Turmas/FindBySchool");
const FindClassesByUser = require("../../use-cases/Turmas/FindByUser");
const ServerError = require("../../utils/ServerError");
const ResponseHandler = require("../../utils/ResponseHandler");
const { FindClassesFromSchoolByProfessor } = require("../../use-cases/Turmas/FindByProfessor");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");
const FindClassById = require("../../use-cases/Turmas/FindById");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");

/** @type {import("express").RequestHandler}  */
const GetClassController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola, idTurma } = req.query;

  try {
    if (idTurma) {
      if (isNaN(Number(idTurma))) {
        return Handler.clientError("Identificador da turma em formato inválido");
      }

      const userPermission = await VerifyUserPermission(Number(idUsuario), { idTurma });

      if (userPermission !== 0) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      const turma = await FindClassById(Number(idTurma));
      return Handler.ok({ turma });
    }

    if (idEscola) {
      if (isNaN(Number(idEscola))) {
        return Handler.clientError("Identificador da escola em formato inválido");
      }

      const userPermission = await VerifyUserPermission(Number(idUsuario), { idEscola });

      if (userPermission === -1) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      if (userPermission === 1) {
        const turmas = await FindClassesFromSchoolByProfessor(Number(idEscola), Number(idUsuario));
        return Handler.ok({ turmas });
      }

      const turmas = await FindClassesBySchool(Number(idEscola), Number(idUsuario));
      return Handler.ok({ turmas });
    }

    const turmas = await FindClassesByUser(Number(idUsuario));
    return Handler.ok({ turmas });
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

module.exports = GetClassController;
