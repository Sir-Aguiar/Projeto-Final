const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const AssociateCursoDiscipinaController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { cursos } = req.body;
	const { idDisciplina } = req.query;
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

		for (const idCurso of cursos) {
			try {
				await CursoDisciplina.create({ idDisciplina, idCurso });
			} catch (error) {
				console.log(error);
			}
		}

		return res.status(200).json({ error: null });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

module.exports = AssociateCursoDiscipinaController;
