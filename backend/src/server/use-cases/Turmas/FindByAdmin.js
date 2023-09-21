const { Op } = require("sequelize");
const Turma = require("../../../database/models/Turma");
const FindSchoolsByAdmin = require("../Escolas/FindByAdmin");

/**
  @typedef {object} Turma
  @property {number} idTurma
  @property {string} nome
*/

/**
 *
 * @param {number} idGestor Identificador do gestor (da escola), o usuário
 * @returns {Promise<Turma[]>} Todas as turmas das escolas em que o usuário é gestor
 */

const FindClassesByAdmin = async (idGestor) => {
  if (!idGestor || typeof idGestor !== "number") {
    throw new ServerError("O identificador do usuario está ausente ou em formato inválido", 400, new Error().stack);
  }

  const foundSchools = await FindSchoolsByAdmin(idGestor);

  const foundClasses = await Turma.findAll({
    where: {
      idEscola: {
        [Op.in]: foundSchools.map((escola) => escola.idEscola),
      },
    },
    attributes: ["idTurma", "nome"],
    raw: true,
    nest: true,
  });

  return foundClasses;
};

module.exports = FindClassesByAdmin;
