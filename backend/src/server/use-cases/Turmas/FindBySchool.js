const Curso = require("../../../database/models/Curso");
const Turma = require("../../../database/models/Turma");
const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const { FindClassesFromSchoolByProfessor } = require("./FindByProfessor");

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
 *
 * @param {number} idEscola Identificador da escola
 * @param {number} idUsuario Identificador do usuário
 * @returns {Promise<Turma[]>} Todas as turmas da escola em questão, caso o seja um professor na escola, apenas as turmas que tem acesso.
 */

const FindClassesBySchool = async (idEscola, idUsuario) => {
  if (!idEscola || typeof idEscola !== "number") {
    throw new ServerError("O identificador da escola está ausente ou em formato inválido", 400, new Error().stack);
  }

  if (!idUsuario || typeof idUsuario !== "number") {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const isUserAdmin = await VerifySchoolPermission(idEscola, idUsuario);

  if (!isUserAdmin) {
    const turmas = await FindClassesFromSchoolByProfessor(idEscola, idUsuario);
    if (turmas.length < 1) {
      throw new ServerError("Você não possui permissão para realizar esta ação", 401, new Error().stack);
    }
    return turmas;
  }

  const turmas = await Turma.findAll({
    where: { idEscola },
    attributes: ["idTurma", "nome"],
    include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
    raw: true,
    nest: true,
  });

  return turmas;
};

FindClassesBySchool(3,11).then(res => console.log(res))

module.exports = FindClassesBySchool;
