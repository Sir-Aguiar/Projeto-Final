const Escola = require("../../database/models/Escola");
const ProfessorLeciona = require("../../database/models/ProfessorLeciona");
const Turma = require("../../database/models/Turma");
const ServerError = require("./ServerError");

/**
 @param {number} idEscola Identificador da escola
 @param {number} idUsuario Identificador do usuário
 @returns {Promise<boolean>} true indica que o usuário é gestor da escola informada false indica que não
*/

const VerifySchoolPermission = async (idEscola, idUsuario) => {
  const foundSchool = await Escola.findByPk(idEscola, { attributes: ["idGestor"], raw: true, nest: true });

  if (!foundSchool) {
    throw new ServerError("Nenhuma escola foi encontrada com este identificador", 404);
  }

  if (foundSchool && foundSchool.idGestor === idUsuario) return true;

  return false;
};

/**
 @param {number} idTurma Identificador da turma
 @param {number} idUsuario Identificador do usuário
 @returns {Promise<boolean>} `true` indica que o usuário tem acesso à turma `false` indica que não tem acesso
*/

const VerifyClassPermission = async (idTurma, idUsuario) => {
  const foundClass = await Turma.findByPk(idTurma, { raw: true, nest: true, attributes: ["idEscola"] });
  const isUserAdmin = await VerifySchoolPermission(foundClass.idEscola, idUsuario);
  if (isUserAdmin) return true;

  const foundRelation = await ProfessorLeciona.findOne({
    where: { idProfessor: idUsuario, idTurma },
    attributes: ["idLeciona"],
    raw: true,
    nest: true,
  });

  if (!foundRelation) return false;
  return true;
};

const VerifyUserPermission = async (idUsuario, options) => {
  const { idEscola, idTurma } = options;

  if (idEscola) {
    const escola = await Escola.findByPk(idEscola, { attributes: ["idGestor"], raw: true, nest: true });

    if (!escola) {
      throw new ServerError("Nenhuma escola foi encontrada com este identificador", 404);
    }

    if (escola.idGestor === idUsuario) return 0;

    if (escola.idGestor !== idUsuario) {
      const relacoes = await ProfessorLeciona.findAll({
        where: {
          idProfessor: idUsuario,
        },
        include: [
          {
            model: Turma,
            as: "turma",
            attributes: ["idTurma"],
            include: [{ model: Escola, as: "escola", where: { idEscola }, required: true }],
            required: true,
          },
        ],
      });

      if (relacoes.length >= 1) return 1;
      return -1;
    }
  }

  if (idTurma) {
    const foundObject = await Turma.findByPk(idTurma, {
      include: [
        { model: Escola, as: "escola", attributes: ["idGestor"] },
        { model: ProfessorLeciona, as: "professores", attributes: ["idProfessor"] },
      ],
    });

    if (!foundObject) {
      throw new ServerError("Nenhuma turma foi encontrada com este identificador", 404);
    }

    const turma = foundObject.toJSON();
    if (turma.escola.idGestor === idUsuario) return 0;

    if (turma.professores.map((prof) => prof.idProfessor).includes(idUsuario)) return 1;

    return -1;
  }
};

module.exports = { VerifySchoolPermission, VerifyClassPermission, VerifyUserPermission };
