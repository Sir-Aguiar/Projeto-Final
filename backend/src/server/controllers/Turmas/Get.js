const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetTurmasController = async (req, res) => {
  const { idEscola, idCurso } = req.params;
  const { idUsuario } = req.userData;

  try {
    if (idEscola) {
      // Verifica permissão do usuário
      const schoolExists = await Escola.findOne({
        where: { idEscola, idGestor: idUsuario },
      });
      if (!schoolExists) {
        return res.status(404).json({
          error: {
            message: "Nenhuma escola foi encontrada com este ID",
          },
        });
      }

      // Todas turmas da série
      if (idCurso) {
        const turmas = await Turma.findAll({ where: { idEscola, idCurso } });
        return res.status(200).json({ error: null, turmas });
      }

      // Todas turmas da escola
      const turmas = await Turma.findAll({ where: { idEscola } });
      return res.status(200).json({ error: null, turmas });
    }

    return res.status(200).json({ error: null, turmas });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetTurmasController;
