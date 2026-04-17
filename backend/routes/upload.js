const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');
const XLSX = require('xlsx');
const IntelligenceData = require('../models/IntelligenceData');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv|json|xlsx|xls|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, JSON, Excel, and image files are allowed.'));
    }
  }
});

// Helper: Convert CSV to unified format
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row, index) => ({
          id: `csv-${Date.now()}-${index}`,
          type: 'HUMINT',
          lat: parseFloat(row.lat || row.latitude || 0),
          lng: parseFloat(row.lng || row.longitude || 0),
          title: row.title || row.name || 'HUMINT Data Point',
          description: row.description || row.info || '',
          image: null,
          source: 'csv',
          metadata: row
        }));
        resolve(data);
      },
      error: (error) => reject(error)
    });
  });
};

// Helper: Convert JSON to unified format
const parseJSON = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    return dataArray.map((item, index) => ({
      id: `json-${Date.now()}-${index}`,
      type: item.type || 'OSINT',
      lat: parseFloat(item.lat || item.latitude || 0),
      lng: parseFloat(item.lng || item.longitude || 0),
      title: item.title || item.name || 'OSINT Data Point',
      description: item.description || item.info || '',
      image: item.image || null,
      source: 'json',
      metadata: item
    }));
  } catch (error) {
    throw new Error('Invalid JSON file format');
  }
};

// Helper: Convert Excel to unified format
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row, index) => ({
      id: `excel-${Date.now()}-${index}`,
      type: row.type || 'OSINT',
      lat: parseFloat(row.lat || row.latitude || 0),
      lng: parseFloat(row.lng || row.longitude || 0),
      title: row.title || row.name || 'Data Point',
      description: row.description || row.info || '',
      image: null,
      source: 'excel',
      metadata: row
    }));
  } catch (error) {
    throw new Error('Invalid Excel file format');
  }
};

// Helper: Process image file
const processImage = (filePath, originalFilename) => {
  const relativePath = `/uploads/${path.basename(filePath)}`;
  return [{
    id: `image-${Date.now()}`,
    type: 'IMINT',
    lat: 0,
    lng: 0,
    title: originalFilename || 'Image',
    description: 'Satellite or aerial imagery',
    image: relativePath,
    source: 'image',
    metadata: { filename: originalFilename }
  }];
};

// Upload API
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let dataToStore = [];

    if (ext === '.csv') {
      dataToStore = await parseCSV(filePath);
    } else if (ext === '.json') {
      dataToStore = parseJSON(filePath);
    } else if (['.xlsx', '.xls'].includes(ext)) {
      dataToStore = parseExcel(filePath);
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      dataToStore = processImage(filePath, req.file.originalname);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Save to MongoDB
    const result = await IntelligenceData.insertMany(dataToStore);

    res.json({
      success: true,
      message: `Successfully uploaded ${result.length} records`,
      data: result,
      fileType: ext
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
