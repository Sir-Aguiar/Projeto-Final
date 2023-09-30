const { FindStudentsByClass } = require("../../use-cases/Alunos/FindByClass");
const ServerError = require("../../utils/ServerError");
const { FindStudentsFromSchoolByProfessor, FindStudentsBySchool } = require("../../use-cases/Alunos/FindBySchool");
const FindStudentById = require("../../use-cases/Alunos/FindById");
const ResponseHandler = require("../../utils/ResponseHandler");
const { VerifyUserPermission } = require("../../utils/VerifyPermission");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
/** @type {import("express").RequestHandler}  */
const GetAlunosController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  let { take, skip } = req.query;

  if (!take) take = 30;
  if (!skip) skip = 0;

  const { idEscola, idTurma, idAluno } = req.query;

  if (!idEscola && !idTurma && !idAluno) {
    return Handler.clientError("Nenhum critério de seleção encontrado, por favor, informe uma escola, turma ou aluno");
  }

  try {
    if (idEscola) {
      if (isNaN(Number(idEscola))) {
        return Handler.clientError("Identificador da escola em formato inválido");
      }

      const userPermission = VerifyUserPermission(Number(idUsuario), { idEscola });

      if (userPermission === -1) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      if (userPermission === 1) {
        const alunos = await FindStudentsFromSchoolByProfessor(Number(idEscola), Number(idUsuario), take, skip);
        return Handler.ok({ alunos });
      }

      const alunos = await FindStudentsBySchool(Number(idEscola), take, skip);
      return Handler.ok({ alunos });
    }

    if (idTurma) {
      if (isNaN(Number(idTurma))) {
        return Handler.clientError("Identificador da turma em formato inválido");
      }

      const userPermission = VerifyUserPermission(Number(idUsuario), { idEscola });

      if (userPermission === -1) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      const alunos = await FindStudentsByClass(Number(idTurma));
      return Handler.ok({ alunos });
    }

    if (idAluno) {
      if (isNaN(Number(idAluno))) {
        return Handler.clientError("Identificador do aluno em formato inválido");
      }

      const aluno = await FindStudentById(Number(idAluno));

      const userPermission = VerifyUserPermission(Number(idUsuario), { idTurma: aluno.turma.idTurma });

      if (userPermission === -1) {
        return Handler.unauthorized("Você não tem permissão para realizar esta ação");
      }

      return Handler.ok({ aluno });
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

module.exports = GetAlunosController;
