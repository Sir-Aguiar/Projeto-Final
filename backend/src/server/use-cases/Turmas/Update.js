const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");

const UpdateClass = async (idTurma, toUpdate) => {
  const turma = await Turma.findByPk(idTurma, { attributes: ["idTurma"] });

  if (!turma) {
    throw new ServerError("Nenhuma turma foi encontrada com este identificador", 404);
  }

  return await turma.update(toUpdate);
};

module.exports = UpdateClass;
