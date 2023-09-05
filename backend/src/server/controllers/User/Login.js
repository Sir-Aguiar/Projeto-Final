require("dotenv/config");
const { compareSync } = require("bcrypt");
const Professor = require("../../../database/models/Professor");
const { sign } = require("jsonwebtoken");
/** @type {import("express").RequestHandler}  */
module.exports = async (req, res) => {
	const { login, senha } = req.body;

	if ((!login, !senha) || typeof login !== "string" || typeof senha !== "string") {
		return res.status(400).json({
			error: {
				message: "Insira dados o válidos para realiar autenticação",
			},
		});
	}

	try {
		const userFound = await Professor.findOne({
			where: { login },
		});

		if (!userFound) {
			return res.status(404).json({
				erorr: {
					message: "Usuário não encontrado ou não existente",
				},
			});
		}

		if (compareSync(senha, userFound.dataValues.senha)) {
			const token = sign(
				{
					login,
					email: userFound.dataValues.email,
				},
				process.env.SECRET,
				{},
			);
			return res.status(200).json({ error: null, token });
		}

		return res.status(400).json({ error: { message: "Senha incorreta" } });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: { message: "Houve um erro em nossos servidores, contate o suporte ou tente novamente mais tarde" },
		});
	}
};
