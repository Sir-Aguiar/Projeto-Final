const { ConnectionRefusedError } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");

/**
 *
 * @param {number} idUsuario Identificador do usuário
 * @returns {Promise<import("./FindByAdmin").Escola[]>}
 */
const FindAllSchools = async (idUsuario) => {
  // Todas as escolas em que o usuário é gestor
  const ownedSchools = await Escola.findAll({
    where: { idGestor: idUsuario },
    attributes: ["idEscola", "idGestor", "nome"],
    raw: true,
    nest: true,
  });

  // Todas as escolas em que é professor
  const givenSchools = await ProfessorLeciona.findAll({
    where: { idProfessor: idUsuario },
    include: [
      {
        model: Turma,
        as: "turma",
        attributes: [], // Não selecione nenhum atributo da Turma
        include: [
          {
            model: Escola,
            as: "escola",
            attributes: [],
          },
        ],
      },
    ],
    attributes: ["turma.escola.idEscola", "turma.escola.idGestor", "turma.escola.nome"],
    raw: true,
    nest: true,
    distinct: true,
    group: ["turma.escola.idEscola"],
  });

  const schoolsMap = new Map();

  const escolas = [...ownedSchools, ...givenSchools].filter((escola) => {
    if (!schoolsMap.has(escola.idEscola)) {
      schoolsMap.set(escola.idEscola, escola);
      return true;
    }
  });

  return escolas;
};

module.exports = FindAllSchools;
