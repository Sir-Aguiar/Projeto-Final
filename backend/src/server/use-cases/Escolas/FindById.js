const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
const Curso = require("../../../database/models/Curso");

const FindSchoolById = async (idEscola) => {
  const escola = await Escola.findByPk(idEscola, {
    attributes: ["idEscola", "idGestor", "nome"],
  });
  return escola;
};

module.exports = FindSchoolById;
