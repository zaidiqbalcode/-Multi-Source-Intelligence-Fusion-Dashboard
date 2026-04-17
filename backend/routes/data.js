const express = require('express');
const IntelligenceData = require('../models/IntelligenceData');

const router = express.Router();

// Get all intelligence data
router.get('/data', async (req, res) => {
  try {
    const { type, limit = 1000 } = req.query;
    
    let query = {};
    if (type && ['OSINT', 'HUMINT', 'IMINT'].includes(type)) {
      query.type = type;
    }

    const data = await IntelligenceData.find(query).limit(parseInt(limit));
    res.json(data);
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get data by type
router.get('/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['OSINT', 'HUMINT', 'IMINT'].includes(type)) {
      return res.status(400).json({ error: 'Invalid intelligence type' });
    }

    const data = await IntelligenceData.find({ type });
    res.json(data);
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get data by ID
router.get('/data/item/:id', async (req, res) => {
  try {
    const data = await IntelligenceData.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete data entry
router.delete('/data/:id', async (req, res) => {
  try {
    const result = await IntelligenceData.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
router.delete('/data-clear/all', async (req, res) => {
  try {
    const result = await IntelligenceData.deleteMany({});
    res.json({ success: true, message: `Deleted ${result.deletedCount} records` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
