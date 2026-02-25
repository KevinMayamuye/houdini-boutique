import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Services API
export const servicesAPI = {
  // Get all services (public)
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Get single service (public)
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create service
  create: async (serviceData) => {
    const formData = new FormData();
    formData.append('name', serviceData.name);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price);
    formData.append('duration', serviceData.duration);
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    const response = await api.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update service
  update: async (id, serviceData) => {
    const formData = new FormData();
    formData.append('name', serviceData.name);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price);
    formData.append('duration', serviceData.duration);
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    const response = await api.put(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete service
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};

// Bookings API
export const bookingsAPI = {
  // Get all bookings
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Get single booking
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Get available time slots for a date
  getAvailability: async (date, serviceId) => {
    const response = await api.get(`/bookings/availability/${date}${serviceId ? `?serviceId=${serviceId}` : ''}`);
    return response.data;
  },

  // Create booking
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Update booking
  update: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  // Delete booking
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};

export default api;

