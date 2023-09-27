const FindClassesBySchool = require("../../use-cases/Turmas/FindBySchool");
const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Usuario = require("../../../database/models/Usuario");
const Turma = require("../../../database/models/Turma");
const Disciplina = require("../../../database/models/Disciplina");
const FindClassesByUser = require("../../use-cases/Turmas/FindByUser");
const ServerError = require("../../utils/ServerError");
/** @type {import("express").RequestHandler}  */
const GetTurmasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idTurma } = req.query;

  if (idEscola) {
    try {
      const turmas = await FindClassesBySchool(Number(idEscola), Number(idUsuario));
      return res.status(200).json({ error: null, turmas });
    } catch (error) {
      if (error instanceof ServerError) {
        const { message, status } = error;
        return res.status(status).json({ error: { message } });
      }
      console.log(error);
      return res.status(500).json({
        error: { message: "Houve um erro desconhecido ao tentar pesquisar turmas por escola" },
      });
    }
  }

  if (idTurma) {
    const turma = await Turma.findByPk(idTurma, {
      include: [
        { model: Escola, as: "escola" },
        { model: Aluno, as: "alunos", attributes: ["idAluno", "nome"] },
        { model: Curso, as: "curso" },
        {
          model: ProfessorLeciona,
          as: "professores",
          attributes: ["idProfessor", "idDisciplina"],
          include: [
            { model: Usuario, as: "professor", attributes: ["nome"] },
            { model: Disciplina, as: "disciplina", attributes: ["nome"] },
          ],
        },
      ],
      attributes: ["idTurma", "nome"],
    });

    if (turma.toJSON().escola.idGestor !== idUsuario) {
      const OBJECT_TO_NOT_MANAGER = turma.toJSON();

      OBJECT_TO_NOT_MANAGER.professores = OBJECT_TO_NOT_MANAGER.professores.filter(
        (some_class) => some_class.idProfessor === idUsuario,
      );
      if (OBJECT_TO_NOT_MANAGER.professores.length < 1) {
        return res.status(401).json({});
      }
      return res.status(200).json({ error: null, turma: OBJECT_TO_NOT_MANAGER });
    }

    if (!turma) {
      return res.status(404).json({});
    }

    return res.status(200).json({ error: null, turma });
  }

  try {
    const turmas = await FindClassesByUser(Number(idUsuario));
    return res.status(200).json({ error: null, turmas });
  } catch (error) {
    if (error instanceof ServerError) {
      const { message, status } = error;
      return res.status(status).json({ error: { message } });
    }
    console.log(error);
    return res.status(500).json({
      error: { message: "Houve um erro desconhecido ao tentar pesquisar turmas" },
    });
  }
};

module.exports = GetTurmasController;
