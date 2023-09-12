const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Chamada = require("../../../database/models/Chamada");
/** @type {import("express").RequestHandler}  */
const GetChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAula } = req.params;
  try {
    const chamadas = await Chamada.findAll({ where: { idAula } });
    return res.status(200).json({ erro: null, chamadas });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetChamadaController;
