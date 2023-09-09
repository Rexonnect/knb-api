const express = require('express');
const router = express.Router();
const YourModel = require('../models/yourModel');

// Create a new document
router.post('/create', async (req, res) => {
  try {
    const newData = await YourModel.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Read documents
router.get('/read', async (req, res) => {
  try {
    const data = await YourModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Update a document
router.put('/update/:id', async (req, res) => {
  try {
    const updatedData = await YourModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete a document
router.delete('/delete/:id', async (req, res) => {
  try {
    await YourModel.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
