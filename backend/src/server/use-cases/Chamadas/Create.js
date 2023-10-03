const Aula = require("../../../database/models/Aula");
const Chamada = require("../../../database/models/Chamada");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const ServerError = require("../../utils/ServerError");
const { FindStudentsByClass } = require("../Alunos/FindByClass");

const CreatePresenceList = async (idAula, presentes) => {
  const aula = await Aula.findByPk(idAula, { attributes: ["idTurma"], raw: true, nest: true });

  if (!aula) {
    throw new ServerError("Nenhuma aula foi encontrada para a chamada", 404);
  }

  const created = await Chamada.create({ idAula });

  const classStudents = (await FindStudentsByClass(aula.idTurma)).map(({ idAluno }) => idAluno);

  for (const idAluno of classStudents) {
    await ChamadaAluno.create({
      idAluno,
      idChamada: created.dataValues.idChamada,
      situacao: presentes.includes(idAluno),
    });
  }

  return created;
};

module.exports = CreatePresenceList;
