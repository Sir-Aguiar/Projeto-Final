const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const CreateLesson = require("../../use-cases/Aulas/Create");
const CreatePresenceList = require("../../use-cases/Chamadas/Create");
const { FindStudentsByClass } = require("../../use-cases/Alunos/FindByClass");
const ServerError = require("../../utils/ServerError");

/** @type {import("express").RequestHandler}  */
const CreateAulaController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idDisciplina, idTurma, idProfessor, observacoes, presentes } = req.body;

  if (!idDisciplina || isNaN(Number(idDisciplina))) {
    return Handler.clientError("Identificador da disciplina ausente ou em formato inválido");
  }

  if (!idTurma || isNaN(Number(idTurma))) {
    return Handler.clientError("Identificador da turma ausente ou em formato inválido");
  }

  if (!idProfessor || isNaN(Number(idProfessor))) {
    return Handler.clientError("Identificador do professor ausente ou em formato inválido");
  }

  if (!presentes) {
    return Handler.clientError("Não foram informados alunos presentes");
  }

  if (presentes.length > 0) {
    const classStudents = (await FindStudentsByClass(Number(idTurma))).map(({ idAluno }) => idAluno);

    for (const aluno of presentes) {
      if (!classStudents.includes(aluno)) {
        throw new ServerError(`O aluno ${aluno} não pertence à esta turma`, 400);
      }
    }
  }

  try {
    const aula = await CreateLesson({ idDisciplina, idTurma, idProfessor, observacoes });
    const chamada = await CreatePresenceList(aula.dataValues.idAula, presentes);
    return Handler.created();
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

module.exports = CreateAulaController;
