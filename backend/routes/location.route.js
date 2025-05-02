const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

// Create a new location
router.post('/', locationController.createLocation);

// Get all locations
router.get('/', locationController.getAllLocations);

// Get a single location by id
router.get('/:id', locationController.getLocationById);

// Update a location by id
router.put('/:id', locationController.updateLocationById);

// Delete a location by id
router.delete('/:id', locationController.deleteLocationById);

module.exports = router;