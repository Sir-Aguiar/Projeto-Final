const FindClassesByAdmin = require("./FindByAdmin");
const { FindClassesByProfessor } = require("./FindByProfessor");

/**
  @typedef {object} Turma
  @property {number} idTurma
  @property {string} nome
*/

/**
 *
 * @param {number} idUsuario Identificador do usuário
 * @returns {Promise<Turma[]>} Todas as turmas que meu usuário tem acesso (por gerir ou por lecionar)
 */

const FindClassesByUser = async (idUsuario) => {
  if (!idUsuario || typeof idUsuario !== "number") {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const admin = await FindClassesByAdmin(idUsuario);
  const professor = await FindClassesByProfessor(idUsuario);

  const classMap = new Map();
  const turmas = [...admin, ...professor].filter((turma) => {
    if (!classMap.has(turma.idTurma)) {
      classMap.set(turma.idTurma, turma);
      return turma;
    }
  });

  return turmas;
};

module.exports = FindClassesByUser;
