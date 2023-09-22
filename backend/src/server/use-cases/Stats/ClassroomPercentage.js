const { Op } = require("sequelize");
const Aula = require("../../../database/models/Aula");
const Disciplina = require("../../../database/models/Disciplina");
const FindClassesBySchool = require("../Turmas/FindBySchool");
const Turma = require("../../../database/models/Turma");

/* 
  Quantos porcento das aulas representa cada disciplina;
*/
/**
 *
 * @param {number} idEscola Identificador da escola
 *  @description Retorna a porcentagem que cada disciplina representa do total de aulas
 */

const CalculateDisciplineClassRoomsPercentage = async (idEscola) => {
  const disciplinas = await Disciplina.findAll({
    where: { idEscola },
    attributes: ["idDisciplina", "nome"],
    raw: true,
    nest: true,
  });

  const turmasEscola = await FindClassesBySchool(idEscola);

  const aulas = await Aula.findAll({
    where: {
      idTurma: {
        [Op.in]: turmasEscola.map((turma) => turma.idTurma),
      },
    },
    attributes: ["disciplina.idDisciplina", "disciplina.nome"],
    include: [{ model: Disciplina, as: "disciplina", attributes: [] }],
    raw: true,
    nest: true,
  });

  const totalAulas = aulas.length;
  console.log(`Total de aulas: ${totalAulas}`);

  for (const disciplina of disciplinas) {
    const aulasDisciplina = await Aula.findAll({
      where: {
        idDisciplina: disciplina.idDisciplina,
      },
      attributes: ["idAula", "disciplina.idDisciplina", "disciplina.nome"],
      include: [{ model: Disciplina, as: "disciplina", attributes: [] }],
      raw: true,
      nest: true,
    });

    const parcialAulas = aulasDisciplina.length;
    const porcentagemDisciplina = (aulasDisciplina.length * 100) / aulas.length;

    console.log(`${disciplina.nome} -> ${parcialAulas} aulas (${porcentagemDisciplina}%)`);
  }
};

/**
 *
 * @param {number} idEscola Identificador da escola
 *  @description Retorna a porcentagem que cada turma representa do total de aulas
 */

const CalculateClassPercentage = async (idEscola) => {
  let data = [];

  const turmas = await Turma.findAll({
    where: { idEscola },
    attributes: ["idTurma", "nome"],
    raw: true,
    nest: true,
  });

  const aulas = await Aula.findAll({
    where: {
      idTurma: {
        [Op.in]: turmas.map((turma) => turma.idTurma),
      },
    },
    attributes: ["turma.idTurma", "turma.nome"],
    include: [{ model: Turma, as: "turma", attributes: [] }],
    raw: true,
    nest: true,
  });

  const totalAulas = aulas.length;

  if (totalAulas < 1) {
    return [];
  }

  for (const turma of turmas) {
    const aulaTurma = await Aula.findAll({
      where: {
        idTurma: turma.idTurma,
      },
      attributes: ["idAula", "turma.idTurma", "turma.nome"],
      include: [{ model: Turma, as: "turma", attributes: [] }],
      raw: true,
      nest: true,
    });

    const parcialAulas = aulaTurma.length;
    const porcentagemTurma = (aulaTurma.length * 100) / aulas.length;
    data.push({
      ...turma,
      percentage: porcentagemTurma,
      quantity: parcialAulas,
    });
  }
  return data;
};
