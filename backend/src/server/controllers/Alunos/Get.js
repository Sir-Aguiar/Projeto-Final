const { json } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Curso = require("../../../database/models/Curso");
const Turma = require("../../../database/models/Turma");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const FindStudentsByClass = require("../../use-cases/Alunos/FindByClass");
const ServerError = require("../../utils/ServerError");

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

  try {
    // Todos alunos de escola
    if (idEscola && !isNaN(Number(idEscola))) {
      const alunos = await Aluno.findAndCountAll({
        where: { idEscola },
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
        limit: Number(take) || 30,
        offset: Number(skip) || 0,
        order: [["nome", "ASC"]],
      });

      return res.status(200).json({ error: null, alunos: alunos.rows, qtd: alunos.count });
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

    // Todos alunos que pertencem às suas escolas
    const alunos = await Aluno.findAndCountAll({
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
      limit: Number(take) || 30,
      offset: Number(skip) || 0,
      order: [["nome", "ASC"]],
    });

    return res.status(200).json({ error: null, alunos: alunos.rows, qtd: alunos.count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = GetAlunosController;
