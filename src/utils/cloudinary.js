import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// cloudinary.uploader.upload("path/to/file", { public_id: "sample_id" },
//      function(error, result)
//       {console.log(result, error); 

//       }
//     );

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
        console.log("File uploaded to Cloudinary:", response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath); // Delete the local temp saved file if upload fails
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
}

export {uploadOnCloudinary}