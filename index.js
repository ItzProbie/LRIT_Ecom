const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const database = require("./config/database");

database.connect();

const Auth = require("./routes/Auth");

app.use("/auth" , Auth);

app.get("/" , (req , res) => {
    res.send("<h1>Server Started Succcessfully</h1>");
});

app.listen(PORT , () => {
    console.log(`Server Started at PORT ${PORT}`);
})