const mongoose = require('mongoose');

// Unified GeoPoint Schema - CRITICAL IDEA
const intelligenceDataSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['OSINT', 'HUMINT', 'IMINT'],
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  source: {
    type: String,
    default: 'uploaded'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('IntelligenceData', intelligenceDataSchema);
