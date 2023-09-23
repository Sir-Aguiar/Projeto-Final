const Aluno = require("../../../database/models/Aluno");
const Turma = require("../../../database/models/Turma");
const Curso = require("../../../database/models/Curso");
/**
 * @typedef {object} Curso
 *  @property {number} idCurso
 * @property {string} nome
 */

/**
 * @typedef {object} Turma
 *  @property {number} idTurma
 * @property {string} nome
 * @property {Curso} curso
 */

/**
 * @typedef {object} Aluno
 * @property {number} idAluno
 * @property {string} nome
 * @property {Turma} turma
 */

/**
 *
 * @param {number} idAluno Identificador do aluno
 * @returns {Promise<Aluno>} Objeto contendo todas as informações do aluno
 */

const FindStudentById = async (idAluno) => {
  const aluno = await Aluno.findByPk(idAluno, {
    attributes: ["idAluno", "nome"],
    include: [
      {
        model: Turma,
        as: "turma",
        attributes: ["idTurma", "nome"],
        include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
      },
    ],
    raw: true,
    nest: true,
  });
  return aluno;
};

module.exports = FindStudentById;
