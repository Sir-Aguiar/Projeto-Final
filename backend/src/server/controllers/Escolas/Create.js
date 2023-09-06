const Escolas = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const CreateEscolasController = async (req, res) => {
	const { idProfessor } = req.userData;
	const { nome } = req.body;
	try {
		const created = await Escolas.create({ idProfessor, nome });
		return res.status(201).json({ error: null, created });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: {
				message: error.message,
			},
		});
	}
};

module.exports = CreateEscolasController;
