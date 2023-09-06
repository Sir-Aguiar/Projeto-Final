const { createServer } = require("http");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();
const httpServer = createServer(app);

app.use(
	cors({
		origin: "*",
	}),
);

app.use(express.json());
app.use(routes);
module.exports = { app, httpServer };
