const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const { CreateManyClasses } = require("../../use-cases/Turmas/Create");

/** @type {import("express").RequestHandler}  */
const CreateClassController = async (req, res) => {
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

  const { turmas } = req.body;

  if (!turmas || turmas.length < 1) {
    return Handler.clientError("Não foram informadas turmas à serem adicionadas");
  }

  try {
    for (const turma of turmas) {
      const { idCurso, nome } = turma;

      if (!nome) {
        throw new ServerError("Todas as turmas devem possuir um nome", 400);
      }

      if (typeof nome !== "string") {
        throw new ServerError(`${nome} não é um nome válido para turmas`, 400);
      }

      if (nome.length > 15) {
        throw new ServerError(`${nome} não é um nome válido para turmas, nomes devem ter até 15 caracteres`, 400);
      }

      if (!idCurso || typeof idCurso !== "number") {
        throw new ServerError(`Turma ${nome} não está associada à nenhum curso`, 400);
      }

      /* Deve ser feita a checagem da elegibilidade de um curso inserido */
    }

    const isUserAdmin = await VerifySchoolPermission(Number(idEscola), Number(idUsuario));

    if (!isUserAdmin) {
      return Handler.unauthorized("Você não possui autorização para realizar esta ação");
    }

    await CreateManyClasses(turmas.map(({ nome, idCurso }) => ({ nome, idCurso, idEscola })));
    return Handler.ok();
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 400) {
        return Handler.clientError(error.message);
      }

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

module.exports = CreateClassController;
