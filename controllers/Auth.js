const validator = require("validator");
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async(req,res) => {

    try{

        const {name , email , password , otp} = req.body;
        
        if(!name || !email || !password || !otp || !validator.isEmail(email)){
            return res.status(400).json({
                success : false,
                message : "All fields are mandatory"
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "User already exists"
            });
        }

        const otpDB = await Otp.find({email}).sort({createdAt : -1}).limit(1);
        console.log(otp , otpDB);
        if(otpDB.length === 0 || parseInt(otp) !== parseInt(otpDB[0].otp)){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
              })
        }

        const hashedpassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name , email , password : hashedpassword ,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        });

        return res.status(200).json({
            success : true,
            user
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error. Please try again later"
        });
    }

};

exports.sendOtp = async(req,res) => {

    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "All fields are mandatory"
            });
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(409).json({
                success : false,
                message : "User already registered"
            });
        }

        var otp = otpGenerator.generate(6 , {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        });

        let result = await Otp.findOne({otp});

        while(result){
            otp = otpGenerator.generate(6 , {
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false
            });
            result = await Otp.findOne({otp});
        }

        console.log("OTP : " , otp);

        const OTP = await Otp.create({
            email , otp
        });

        return res.status(200).json({
            success : true,
            message : "OTP SENT"
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE SENDING OTP",
            error : err.message
        });
    }

};

exports.login = async(req,res) => {

    try{

        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are mandatory"
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success : false,
                message : "Unregistered User"
            });
        }

        if(await bcrypt.compare(password , user.password)){
           
            const payload = {
                email : user.email,
                id : user._id
            };
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn : "2h"
            });

            user.password = undefined;

            return res.status(200).json({
                success : true,
                user ,
                token,
                message : "Logged in successfully"
            })

        }

        return res.status(401).json({
            success : false,
            message : "Invalid password"
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error in Login",
            error : err.message
        });
    }

}