const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String 
    },
    cart : {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }],
        default: [],
        required: true
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
} , {timestamps : true});

module.exports = mongoose.model("User" , userSchema);