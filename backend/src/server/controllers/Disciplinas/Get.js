const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
/** @type {import("express").RequestHandler}  */
const GetDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idCurso, idTurma } = req.params;
  try {
    const foundSchool = await Escola.findOne({ where: { idEscola, idGestor: idUsuario } });
    if (!foundSchool) {
      return res.status(400).json({
        error: {
          message: "Você não possui permissão para fazer isto",
        },
      });
    }
    if (idCurso) {
    } // Outro papo
    if (idTurma) {
    } // Outro papo

    const disciplinas = await Disciplina.findAll({ where: { idEscola } });
    return res.status(200).json({ erro: null, disciplinas });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetDisciplinasController;
