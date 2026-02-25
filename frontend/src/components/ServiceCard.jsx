import { IMAGE_BASE_URL } from '../utils/api';
import './ServiceCard.css';

function ServiceCard({ service }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="service-card">
      <div className="service-card-image-container">
        {service.image ? (
          <img 
            src={`${IMAGE_BASE_URL}${service.image}`} 
            alt={service.name}
            className="service-card-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Service+Image';
            }}
          />
        ) : (
          <div className="service-card-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="service-card-content">
        <h3 className="service-card-title">{service.name}</h3>
        <p className="service-card-description">{service.description}</p>
        <div className="service-card-footer">
          <span className="service-card-price">{formatPrice(service.price)}</span>
          <span className="service-card-duration">{formatDuration(service.duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;

