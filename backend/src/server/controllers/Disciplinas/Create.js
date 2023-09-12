const { json } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
/** @type {import("express").RequestHandler}  */
const CreateDisciplinaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, nome } = req.body;
  try {
    const foundSchool = await Escola.findOne({ idEscola, idGestor: idUsuario });
    if (!foundSchool) {
      return res.status(400).json({
        error: {
          message: "Você não possui permissão para fazer isto",
        },
      });
    }
    await Disciplina.create({ nome, idEscola });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = CreateDisciplinaController;
