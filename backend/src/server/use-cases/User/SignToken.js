require("dotenv/config");
const { sign } = require("jsonwebtoken");

const SignUserToken = (user, remember) => {
  const { idUsuario, email, nome } = user;

  if (remember) {
    const TOKEN = sign({ idUsuario, email, nome }, process.env.SECRET);
    return TOKEN;
  }

  const expiresIn = 60 * 60 * 6;

  const TOKEN = sign({ idUsuario, email, nome }, process.env.SECRET, { expiresIn });
  return { data: TOKEN, expiresIn };
};

module.exports = SignUserToken;
