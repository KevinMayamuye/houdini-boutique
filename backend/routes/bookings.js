import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/bookings - Get all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'name price duration')
      .sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name price duration');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/availability/:date - Get available time slots for a date
router.get('/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { serviceId } = req.query;

    // Get all bookings for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] }
    }).select('time service');

    // Get service duration if serviceId is provided
    let serviceDuration = 60; // default 60 minutes
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) {
        serviceDuration = service.duration;
      }
    }

    // Generate available time slots (9 AM to 7 PM, every 30 minutes)
    const availableSlots = [];
    const bookedTimes = bookings.map(b => b.time);
    
    for (let hour = 9; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this time slot conflicts with any existing booking
        const isBooked = bookedTimes.some(bookedTime => {
          const [bookedHour, bookedMinute] = bookedTime.split(':').map(Number);
          const slotStart = hour * 60 + minute;
          const slotEnd = slotStart + serviceDuration;
          const bookedStart = bookedHour * 60 + bookedMinute;
          const bookedEnd = bookedStart + serviceDuration;
          
          return (slotStart < bookedEnd && slotEnd > bookedStart);
        });

        if (!isBooked) {
          availableSlots.push(timeString);
        }
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, service, date, time, notes } = req.body;

    if (!customerName || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Verify service exists
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if time slot is available
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingBookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const booking = new Booking({
      customerName,
      email,
      phone,
      service,
      date: bookingDate,
      time,
      notes: notes || ''
    });

    await booking.save();
    await booking.populate('service', 'name price duration');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/bookings/:id - Update booking (for admin)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (status) {
      booking.status = status;
    }
    if (notes !== undefined) {
      booking.notes = notes;
    }

    await booking.save();
    await booking.populate('service', 'name price duration');

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

