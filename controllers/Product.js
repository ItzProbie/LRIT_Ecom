const Product = require("../models/Product");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/cloudinary");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
// const { response } = require("express");

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
           user : req.user.id ,  name , description , category , image : imageUrl , newPrice : parseInt(newPrice)
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

exports.addImage = async(req,res) => {

    try{
        
        const {productId} = req.params;
        const file = req.files.image;

        if(!file || !productId){
            return res.status(400).json({
                success  : false,
                message : "All fields are Mandatory"
            });
        }

        const product = await Product.findOne({_id : productId });
        console.log(product);
        if(!product || !product.user.equals(new mongoose.Types.ObjectId(req.user.id))){
            return res.status(404).json({
                success : false,
                message : "Product Invalid"
            });
        }

        const response = await uploadFileToCloudinary(file , "Ecom");
        product.image.push(response.secure_url);

        const updatedProduct = await product.save();

        return res.status(200).json({
            success : true,
            updatedProduct
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while adding image",
            error : err.message
        });
    }

}