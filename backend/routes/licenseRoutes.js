const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');

// Route to update a user's license key.
router.put('/:userId', licenseController.updateLicense);

// Route to unsubscribe (delete the license key)
router.delete('/:userId', licenseController.unsubscribeLicense);

module.exports = router;