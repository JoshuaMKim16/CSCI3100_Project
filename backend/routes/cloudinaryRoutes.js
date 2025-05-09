const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinaryController = require('../controllers/cloudinaryController');

// Configure Multer for temporary file storage in the "uploads" folder
const upload = multer({ dest: 'uploads/' });

// Uploading images
router.post('/upload', upload.single('file'), cloudinaryController.uploadImage);

// Fetching all images
router.get('/', cloudinaryController.getAllImages);

// Fetching an image by filename
router.get('/:filename', cloudinaryController.getImageByFilename);

module.exports = router;