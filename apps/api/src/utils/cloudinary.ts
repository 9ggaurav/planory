import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

 // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
});

const uploadOnCloudinary = async(localFilePath: string) => {
    try {
        if (!localFilePath) return
        //upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary",
            response.url
        );
        return response;
    } catch(error) {
        fs.unlinkSync(localFilePath);   // remove the locally saved temporary
        //  file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}
