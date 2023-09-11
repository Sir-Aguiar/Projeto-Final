const Usuario = require("./models/Usuario");
const Escola = require("./models/Escola");
const Curso = require("./models/Curso");
const Turma = require("./models/Turma");
const Disciplina = require("./models/Disciplina");
const CursoDisciplina = require("./models/CursoDisciplina");
const ProfessorLeciona = require("./models/ProfessorLeciona");
const Aula = require("./models/Aula");
const Chamada = require("./models/Chamada");
const Aluno = require("./models/Aluno");
const ChamadaAluno = require("./models/ChamadaAluno");
const Modelos = [
  Usuario,
  Escola,
  Curso,
  Turma,
  Disciplina,
  Aluno,
  Aula,
  Chamada,
  ChamadaAluno,
  ProfessorLeciona,
  CursoDisciplina,
];

for (const Modelo of Modelos) {
  Modelo.findAll({})
    .then(() => {
      console.log(`${Modelo.name} passou`);
    })
    .catch((error) => {
      console.log(`${Modelo.name} FALHOU`);
      console.log(error);
    });
}
