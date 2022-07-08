require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_username,
    password: process.env.DB_password,
    database: process.env.DB_database,
    host: process.env.DB_host,
    dialect: process.env.DB_dialect,
    logging: false,
  },
  test: {
    username: process.env.DB_username,
    password: process.env.DB_password,
    database: "secondhandtest",
    host: process.env.DB_host,
    dialect: process.env.DB_dialect,
    logging: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
