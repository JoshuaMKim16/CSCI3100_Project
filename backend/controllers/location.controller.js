// controllers/location.controller.js
const Location = require('../models/location.model');

// Create a new location
const createLocation = async (req, res) => {
  try {
    const locationData = req.body;
    const newLocation = new Location(locationData);
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a location by id
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a location by id
const updateLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a location by id
const deleteLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLocation = await Location.findByIdAndDelete(id);
    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById,
};