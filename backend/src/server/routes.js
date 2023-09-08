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

routes.post("/create-user", RegisterUser);
routes.post("/login", Login);

routes.get("/escola", UserAuthMiddleware, GetEscolasController);
routes.get("/escola/:idEscola", UserAuthMiddleware, GetEscolasController);
routes.post("/escola", UserAuthMiddleware, CreateEscolasController);
routes.put("/escola/:idEscola", UserAuthMiddleware, UpdateEscolasController);
routes.delete("/escola/:idEscola", UserAuthMiddleware, DeleteEscolasController);

routes.get("/turma", UserAuthMiddleware, GetTurmasController);
routes.get("/turma/:idEscola", UserAuthMiddleware, GetTurmasController);
routes.get("/turma/:idEscola/:idSerie", UserAuthMiddleware, GetTurmasController);
routes.post("/turma/:idEscola/:idSerie", UserAuthMiddleware, CreateTurmaController);
routes.put("/turma/:idTurma", UserAuthMiddleware, UpdateTurmaController);
routes.delete("/turma/:idTurma", UserAuthMiddleware, DeleteTurmasController);

module.exports = routes;  
