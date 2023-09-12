const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Curso = require("../../../database/models/Curso");
/** @type {import("express").RequestHandler}  */
const GetCursoDisciplinaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina } = req.params;
  try {
    if (idDisciplina) {
      const cursoDisciplina = await CursoDisciplina.findAll({ where: { idDisciplina } });
      return res.status(200).json({ error: null, cursoDisciplina });
    }

    return res.status(400).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = GetCursoDisciplinaController;
