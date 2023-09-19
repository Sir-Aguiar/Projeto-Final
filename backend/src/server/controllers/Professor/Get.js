const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Curso = require("../../../database/models/Curso");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const Usuario = require("../../../database/models/Usuario");
const { Sequelize } = require("sequelize");
/** @type {import("express").RequestHandler}  */
const GetProfessorLecionaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma, idEscola, onlyLength } = req.query;
  try {
    if (idTurma) {
      const professores = await ProfessorLeciona.findAll({
        attributes: ["idProfessor", "professor.nome", "idLeciona"],
        where: { idTurma, idProfessor: idUsuario },
        include: [
          { model: Usuario, as: "professor", attributes: [] },
          {
            model: Turma,
            as: "turma",
            attributes: ["idTurma", "nome"],
          },
          { model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] },
        ],
        raw: true,
        nest: true,
      });

      return res.status(200).json({ professores });
    }
    if (idEscola) {
      const foundSchool = await Escola.findByPk(idEscola);
      if (!foundSchool) {
        return res.status(404).json({});
      }
      if (foundSchool.dataValues.idGestor !== idUsuario) {
        const professores = await ProfessorLeciona.findAll({
          attributes: ["idProfessor", "professor.nome", "idLeciona"],
          where: { idProfessor: idUsuario },
          include: [
            { model: Usuario, as: "professor", attributes: [] },
            {
              model: Turma,
              as: "turma",
              attributes: ["idTurma", "nome"],
              where: { idEscola },
            },
            { model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] },
          ],
          raw: true,
          nest: true,
        });
        if (professores.length < 1) {
          return res.status(401).json({});
        }
        return res.status(200).json({ professores });
      }

      if (onlyLength) {
        const result = await ProfessorLeciona.count({
          include: [{ model: Turma, as: "turma", attributes: [], where: { idEscola } }],
          group: ["idProfessor"],
          distinct: true,
        });
        return res.status(200).json({ length: result.length });
      }

      const professores = await ProfessorLeciona.findAll({
        attributes: ["idProfessor", "professor.nome", "idLeciona"],
        include: [
          { model: Usuario, as: "professor", attributes: [] },
          {
            model: Turma,
            as: "turma",
            attributes: ["idTurma", "nome"],
            where: { idEscola },
          },
          { model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] },
        ],
        raw: true,
        nest: true,
      });

      return res.status(200).json({ professores });
    }

    return res.status(404).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = GetProfessorLecionaController;
