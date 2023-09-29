const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
const FindAllSchools = require("../../use-cases/Escolas/FindAll");
const FindSchoolById = require("../../use-cases/Escolas/FindById");
const ResponseHandler = require("../../utils/ResponseHandler");
const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");

/** @type {import("express").RequestHandler}  */
const GetSchoolsController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;
  
  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { idEscola } = req.query;


  if (idEscola) {
    // Caso não seja um número
    if (isNaN(Number(idEscola))) {
      return Handler.clientError("Identificador da escola em formato inválido");
    }

    const isUserAdmin = await VerifySchoolPermission(Number(idEscola), Number(idUsuario));

    if (!isUserAdmin) {
      return Handler.unauthorized("Você não possui autorização para realizar esta ação");
    }

    // Retornar escola específica
    const escola = await FindSchoolById(idEscola);
    return Handler.ok({ escola });
  }

  try {
    const escolas = await FindAllSchools(Number(idUsuario));
    return Handler.ok({ escolas });
  } catch (error) {
    if (error instanceof ConnectionRefusedError) {
      return Handler.fail(
        "Parece que nosso banco de dados se encontra fora do ar neste momento, tente novamente em alguns instantes",
        error,
      );
    }
    if (error instanceof ConnectionAcquireTimeoutError) {
      return Handler.fail("Parece que nosso banco de dados esta sobrecarregado, aguarde alguns instantes", error);
    }

    return Handler.fail("Houve um erro desconhecido, isto foi um problema interno. Aguarde aguns instantes", error);
  }
};

module.exports = GetSchoolsController;
