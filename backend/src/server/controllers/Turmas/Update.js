const ResponseHandler = require("../../utils/ResponseHandler");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");
const UpdateClass = require("../../use-cases/Turmas/Update");

/** @type {import("express").RequestHandler}  */
const UpdateClassController = async (req, res) => {
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

  const { toUpdate } = req.body;

  if (!toUpdate || (!toUpdate.nome && !toUpdate.idCurso)) {
    return Handler.clientError("Não foram inseridos dados à serem atualizados");
  }

  const { nome, idCurso } = toUpdate;

  if (nome) {
    if (typeof nome !== "string") {
      return Handler.clientError("O nome da turma se encontra em formato inválido");
    }

    if (nome.length > 15) {
      return Handler.clientError("O nome da turma deve conter no máximo 15 caracteres");
    }
  }

  if (idCurso && isNaN(Number(idCurso))) {
    return Handler.clientError("Este curso não é um curso válido");
  }

  try {
    const userPermission = await VerifyUserPermission(Number(idUsuario), { idTurma });

    if (userPermission !== 0) {
      return Handler.unauthorized("Você não tem permissão para realizar esta ação");
    }

    await UpdateClass(Number(idTurma), toUpdate);
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

    return Handler.fail("Houve um erro desconhecido, estamos com problemas internos. Aguarde aguns instantes", error);
  }
};

module.exports = UpdateClassController;
