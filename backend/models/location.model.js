const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  // Tour site name shown on the description page.
  name: {
    type: String,
    required: true
  },
  // Stores two numbers for longitude and latitude.
  location: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 2;
      },
      message: props => `${props.value} must be an array with two elements (longitude and latitude).`
    }
  },
  // Address to be displayed on the description page.
  address: {
    type: String,
    required: true
  },
  // Stored two sets of time information (e.g., opening and closing times in HKT).
  opening_hour: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 2;
      },
      message: props => `${props.value} must be an array with two time values.`
    }
  },
  // Estimated budget limit of the tour site.
  price: {
    type: Number,
    required: true
  },
  // Brief description used on the description page.
  description: {
    type: String,
    required: true
  },
  // Categories for filtering search options, e.g., "culture", "food", etc.
  type: [{
    type: String
  }],
  // Field to store picture references.
  picture: {
    type: [String],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);