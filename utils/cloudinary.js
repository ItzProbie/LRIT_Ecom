const cloudinary = require("cloudinary").v2;

exports.uploadFileToCloudinary = async(file , folder) => {
    
    try{
        const options = {folder};
        options.resource_type = "auto";
        options.timeout = 120000;
        const rV = await cloudinary.uploader.upload(file.tempFilePath , options);
        console.log(rV);
        return rV;
    }catch(err){
        console.log(err);
    }

};

exports.deleteFileFromCloudinary = async(imageId) => {

    try{

        const del = await cloudinary.uploader.destroy(`Ecom/${imageId}` , {invalidate : true , resource_type : "image"});
        return del;

    }catch(err){
        console.log(err);
    }

}