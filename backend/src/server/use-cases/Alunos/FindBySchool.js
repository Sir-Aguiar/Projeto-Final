const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
/**
 *
 * @param {number} idEscola Identificador da escola
 * @param {number} limit Quantos alunos deverão ser retornados
 * @param {number} offset Quantos alunos deverão ser "pulados"
 * @returns {Promise<{rows:import("../../@types/Aluno").__Aluno__[], count:number}>}  Retorna todos os alunos de uma escola
 *
 * **_Garanta a integridade dos dados a serem passados e o tratamento de exceções é delegado totalmente ao escopo de chamada_**
 */
const FindStudentsBySchool = async (idEscola, limit, offset, onlyLength) => {
  if (onlyLength) {
    const alunos = await Aluno.count({ where: { idEscola } });
    return alunos;
  }

  const alunos = await Aluno.findAndCountAll({
    where: {
      idEscola,
    },
    attributes: ["idAluno", "nome"],
    include: [
      {
        model: Turma,
        as: "turma",
        attributes: ["idTurma", "nome"],
        include: [
          { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
          { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
        ],
      },
    ],
    order: [["nome", "ASC"]],
    raw: true,
    nest: true,
    limit,
    offset,
  });

  return alunos;
};

/**
 *
 * @param {number} idEscola Identificador da escola
 * @param {number} idProfessor Identificador da escola
 * @param {number} limit Quantos alunos deverão ser retornados
 * @param {number} offset Quantos alunos deverão ser "pulados"
 * @returns {Promise<{rows:import("../../@types/Aluno").__Aluno__[], count:number}>}  Retorna todos os alunos de uma escola que sejam lecionados pelo professor informado
 *
 * **_Garanta a integridade dos dados a serem passados e o tratamento de exceções é delegado totalmente ao escopo de chamada_**
 */
const FindStudentsFromSchoolByProfessor = async (idEscola, idProfessor, limit, offset) => {
  const alunos = await Aluno.findAndCountAll({
    where: {
      idEscola,
    },
    attributes: ["idAluno", "nome"],
    include: [
      {
        model: Turma,
        as: "turma",
        include: [
          { model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
          { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
          { model: ProfessorLeciona, as: "professores", where: { idProfessor }, attributes: [], required: true },
        ],
        required: true,
      },
    ],
    order: [["nome", "ASC"]],
    raw: true,
    nest: true,
    limit,
    offset,
  });

  return {
    rows: alunos.rows.map(({ idAluno, nome, turma }) => ({
      idAluno,
      nome,
      turma: {
        idTurma: turma.idTurma,
        nome: turma.nome,
        escola: {
          idEscola: turma.escola.idEscola,
          nome: turma.escola.nome,
        },
        curso: {
          idCurso: turma.curso.idCurso,
          nome: turma.curso.nome,
        },
      },
    })),
    count: alunos.count,
  };
};

module.exports = { FindStudentsFromSchoolByProfessor, FindStudentsBySchool };
