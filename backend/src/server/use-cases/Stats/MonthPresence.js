const { Op } = require("sequelize");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const FindStudentById = require("../Alunos/FindById");
const Chamada = require("../../../database/models/Chamada");
const Aula = require("../../../database/models/Aula");
const Turma = require("../../../database/models/Turma");
const Aluno = require("../../../database/models/Aluno");
const Disciplina = require("../../../database/models/Disciplina");
/* 
  Gráfico de faltas por mês ->
  Mês 01: 0 faltas;
  Mês 02: 0 faltas;
  Mês 03: 4 faltas;
*/

/* 
  Pegar todas as presenças do aluno, no decorrer dos meses (até então)
  [0...9], [xx...xxx]
  {Achar todos os meses do ano até agora}
*/

/* 
  Como toda aula tem que ter chamada
  Procurar todos chamadaAluno deste cujo situation seja falso
  {Achar todas as faltas deste aluno no ano atual}
*/

/**
 *
 * @param {number} idAluno Identificador do aluno
 * @returns {Promise<(string | number)[][]>} Retorna um array contendo as faltas mensais do aluno informado.
 */

const MonthlyPresence = async (idAluno) => {
  const aluno = await FindStudentById(idAluno);

  const faltas = await ChamadaAluno.findAll({
    where: { idAluno, situacao: false },
    raw: true,
    nest: true,
  });

  const faltasPorMes = [];

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  for (let index = 0; index <= currentMonth; index++) {
    const startMonth = new Date(currentYear, index, 1);
    const endMonth = new Date(currentYear, index + 1, 0);

    faltasPorMes.push([
      startMonth.toLocaleDateString("pt-br", { month: "long" }),
      faltas.filter((falta) => {
        const createdAt = new Date(falta.createdAt);
        return createdAt >= startMonth && createdAt <= endMonth;
      }).length,
    ]);
  }
  return faltasPorMes;
};

/**
 * @param {number} idAluno Identificador do aluno
 * @param {number} month Número do mês desejado, onde 0 = Janeiro e 11 = Dezembro
 * @description Esta função informará a quantidade de faltas do aluno no mês
 */
const MonthPresence = async (idAluno, month) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const startMonth = new Date(currentYear, month, 1);
  const endMonth = new Date(currentYear, month + 1, 0);

  const faltas = await ChamadaAluno.count({
    where: {
      idAluno,
      situacao: false,
      createdAt: {
        [Op.gte]: startMonth,
        [Op.lte]: endMonth,
      },
    },
  });

  return faltas;
};

const MonthPresenceComparation = async (idAluno, finalValue, month) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const startMonth = new Date(currentYear, month, 1);
  const endMonth = new Date(currentYear, month + 1, 0);

  const currentMonthPresence = await ChamadaAluno.count({
    where: {
      idAluno,
      situacao: false,
      createdAt: {
        [Op.gte]: startMonth,
        [Op.lte]: endMonth,
      },
    },
  });
  return finalValue - currentMonthPresence;
};

/**
 * @param {number} idCurso Identificador do curso
 * @param {number} month Número do mês desejado, onde 0 = Janeiro e 11 = Dezembro
 * @description Está função retorna a média de faltas dos alunos do curso informado, no mês informado
 */
const AvarageMonthPresenceInCourse = async (idCurso, month) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const startMonth = new Date(currentYear, month, 1);
  const endMonth = new Date(currentYear, month + 1, 0);

  const faltas = await ChamadaAluno.findAll({
    where: {
      situacao: false,
      createdAt: {
        [Op.gte]: startMonth,
        [Op.lte]: endMonth,
      },
    },
    include: [
      {
        model: Chamada,
        as: "chamada",
        include: [
          {
            model: Aula,
            as: "aula",
            include: [{ model: Turma, as: "turma", where: { idCurso }, required: true }],
            required: true,
          },
        ],
        required: true,
      },
    ],
    raw: true,
    nest: true,
  });

  const studentsMap = new Map();

  const uniqueStudents = faltas.filter((falta) => {
    if (!studentsMap.has(falta.idAluno)) {
      studentsMap.set(falta.idAluno, falta.idAluno);
      return true;
    }
  });

  return Number((faltas.length / uniqueStudents.length).toFixed(2));
};

const TotalPresence = async (idAluno) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const startYear = new Date(currentYear, 0, 1);
  const endYear = new Date(currentYear + 1, 0, 1);
  const faltas = await ChamadaAluno.count({
    where: {
      idAluno,
      situacao: false,
      createdAt: {
        [Op.gte]: startYear,
        [Op.lt]: endYear,
      },
    },
  });

  return faltas;
};

/* Faltas por disciplina (em mês) */

const PersenceByDisciplines = async (idAluno, month) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const startMonth = new Date(currentYear, month, 1);
  const endMonth = new Date(currentYear, month + 1, 0);

  const faltas = await ChamadaAluno.findAll({
    where: {
      idAluno,
      situacao: false,
      createdAt: {
        [Op.gte]: startMonth,
        [Op.lte]: endMonth,
      },
    },
    include: [
      {
        attributes: [],
        model: Chamada,
        as: "chamada",
        required: true,
        include: [
          {
            model: Aula,
            as: "aula",
            include: [{ model: Disciplina, as: "disciplina", required: true, attributes: [] }],
            required: true,
            attributes: [],
          },
        ],
        attributes: [],
      },
    ],
    attributes: ["chamada.aula.idDisciplina", "chamada.aula.disciplina.nome"],
    raw: true,
    nest: true,
  });

  const disciplinesMap = new Map();
  const disciplinasFalta = [];
  const uniqueDisciplines = faltas.filter((falta) => {
    if (!disciplinesMap.has(falta.idDisciplina)) {
      disciplinesMap.set(falta.idDisciplina, falta);
      return falta;
    }
  });

  for (const disciplina of uniqueDisciplines) {
    disciplinasFalta.push([
      disciplina.nome,
      faltas.filter((falta) => falta.idDisciplina === disciplina.idDisciplina).length,
    ]);
  }
  return disciplinasFalta;
};
module.exports = { AvarageMonthPresenceInCourse, MonthlyPresence, MonthPresence, TotalPresence, PersenceByDisciplines };
/* Todas as disciplinas que este aluno faltou */
/* [disciplina, faltas] */
