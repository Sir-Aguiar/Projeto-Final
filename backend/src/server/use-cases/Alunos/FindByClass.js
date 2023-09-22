const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");
const { VerifySchoolPermission, VerifyClassPermission } = require("../../utils/VerifyPermission");

/**
  @typedef {object} UserData
  @property {number} idUsuario
*/

/**
  @typedef {object} Aluno
  @property {number} idAluno
  @property {string} nome
*/

/**
 @param {UserData} userData Informações do usuário
 @param {number} idTurma Identificador da turma
 @returns {Promise<Aluno[]>}  Todos os alunos de uma turma
 */

const FindStudentsByClass = async (userData, idTurma) => {
  if (!idTurma || typeof idTurma !== "number" || isNaN(Number(idTurma))) {
    throw new ServerError("O identificador da turma está ausente ou em formato inválido", 400, new Error().stack);
  }

  if (!userData || !userData.idUsuario || typeof userData.idUsuario !== "number") {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const foundClass = await Turma.findByPk(idTurma, {
    attributes: ["idTurma", "idEscola"],
    raw: true,
    nest: true,
  });

  if (!foundClass) throw new ServerError("Nenhuma turma foi encontrada com este identificador", 404);

  const isUserAdmin = await VerifySchoolPermission(foundClass.idEscola, userData.idUsuario);

  if (!isUserAdmin) {
    const isUserProfessor = await VerifyClassPermission(idTurma, userData.idUsuario);
    if (!isUserProfessor) throw new ServerError("Você não possui permissão para realizar esta ação", 401);
  }

  const foundStudents = await Aluno.findAll({
    where: { idTurma },
    attributes: ["idAluno", "nome"],
    order: [["nome", "ASC"]],
    raw: true,
    nest: true,
  });

  return foundStudents;
};

module.exports = FindStudentsByClass;