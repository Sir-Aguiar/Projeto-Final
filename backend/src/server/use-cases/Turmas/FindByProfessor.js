const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");

/**
 * @param {number} idProfessor Identificador do professor
 * @returns {Promise<import("../../@types/Turma").__Turma__[]>} Todas as turmas em que o usuário é professor
 */
const FindClassesByProfessor = async (idProfessor) => {
  if (!idProfessor || typeof idProfessor !== "number" || isNaN(Number(idProfessor))) {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const foundRelations = await ProfessorLeciona.findAll({
    where: { idProfessor },
    include: [
      {
        model: Turma,
        as: "turma",
        attributes: ["idTurma", "nome"],
        include: [
          { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
          { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
        ],
      },
    ],
    raw: true,
    nest: true,
  });

  return foundRelations.map(({ turma }) => turma);
};

/**
 *
 * @param {number} idEscola Indentificador da escola
 * @param {number} idProfessor Identificador do professor
 * @returns {Promise<import("../../@types/Turma").__Turma__[]>} Todas as turmas da escola em que o usuário é professor
 */

const FindClassesFromSchoolByProfessor = async (idEscola, idProfessor) => {
  const foundClasses = await Turma.findAll({
    where: { idEscola },
    attributes: ["idTurma", "nome"],
    include: [
      { model: ProfessorLeciona, as: "professores", where: { idProfessor }, attributes: [], required: true },
      { model: Curso, as: "curso", attributes: ["idCurso", "nome"], required: true },
      { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"], required: true },
    ],
    raw: true,
    nest: true,
  });

  if (!foundClasses || foundClasses.length < 1) {
    throw new ServerError("Você não possui acesso às turmas dessa escola", 401);
  }

  const classesMap = new Map();

  const turmas = foundClasses.filter((turma) => {
    if (!classesMap.has(turma.idTurma)) {
      classesMap.set(turma.idTurma, turma);
      return true;
    }
  });

  return turmas;
};

module.exports = { FindClassesFromSchoolByProfessor, FindClassesByProfessor };
