const express = require("express");
const app = express();
const userRoutes = require("./routes/user.route");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});