const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

TARGET_FOLDER = 'csci3100e1'

// Controller to handle image upload
exports.uploadImage = async (req, res) => {
  try {
    const publicId = path.parse(req.file.originalname).name;
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: TARGET_FOLDER, 
      public_id: publicId,     
    });
    fs.unlinkSync(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ error: 'Image upload failed', details: error });
  }
};

// Controller to fetch all images
exports.getAllImages = async (req, res) => {
  try {
    const options = {
      type: 'upload',
      prefix: TARGET_FOLDER, 
      max_results: 20,         
    };
    
    const result = await cloudinary.api.resources(options);
    res.json(result.resources);
  } catch (error) {
    console.error('Fetching all images failed:', error);
    res.status(500).json({ error: 'Fetching all images failed', details: error });
  }
};

// Controller to fetch a specific image based on its filename 
exports.getImageByFilename = async (req, res) => {
  try {
    const filename = req.params.filename;
    const publicId = `${TARGET_FOLDER}/${filename}`;
    
    const result = await cloudinary.api.resource(publicId);
    res.json(result);
  } catch (error) {
    console.error('Fetching image failed:', error);
    res.status(500).json({ error: 'Fetching image failed', details: error });
  }
};