const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    name : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    category : {
        type : String , 
        enum : ["Men" , "Women" , "Kid" , "Others"],
        default : "Others"
    },
    image : [{
        type : String,
    }],
    newPrice : {
        type : Number,
        required : true
    },
    oldPrice : {
        type : Number
    }

} , {timestamps : true});


productSchema.pre("save" , function(next){

    if(!this.isNew && this.isModified("newPrice")){
        this.oldPrice = this.get("newPrice"); 
        this.newPrice = this.get("newPrice");
    }
    next();

})

module.exports = mongoose.model("Product" , productSchema);