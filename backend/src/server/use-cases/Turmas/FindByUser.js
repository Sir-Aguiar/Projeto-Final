const FindClassesByAdmin = require("./FindByAdmin");
const { FindClassesByProfessor } = require("./FindByProfessor");
/**
 *
 * @param {number} idUsuario Identificador do usuário
 * @returns {Promise<import("../../@types/Turma").__Turma__[]>} Todas as turmas que meu usuário tem acesso (por gerir ou por lecionar)
 */

const FindClassesByUser = async (idUsuario) => {
  const admin = await FindClassesByAdmin(idUsuario);
  const professor = await FindClassesByProfessor(idUsuario);

  const classMap = new Map();
  const turmas = [...admin, ...professor].filter((turma) => {
    if (!classMap.has(turma.idTurma)) {
      classMap.set(turma.idTurma, turma);
      return true;
    }
  });

  return turmas;
};

module.exports = FindClassesByUser;
