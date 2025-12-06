const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file buffer to Cloudinary
async function uploadToCloudinary(fileBuffer, originalName) {
  return new Promise((resolve, reject) => {
    const uniqueName = `${Date.now()}_${uuidv4()}_${originalName}`;

    cloudinary.uploader
      .upload_stream(
        {
          folder: "products", // Optional folder
          public_id: uniqueName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url); // cloudinary returns URL here
        }
      )
      .end(fileBuffer);
  });
}

module.exports = { upload, uploadToCloudinary };
