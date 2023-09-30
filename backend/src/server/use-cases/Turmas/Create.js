const { Model } = require("sequelize");
const Turma = require("../../../database/models/Turma");
/**
 * @param {number} idEscola Identificador da escola a ser inserida a turma
 * @param {number} idCurso Identificador do curso a ser inserida a turma
 * @param {string} nome Nome da turma
 * @returns {Promise<Model<any, any>>}
 */
const CreateOneClass = async (idEscola, idCurso, nome) => {
  const turma = await Turma.create({ idEscola, idCurso, nome });
  return turma;
};

/**
 * @param {import("../../@types/Turma").__Turma__[]} turmas Array de turmas a ser inseridas
 * @returns {Promise<number>}
 */
const CreateManyClasses = async (turmas) => {
  const result = await Turma.bulkCreate(turmas, { returning: true });
  return result.length;
};

module.exports = { CreateOneClass, CreateManyClasses };
