const Aluno = require("../../../database/models/Aluno");
const Turma = require("../../../database/models/Turma");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ServerError = require("../../utils/ServerError");

/**
 *
 * @param {number} idAluno Identificador do aluno
 * @returns {Promise<import("../../@types/Aluno").__Aluno__[]>} Retorna o único aluno encontrado
 *
 * ```js
 * Aluno.findByPk(idAluno, {...})
 * ```
 *
 * Caso nenhum aluno seja encontrado, `idAluno` será considerado inválido, disparando uma exceção do tipo `ServerError`
 *
 * - status = 404 -> Nenhum aluno encontrado
 *
 * **_Garanta a integridade dos dados a serem passados e o tratamento de exceções é delegado totalmente ao escopo de chamada_**
 */

const FindStudentById = async (idAluno) => {
  const aluno = await Aluno.findByPk(idAluno, {
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
    raw: true,
    nest: true,
  });

  if (!aluno) {
    throw new ServerError("Nenhum aluno foi encontrado com este identificador", 404);
  }

  return aluno;
};

module.exports = FindStudentById;
