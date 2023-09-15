const { json } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Curso = require("../../../database/models/Curso");
const Turma = require("../../../database/models/Turma");

/** @type {import("express").RequestHandler}  */
const GetAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idTurma, idCurso, idAluno, take, skip } = req.query;

  try {
    // Todos alunos de uma turma
    if (idTurma && !isNaN(Number(idTurma))) {
      const alunos = await Aluno.findAll({
        where: { idTurma },
        include: { model: Escola, as: "escola", where: { idGestor: idUsuario } },
      });

      return res.status(200).json({ error: null, alunos });
    }
    // Todos alunos de turma
    if (idEscola && !isNaN(Number(idEscola))) {
      // Todos alunos de uma série/curso
      if (idCurso && !isNaN(Number(idCurso))) {
        const alunos = await Aluno.findAll({
          where: { idCurso, idEscola },
          include: { model: Escola, as: "escola", where: { idGestor: idUsuario } },
        });
        return res.status(200).json({ error: null, alunos });
      }

      const alunos = await Aluno.findAll({
        where: { idEscola },
        include: { model: Escola, as: "escola", where: { idGestor: idUsuario } },
      });

      return res.status(200).json({ error: null, alunos });
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

/* 
  Alunos por escola
  Alunos por turma
  Alunos por curso
*/

module.exports = GetAlunosController;
