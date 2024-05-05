const Product = require("../models/Product");
const { uploadFileToCloudinary } = require("../utils/cloudinary");
const cloudinary = require("cloudinary").v2;
// const { response } = require("express");

const upload = async(Image , imageUrl) => {
    await uploadFileToCloudinary(Image , "Ecom")
            .then((response) => imageUrl.push(response.secure_url))
            .catch((err) => console.log(err));
}

exports.create = async(req,res) => {

    try{

        var {name , description , category , newPrice} = req.body;
        const file = req.files.image;
        console.log(file);
        if(!name || !newPrice){
            return res.status(400).json({
                success : false,
                message : "All parameters are mandatory"
            });
        }

        category = category || "Others";

        const validCategories = ["Men", "Women", "Kid", "Others"];
        if(!validCategories.includes(category)){
            return res.status(404).json({
                success : "false",
                message : "Invalid Category"
            });
        }
        const imageUrl = [];
        
        if(file){
            const response = await uploadFileToCloudinary( file, "Ecom");

            console.log(response);

            imageUrl.push(response.secure_url);   
        }   


        const product = await Product.create({
           User : req.user.id ,  name , description , category , image : imageUrl , newPrice : parseInt(newPrice)
        });

        return res.status(200).json({
            success : true,
            product
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while creating product",
            error : err.message
        });
    }

}

exports.createone =async(req,res) => {
    try{

        const image = req.files.image;
        console.log(image);

        const feed = await uploadFileToCloudinary(image , "Ecom");
        console.log(feed);
        return res.status(200).json({
            data : feed.secure_url
        })

    }catch(err){
        return res.status(500);
    }
}