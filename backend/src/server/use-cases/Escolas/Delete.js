const Escola = require("../../../database/models/Escola");
const ServerError = require("../../utils/ServerError");

const DeleteSchool = async (idEscola) => {
  const escola = await Escola.findByPk(idEscola, { attributes: ["idEscola"] });

  if (!escola) {
    throw new ServerError("Nenhuma escola foi encontrada com este identificador", 404);
  }

  return await escola.destroy();
};

module.exports = DeleteSchool;
