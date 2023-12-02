const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    type: [Number],
    index: '2dsphere', // Enables geospatial indexing
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
