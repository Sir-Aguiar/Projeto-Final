const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
const ServerError = require("../../utils/ServerError");

const CreateDiscipline = async (idEscola, nome) => {
  const escola = await Escola.findByPk(idEscola);

  if (!escola) {
    throw new ServerError("Nenhuma escola foi encontrada", 404);
  }

  const created = await Disciplina.create({ idEscola, nome });
  return created;
};
module.exports = CreateDiscipline;
