const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const ServerError = require("../../utils/ServerError");
const { CreateManyStudents } = require("../../use-cases/Alunos/Create");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");

/** @type {import("express").RequestHandler}  */
const CreateStudentController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { alunos } = req.body;

  if (!alunos || alunos.length <= 0) {
    return Handler.clientError("Não foram informados alunos à serem inseridos");
  }

  try {
    for (const aluno of alunos) {
      const { nome, idTurma } = aluno;

      if (!nome) {
        throw new ServerError("Todos os alunos devem possuir um nome", 400);
      }

      if (typeof nome !== "string") {
        throw new ServerError(`${nome} não é um nome válido para aluno`, 400);
      }

      if (nome.length > 45) {
        throw new ServerError(`O nome de um aluno deve ter até 45 caractéres, faça abreviações caso necessário`, 400);
      }

      if (!idTurma) {
        throw new ServerError(`${nome} deve estar associado à uma turma`, 400);
      }

      if (isNaN(Number(idTurma))) {
        throw new ServerError(`${nome} não está associado à nenhuma turma`, 400);
      }

      const userPermission = await VerifyUserPermission(Number(idUsuario), { idTurma: Number(idTurma) });

      if (userPermission !== 0) {
        throw new ServerError(`Você não tem permissão para inserir ${nome} nesta turma`, 401);
      }
    }

    await CreateManyStudents(alunos);
    return Handler.ok();
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 404) {
        return Handler.notFound(error.message);
      }
      if (error.status === 400) {
        return Handler.clientError(error.message);
      }
      if (error.status === 401) {
        return Handler.unauthorized(error.message);
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

module.exports = CreateStudentController;
