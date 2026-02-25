import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Discover the story behind Houdini Boutique</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <section className="about-section">
            <h2 className="section-heading">Our Story</h2>
            <p className="about-text">
              Houdini Boutique was founded with a vision to create a sanctuary of beauty and 
              wellness where every client feels valued and transformed. We believe that beauty 
              is not just about appearance, but about confidence, self-care, and feeling your best.
            </p>
            <p className="about-text">
              Our team of skilled professionals is dedicated to providing exceptional service 
              and personalized care. We stay at the forefront of beauty trends and techniques, 
              ensuring that you receive the highest quality treatments available.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-heading">Our Mission</h2>
            <p className="about-text">
              To empower our clients through beauty and wellness, creating an experience that 
              enhances their natural beauty and boosts their confidence. We are committed to 
              excellence in every service we provide and to building lasting relationships 
              with our clients.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-heading">Why Choose Us</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">✨</div>
                <h3 className="feature-title">Expert Team</h3>
                <p className="feature-text">
                  Our professionals are highly trained and continuously update their skills 
                  with the latest techniques and trends.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💎</div>
                <h3 className="feature-title">Premium Products</h3>
                <p className="feature-text">
                  We use only the finest quality products that are safe, effective, and 
                  environmentally conscious.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌟</div>
                <h3 className="feature-title">Personalized Service</h3>
                <p className="feature-text">
                  Every treatment is tailored to your unique needs and preferences, ensuring 
                  the best possible results.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">❤️</div>
                <h3 className="feature-title">Relaxing Atmosphere</h3>
                <p className="feature-text">
                  Our salon provides a serene and welcoming environment where you can unwind 
                  and rejuvenate.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;

