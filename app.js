const express = require("express");
const app = express();
const errorHandler = require("./error_handler");
const router = require("./routes");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./SecondHandSwagger3.json");
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(router);
app.use(express.static("public"));
app.use(errorHandler);

module.exports = app;
