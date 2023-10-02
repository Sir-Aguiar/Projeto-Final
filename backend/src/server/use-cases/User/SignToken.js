require("dotenv/config");
const { sign } = require("jsonwebtoken");

const SignUserToken = (user, remember) => {
  const { idUsuario, email, nome } = user;

  if (remember) {
    const TOKEN = sign({ idUsuario, email, nome }, process.env.SECRET);
    return TOKEN;
  }

  const TOKEN = sign({ idUsuario, email, nome }, process.env.SECRET, { expiresIn: 60 * 60 * 6 });
  return TOKEN;
};

module.exports = SignUserToken;
