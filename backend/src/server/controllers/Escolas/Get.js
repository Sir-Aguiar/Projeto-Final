const ServerError = require("../../utils/ServerError");
const FindAllSchools = require("../../use-cases/Escolas/FindAll");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetEscolasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola } = req.query;

  if (idEscola) {
    const escola = await Escola.findByPk(idEscola, {
      include: [{ model: Turma, as: "turmas", attributes: ["idTurma", "nome"] }],
      attributes: ["idEscola", "idGestor", "nome"],
    });

    if (!escola) {
      return res.status(404).json({});
    }

    if (escola.dataValues.idGestor !== idUsuario) {
      const foundRelations = await ProfessorLeciona.findAll({
        where: { idProfessor: idUsuario },
        include: [{ model: Turma, as: "turma", where: { idEscola }, attributes: [] }],
        raw: true,
        nest: true,
        attributes: ["turma.idTurma", "turma.nome"],
      });

      if (foundRelations.length < 1) {
        return res.status(401).json({});
      }

      const schoolData = escola.dataValues;

      return res.status(200).json({
        escola: {
          idEscola: schoolData.idEscola,
          idGestor: schoolData.idGestor,
          nome: schoolData.nome,
          turmas: foundRelations,
        },
      });
    }

    return res.status(200).json({ error: null, escola });
  }

  // Todas as escolas
  try {
    const escolas = await FindAllSchools(Number(idUsuario));
    return res.status(200).json({ error: null, escolas });
  } catch (error) {
    if (error instanceof ServerError) {
      const { message, status } = error;
      return res.status(status).json({ error: { message } });
    }

    console.log(error);
    return res.status(500).json({
      error: { message: "Houve um erro desconhecido ao tentar pesquisar escolas" },
    });
  }
};

module.exports = GetEscolasController;
