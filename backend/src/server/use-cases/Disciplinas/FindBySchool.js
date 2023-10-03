const ServerError = require("../../utils/ServerError");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const { Op } = require("sequelize");

const FindDisciplinesBySchool = async (idEscola, onlyLength) => {
  const escola = await Escola.findByPk(idEscola, {
    attributes: ["idEscola"],
    include: [{ model: Disciplina, as: "disciplinas", attributes: ["idDisciplina", "nome"] }],
  });

  if (!escola) {
    throw new ServerError("Nenhuma escola foi encontrada", 404);
  }

  const disciplinas = escola.toJSON().disciplinas;

  return onlyLength ? disciplinas.length : disciplinas;
};

const FindDisciplinesFromSchoolByProfessor = async (idEscola, idProfessor) => {
  const escola = await Escola.findByPk(idEscola, {
    attributes: ["idEscola"],
    include: [{ model: Turma, as: "turmas", attributes: ["idTurma"] }],
  });

  if (!escola) {
    throw new ServerError("Nenhuma escola foi encontrada", 404);
  }

  const turmas = escola.toJSON().turmas.map(({ idTurma }) => idTurma);

  const relacoes = await ProfessorLeciona.findAll({
    where: {
      idProfessor,
      idTurma: {
        [Op.in]: turmas,
      },
    },
    include: [{ model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] }],
  });

  return relacoes.map((relacao) => relacao.toJSON()).map(({ disciplina }) => disciplina);
};

module.exports = { FindDisciplinesBySchool, FindDisciplinesFromSchoolByProfessor };
