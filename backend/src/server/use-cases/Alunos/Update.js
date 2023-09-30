const Aluno = require("../../../database/models/Aluno");
const ServerError = require("../../utils/ServerError");

const UpdateStudent = async (idAluno, toUpdate) => {
  const aluno = await Aluno.findByPk(idAluno, { attributes: ["idAluno"] });

  if (!aluno) {
    throw new ServerError("Nenhum aluno encontrado com este identificador", 404);
  }

  await aluno.update(toUpdate);
  return;
};

module.exports = UpdateStudent;
