const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");

/** @type {import("express").RequestHandler}  */
const CreateDisciplinaController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idEscola, nome } = req.body;

	if (!idEscola || isNaN(Number(idEscola))) {
		return res.status(400).json({});
	}

	if (!nome) {
		return res.status(400).json({});
	}

	if (nome.length > 50) {
		return res.status(400).json({});
	}

	try {
		const foundSchool = await Escola.findByPk(idEscola);

		if (!foundSchool) {
			return res.status(404).json({});
		}

		if (foundSchool.dataValues.idGestor !== idUsuario) {
			return res.status(401).json({});
		}

		await Disciplina.create({ idEscola, nome });

		return res.status(201).json({ error: null });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

module.exports = CreateDisciplinaController;
