const express = require("express");
const app = express();
const errorHandler = require("./error_handler");
const router = require("./routes");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./SecondHandSwagger.json");
const cors = require("cors");
const isAuth = require("./middlewares/isAuth");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.use(cors());

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(router);
app.use(isAuth, express.static("public"));
app.use(errorHandler);
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});