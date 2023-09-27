const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");

/**
  @typedef {object} Curso
  @property {number} idCurso
  @property {string} nome
*/
/**
  @typedef {object} Escola
  @property {number} idEscola
  @property {number} idGestor
  @property {string} nome
*/

/**
  @typedef {object} Turma
  @property {number} idTurma
  @property {string} nome
  @property {Curso} curso
  @property {Escola} escola
*/

/**
 *
 * @param {number} idProfessor Identificador do professor
 * @returns {Promise<Turma[]>} Todas as turmas em que o usuário é professor
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
 * @returns {Promise<Turma[]>} Todas as turmas da escola em que o usuário é professor
 */

const FindClassesFromSchoolByProfessor = async (idEscola, idProfessor) => {
  if (!idEscola || typeof idEscola !== "number" || isNaN(Number(idEscola))) {
    throw new ServerError("O identificador da escola está ausente ou em formato inválido", 400, new Error().stack);
  }

  if (!idProfessor || typeof idProfessor !== "number" || isNaN(Number(idProfessor))) {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const foundClasses = await Turma.findAll({
    where: { idEscola },
    attributes: ["idTurma", "nome"],
    include: [
      { model: ProfessorLeciona, as: "professores", where: { idProfessor }, attributes: [] },
      { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
      { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
    ],
    raw: true,
    nest: true,
  });

  if (!foundClasses || foundClasses.length < 1) return [];

  const classesMap = new Map();

  const turmas = foundClasses.filter((turma) => {
    if (!classesMap.has(turma.idTurma)) {
      classesMap.set(turma.idTurma, turma);
      return turma;
    }
  });

  return turmas;
};

module.exports = { FindClassesFromSchoolByProfessor, FindClassesByProfessor };
