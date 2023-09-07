const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetEscolasController = async (req, res) => {
  const { idProfessor } = req.userData;
  const { idEscola } = req.params;
  try {
    if (idEscola) {
      const escola = await Escola.findOne({
        where: { idProfessor, idEscola },
        include: [
          {
            model: Turma,
            as: "turmas",
          },
        ],
      });

      if (!escola) {
        return res.status(404).json({
          error: {
            message: "Nenhuma escola encontrada com este id",
          },
        });
      }

      return res.status(200).json({ error: null, escola });
    }
    const escolas = await Escola.findAll({ where: { idProfessor } });
    return res.status(200).json({ error: null, escolas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = GetEscolasController;
