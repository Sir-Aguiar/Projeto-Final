const Usuario = require("../../../database/models/Usuario");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const CreateProfessorController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { email, idDisciplina, idTurma } = req.body;
  try {
    // Achar o usuário em questão
    const foundProfessor = await Usuario.findOne({ where: { email } });

    if (!foundProfessor) {
      return res.status(404).json({ error: { message: "Nenhum professor encontrado com este email" } });
    }
    // Ache a disciplina
    const foundDiscipline = await Disciplina.findByPk(idDisciplina, { include: [{ model: Escola, as: "escola" }] });
    if (!foundDiscipline) {
      return res.status(404).json({ error: { message: "Nenhuma disciplina encontrada com este id" } });
    }

    // Ache a turma
    const foundClass = await Turma.findByPk(idTurma, { include: [{ model: Escola, as: "escola" }] });
    if (!foundClass) {
      return res.status(404).json({ error: { message: "Nenhuma turma encontrada com este id" } });
    }

    // Compara a escola da turma e disciplina
    if (foundClass.dataValues.idEscola !== foundDiscipline.dataValues.idEscola) {
      return res.status(400).json({});
    }
    // Verifica se é dono da escola
    if (foundClass.dataValues.escola.idGestor !== idUsuario) {
      return res.status(401).json({});
    }
    // Checa relação de disciplina com o curso da turma
    const disciplineCourse = await CursoDisciplina.findOne({
      where: { idDisciplina, idCurso: foundClass.dataValues.idCurso },
    });

    if (!disciplineCourse) {
      return res.status(400).json({});
    }
    await ProfessorLeciona.create({ idProfessor: foundProfessor.dataValues.idUsuario, idDisciplina, idTurma });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = CreateProfessorController;
