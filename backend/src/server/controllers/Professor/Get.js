const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Curso = require("../../../database/models/Curso");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
/** @type {import("express").RequestHandler}  */
const GetProfessorLecionaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma } = req.params;
  try {
    if (idTurma) {
      const professorLeciona = await ProfessorLeciona.findAll({ where: { idTurma } });
      return res.status(200).json({ error: null, professorLeciona });
    }
    const professorLeciona = await ProfessorLeciona.findAll({});
    return res.status(200).json({ error: null, professorLeciona });
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
