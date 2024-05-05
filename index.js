const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const fileupload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const PORT = process.env.PORT || 4000;

const database = require("./config/database");
const cloudinary = require("./config/cloudinary");

database.connect();
cloudinary.cloudinaryConnect();

const Auth = require("./routes/Auth");
const Product = require("./routes/Product");

app.use("/auth" , Auth);
app.use("/product" , Product);

app.get("/" , (req , res) => {
    res.send("<h1>Server Started Succcessfully</h1>");
});

app.listen(PORT , () => {
    console.log(`Server Started at PORT ${PORT}`);
})