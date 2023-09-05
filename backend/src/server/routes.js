const { Router } = require("express");
const routes = Router();
const RegisterUser = require("./controllers/User/ReigsterUser");

routes.post("/create-user", RegisterUser);

module.exports = routes;
