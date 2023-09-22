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
  if (!idEscola || typeof idEscola !== "number" || isNaN(Number(idEscola))) {
    throw new ServerError("O identificador da escola está ausente ou em formato inválido", 400, new Error().stack);
  }

  if (!idUsuario || typeof idUsuario !== "number" || isNaN(Number(idUsuario))) {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
  }

  const foundSchool = await Escola.findByPk(idEscola, { raw: true, nest: true });

  if (!foundSchool) throw new ServerError("Nenhuma escola foi encontrada com este identificador", 404);

  if (foundSchool.idGestor === idUsuario) return true;
  return false;
};

/**
 @param {number} idTurma Identificador da turma
 @param {number} idUsuario Identificador do usuário
 @returns {Promise<boolean>} `true` indica que o usuário tem acesso à turma `false` indica que não tem acesso
*/

const VerifyClassPermission = async (idTurma, idUsuario) => {
  if (!idTurma || typeof idTurma !== "number" || isNaN(Number(idTurma))) {
    throw new ServerError("O identificador da turma está ausente ou em formato inválido", 400);
  }

  if (!idUsuario || typeof idUsuario !== "number" || isNaN(Number(idUsuario))) {
    throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400);
  }

  const foundRelation = await ProfessorLeciona.findOne({
    where: { idProfessor: idUsuario, idTurma },
    attributes: ["idLeciona"],
    raw: true,
    nest: true,
  });

  if (!foundRelation) return false;
  return true;
};

module.exports = { VerifySchoolPermission, VerifyClassPermission };