require("dotenv/config");
const { hashSync } = require("bcrypt");
const Usuario = require("../../../database/models/Usuario");
const HttpHandler = require("../../utils/HttpHandlers");

/** @type {import("express").RequestHandler}  */
module.exports = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (nome.length > 45) {
    return HttpHandler.outOfRangeProperty(res, "Nome precisa ser inferior a 45 caracteres");
  }

  if (email.length > 255) {
    return HttpHandler.outOfRangeProperty(res, "Email precisa ser inferior a 255 caracteres");
  }

  const HASHED_PASSWORD = hashSync(senha, Number(process.env.SALT));

  try {
    const insertedUser = await Usuario.create({ nome, email, senha: HASHED_PASSWORD });
    res.status(201).json({ error: null, insertedUser });
  } catch (error) {
    const errorType = error.errors[0].type;
    if (errorType === "unique violation") {
      const errorPath = error.errors[0].path;
      if (errorPath === "email") {
        return res.status(400).json({
          error: {
            message: "Este email já está em uso",
          },
        });
      }
    }
    return res.status(500).json({ error });
  }
};
