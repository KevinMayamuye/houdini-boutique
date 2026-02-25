import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { servicesAPI } from '../utils/api';
import './Home.css';

function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll();
        // Show only first 3 services on home page
        setServices(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Houdini Boutique</h1>
          <p className="hero-subtitle">Where beauty meets elegance</p>
          <Link to="/services" className="hero-button">
            Explore Our Services
          </Link>
        </div>
      </section>

      <section className="intro-section">
        <div className="container">
          <h2 className="section-title">About Houdini Boutique</h2>
          <p className="intro-text">
            At Houdini Boutique, we believe in the transformative power of beauty and self-care. 
            Our expert team is dedicated to providing you with exceptional services that enhance 
            your natural beauty and leave you feeling confident and refreshed.
          </p>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">Our Featured Services</h2>
          {loading ? (
            <div className="loading">Loading services...</div>
          ) : services.length > 0 ? (
            <>
              <div className="services-grid">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
              <div className="services-link-container">
                <Link to="/services" className="services-link">
                  View All Services
                </Link>
              </div>
            </>
          ) : (
            <p className="no-services">No services available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;

