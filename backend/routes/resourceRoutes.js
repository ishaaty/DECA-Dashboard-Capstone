const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sequelize = require('../config/db');
const Resources = require('../models/resourcesModel')(sequelize);
const s3 = require('../config/s3Config'); // Import the updated S3 config
const { PutObjectCommand } = require('@aws-sdk/client-s3'); // v3 client

// Configure multer storage to memory for manual upload to S3
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to add a new resource (file upload to S3)
router.post('/add', upload.single('pdf'), async (req, res) => {
  const { resource_name, web_url } = req.body;
  const file = req.file;

  if (!resource_name || (!web_url && !file)) {
    return res.status(400).json({ error: 'Resource name and either a link or file are required.' });
  }

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `pdfs/${Date.now()}_${file.originalname}`, // Unique file name
      Body: file.buffer, // Use file buffer from memory storage
      // Removed ACL: 'public-read'
    };

    // Upload file to S3
    const command = new PutObjectCommand(params);
    const data = await s3.send(command); // Send the command using AWS SDK v3

    const file_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    // Create a new resource entry in the database
    const newResource = await Resources.create({
      resource_name,
      web_url,
      file_url, // Store S3 file URL in the database
    });

    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

// Display resources
router.get('/display', async (req, res) => {
  try {
    const resources = await Resources.findAll();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Delete a resource by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the resource ID from the URL parameter

  try {
    const resource = await Resources.findByPk(id); // Find resource by primary key (ID)
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.destroy(); // Delete the resource
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router;
