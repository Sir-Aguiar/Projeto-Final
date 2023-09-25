/**
  @typedef {object} UserData
  @property {number} idUsuario
*/

const { Op } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const { FindClassesFromSchoolByProfessor } = require("../Turmas/FindByProfessor");
const ServerError = require("../../utils/ServerError");

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
*/
/**
  @typedef {object} Curso
  @property {number} idCurso
  @property {string} nome
*/

/**
  @typedef {object} Aluno
  @property {number} idAluno
  @property {string} nome
  @property {Turma} turma
*/

/**
 @param {UserData} userData Informações do usuário
 @param {number} idEscola Identificador da escola
 @param {boolean} onlyLength Parâmetro que irá indicar se deve ser feito uma consulta ou apenas uma contagem
 @returns {Promise<Aluno[]>} 
 @description Retorna todos os alunos de uma escola. Caso o usuário não seja gestor da escola, será retornado apenas os alunos que este usuário tem acesso
 */

const FindStudentsBySchool = async (userData, idEscola, onlyLength = false) => {
  if (!idEscola || typeof idEscola !== "number" || isNaN(Number(idEscola))) {
    throw new ServerError("O identificador da escola está ausente ou em formato inválido", 400, new Error().stack);
  }

  if (!userData || !userData.idUsuario || typeof userData.idUsuario !== "number") {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const isUserAdmin = await VerifySchoolPermission(idEscola, userData.idUsuario);

  if (!isUserAdmin) {
    const foundClasses = await FindClassesFromSchoolByProfessor(idEscola, userData.idUsuario);

    if (!foundClasses || foundClasses.length < 1) {
      throw new ServerError("Você não possui permissão para realizar esta ação", 401);
    }

    if (onlyLength) {
      const alunos = await Aluno.count({
        where: { idEscola, idTurma: { [Op.in]: foundClasses.map((turma) => turma.idTurma) } },
      });
      return alunos;
    }

    const alunos = await Aluno.findAll({
      where: { idEscola, idTurma: { [Op.in]: foundClasses.map((turma) => turma.idTurma) } },
      attributes: ["idAluno", "nome"],
      include: [
        {
          model: Turma,
          as: "turma",
          attributes: ["idTurma", "nome"],
          include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
        },
        {
          model: Escola,
          as: "escola",
          attributes: ["idEscola", "idGestor", "nome"],
        },
      ],
      order: [["nome", "ASC"]],
    });

    return alunos;
  }

  if (onlyLength) {
    const alunos = await Aluno.count({ where: { idEscola } });
    return alunos;
  }

  const alunos = await Aluno.findAll({
    where: { idEscola },
    attributes: ["idAluno", "nome"],
    include: [
      {
        model: Turma,
        as: "turma",
        attributes: ["idTurma", "nome"],
        include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
      },
      {
        model: Escola,
        as: "escola",
        attributes: ["idEscola", "idGestor", "nome"],
      },
    ],
    order: [["nome", "ASC"]],
  });

  return alunos;
};

module.exports = FindStudentsBySchool;
