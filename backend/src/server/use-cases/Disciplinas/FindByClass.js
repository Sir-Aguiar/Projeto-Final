const ServerError = require("../../utils/ServerError");

const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Disciplina = require("../../../database/models/Disciplina");
const Turma = require("../../../database/models/Turma");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");

const FindDisciplinesByClass = async (idTurma) => {
  const turma = await Turma.findByPk(idTurma, {
    attributes: ["idTurma", "idCurso", "idEscola"],
    raw: true,
    nest: true,
  });

  if (!turma) {
    throw new ServerError("Nenhuma turma foi encontrada", 404);
  }

  const grade = await CursoDisciplina.findAll({
    where: {
      idCurso: turma.idCurso,
    },
    attributes: ["idDisciplina", "idCurso"],
    include: [
      {
        model: Disciplina,
        as: "disciplina",
        attributes: ["idDisciplina", "nome"],
        where: { idEscola: turma.idEscola },
        required: true,
      },
    ],
    raw: true,
    nest: true,
  });

  return grade.map(({ disciplina }) => disciplina);
};

const FindDisciplinesFromClassByProfessor = async (idTurma, idProfessor) => {
  const turma = await Turma.findByPk(idTurma, { attributes: ["idTurma"], raw: true, nest: true });

  if (!turma) {
    throw new ServerError("Nenhuma turma foi encontrada", 404);
  }

  const relacoes = await ProfessorLeciona.findAll({
    where: { idTurma, idProfessor },
    include: [{ model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] }],
    raw: true,
    nest: true,
  });

  return relacoes.map((relacao) => relacao.toJSON()).map(({ disciplina }) => disciplina);
};

module.exports = { FindDisciplinesByClass, FindDisciplinesFromClassByProfessor };
