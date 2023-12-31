const ResponseHandler = require("../../utils/ResponseHandler");
const CreateDiscipline = require("../../use-cases/Disciplinas/Create");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");
const ServerError = require("../../utils/ServerError");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");

/** @type {import("express").RequestHandler}  */
const CreateDisciplinaController = async (req, res) => {
  const Handler = new ResponseHandler(res);
  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola, nome } = req.body;

  if (!idEscola || isNaN(Number(idEscola))) {
    return Handler.clientError("Identificador da escola ausente ou em formato inválido");
  }

  if (!nome) {
    return Handler.clientError("Nome da disciplina ausente ");
  }

  if (nome.length > 50) {
    return Handler.clientError("Nome da disciplina deve ter menos de 50 caracteres ");
  }

  try {
    const userPermission = await VerifyUserPermission(Number(idUsuario), { idEscola: Number(idEscola) });

    if (userPermission !== 0) {
      return Handler.unauthorized("Você não tem permissão para realizar esta ação");
    }

    const disciplina = await CreateDiscipline(idEscola, nome);
    return Handler.created({ disciplina });
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

module.exports = CreateDisciplinaController;
