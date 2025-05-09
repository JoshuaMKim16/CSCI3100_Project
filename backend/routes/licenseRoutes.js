const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');

// Update a user's license key.
router.put('/:userId', licenseController.updateLicense);

// Unsubscribe (delete the license key)
router.delete('/:userId', licenseController.unsubscribeLicense);

module.exports = router;