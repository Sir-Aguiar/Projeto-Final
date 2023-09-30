const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/**
 *
 * @param {number} idTurma Identificador da turma
 * @returns {Promise<import("../../@types/Aluno").__Aluno__[]>} Retornar todos os alunos da turma informada
 *
 * Caso `idTurma` seja inválido ou inexistente, um array vazio será retornado, isto proporciona maior flexibilidade para se lidar com resultados indesejados.
 *
 * **_Garanta a integridade dos dados a serem passados e o tratamento de exceções é delegado totalmente ao escopo de chamada_**
 */
const FindStudentsByClass = async (idTurma) => {
  const alunos = await Aluno.findAll({
    where: { idTurma },
    attributes: ["idAluno", "nome"],
    include: [
      {
        model: Turma,
        as: "turma",
        attributes: ["idTurma", "nome"],
        include: [
          { model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
          {
            model: Escola,
            as: "escola",
            attributes: ["idEscola", "idGestor", "nome"],
          },
        ],
      },
    ],
    order: [["nome", "ASC"]],
    raw: true,
    nest: true,
  });

  return alunos;
};

module.exports = { FindStudentsByClass };
