const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");
const UpdateStudent = require("../../use-cases/Alunos/Update");

/** @type {import("express").RequestHandler}  */
const UpdateStudentController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idAluno } = req.query;

  if (!idAluno) {
    return Handler.clientError("Nenhum aluno foi informado");
  }

  if (isNaN(Number(idAluno))) {
    return Handler.clientError("Identificador de aluno em formato inválido");
  }

  const { toUpdate } = req.body;

  if (!toUpdate) {
    return Handler.clientError("Não foram inseridos dados à serem atualizados");
  }

  const { nome } = toUpdate;

  if (!nome) {
    return Handler.clientError("Todos os alunos devem possuir um nome");
  }

  if (typeof nome !== "string") {
    return Handler.clientError(`${nome} não é um nome válido para aluno`);
  }

  if (nome.length > 45) {
    return Handler.clientError(`O nome de um aluno deve ter até 45 caractéres, faça abreviações caso necessário`);
  }

  try {
    const userPermission = await VerifyUserPermission(Number(idUsuario), { idAluno: Number(idAluno) });

    if (userPermission !== 0) {
      return Handler.unauthorized(`Você não tem permissão para realizar esta ação`);
    }

    await UpdateStudent(Number(idAluno), { nome });
    return Handler.ok();
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 404) {
        return Handler.notFound(error.message);
      }
      if (error.status === 400) {
        return Handler.clientError(error.message);
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
module.exports = UpdateStudentController;
