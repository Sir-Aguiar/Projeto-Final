const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const ServerError = require("../../utils/ServerError");
const FindAllSchools = async (idUsuario) => {
  if (!idUsuario || typeof idUsuario !== "number") {
    throw new ServerError("O identificador do usuario está ausente ou em formato inválido", 400, new Error().stack);
  }

  // Todas as escolas em que o usuário é gestor
  const ownedSchools = await Escola.findAll({
    where: { idGestor: idUsuario },
    raw: true,
    nest: true,
    attributes: ["idEscola", "idGestor", "nome"],
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
    raw: true, // Retorna resultados como objetos JavaScript em vez de instâncias do Sequelize
    nest: true, // Aninha os resultados em objetos JavaScript
    distinct: true, // Evita duplicatas,
    group: ["turma.escola.idEscola"],
  });

  // Filtering for only uniques values
  const escolasMap = new Map();

  const escolas = [...ownedSchools, ...givenSchools].filter((escola) => {
    if (!escolasMap.has(escola.idEscola)) {
      escolasMap.set(escola.idEscola, escola);
      return true;
    }
  });

  return escolas;
};

module.exports = FindAllSchools;
