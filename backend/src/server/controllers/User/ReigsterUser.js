require("dotenv/config");
const { hashSync } = require("bcrypt");
const Professor = require("../../../database/models/Professor");
const HttpHandler = require("../../utils/HttpHandlers");

/** @type {import("express").RequestHandler}  */
module.exports = async (req, res) => {
	const { nome, email, login, senha } = req.body;

	if (nome.length > 150) {
		return HttpHandler.outOfRangeProperty(res, "Nome precisa ser inferior a 150 caracteres");
	}
	if (login.length > 30) {
		return HttpHandler.outOfRangeProperty(res, "Nome de usuário precisa ser inferior a 30 caracteres");
	}
	if (email.length > 255) {
		return HttpHandler.outOfRangeProperty(res, "Email precisa ser inferior a 255 caracteres");
	}

	const HASHED_PASSWORD = hashSync(senha, Number(process.env.SALT));

	try {
		const insertedUser = await Professor.create({ nome, email, login, senha: HASHED_PASSWORD });
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
			if (errorPath === "login") {
				return res.status(400).json({
					error: {
						message: "Este nome de usuário já está em uso",
					},
				});
			}
		}
		return res.status(500).json({ error });
	}
};
