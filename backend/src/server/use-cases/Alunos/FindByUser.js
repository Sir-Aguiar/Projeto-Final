const { Op } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const FindClassesByUser = require("../Turmas/FindByUser");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/**
  @typedef {object} Escola
  @property {number} idEscola
  @property {string} nome
*/

/**
  @typedef {object} Curso
  @property {number} idCurso
  @property {string} nome
*/
/**
  @typedef {object} Turma
  @property {number} idTurma
  @property {string} nome
  @property {Curso} curso
*/
/**
  @typedef {object} Aluno
  @property {number} idAluno
  @property {string} nome
  @property {Escola} escola
  @property {Turma} turma
*/

/**
 @param {number} idUsuario Identificador do usuário
 @returns {Promise<Aluno[]>} 
 @description Retorna todos os alunos que meu usuário tem acesso
 */

const FindStudentsByUser = async (idUsuario) => {
  const foundClasses = await FindClassesByUser(idUsuario);
  const foundStudents = await Aluno.findAll({
    where: {
      idTurma: {
        [Op.in]: foundClasses.map((turma) => turma.idTurma),
      },
    },
    attributes: ["idAluno", "nome"],
    include: [
      { model: Escola, as: "escola", attributes: ["idEscola", "nome"] },
      {
        model: Turma,
        as: "turma",
        attributes: ["idTurma", "nome"],
        include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
      },
    ],
    order: [["nome", "ASC"]],
    raw: true,
    nest: true,
  });
  return foundStudents;
};

module.exports = FindStudentsByUser;
