const Curso = require("../../../database/models/Curso");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Disciplina = require("../../../database/models/Disciplina");
const ServerError = require("../../utils/ServerError");

const CreateDisciplineGrid = async (idDisciplina, idCurso) => {
  const disciplina = await Disciplina.findByPk(idDisciplina);

  if (!disciplina) {
    throw new ServerError("Nenhuma disciplina foi encontrada", 404);
  }

  const curso = await Curso.findByPk(idCurso);

  if (!curso) {
    throw new ServerError("Nenhum curso foi encontrado", 404);
  }

  const created = await CursoDisciplina.create({ idCurso, idDisciplina });
  return created;
};

module.exports = CreateDisciplineGrid;
