const Usuario = require("../../../database/models/Usuario");

/** @type {import("express").RequestHandler}  */
const DeleteUserController = async (req, res) => {
	const { idUsuario } = req.userData;
	try {
		const foundUser = await Usuario.findByPk(idUsuario);

		await foundUser.destroy({});

		return res.status(200).json({ error: null });
	} catch (error) {
		res.status(500).json({ error });
	}
};
module.exports = DeleteUserController;
