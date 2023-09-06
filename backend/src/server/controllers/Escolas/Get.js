const Escolas = require("../../../database/models/Escola");

/** @type {import("express").RequestHandler}  */
const GetEscolasController = async (req, res) => {
	const { idProfessor } = req.userData;
	const { idEscola } = req.params;
	try {
		if (idEscola) {
			const escola = await Escolas.findOne({ where: { idProfessor, idEscola } });
			if (!escola) {
				return res.status(404).json({
					error: {
						message: "Nenhuma escola encontrada com este id",
					},
				});
			}
			return res.status(200).json({ error: null, escola });
		}
		const escolas = await Escolas.findAll({ where: { idProfessor } });
		return res.status(200).json({ error: null, escolas });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: {
				message: error.message,
			},
		});
	}
};

module.exports = GetEscolasController;
