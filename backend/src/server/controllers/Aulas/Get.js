const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Aula = require("../../../database/models/Aula");
const Turma = require("../../../database/models/Turma");
const Usuario = require("../../../database/models/Usuario");
const Chamada = require("../../../database/models/Chamada");
const Aluno = require("../../../database/models/Aluno");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const Sequelize = require("sequelize");
/** @type {import("express").RequestHandler}  */
const GetAulasController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idTurma, idDisciplina, idEscola, idAula, createdAt } = req.query;
	try {
		if (idTurma) {
			const aulas = await Aula.findAll({
				where: { idTurma },
				attributes: ["idAula", "anotacao"],
				include: [
					{ model: Turma, as: "turma", attributes: ["nome", "idTurma"] },
					{ model: Disciplina, as: "disciplina", attributes: ["nome", "idDisciplina"] },
					{ model: Usuario, as: "professor", attributes: ["nome", "idUsuario"] },
				],
			});
			return res.status(200).json({ erro: null, aulas });
		}

		if (idDisciplina) {
			const aulas = await Aula.findAll({
				where: { idDisciplina },
				attributes: ["idAula", "anotacao"],
				include: [
					{ model: Turma, as: "turma", attributes: ["nome", "idTurma"] },
					{ model: Disciplina, as: "disciplina", attributes: ["nome", "idDisciplina"] },
					{ model: Usuario, as: "professor", attributes: ["nome", "idUsuario"] },
				],
			});
			return res.status(200).json({ erro: null, aulas });
		}

		if (idEscola) {
			const foundSchool = await Escola.findByPk(idEscola, { raw: true, nest: true });
			if (!foundSchool) {
				return res.status(404).json({});
			}
			if (foundSchool.idGestor !== idUsuario) {
				const aulas = await Aula.findAll({
					attributes: ["idAula", "anotacao", "createdAt"],
					where: { idProfessor: idUsuario },
					include: [
						{ model: Turma, as: "turma", where: { idEscola }, attributes: ["nome", "idTurma"] },
						{ model: Disciplina, as: "disciplina", attributes: ["nome", "idDisciplina"] },
						{ model: Usuario, as: "professor", attributes: ["nome", "idUsuario"] },
					],
				});
				return res.status(200).json({ error: null, aulas });
			}

			if (createdAt) {
				const today = new Date(createdAt);
				const tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);
				console.log(today, tomorrow);
				const aulas = await Aula.findAll({
					where: {
						createdAt: {
							[Sequelize.Op.gte]: today,
							[Sequelize.Op.lt]: tomorrow,
						},
					},
					attributes: ["idAula", "anotacao", "createdAt"],
					include: [
						{ model: Turma, as: "turma", where: { idEscola }, attributes: ["nome", "idTurma"] },
						{ model: Disciplina, as: "disciplina", attributes: ["nome", "idDisciplina"] },
						{ model: Usuario, as: "professor", attributes: ["nome", "idUsuario"] },
					],
					order: [["createdAt", "DESC"]],
				});
				return res.status(200).json({ aulas });
			}

			const aulas = await Aula.findAll({
				attributes: ["idAula", "anotacao", "createdAt"],
				include: [
					{ model: Turma, as: "turma", where: { idEscola }, attributes: ["nome", "idTurma"] },
					{ model: Disciplina, as: "disciplina", attributes: ["nome", "idDisciplina"] },
					{ model: Usuario, as: "professor", attributes: ["nome", "idUsuario"] },
				],
			});

			return res.status(200).json({ erro: null, aulas });
		}

		if (idAula) {
			const aula = await Aula.findByPk(idAula, {
				attributes: ["idAula", "anotacao", "createdAt"],
				include: [
					{ model: Disciplina, as: "disciplina", attributes: ["idDisciplina", "nome"] },
					{ model: Usuario, as: "professor", attributes: ["idUsuario", "nome"] },
					{ model: Turma, as: "turma", attributes: ["idTurma", "nome"] },
					{ model: Chamada, as: "chamada", attributes: ["idChamada"] },
				],
				raw: true,
				nest: true,
			});

			const chamada = await ChamadaAluno.findAll({
				where: { idChamada: aula.chamada.idChamada },
				attributes: ["idAluno", "situacao"],
				include: [{ model: Aluno, as: "aluno", attributes: ["nome"] }],
			});

			return res.status(200).json({ error: null, aula, chamada });
		}

		return res.status(430).json({});
	} catch (error) {
		return res.status(500).json({ error });
	}
};

module.exports = GetAulasController;
