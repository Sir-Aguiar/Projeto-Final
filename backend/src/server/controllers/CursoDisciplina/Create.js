const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const CreateDisciplineGrid = require("../../use-cases/CursoDisciplina/Create");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");

/** @type {import("express").RequestHandler}  */
const CreateDisciplineGridController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idDisciplina, idEscola } = req.query;

  if (!idDisciplina || isNaN(Number(idDisciplina))) {
    return Handler.clientError("Identificador da disciplina ausente ou em formato inválido");
  }

  if (!idEscola || isNaN(Number(idEscola))) {
    return Handler.clientError("Identificador da escola ausente ou em formato inválido");
  }

  const { cursos } = req.body;

  if (!cursos || cursos.length < 1) {
    return Handler.clientError("Não foram informados cursos para serem relacionados");
  }

  try {
    const userPermission = await VerifyUserPermission(Number(idUsuario), { idEscola: Number(idEscola) });

    if (userPermission !== 0) {
      return Handler.unauthorized("Você não tem permissão para realizar esta ação");
    }

    for (const curso of cursos) {
      await CreateDisciplineGrid(Number(idDisciplina), Number(curso));
    }

    return Handler.created();
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

module.exports = CreateDisciplineGridController;
