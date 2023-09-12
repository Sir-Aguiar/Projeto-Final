const { Router } = require("express");
const routes = Router();
const RegisterUser = require("./controllers/User/ReigsterUser");
const Login = require("./controllers/User/Login");
const UserAuthMiddleware = require("./middlewares/UserAuth");
const GetEscolasController = require("./controllers/Escolas/Get");
const CreateEscolasController = require("./controllers/Escolas/Create");
const UpdateEscolasController = require("./controllers/Escolas/Update");
const UpdateTurmaController = require("./controllers/Turmas/Update");
const DeleteEscolasController = require("./controllers/Escolas/Delete");
const CreateTurmaController = require("./controllers/Turmas/Create");
const GetTurmasController = require("./controllers/Turmas/Get");
const DeleteTurmasController = require("./controllers/Turmas/Delete");
const CreateAlunosController = require("./controllers/Alunos/Create");
const GetAlunosController = require("./controllers/Alunos/Get");
const CreateDisciplinaController = require("./controllers/Disciplinas/Create");
const GetDisciplinasController = require("./controllers/Disciplinas/Get");
const UpdateDisciplinasController = require("./controllers/Disciplinas/Update");
const DeleteDisciplinasController = require("./controllers/Disciplinas/Delete");

routes.post("/create-user", RegisterUser);
routes.post("/login", Login);

routes.post("/escola", UserAuthMiddleware, CreateEscolasController);
routes.get("/escola", UserAuthMiddleware, GetEscolasController);
routes.get("/escola/:idEscola", UserAuthMiddleware, GetEscolasController);
routes.put("/escola/:idEscola", UserAuthMiddleware, UpdateEscolasController);
routes.delete("/escola/:idEscola", UserAuthMiddleware, DeleteEscolasController);

// routes.get("/turma", UserAuthMiddleware, GetTurmasController);
routes.get("/turma/:idEscola", UserAuthMiddleware, GetTurmasController);
routes.get("/turma/:idEscola/:idCurso", UserAuthMiddleware, GetTurmasController);
routes.post("/turma/:idEscola/:idCurso", UserAuthMiddleware, CreateTurmaController);
routes.put("/turma/:idTurma", UserAuthMiddleware, UpdateTurmaController);
routes.delete("/turma/:idTurma", UserAuthMiddleware, DeleteTurmasController);

routes.post("/disciplina", UserAuthMiddleware, CreateDisciplinaController);
routes.get("/disciplina/:idEscola", UserAuthMiddleware, GetDisciplinasController);
routes.put("/disciplina/:idDisciplina", UserAuthMiddleware, UpdateDisciplinasController);
routes.delete("/disciplina/:idDisciplina", UserAuthMiddleware, DeleteDisciplinasController);

/* 


routes.post("/aluno", UserAuthMiddleware, CreateAlunosController);
routes.get("/aluno", UserAuthMiddleware, GetAlunosController); */
module.exports = routes;
