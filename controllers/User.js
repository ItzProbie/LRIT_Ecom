const User = require("../models/User");
const crypto = require("crypto");
const {mailSender} = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.generateResetPasswordToken = async(req,res) => {

    try{

        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success : false,
                message : "Email Missing"
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                successs : false,
                message : "Invalid email"
            });
        }

        const token = crypto.randomBytes(20).toString("hex");
        await User.findByIdAndUpdate(user._id , {
            resetPasswordToken : token , 
            resetPasswordExpire : Date.now() + 5*60*1000
        });

        //#TODO change this to the frontendlink
        const url = `http://localhost:4000/update-password/${token}`;

        await mailSender(
            email , 
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        return res.status(200).json({
            success : true,
            message : "Mail sent successfully"
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while generating resetPasswordToken",
            error : err.message
        })
    }

}

exports.resetPassword = async(req,res) => {

    try{

        const {password , token } = req.body;
        if(!password || !token){
            return res.status(400).json({
                success : false,
                message : "All fields are mandatory"
            });
        }

        const user = await User.findOne({resetPasswordToken : token}).select("resetPasswordToken resetPasswordExpire");
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Invalid Token"
            });
        }

        if(user.resetPasswordExpire < Date.now()){
            return res.json({
                success : false,
                message : "Token expired , plz regenerate your token"
            });
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success : true,
            message : "Password Reset Successfull"
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error while resetting password",
            error : err.message
        })
    }


}