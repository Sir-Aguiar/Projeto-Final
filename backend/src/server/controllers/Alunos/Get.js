const { json } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Curso = require("../../../database/models/Curso");
const Turma = require("../../../database/models/Turma");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const FindStudentsByClass = require("../../use-cases/Alunos/FindByClass");
const ServerError = require("../../utils/ServerError");
const FindStudentsBySchool = require("../../use-cases/Alunos/FindBySchool");
const FindStudentsByUser = require("../../use-cases/Alunos/FindByUser");
/** @type {import("express").RequestHandler}  */
const GetAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idTurma, idCurso, idAluno, take, skip } = req.query;

  // Todos alunos de uma turma
  if (idTurma) {
    try {
      const alunos = await FindStudentsByClass(req.userData, Number(idTurma));
      return res.status(200).json({ error: null, alunos });
    } catch (error) {
      if (error instanceof ServerError) {
        const { message, status } = error;
        return res.status(status).json({ error: { message } });
      }
      console.log(error);
      return res.status(500).json({
        error: { message: "Houve um erro desconhecido ao tentar pesquisar os alunos pela turma" },
      });
    }
  }

  // Todos alunos de escola
  if (idEscola) {
    try {
      const alunos = await FindStudentsBySchool(req.userData, Number(idEscola));
      return res.status(200).json({ error: null, alunos });
    } catch (error) {
      if (error instanceof ServerError) {
        const { message, status } = error;
        return res.status(status).json({ error: { message } });
      }
      console.log(error);
      return res.status(500).json({
        error: { message: "Houve um erro desconhecido ao tentar pesquisar os alunos pela escola" },
      });
    }
  }

  if (idAluno && !isNaN(Number(idAluno))) {
    const aluno = await Aluno.findByPk(idAluno, {
      include: [
        { model: Escola, as: "escola", where: { idGestor: idUsuario }, attributes: ["idEscola", "nome"] },
        {
          model: Turma,
          as: "turma",
          attributes: ["idTurma", "nome"],
          include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
        },
      ],
      attributes: ["idAluno", "nome"],
    });
    return res.status(200).json({ error: null, aluno });
  }

  // Todos os alunos
  try {
    const alunos = await FindStudentsByUser(Number(idUsuario));
    return res.status(200).json({ error: null, alunos });
  } catch (error) {
    if (error instanceof ServerError) {
      const { message, status } = error;
      return res.status(status).json({ error: { message } });
    }
    console.log(error);
    return res.status(500).json({
      error: { message: "Houve um erro desconhecido ao tentar pesquisar os alunos" },
    });
  }
};

module.exports = GetAlunosController;
