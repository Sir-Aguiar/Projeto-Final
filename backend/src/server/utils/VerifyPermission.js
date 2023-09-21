const Escola = require("../../database/models/Escola");
/**
 @param {number} idEscola Identificador da escola
 @param {number} idUsuario Identificador do usuário
 @returns {boolean} true indica que o usuário é gestor da escola informada false indica que não
*/

const VerifyPermission = async (idEscola, idUsuario) => {
	try {
		const foundSchool = await Escola.findByPk(idEscola, { raw: true, nest: true });
		if (!foundSchool) throw new Error("Nenhuma escola foi encontrada com este identificador");
		if (foundSchool.idGestor === idUsuario) return true;
		return false;
	} catch (error) {
		console.log(error);
		throw new Error("Houve um erro ao verificar a permissão do usuário sobre a escola");
	}
};
