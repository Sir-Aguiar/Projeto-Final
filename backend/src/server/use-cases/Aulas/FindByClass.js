const { raw } = require("express");
const Aula = require("../../../database/models/Aula");
const Turma = require("../../../database/models/Turma");
const Usuario = require("../../../database/models/Usuario");
const ServerError = require("../../utils/ServerError");
const { VerifyClassPermission, VerifySchoolPermission } = require("../../utils/VerifyPermission");
/**
 * @param {number} idTurma
 * @param {number} idUsuario
 * @description Retorna todas as aulas de uma turma informada
 */
const FindClassRoomByClass = async (idTurma, idUsuario) => {
	if (!idTurma || typeof idTurma !== "number" || isNaN(Number(idTurma))) {
		throw new ServerError("O identificador da turma está ausente ou em formato inválido", 400, new Error().stack);
	}
	if (!idUsuario || typeof idUsuario !== "number" || isNaN(Number(idUsuario))) {
		throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
	}

	const foundClass = await Turma.findByPk(idTurma, { attributes: ["idEscola"], raw: true, nest: true });
	const isUserAdmin = await VerifySchoolPermission(foundClass.idEscola);

	if (!isUserAdmin) {
		const isUserAllowed = await VerifyClassPermission(idTurma, idUsuario);

		if (!isUserAllowed) throw new ServerError("Você não possui permissão para realizar esta ação", 401);

		const aulas = await Aula.findAll({
			where: { idTurma, idProfessor: idUsuario },
			include: [{ model: Usuario, as: "professor", attributes: ["idUsuario", "nome"] }],
			raw: true,
			nest: true,
		});

		return aulas;
	}

	const aulas = await Aula.findAll({
		where: { idTurma },
		include: [{ model: Usuario, as: "professor", attributes: ["idUsuario", "nome"] }],
		raw: true,
		nest: true,
	});
	return aulas;
};

FindClassRoomByClass(10, 12).then((res) => console.log(res));

module.exports = FindClassRoomByClass;
