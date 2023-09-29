const Escola = require("../../../database/models/Escola");

const CreateSchool = async (idUsuario, nome) => {
  const escola = await Escola.create({ idGestor: idUsuario, nome });
  return escola;
};
module.exports = CreateSchool;
