const Turma = require("../../../database/models/Turma");

const CreateOneClass = async (idEscola, idCurso, nome) => {
  const turma = await Turma.create({ idEscola, idCurso, nome });
  return turma;
};

const CreateManyClasses = async (turmas) => {
  const result = await Turma.bulkCreate(turmas, { returning: true });
  return result.length;
};

module.exports = { CreateOneClass, CreateManyClasses };
