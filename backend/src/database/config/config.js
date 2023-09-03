require("dotenv/config");

module.exports = {
  host: "localhost",
  port: process.env.PORT,
  password: process.env.PASSWORD,
  username: process.env.PG_USER,
  database: "Eligo",
  dialect: "postgres",
  define: {
    underscored: true,
    timestamps: true,
  },
};
