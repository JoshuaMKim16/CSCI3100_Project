const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
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
  address: {
    type: String,
    required: true
  },
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
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: [{
    type: String
  }],
  picture: {
    type: [String],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);