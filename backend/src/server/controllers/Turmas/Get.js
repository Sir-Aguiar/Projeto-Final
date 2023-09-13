const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetTurmasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idTurma } = req.query;
  try {
    if (idEscola) {
      const foundSchool = await Escola.findOne({ where: { idEscola } });

      if (!foundSchool) {
        return res.status(404).json({
          error: {
            message: "Nenhuma escola foi encontrada com este ID",
          },
        });
      }

      if (foundSchool.dataValues.idGestor !== idUsuario) {
        return res.status(401).json({
          error: {
            message: "Você não possui acesso às turmas desta escola",
          },
        });
      }

      const turmas = await Turma.findAll({ where: { idEscola } });
      return res.status(200).json({ error: null, turmas });
    }

    if (idTurma) {
      const turma = await Turma.findByPk(idTurma, {
        include: [
          { model: Escola, as: "escola", where: { idGestor: idUsuario } },
          { model: Aluno, as: "alunos" },
          { model: Curso, as: "curso" },
        ],
      });
      return res.status(200).json({ error: null, turma });
    }

    const turmas = await Turma.findAll({
      include: [
        { model: Escola, as: "escola", attributes: ["idGestor", "nome"], where: { idGestor: idUsuario } },
        { model: Curso, as: "curso", attributes: ["nome"] },
      ],
    });

    return res.status(200).json({ error: null, turmas });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetTurmasController;
