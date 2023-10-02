const { compareSync } = require("bcrypt");
const FindUserByEmail = require("./FindByEmail");
const ServerError = require("../../utils/ServerError");

const VerifyUserAuthentication = async (email, password, options) => {
  const { returning } = options;

  const usuario = await FindUserByEmail(email);

  const isUserValid = compareSync(password, usuario.senha);

  if (!isUserValid) {
    throw new ServerError("Senha incorreta, verifique se os dados inseridos estão certos", 401);
  }

  return returning ? usuario : isUserValid;
};

module.exports = VerifyUserAuthentication;
