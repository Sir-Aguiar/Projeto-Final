const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const AssociateCursoDiscipinaController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idCurso, idDisciplina } = req.body;

	if (!idCurso || !idDisciplina || isNaN(Number(idDisciplina)) || isNaN(Number(idCurso))) {
		return res.status(400).json({
			error: {
				message: "Não foram inseridos dados válidos para realizar esta ação",
			},
		});
	}

	try {
		const foundDiscipline = await Disciplina.findByPk(idDisciplina, {
			include: [{ model: Escola, as: "escola", attributes: ["idGestor"] }],
		});

		if (!foundDiscipline) {
			return res.status(404).json({
				error: {
					message: "Nenhuma disciplina foi encontrada com este ID",
				},
			});
		}

		if (foundDiscipline.dataValues.escola.idGestor !== idUsuario) {
			return res.status(401).json({
				error: {
					message: "Você não possui permissão para realizar esta ação",
				},
			});
		}

		await CursoDisciplina.create({ idCurso, idDisciplina });
		return res.status(200).json({ error: null });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

module.exports = AssociateCursoDiscipinaController;
