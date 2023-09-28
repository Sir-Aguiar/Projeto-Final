const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const UpdateAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAluno } = req.params;
  const { toUpdate } = req.body;

  if (!toUpdate) {
    return res.status(400).json({
      error: {
        message: "Nenhum dado para se atualizar foi enviado",
      },
    });
  }

  try {
    const aluno = await Aluno.findByPk(idAluno);
    if (!aluno) {
      return res.status(404).json({
        error: {
          message: "Nenhum aluno encontrado com este identificador",
        },
      });
    }
    const isUserAdmin = await VerifySchoolPermission(aluno.dataValues.idEscola, Number(idUsuario));

    if (!isUserAdmin) {
      return res.status(401).json({
        error: {
          message: "Você não tem permissão para realizar esta ação",
        },
      });
    }

    aluno.update(toUpdate);
    return res.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
module.exports = UpdateAlunosController;
