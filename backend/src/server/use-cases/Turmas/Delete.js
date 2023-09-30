const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");

const DeleteClass = async (idTurma) => {
  const turma = await Turma.findByPk(idTurma, { attributes: ["idTurma"] });

  if (!turma) {
    throw new ServerError("Nenhuma Turma foi encontrada com este identificador", 404);
  }

  return await turma.destroy();
};

module.exports = DeleteClass;
