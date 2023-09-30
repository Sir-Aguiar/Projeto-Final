const Aluno = require("../../../database/models/Aluno");
const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");

const CreateOneStudent = async (nome, idTurma) => {
  const turma = await Turma.findByPk(idTurma, { attributes: ["idEscola", "idTurma"], raw: true, nest: true });

  if (!turma) {
    throw new ServerError("Não é possível adicionar aluno em turma inexistente", 404);
  }

  await Aluno.create({ nome, idTurma, idEscola: turma.idEscola });
  return;
};

const CreateManyStudents = async (alunos) => {
  const insertingObject = [];

  for (const aluno of alunos) {
    const { idTurma, nome } = aluno;

    const turma = await Turma.findByPk(idTurma, { attributes: ["idEscola", "idTurma"], raw: true, nest: true });

    if (!turma) {
      throw new ServerError(`Não é possível adicionar ${nome} em turma inexistente`, 404);
    }

    insertingObject.push({ nome, idTurma, idEscola: turma.idEscola });
  }

  return await Aluno.bulkCreate(insertingObject, { returning: true });
};

module.exports = { CreateManyStudents, CreateOneStudent };
