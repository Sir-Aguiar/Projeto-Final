const { Router } = require("express");
const routes = Router();
const RegisterUser = require("./controllers/User/ReigsterUser");
const Login = require("./controllers/User/Login");
const UserAuthMiddleware = require("./middlewares/UserAuth");
const GetEscolasController = require("./controllers/Escolas/Get");
const CreateEscolasController = require("./controllers/Escolas/Create");
const UpdateEscolasController = require("./controllers/Escolas/Update");
const DeleteEscolasController = require("./controllers/Escolas/Delete");

routes.post("/create-user", RegisterUser);
routes.post("/login", Login);

routes.get("/escolas", UserAuthMiddleware, GetEscolasController);
routes.get("/escolas/:idEscola", UserAuthMiddleware, GetEscolasController);
routes.post("/escola", UserAuthMiddleware, CreateEscolasController);
routes.put("/escola/:idEscola", UserAuthMiddleware, UpdateEscolasController);
routes.delete("/escola/:idEscola", UserAuthMiddleware, DeleteEscolasController);
module.exports = routes;
