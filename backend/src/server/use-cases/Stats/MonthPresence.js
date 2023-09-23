const { Op } = require("sequelize");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const FindStudentById = require("../Alunos/FindById");
const Chamada = require("../../../database/models/Chamada");
const Aula = require("../../../database/models/Aula");
const Turma = require("../../../database/models/Turma");
const Aluno = require("../../../database/models/Aluno");
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
 * @returns {(string | number)[][]} Retorna uma matriz, onde cada array representa um mês. O primeiro termo deste array é o mês, o segundo representa a quantidade de faltas que o aluno informado tem neste mês
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

const MonthPresence = async (idAluno, month) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const startMonth = new Date(currentYear, month, 1);
  const endMonth = new Date(currentYear, month + 1, 0);
/* Why not a count? */
  const faltas = await ChamadaAluno.findAll({
    where: {
      idAluno,
      situacao: false,
      createdAt: {
        [Op.gte]: startMonth,
        [Op.lte]: endMonth,
      },
    },
    raw: true,
    nest: true,
  });

  return faltas.length;
};

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
    attributes: ["idAluno"],
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
        attributes: [],
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

  return faltas.length / uniqueStudents.length;
};

MonthPresence(1759, 8).then((res) => console.log(`Faltou ${res} neste mês`));
AvarageMonthPresenceInCourse(4, 8).then((res) =>
  console.log(`A média de faltas dos alunos deste curso é de ${res}`),
);

module.exports = { AvarageMonthPresenceInCourse, MonthlyPresence, MonthPresence };
