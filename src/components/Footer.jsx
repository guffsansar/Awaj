import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            बिद्यार्थीको <span>आवाज</span>
          </div>
          <p className="footer-tagline">Your Voice, Your Stories</p>
        </div>
        <p className="copyright">&copy; 2026 Bidyarthiko Aawaj. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
