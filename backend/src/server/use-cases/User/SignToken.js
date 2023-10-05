require("dotenv/config");
const { sign } = require("jsonwebtoken");

const SignUserToken = (user) => {
  const { idUsuario, email, nome } = user;

  const TOKEN = sign({ idUsuario, email, nome }, process.env.SECRET);
  return { data: TOKEN };
};

module.exports = SignUserToken;
