const { json } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Chamada = require("../../../database/models/Chamada");
/** @type {import("express").RequestHandler}  */
const CreateChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAula } = req.body;
  try {
    await Chamada.create({ idAula });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = CreateChamadaController;
