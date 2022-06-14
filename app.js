const express = require("express");
const app = express();
const errorHandler = require('./error_handler')

app.use(errorHandler);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});