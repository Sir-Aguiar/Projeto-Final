const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetEscolasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola } = req.params;

  try {
    const SCHOOLS_OF_LESSON = await ProfessorLeciona.findAll({
      where: { idProfessor: idUsuario },
      include: [
        {
          model: Turma,
          as: "turma",
          attributes: [], // Não selecione nenhum atributo da Turma
          include: [
            {
              model: Escola,
              as: "escola",
              attributes: [],
            },
          ],
        },
      ],
      attributes: ["turma.escola.idEscola", "turma.escola.idGestor", "turma.escola.nome"],
      raw: true, // Retorna resultados como objetos JavaScript em vez de instâncias do Sequelize
      nest: true, // Aninha os resultados em objetos JavaScript
      distinct: true, // Evita duplicatas,
      group: ["turma.escola.idEscola"],
    });

    const SCHOOLS_OF_ADM = await Escola.findAll({
      where: { idGestor: idUsuario },
      raw: true,
      nest: true,
      attributes: ["idEscola", "idGestor", "nome"],
    });

    const escolas = [];

    for (const escola of [...SCHOOLS_OF_ADM, ...SCHOOLS_OF_LESSON]) {
      escolas.push(escola);
    }

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
