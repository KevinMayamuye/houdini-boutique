import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Houdini Boutique</h3>
          <p className="footer-text">Your premier destination for beauty and wellness.</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p className="footer-text">Email: info@houdiniboutique.com</p>
          <p className="footer-text">Phone: (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Hours</h4>
          <p className="footer-text">Mon - Sat: 9:00 AM - 7:00 PM</p>
          <p className="footer-text">Sunday: 10:00 AM - 5:00 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Houdini Boutique. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

