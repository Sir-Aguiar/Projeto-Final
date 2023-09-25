const Usuario = require("../../../database/models/Usuario");

/** @type {import("express").RequestHandler}  */
const UpdateUserController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { nome, email } = req.body;
	if (!nome && !email) return res.status(400).json({});
	try {
		const foundUser = await Usuario.findByPk(idUsuario);

		await foundUser.update({ nome: nome || foundUser.dataValues.nome, email: email || foundUser.dataValues.email });

		return res.status(200).json({ error: null });
	} catch (error) {
		res.status(500).json({ error });
	}
};
module.exports = UpdateUserController;
