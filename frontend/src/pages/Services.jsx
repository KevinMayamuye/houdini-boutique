import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { servicesAPI } from '../utils/api';
import './Services.css';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesAPI.getAll();
        setServices(data);
        setError(null);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <div className="services-header">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">
            Discover our comprehensive range of beauty and wellness services
          </p>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          {loading ? (
            <div className="loading">Loading services...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : services.length > 0 ? (
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="no-services">
              <p>No services available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;

