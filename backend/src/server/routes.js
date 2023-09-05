const { Router } = require("express");
const routes = Router();
const RegisterUser = require("./controllers/User/ReigsterUser");
const Login = require("./controllers/User/Login");

routes.post("/create-user", RegisterUser);
routes.post("/login", Login);
module.exports = routes;
