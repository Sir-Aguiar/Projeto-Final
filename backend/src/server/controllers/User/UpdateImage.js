const { ConnectionAcquireTimeoutError, ConnectionRefusedError } = require("sequelize");
const Usuario = require("../../../database/models/Usuario");
const ResponseHandler = require("../../utils/ResponseHandler");

/** @type {import("express").RequestHandler}  */
const UpdateProfileImageController = async (req, res) => {
  const Handler = new ResponseHandler(res);

  const { idUsuario } = req.userData;

  try {
    const usuario = await Usuario.findByPk(idUsuario);
    await usuario.update({ profile_image: req.file.filename });
    return Handler.ok();
  } catch (error) {
    if (error instanceof ConnectionRefusedError) {
      return Handler.databaseConnectionFail(undefined, error);
    }

    if (error instanceof ConnectionAcquireTimeoutError) {
      return Handler.databaseTimeout(undefined, error);
    }

    return Handler.fail(undefined, error);
  }
};

module.exports = UpdateProfileImageController;
