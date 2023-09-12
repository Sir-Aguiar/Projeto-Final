const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Aula = require("../../../database/models/Aula");
/** @type {import("express").RequestHandler}  */
const GetAulasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma } = req.params;
  try {
    const aulas = await Aula.findAll({ where: { idTurma } });
    return res.status(200).json({ erro: null, aulas });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetAulasController;
