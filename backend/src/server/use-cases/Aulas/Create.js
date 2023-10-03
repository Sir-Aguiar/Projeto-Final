const ServerError = require("../../utils/ServerError");
const Aluno = require("../../../database/models/Aluno");
const Turma = require("../../../database/models/Turma");
const Escola = require("../../../database/models/Escola");
const Curso = require("../../../database/models/Curso");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Disciplina = require("../../../database/models/Disciplina");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Aula = require("../../../database/models/Aula");
/* 
  O professor Felipe Aguiar (11)
  Dá aula de Matemática (3)
  Para a turma 1 Ano C (17)
  Do curso 1 Ano (10)

  Turma:
    -> idTurma
    Escola:
      -> idEscola, idGestor
    Curso:
      -> idCurso

  Disciplina:
    -> idDisciplina, idEscola
  Aluno:
    -> idAluno, idTurma, idEscola


  -> A disciplina tem que pertencer a mesma escola que a turma
  -> A disciplina tem que estar na grade do curso da turma
  -> Para associar o professor à aula, ele tem que estar relacionado de acordo
    -> A não ser que seja gestor
  -> Os alunos à serem declarados devem pertencer à turma
*/

const CreateLesson = async (lessonData) => {
  const { idTurma, idDisciplina, idProfessor, observacoes } = lessonData;

  const turma = await Turma.findByPk(idTurma, {
    attributes: ["idTurma"],
    include: [
      { model: Escola, as: "escola", attributes: ["idEscola", "idGestor"] },
      { model: Curso, as: "curso", attributes: ["idCurso"] },
    ],
    raw: true,
    nest: true,
  });

  if (!turma) {
    throw new ServerError("Nenhuma turma foi encontrada", 404);
  }

  const disciplina = await Disciplina.findByPk(idDisciplina, {
    attributes: ["idEscola", "idDisciplina"],
    raw: true,
    nest: true,
  });

  if (!disciplina) {
    throw new ServerError("Nenhuma disciplina foi encontrada", 404);
  }

  if (disciplina.idEscola !== turma.escola.idEscola) {
    throw new ServerError("Esta disciplina não pertence à esta escola", 401);
  }

  const grade = await CursoDisciplina.findOne({
    where: {
      idCurso: turma.curso.idCurso,
      idDisciplina,
    },
    raw: true,
    nest: true,
  });

  if (!grade) {
    throw new ServerError("Esta disciplina não é atribuível à está turma", 401);
  }

  if (turma.escola.idGestor !== idProfessor) {
    const professor = await ProfessorLeciona.findOne({
      where: { idProfessor, idDisciplina, idTurma },
      raw: true,
      nest: true,
    });

    if (!professor) {
      throw new ServerError("Este professor não está leciona esta disciplina à esta turma", 401);
    }
  }

  const created = await Aula.create({ idTurma, idDisciplina, idProfessor, observacoes });
  return created;
};

module.exports = CreateLesson;
