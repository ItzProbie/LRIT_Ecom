const Product = require("../models/Product");
const User = require("../models/User");
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../utils/cloudinary");
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

exports.deleteImage = async(req,res) => {

    try{
        
        const {imageLink , productId} = req.body;

        if(!imageLink || !productId){
            return res.status(400).json({
                success  : false,
                message : "Missing Link"
            });
        }

        const product = await Product.findById(productId);
        if(!product || !product.image.includes(imageLink) || product.user.toString()!==req.user.id){
            return res.status(404).json({
                success : false,
                message : "Invalid Request"
            });
        }

        console.log(imageLink);
        const imageId = imageLink.split('/').reverse()[0].split('.')[0];

        const del = await deleteFileFromCloudinary(imageId);
        if (del.result !== 'ok') {
            throw new Error("Failed to delete image from cloudinary");
        }

        product.image.splice(product.image.indexOf(imageLink), 1);

        await product.save();

        return res.status(200).json({
            success : true,
            message : "Image deleted"
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wring while deleteing the image",
            error : err.message
        });
    }

}

// #TODO : By deleting product to products in cart wont be deleted and frontend should create a page product no more exits for such products 
exports.deleteProduct = async(req,res) => {

    try{

        const {productId} = req.params;
        if(!productId){
            return res.status(400).json({
                success : false,
                message : "Missing productId"
            });
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success : false,
                message : "Invalid productId"
            });
        }

        if(product.user.toString() !== req.user.id){
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            });
        }

        const deleteImagePromises = product.image.map(async (imageUrl) => {
            const imageId = imageUrl.split('/').reverse()[0].split('.')[0];
            try {
                await deleteFileFromCloudinary({ imageId });
            } catch (error) {
                console.error(`Error deleting image ${imageUrl}: ${error.message}`);
            }
        });
        
        await Promise.all(deleteImagePromises);

        await product.deleteOne();

        return res.status(200).json({
            success : true,
            message : "Product deleted Successfully"
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while deleting the product",
            error : err.message
        });
    }

}

exports.getProducts = async(req,res) => {
    
    try{

        const products = await Product.find();

        return res.status(200).json({
            success : true,
            products
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching products",
            error : err.message
        });
    }

}

exports.changePrice = async(req,res) => {

    try{

        const {productId} = req.params;
        const {newPrice} = req.body;

        if(!productId || !newPrice){
            return res.status(400).json({
                success : false,
                message : "Missing productId"
            });
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success : false,
                message : "Invalid productId"
            });
        }
        
        if(product.user.toString() !== req.user.id){
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            });
        }

        product.oldPrice = product.newPrice;
        product.newPrice = parseInt(newPrice);
        const updatedProduct = await product.save();

        return res.status(200).json({
            success : true,
            updatedProduct
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while changing price",
            error : err.message
        });
    }

}

