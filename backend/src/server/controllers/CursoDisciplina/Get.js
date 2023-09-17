const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Curso = require("../../../database/models/Curso");
/** @type {import("express").RequestHandler}  */
const GetCursoDisciplinaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola } = req.query;
  try {
    if (idEscola) {
      const foundSchool = await Escola.findByPk(idEscola);

      if (!foundSchool) {
        return res.status(404).json({});
      }

      if (foundSchool.dataValues.idGestor !== idUsuario) {
        return res.status(401).json({});
      }

      const result = await CursoDisciplina.findAll({
        include: [
          { model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"], where: { idEscola } },
          { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
        ],
        attributes: [],
        raw: true,
        nest: true,
      });
      const grade = result.map((obj) => ({
        idDisciplina: obj.disciplina.idDisciplina,
        nome: obj.disciplina.nome,
        curso: obj.curso,
      }));
      return res.status(200).json({ grade });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetCursoDisciplinaController;
