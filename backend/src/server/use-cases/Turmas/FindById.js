const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const Usuario = require("../../../database/models/Usuario");
const ServerError = require("../../utils/ServerError");

const FindClassById = async (idTurma) => {
  const turma = await Turma.findByPk(idTurma, {
    attributes: ["idTurma", "nome"],
    include: [
      { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
      { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
      {
        model: ProfessorLeciona,
        as: "professores",
        attributes: ["idLeciona"],
        include: [
          { model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] },
          { model: Usuario, as: "professor", attributes: ["idUsuario", "nome"] },
        ],
      },
    ],
  });

  if (!turma) throw new ServerError("Nenhuma turma foi encontrada", 404);

  return turma.toJSON();
};

module.exports = FindClassById;
