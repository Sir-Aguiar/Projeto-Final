const CountProfessorsClassRoomByClass = require("../../use-cases/Stats/ProfessorClassroomPresence");

/** @type {import("express").RequestHandler}  */
const GetProfessorsStatsByClassRooms = async (req, res) => {
	const { idTurma } = req.query;
	try {
		const stats = await CountProfessorsClassRoomByClass(Number(idTurma));
		return res.status(200).json({ stats });
	} catch (error) {
		return res.status(500).json({ error });
	}
};
module.exports = GetProfessorsStatsByClassRooms;
