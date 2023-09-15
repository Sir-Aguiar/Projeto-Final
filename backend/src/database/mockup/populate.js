require("dotenv/config");
const { hashSync } = require("bcrypt");
const Escola = require("../models/Escola");
const Curso = require("../models/Curso");
const Usuario = require("../models/Usuario");
const Turma = require("../models/Turma");
const Disciplina = require("../models/Disciplina");

const { Usuarios, Escolas, Cursos, Turmas, Disciplinas } = require("./data.json");

const PopulateUser = async () => {
  for (const usuario of Usuarios) {
    const { email, nome, senha } = usuario;
    const HASHED_PASSWORD = hashSync(senha, Number(process.env.SALT));
    try {
      const insertedValue = await Usuario.create({ email, nome, senha: HASHED_PASSWORD });
      console.log(`${insertedValue.dataValues.idUsuario} -> Inserido com sucesso`);
    } catch (error) {
      console.log(`Falha ao inserir usuário ${usuario.nome}`);
    }
  }
};

const PopulateSchools = async () => {
  for (const escola of Escolas) {
    try {
      const insertedValue = await Escola.create(escola);
      console.log(`${insertedValue.dataValues.idEscola} -> Inserido com sucesso`);
    } catch (error) {
      console.log(`Falha ao inserir escola ${escola.nome}`);
    }
  }
};

const PopulateCourses = async () => {
  for (const curso of Cursos) {
    try {
      const insertedValue = await Curso.create(curso);
      console.log(`${insertedValue.dataValues.idCurso} -> Inserido com sucesso`);
    } catch (error) {
      console.log(`Falha ao inserir escola ${curso.nome}`);
    }
  }
};

const PopulateClasses = async () => {
  for (const turma of Turmas) {
    try {
      const insertedValue = await Turma.create(turma);
      console.log(`${insertedValue.dataValues.idTurma} -> Inserido com sucesso`);
    } catch (error) {
      console.log(`Falha ao inserir escola ${turma.nome}`);
    }
  }
};
const PopulateDisciplines = async () => {
  for (const disciplina of Disciplinas) {
    try {
      const insertedValue = await Disciplina.create(disciplina);
      console.log(`${insertedValue.dataValues.idDisciplina} -> Inserido com sucesso`);
    } catch (error) {
      console.log(`Falha ao inserir escola ${disciplina.nome}`);
    }
  }
};

PopulateSchools().then(() =>
  PopulateCourses()
    .then(() => PopulateClasses())
    .then(() => PopulateDisciplines()),
);
