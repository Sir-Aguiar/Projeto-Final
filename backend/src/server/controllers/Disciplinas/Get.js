const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Curso = require("../../../database/models/Curso");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const GetDisciplinasController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idEscola, idCurso, idTurma } = req.query;
	try {
		if (idEscola) {
			if (isNaN(Number(idEscola))) {
				return res.status(400).json({});
			}

			const disciplinas = await Escola.findByPk(idEscola, {
				include: [
					{
						model: Disciplina,
						as: "disciplinas",
						attributes: ["nome", "idDisciplina"],
					},
				],
				attributes: ["nome", "idEscola", "idGestor"],
			});

			if (!disciplinas) {
				return res.status(404).json({});
			}
			if (disciplinas.dataValues.idGestor !== idUsuario) {
				return res.status(401).json({});
			}

			return res.status(200).json({ disciplinas });
		}

		const disciplinas = await Disciplina.findAll({
			include: [{ model: Escola, as: "escola", attributes: ["idGestor"], where: { idGestor: idUsuario } }],
		});

		if (!disciplinas) {
			return res.status(404).json({});
		}

		return res.status(200).json({ error: null, disciplinas });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error });
	}
};

module.exports = GetDisciplinasController;
