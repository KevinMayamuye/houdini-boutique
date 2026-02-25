import { useEffect, useState } from 'react';
import { servicesAPI, bookingsAPI } from '../utils/api';
import './Book.css';

function Book() {
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.date) {
        try {
          setLoading(true);
          const data = await bookingsAPI.getAvailability(formData.date, formData.service);
          setAvailableSlots(data.availableSlots || []);
        } catch (error) {
          console.error('Error fetching availability:', error);
          setAvailableSlots([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    fetchAvailability();
  }, [formData.date, formData.service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'date' || name === 'service' ? { time: '' } : {})
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await bookingsAPI.create(formData);
      setSubmitted(true);
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        notes: ''
      });
      setAvailableSlots([]);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const selectedService = services.find(s => s._id === formData.service);

  if (submitted) {
    return (
      <div className="book-page">
        <div className="booking-success">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h1>Booking Confirmed!</h1>
            <p>Thank you for booking with Houdini Boutique.</p>
            <p>We'll send you a confirmation email shortly.</p>
            <button onClick={() => setSubmitted(false)} className="book-again-button">
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page">
      <div className="book-header">
        <div className="container">
          <h1 className="page-title">Book an Appointment</h1>
          <p className="page-subtitle">Schedule your visit with us</p>
        </div>
      </div>

      <div className="book-content">
        <div className="container">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-section">
              <h2 className="section-title">Your Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Service & Date</h2>
              <div className="form-group">
                <label htmlFor="service" className="form-label">Select Service *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose a service...</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} - ${service.price} ({service.duration} min)
                    </option>
                  ))}
                </select>
                {selectedService && (
                  <p className="service-info">
                    {selectedService.description}
                  </p>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date" className="form-label">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-input"
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time" className="form-label">Time *</label>
                  {formData.date && availableSlots.length > 0 ? (
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select a time...</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  ) : formData.date ? (
                    <div className="no-slots">
                      {loading ? 'Loading available times...' : 'No available time slots for this date'}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Select a date first"
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Additional Notes (Optional)</h2>
              <div className="form-group">
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-booking-button" disabled={loading}>
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Book;

