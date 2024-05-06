const Product = require("../models/Product");
const User = require("../models/User");

exports.addToCart = async(req,res) => {
    try{
        const {productId} = req.params;
        if(!productId){
            return res.status(400).json({
                success : false,
                message : "Product Id Missing"
            });
        }
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success : false,
                message : "Invalid Product"
            });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $push: { cart : product._id } 
            },
            {new : true}
        );

        const updatedUser = await user.save();
        
        return res.status(200).json({
            success : true,
            updatedUser
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : true,
            message : "Add to cart failed",
            error : err.message
        });
    } 
}

exports.removeFromCart = async (req, res) => {

    try {

        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id Missing"
            });
        }
        
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success : false,
                message : "Invalid Product"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { cart: productId } },
            { new: true } 
        );
        
        return res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Remove from cart failed",
            error: err.message
        });
    } 

}
