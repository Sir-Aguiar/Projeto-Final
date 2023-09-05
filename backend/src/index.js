require("dotenv/config");
const { httpServer } = require("./server/server");

const PORT = process.env.SERVER_PORT || "8080";
const HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";

httpServer.listen(PORT, HOSTNAME, () => {
  console.log("Listening at", HOSTNAME, PORT);
});
