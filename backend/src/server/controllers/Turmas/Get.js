const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetEscolasController = async (req, res) => {
	const { idEscola, idSerie } = req.params;
	const { idProfessor } = req.userData;

	// Verificação se o professor tem acesso
	const escola = await Escola.findOne({
		where: {
			idEscola,
			idProfessor,
		},
	});

	if (!escola) {
		return res.status(400).json({
			error: {
				message: "Você não possui acesso à esta escola",
			},
		});
	}

	// Todas turmas da escola
	const turmasEscola = await Turma.findAll({
		where: {
			idEscola,
		},
	});
	// Todas as turmas da série e escola
	const turmasSérieEscola = await Turma.findAll({
		where: {
			idEscola,
			idSerie,
		},
	});
	// Todas as turmas do professor
};

module.exports = GetEscolasController;
