const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const { FindClassesFromSchoolByProfessor } = require("./FindByProfessor");

/**
 * @param {number} idEscola Identificador da escola
 * @returns {Promise<import("../../@types/Turma").__Turma__[]>} Todas as turmas da escola
 */

const FindClassesBySchool = async (idEscola) => {
  const turmas = await Turma.findAll({
    where: { idEscola },
    attributes: ["idTurma", "nome"],
    include: [
      { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
      { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
    ],
    raw: true,
    nest: true,
  });

  return turmas;
};

module.exports = FindClassesBySchool;
