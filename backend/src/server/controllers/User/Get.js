const Usuario = require("../../../database/models/Usuario");

/** @type {import("express").RequestHandler}  */
const GetUserController = async (req, res) => {
	const { idUsuario } = req.userData;
	try {
		const foundUser = await Usuario.findByPk(idUsuario, {
			attributes: ["nome", "email"],
			raw: true,
			nest: true,
		});
		return res.status(200).json({ error: null, usuario: foundUser });
	} catch (error) {
		res.status(500).json({ error });
	}
};
module.exports = GetUserController;
