import { useEffect, useState } from 'react';
import { servicesAPI, bookingsAPI, IMAGE_BASE_URL } from '../utils/api';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingService) {
        await servicesAPI.update(editingService._id, formData);
      } else {
        await servicesAPI.create(formData);
      }
      await fetchServices();
      resetForm();
      alert(editingService ? 'Service updated successfully!' : 'Service created successfully!');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      image: null
    });
    setImagePreview(service.image ? `${IMAGE_BASE_URL}${service.image}` : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    try {
      setLoading(true);
      await servicesAPI.delete(id);
      await fetchServices();
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      image: null
    });
    setImagePreview(null);
    setEditingService(null);
    setShowForm(false);
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingsAPI.update(id, { status });
      await fetchBookings();
      alert('Booking status updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status.');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    try {
      await bookingsAPI.delete(id);
      await fetchBookings();
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'cancelled': return '#f44336';
      case 'completed': return '#2196f3';
      default: return '#808080';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-tabs">
            <button
              className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button
              className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {activeTab === 'services' && (
            <>
              <div className="section-header">
                <h2 className="section-title">Service Management</h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="add-button"
                >
                  + Add New Service
                </button>
              </div>

          {showForm && (
            <div className="service-form-container">
              <h2 className="form-title">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <form onSubmit={handleSubmit} className="service-form">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cancel-button"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

              <div className="services-list">
            {loading && !showForm ? (
              <div className="loading">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="no-services">No services yet. Add your first service!</div>
            ) : (
              <div className="admin-services-grid">
                {services.map((service) => (
                  <div key={service._id} className="admin-service-card">
                    {service.image && (
                      <div className="admin-service-image">
                        <img
                          src={`${IMAGE_BASE_URL}${service.image}`}
                          alt={service.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="admin-service-content">
                      <h3 className="admin-service-name">{service.name}</h3>
                      <p className="admin-service-description">{service.description}</p>
                      <div className="admin-service-details">
                        <span className="admin-service-price">${service.price}</span>
                        <span className="admin-service-duration">{service.duration} min</span>
                      </div>
                      <div className="admin-service-actions">
                        <button
                          onClick={() => handleEdit(service)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
            </>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2 className="section-title">All Bookings</h2>
              {bookings.length === 0 ? (
                <div className="no-bookings">No bookings yet.</div>
              ) : (
                <div className="bookings-table-container">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <div className="customer-info">
                              <strong>{booking.customerName}</strong>
                              <small>{booking.email}</small>
                              <small>{booking.phone}</small>
                            </div>
                          </td>
                          <td>
                            {booking.service ? (
                              <div>
                                <strong>{booking.service.name}</strong>
                                <small>${booking.service.price} • {booking.service.duration} min</small>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{formatDate(booking.date)}</td>
                          <td>{booking.time}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(booking.status) }}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <div className="booking-actions">
                              <select
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                                className="status-select"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => handleDeleteBooking(booking._id)}
                                className="delete-booking-button"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
