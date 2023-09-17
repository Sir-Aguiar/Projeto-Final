const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Curso = require("../../../database/models/Curso");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const GetDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idCurso, onlyLength } = req.query;
  try {
    if (idEscola) {
      if (isNaN(Number(idEscola))) {
        return res.status(400).json({});
      }
      const foundSchool = await Escola.findByPk(idEscola);

      if (!foundSchool) {
        return res.status(404).json({});
      }

      if (foundSchool.dataValues.idGestor !== idUsuario) {
        return res.status(401).json({});
      }

      if (onlyLength) {
        return res.status(200).json({
          length: await Disciplina.count({
            where: { idEscola },
          }),
        });
      }

      const disciplinas = await Escola.findOne({
        include: [
          {
            model: Disciplina,
            as: "disciplinas",
            attributes: ["nome", "idDisciplina"],
          },
        ],
        attributes: [],
        where: { idGestor: idUsuario, idEscola },
      });

      if (!disciplinas) {
        return res.status(404).json({});
      }

      return res.status(200).json({ disciplinas: disciplinas.disciplinas });
    }

    const disciplinas = await Disciplina.findAll({
      include: [{ model: Escola, as: "escola", attributes: ["idGestor"], where: { idGestor: idUsuario } }],
    });

    if (!disciplinas) {
      return res.status(404).json({});
    }

    return res.status(200).json({ error: null, disciplinas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

module.exports = GetDisciplinasController;
