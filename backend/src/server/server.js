const { createServer } = require("http");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { resolve } = require("path");
const UserAuthMiddleware = require("./middlewares/UserAuth");

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.use("/profile_images", express.static(resolve("src", "profile_images")));

app.use(routes);

module.exports = { app, httpServer };
