const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const Curso = require("../../../database/models/Curso");
/** @type {import("express").RequestHandler}  */
const GetAlunoChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idChamada } = req.params;
  try {
    const chamadasAluno = await ChamadaAluno.findAll({ where: { idChamada } });
    return res.status(200).json({ errro: null, chamadasAluno });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = GetAlunoChamadaController;
