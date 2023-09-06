const Escolas = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const UpdateEscolasController = async (req, res) => {
	const { idProfessor } = req.userData;
	const { idEscola } = req.params;
	const { toUpdate } = req.body;

	if (!idEscola || !toUpdate) {
		return res.status(400).json({
			error: {
				message: "Dados insuficientes para realizar esta ação",
			},
		});
	}

	const { nome } = toUpdate;

	try {
		await Escolas.update({ nome }, { where: { idProfessor, idEscola } });
		return res.status(200).json({ error: null });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: {
				message: error.message,
			},
		});
	}
};

module.exports = UpdateEscolasController;
