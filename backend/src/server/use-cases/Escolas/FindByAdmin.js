const Escola = require("../../../database/models/Escola");

/**
 * @param {number} idGestor Identificador do gestor (da escola), o usuário
 * @returns {Promise<import("../../@types/Escola").__Escola__[]>} Todas as escolas em que o usuário é gestor
 */
const FindSchoolsByAdmin = async (idGestor) => {
  if (!idGestor || typeof idGestor !== "number") {
    throw new ServerError("O identificador do usuario está ausente ou em formato inválido", 400, new Error().stack);
  }

  const foundSchools = await Escola.findAll({
    where: { idGestor },
    attributes: ["idEscola", "idGestor", "nome"],
    raw: true,
    nest: true,
  });
  return foundSchools;
};

module.exports = FindSchoolsByAdmin;
