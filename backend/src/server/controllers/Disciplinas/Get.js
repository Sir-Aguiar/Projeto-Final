const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const {
  FindDisciplinesByClass,
  FindDisciplinesFromClassByProfessor,
} = require("../../use-cases/Disciplinas/FindByClass");
const {
  FindDisciplinesFromSchoolByProfessor,
  FindDisciplinesBySchool,
} = require("../../use-cases/Disciplinas/FindBySchool");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");
/** @type {import("express").RequestHandler}  */
const GetDisciplinasController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola, idTurma, onlyLength } = req.query;

  if (!idEscola && !idTurma) {
    return Handler.clientError("Nenhum critério de seleção encontrado, por favor informe uma escola ou turma");
  }

  if (idEscola && isNaN(Number(idEscola))) {
    return Handler.clientError("Identificador da escola em formato inválido");
  }

  if (idTurma && isNaN(Number(idTurma))) {
    return Handler.clientError("Identificador da turma em formato inválido");
  }

  try {
    if (idEscola) {
      const userPermission = await VerifyUserPermission(Number(idUsuario), { idEscola: Number(idEscola) });

      if (userPermission === -1) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      if (userPermission === 1) {
        const disciplinas = await FindDisciplinesFromSchoolByProfessor(Number(idEscola), Number(idUsuario));
        return Handler.ok({ disciplinas });
      }

      const disciplinas = await FindDisciplinesBySchool(Number(idEscola), onlyLength);
      return Handler.ok({ disciplinas });
    }

    if (idTurma) {
      const userPermission = await VerifyUserPermission(Number(idUsuario), { idTurma: Number(idTurma) });

      if (userPermission === -1) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      if (userPermission === 1) {
        const disciplinas = await FindDisciplinesFromClassByProfessor(Number(idTurma), Number(idUsuario));
        return Handler.ok({ disciplinas });
      }

      const disciplinas = await FindDisciplinesByClass(Number(idTurma));
      return Handler.ok({ disciplinas });
    }
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

module.exports = GetDisciplinasController;
