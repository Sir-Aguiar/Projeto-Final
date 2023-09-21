const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Curso = require("../../../database/models/Curso");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Turma = require("../../../database/models/Turma");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
/** @type {import("express").RequestHandler}  */
const GetDisciplinasController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idEscola, idCurso, onlyLength, idTurma } = req.query;
	try {
		if (idEscola) {
			if (isNaN(Number(idEscola))) {
				return res.status(400).json({});
			}
			const foundSchool = await Escola.findByPk(idEscola);

			if (!foundSchool) {
				return res.status(404).json({});
			}

			if (foundSchool.dataValues.idGestor !== idUsuario) {
				return res.status(401).json({});
			}

			if (onlyLength) {
				return res.status(200).json({
					length: await Disciplina.count({
						where: { idEscola },
					}),
				});
			}

			const disciplinas = await Escola.findOne({
				include: [
					{
						model: Disciplina,
						as: "disciplinas",
						attributes: ["nome", "idDisciplina"],
					},
				],
				attributes: [],
				where: { idGestor: idUsuario, idEscola },
			});

			if (!disciplinas) {
				return res.status(404).json({});
			}

			return res.status(200).json({ disciplinas: disciplinas.disciplinas });
		}

		if (idTurma) {
			const foundClass = await Turma.findByPk(idTurma, {
				attributes: ["idTurma", "idCurso", "nome"],
				include: [{ model: Escola, as: "escola", attributes: ["idGestor", "idEscola"] }],
				raw: true,
				nest: true,
			});

			if (foundClass.escola.idGestor === idUsuario) {
				const foundGrids = await CursoDisciplina.findAll({
					where: { idCurso: foundClass.idCurso },
					include: [{ model: Disciplina, as: "disciplina", attributes: [] }],
					attributes: ["disciplina.idDisciplina", "disciplina.nome"],
					group: ["disciplina.idDisciplina"],
					raw: true,
					nest: true,
				});

				return res.status(200).json({ error: null, disciplinas: foundGrids });
			}

			const foundRelations = await ProfessorLeciona.findAll({
				where: { idTurma, idProfessor: idUsuario },
				include: [{ model: Disciplina, as: "disciplina", attributes: [] }],
				attributes: ["disciplina.idDisciplina", "disciplina.nome"],
				group: ["disciplina.idDisciplina"],
				raw: true,
				nest: true,
			});
			return res.status(200).json({ error: null, disciplinas: foundRelations });
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
