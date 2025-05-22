import { v2 as cloudinary, UploadApiOptions } from 'cloudinary'
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET_KEY } from '../config'
import streamifier from 'streamifier'
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY
})


export async function uploadToCloudinary(fileBuffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (err, res) => {
            if (err) return reject(err);
            resolve(res)
        })
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
    
}