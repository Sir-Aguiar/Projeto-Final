const { json } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Aula = require("../../../database/models/Aula");
/** @type {import("express").RequestHandler}  */
const CreateAulaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { anotacao, idDisciplina, idTurma, idProfessor } = req.body;
  try {
    await Aula.create({ anotacao, idDisciplina, idTurma, idProfessor });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = CreateAulaController;
