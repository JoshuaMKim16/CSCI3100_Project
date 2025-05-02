const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinaryController = require('../controllers/cloudinaryController');

// Configure Multer for temporary file storage in the "uploads" folder
const upload = multer({ dest: 'uploads/' });

// POST endpoint for uploading images
router.post('/upload', upload.single('file'), cloudinaryController.uploadImage);

// GET endpoint for fetching all images
router.get('/', cloudinaryController.getAllImages);

// GET endpoint for fetching an image by filename
router.get('/:filename', cloudinaryController.getImageByFilename);

module.exports = router;