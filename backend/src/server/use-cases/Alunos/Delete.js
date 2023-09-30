const Aluno = require("../../../database/models/Aluno");
const ServerError = require("../../utils/ServerError");

const DeleteStudent = async (idAluno) => {
  const aluno = await Aluno.findByPk(idAluno, { attributes: ["idAluno"] });

  if (!aluno) {
    throw new ServerError("Nenhum aluno encontrado com este identificador", 404);
  }

  await aluno.destroy();
  return;
};

module.exports = DeleteStudent;
