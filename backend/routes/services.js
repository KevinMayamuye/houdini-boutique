import express from 'express';
import Service from '../models/Service.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET /api/services - Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/services/:id - Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/services - Create service
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !description || !price || !duration) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const service = new Service({
      name,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      image
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/services/:id - Update service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Update fields
    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = parseFloat(price);
    if (duration) service.duration = parseInt(duration);
    
    // Update image if new one is uploaded
    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/services/:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

