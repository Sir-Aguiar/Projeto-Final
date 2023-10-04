require("dotenv/config");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");

/** @type {import("express").RequestHandler}  */
const UserAuthMiddleware = async (req, res, next) => {
  const AuthToken = req.header("Authorization")?.split(" ")[1];

  if (!AuthToken) {
    return res.status(400).json({
      error: {
        message: "É necessário estar autenticado para fazer isto",
      },
    });
  }

  try {
    const userData = jwt.verify(AuthToken, process.env.SECRET, {});
    req.userData = userData;
    console.log(userData.email, req.method, req.path, req.query);
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: {
            message: "Sua sessão se encerrou, por favor, realize login novamente.",
          },
        });
      }
    }
    res.status(500).json({ error });
  }
};

module.exports = UserAuthMiddleware;
