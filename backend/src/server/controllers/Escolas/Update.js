const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");

const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const UpdateSchool = require("../../use-cases/Escolas/Update");
const ServerError = require("../../utils/ServerError");

/** @type {import("express").RequestHandler}  */
const UpdateSchoolController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola } = req.query;

  if (!idEscola) {
    return Handler.clientError("Identificador da escola ausente");
  }

  if (isNaN(Number(idEscola))) {
    return Handler.clientError("Identificador da escola em formato inválido");
  }

  const { toUpdate } = req.body;

  if (!toUpdate || (!toUpdate.nome && !toUpdate.idGestor)) {
    return Handler.clientError("Não foram inseridos dados à serem atualizados");
  }

  const { nome, idGestor } = toUpdate;

  if (nome) {
    if (typeof nome !== "string") {
      return Handler.clientError("O nome da escola se encontra em formato inválido");
    }

    if (nome.length > 150) {
      return Handler.clientError("O nome da escola deve conter no máximo 150 caracteres");
    }
  }

  if (idGestor && isNaN(Number(idGestor))) {
    return Handler.clientError("Não foi informado um novo gestor válido");
  }

  try {
    const isUserAdmin = await VerifySchoolPermission(Number(idEscola), Number(idUsuario));

    if (!isUserAdmin) {
      return Handler.unauthorized("Você não possui autorização para realizar esta ação");
    }

    await UpdateSchool(Number(idEscola), toUpdate);
    return Handler.ok();
  } catch (error) {
    if (error instanceof ServerError) {
      if (error.status === 404) {
        return Handler.notFound(error.message);
      }
    }

    if (error instanceof ConnectionRefusedError) {
      return Handler.databaseConnectionFail(undefined, error);
    }

    if (error instanceof ConnectionAcquireTimeoutError) {
      return Handler.databaseTimeout(undefined, error);
    }

    return Handler.fail(undefined, error);
  }
};

module.exports = UpdateSchoolController;
