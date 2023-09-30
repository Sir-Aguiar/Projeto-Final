const { ConnectionRefusedError, ConnectionAcquireTimeoutError } = require("sequelize");
const ResponseHandler = require("../../utils/ResponseHandler");
const CreateSchool = require("../../use-cases/Escolas/Create");
const { CreateManyClasses } = require("../../use-cases/Turmas/Create");

/** @type {import("express").RequestHandler}  */
const CreateSchoolController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  if (!idUsuario) {
    return Handler.forbidden("Nenhum usuário foi identificado, por favor, reconecte-se");
  }

  const { nome, turmas } = req.body;

  if (!nome) {
    return Handler.clientError("Não foi informado nenhum nome para a escola");
  }

  if (nome.length > 150) {
    return Handler.clientError("O nome da escola deve conter no máximo 150 caracteres");
  }

  try {
    const escola = await CreateSchool(Number(idUsuario), nome);

    if (turmas && turmas.length > 0) {
      await CreateManyClasses(turmas.map((turma) => ({ ...turma, idEscola: escola.dataValues.idEscola })));
    }

    return Handler.ok();
  } catch (error) {
    if (error instanceof ConnectionRefusedError) {
      return Handler.fail("Nosso banco de dados se encontra fora do ar, tente novamente em alguns instantes", error);
    }

    if (error instanceof ConnectionAcquireTimeoutError) {
      return Handler.fail("Nosso banco de dados esta sobrecarregado, aguarde alguns instantes", error);
    }

    return Handler.fail("Houve um erro desconhecido, estamos com problemas internos. Aguarde aguns instantes", error);
  }
};

module.exports = CreateSchoolController;
