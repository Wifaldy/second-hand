const express = require("express");
const app = express();
const errorHandler = require("./error_handler");
const router = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});