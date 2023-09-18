const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const DeleteProfessorLecionaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina, idTurma, idProfessor } = req.params;

  try {
    const foundRelation = await ProfessorLeciona.findOne({
      where: { idDisciplina, idTurma, idProfessor },
      include: [{ model: Turma, as: "turma", include: [{ model: Escola, as: "escola" }] }],
    });

    if (!foundRelation) {
      return res.status(404).json({});
    }

    if (foundRelation.dataValues.turma.escola.idGestor !== idUsuario) {
      return res.status(401).json({});
    }

    await foundRelation.destroy()

    return res.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = DeleteProfessorLecionaController;
